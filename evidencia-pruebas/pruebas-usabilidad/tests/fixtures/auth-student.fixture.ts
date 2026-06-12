import { test as base } from '@playwright/test';
import { BASE_URL } from './auth.fixture';

export { BASE_URL };
export const GRUPOS_URL = `${BASE_URL}/groups`;

export const STUDENT_CREDENTIALS = {
  email: 'student3@student.com',
  password: 'student', // ← reemplazá con la contraseña real de Estudiante3
};

type AuthFixture = {
  authenticatedPage: import('@playwright/test').Page;
};

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/auth/login`);

    await page.locator('#email').fill(STUDENT_CREDENTIALS.email);
    await page.locator('#password').fill(STUDENT_CREDENTIALS.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
      timeout: 15000,
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';
