import { expect, test } from "@playwright/test";

const routes = [
  ["top", "./"],
  ["story", "story/"],
  ["characters", "characters/"],
  ["profile", "characters/cocoa/"],
  ["gallery", "gallery/"],
];

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  for (const [name, href] of routes) {
    test(`${name} · ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(href);
      expect(response?.status()).toBe(200);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, async (image) => {
          image.loading = "eager";
          await image.decode();
        }));
      });
      await expect(page).toHaveScreenshot(`${name}-${viewport.name}.png`, { fullPage: true });
    });
  }
}
