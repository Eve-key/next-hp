import { defineConfig } from "@playwright/test";

const port = 3210;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default defineConfig({
  testDir: "./tests/browser",
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 2 : 3,
  reporter: [["list"], ["html", { open: "never" }]],
  snapshotPathTemplate: "{testDir}/snapshots/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.004,
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}/`,
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    locale: "ja-JP",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "e2e", testMatch: "**/*.spec.ts", testIgnore: "**/*.visual.spec.ts" },
    { name: "vrt", testMatch: "**/*.visual.spec.ts" },
  ],
  webServer: {
    command: `npm run start -- --port ${port}`,
    url: `http://127.0.0.1:${port}${basePath}/`,
    timeout: 15_000,
  },
});
