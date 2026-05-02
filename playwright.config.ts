import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:3001",
  },
  webServer: {
    command: "PORT=3001 node dist/server.js",
    url: "http://localhost:3001",
    reuseExistingServer: false,
  },
});
