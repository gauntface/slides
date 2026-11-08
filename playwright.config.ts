import {defineConfig, devices} from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'test',
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', {open: 'never'}]] : 'list',
  use: {
    baseURL: 'http://localhost:8888',
  },
  projects: [
    {name: 'chromium', use: devices['Desktop Chrome']},
    {name: 'firefox', use: devices['Desktop Firefox']},
  ],
  webServer: {
    command: 'pnpm exec esbuild --servedir=. --serve=8888 --log-level=warning',
    url: 'http://localhost:8888/demo/',
    reuseExistingServer: !isCI,
  },
});
