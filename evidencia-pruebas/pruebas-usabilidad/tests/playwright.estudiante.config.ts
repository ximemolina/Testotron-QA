import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'grupos-estudiante.accessibility.spec.ts', // suite del rol Estudiante
  fullyParallel: false,
  retries: 1,
  timeout: 30_000,

  reporter: [
    ['html', { outputFolder: 'reports/html-estudiante', open: 'never' }],
    ['json', { outputFile: 'reports/axe-results-estudiante.json' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'es-CR',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
