// Script opcional de Playwright para flujo web de autenticacion.
// Requiere que Testotron este corriendo en http://localhost:8080.

import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
const email = `pw-${Date.now()}@testotron.local`;
const password = 'Test1234';

test('registro, login, perfil y logout', async ({ page }) => {
  await page.goto(`${baseUrl}/auth/register`);
  await page.fill('input[name="name"]', 'Usuario Playwright QA');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.selectOption('select[name="role"]', 'student');
  await page.getByRole('button', { name: /registrarse/i }).click();

  await expect(page).toHaveURL(/\/auth\/login/);

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.getByRole('button').click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto(`${baseUrl}/profile`);
  await expect(page.getByText(/configuracion de cuenta/i)).toBeVisible();
});

test('perfil sin autenticacion redirige a login', async ({ page }) => {
  await page.goto(`${baseUrl}/profile`);
  await expect(page).toHaveURL(/\/auth\/login/);
});

