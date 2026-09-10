import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:4175", trace: "retain-on-failure" },
  webServer: {
    command:
      "npm run preview -- --host 127.0.0.1 --port 4175 --strictPort",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: false,
  },
  projects: [
    { name: "android-web", use: { ...devices["Pixel 7"] } },
    {
      name: "ios-web",
      use: { ...devices["iPhone 13"], defaultBrowserType: "webkit" },
    },
  ],
});
