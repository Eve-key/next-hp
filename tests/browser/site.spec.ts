import { expect, test } from "@playwright/test";

const profiles = [
  ["nagisa", "登坂 凪紗"],
  ["ran", "御影 蘭"],
  ["kotoha", "小日向 琴葉"],
  ["rio", "篠宮 理央"],
];

test("TOP links to the story, character index and gallery", async ({ page }) => {
  await page.goto("./");
  const nav = page.getByRole("navigation", { name: "メインナビゲーション" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("放課後、春を待つ。");

  await nav.getByRole("link", { name: "STORY" }).click();
  await expect(page).toHaveURL(/\/story\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("桜が散るまで、あと少し。");

  await nav.getByRole("link", { name: "CHARACTER" }).click();
  await expect(page).toHaveURL(/\/characters\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("登場人物");

  await nav.getByRole("link", { name: "GALLERY" }).click();
  await expect(page).toHaveURL(/\/gallery\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ギャラリー");
  await nav.getByRole("link", { name: "TOP" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("放課後、春を待つ。");
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
  await page.goto("characters/nagisa/");
  await page.getByRole("link", { name: /前の人物.*篠宮 理央/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("篠宮 理央");
  await page.getByRole("link", { name: /次の人物.*登坂 凪紗/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("登坂 凪紗");
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
  const hero = page.getByRole("region", { name: /放課後、\s*春を待つ。/ });
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
