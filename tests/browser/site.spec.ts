import { expect, test } from "@playwright/test";

const profiles = [
  ["cocoa", "ココア"],
  ["chino", "チノ"],
  ["rize", "リゼ"],
  ["chiya", "千夜"],
  ["sharo", "シャロ"],
];

test("TOP links to the story, character index and gallery", async ({ page }) => {
  await page.goto("./");
  const nav = page.getByRole("navigation", { name: "メインナビゲーション" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("木組みの街、春日和。");

  await nav.getByRole("link", { name: "STORY" }).click();
  await expect(page).toHaveURL(/\/story\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("喫茶店からはじまる春。");

  await nav.getByRole("link", { name: "CHARACTER" }).click();
  await expect(page).toHaveURL(/\/characters\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("登場人物");

  await nav.getByRole("link", { name: "GALLERY" }).click();
  await expect(page).toHaveURL(/\/gallery\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ギャラリー");
  await nav.getByRole("link", { name: "TOP" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("木組みの街、春日和。");
});

for (const [id, name] of profiles) {
  test(`${name} can be opened directly and has a loaded portrait`, async ({ page }) => {
    const response = await page.goto(`characters/${id}/`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.getByRole("img", { name })).toHaveJSProperty("complete", true);
    await expect.poll(() => page.getByRole("img", { name }).evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await page.getByRole("link", { name: "登場人物一覧" }).click();
    await expect(page.getByRole("link", { name, exact: false })).toBeVisible();
  });
}

test("character navigation wraps and invalid characters return 404", async ({ page }) => {
  await page.goto("characters/cocoa/");
  await page.getByRole("link", { name: /前の人物.*シャロ/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("シャロ");
  await page.getByRole("link", { name: /次の人物.*ココア/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ココア");
  const response = await page.goto("characters/unknown/");
  expect(response?.status()).toBe(404);
});

test("mobile gallery opens an image and restores keyboard focus on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("gallery/");
  const trigger = page.getByRole("button", { name: "キービジュアルを拡大" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "キービジュアル" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflowing).toBe(false);
});

test("TOP stages art, title and CTA while respecting reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  const hero = page.getByRole("region", { name: /木組みの街、\s*春日和。/ });
  const timing = async () => hero.evaluate((section) => {
    const elements = [section.querySelector("img"), section.querySelector("h1"), section.querySelector("a")];
    return elements.map((element) => {
      if (!element) throw new Error("Missing hero element");
      const style = getComputedStyle(element);
      return { animation: style.animationName, delay: parseFloat(style.animationDelay) };
    });
  });
  const [art, title, cta] = await timing();
  expect([art, title, cta].every(({ animation }) => animation !== "none")).toBe(true);
  expect(art.delay).toBeLessThan(title.delay);
  expect(title.delay).toBeLessThan(cta.delay);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect((await timing()).every(({ animation }) => animation === "none")).toBe(true);
  await expect(hero.getByRole("link", { name: "物語を読む" })).toBeVisible();
});

test("character picker changes the portrait and keeps the selected character in the URL", async ({ page }) => {
  await page.goto("characters/");
  const picker = page.getByRole("navigation", { name: "登場人物を選ぶ" });
  await picker.getByRole("link", { name: "チノ", exact: true }).click();
  await expect(page).toHaveURL(/\/characters\/chino\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("チノ");
  await expect(picker.getByRole("link", { name: "チノ", exact: true })).toHaveAttribute("aria-current", "page");
});

test("scene filter and arrow keys let visitors browse without closing the gallery", async ({ page }) => {
  await page.goto("gallery/");
  await page.getByRole("button", { name: "場面イラスト", exact: true }).click();
  await expect(page.getByRole("button", { name: "ココアの立ち絵を拡大" })).toHaveCount(0);
  await page.getByRole("button", { name: "放課後の一杯を拡大" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("放課後の一杯");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAccessibleName("春雨の帰り道");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog).toHaveAccessibleName("放課後の一杯");
});

test("favorites survive a reload, narrow the gallery and keep focus when the last one is removed", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // hydration の不一致などを拾う。静的プレビューの RSC プリフェッチ 404 は本機能と無関係なので除く
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) errors.push(message.text());
  });

  await page.goto("gallery/");
  const zoomButtons = page.getByRole("button", { name: /を拡大$/ });
  const saveScene = page.getByRole("button", { name: "放課後の一杯をお気に入りに保存" });
  const savePortrait = page.getByRole("button", { name: "チノの立ち絵をお気に入りに保存" });
  const favoritesFilter = page.getByRole("button", { name: "お気に入り", exact: true });

  await expect(saveScene).toHaveAttribute("aria-pressed", "false");
  await saveScene.click();
  await savePortrait.focus();
  await page.keyboard.press("Enter");
  await expect(saveScene).toHaveAttribute("aria-pressed", "true");
  await expect(savePortrait).toHaveAttribute("aria-pressed", "true");
  // 保存しても拡大は開かない
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.reload();
  await expect(saveScene).toHaveAttribute("aria-pressed", "true");
  await favoritesFilter.click();
  await expect(favoritesFilter).toHaveAttribute("aria-pressed", "true");
  await expect(zoomButtons).toHaveCount(2);
  await expect(zoomButtons.nth(0)).toHaveAccessibleName("放課後の一杯を拡大");
  await expect(zoomButtons.nth(1)).toHaveAccessibleName("チノの立ち絵を拡大");

  // 拡大中の左右キーはお気に入りの中だけを巡る
  await zoomButtons.nth(0).click();
  const dialog = page.getByRole("dialog");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAccessibleName("チノの立ち絵");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAccessibleName("放課後の一杯");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(zoomButtons.nth(0)).toBeFocused();

  await savePortrait.click();
  await expect(zoomButtons).toHaveCount(1);
  await expect(saveScene).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(zoomButtons).toHaveCount(0);
  const empty = page.getByText("まだお気に入りはありません", { exact: false });
  await expect(empty).toBeVisible();
  await expect(empty).toBeFocused();

  await page.reload();
  await favoritesFilter.click();
  await expect(empty).toBeVisible();
  await page.getByRole("button", { name: "すべて", exact: true }).click();
  await expect(zoomButtons).toHaveCount(8);
  expect(errors).toEqual([]);
});

test("gallery still works when saved favorites are corrupt or storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem("next-hp:gallery-favorites:v1", "{not json"); } catch {}
  });
  await page.goto("gallery/");
  await page.getByRole("button", { name: "お気に入り", exact: true }).click();
  await expect(page.getByText("まだお気に入りはありません", { exact: false })).toBeVisible();

  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
  });
  await page.reload();
  const save = page.getByRole("button", { name: "キービジュアルをお気に入りに保存" });
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "お気に入り", exact: true }).click();
  await expect(page.getByRole("button", { name: /を拡大$/ })).toHaveCount(1);
});

test("an open favorite follows its image when another tab changes the saved list", async ({ page, context }) => {
  await page.goto("gallery/");
  for (const title of ["放課後の一杯", "チノの立ち絵"]) {
    await page.getByRole("button", { name: `${title}をお気に入りに保存` }).click();
  }
  const other = await context.newPage();
  await other.goto("gallery/");

  const favoritesFilter = page.getByRole("button", { name: "お気に入り", exact: true });
  await favoritesFilter.click();
  await page.getByRole("button", { name: "チノの立ち絵を拡大" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("チノの立ち絵");
  await expect(dialog.getByText("2 / 2")).toBeVisible();

  // 手前の絵だけが別タブで外れても、同じ絵と正しい番号のまま
  await other.getByRole("button", { name: "放課後の一杯をお気に入りに保存" }).click();
  await expect(dialog).toHaveAccessibleName("チノの立ち絵");
  await expect(dialog.getByText("1 / 1")).toBeVisible();

  // 開いている絵そのものが外れたら閉じ、残っている操作へフォーカスを戻す
  await other.getByRole("button", { name: "チノの立ち絵をお気に入りに保存" }).click();
  await expect.poll(() => page.locator("dialog").evaluate((element: HTMLDialogElement) => element.open)).toBe(false);
  await expect(favoritesFilter).toBeFocused();
  await expect(page.getByText("まだお気に入りはありません", { exact: false })).toBeVisible();
});

test("Escape falls back to the selected filter when the opening button was removed in another tab", async ({ page, context }) => {
  await page.goto("gallery/");
  for (const title of ["放課後の一杯", "チノの立ち絵"]) {
    await page.getByRole("button", { name: `${title}をお気に入りに保存` }).click();
  }
  const other = await context.newPage();
  await other.goto("gallery/");

  const favoritesFilter = page.getByRole("button", { name: "お気に入り", exact: true });
  await favoritesFilter.click();
  await page.getByRole("button", { name: "放課後の一杯を拡大" }).click();
  const dialog = page.getByRole("dialog");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAccessibleName("チノの立ち絵");

  await other.getByRole("button", { name: "放課後の一杯をお気に入りに保存" }).click();
  await expect(dialog).toHaveAccessibleName("チノの立ち絵");
  await expect(dialog.getByText("1 / 1")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(favoritesFilter).toBeFocused();
});
