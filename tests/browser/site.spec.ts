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
