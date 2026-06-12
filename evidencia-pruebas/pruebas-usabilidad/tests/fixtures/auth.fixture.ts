import { test as base } from '@playwright/test';

export const BASE_URL = 'http://localhost:8080';
export const GRUPOS_URL = `${BASE_URL}/groups`;

export const CREDENTIALS = {
  email: 'juan.garcia@school.com',
  password: 'Teacher@123',
};

type AuthFixture = {
  authenticatedPage: import('@playwright/test').Page;
};

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/auth/login`);

    // Usar el id exacto del HTML: #email y #password
    await page.locator('#email').fill(CREDENTIALS.email);
    await page.locator('#password').fill(CREDENTIALS.password);

    // El botón dice "Iniciar sesión" con aria-label "Enviar credenciales para iniciar sesión"
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Esperar cualquier redirección tras login (dashboard, panel, groups, etc.)
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
      timeout: 15000,
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';
