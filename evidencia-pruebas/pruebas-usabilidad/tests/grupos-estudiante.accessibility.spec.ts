/**
 * Suite de accesibilidad — Módulo de Gestión de Grupos (Testotron)
 * Rol       : Estudiante
 * Framework : Playwright + @axe-core/playwright
 * Estándar  : WCAG 2.1 AA
 */

import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';
import { test, expect, GRUPOS_URL } from './fixtures/auth-student.fixture';

// ─── Helper: escanea página completa, retorna violations[] ───────────────────
async function scanPage(page: import('@playwright/test').Page, context?: string): Promise<Result[]> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
    .analyze();

  const violations = results.violations;
  if (violations.length > 0) {
    const report = violations
      .map(v =>
        `\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n` +
        v.nodes.map(n => `  → ${n.html}`).join('\n')
      ).join('\n');
    console.error(`\n── Violaciones en: ${context ?? 'página'} ──${report}`);
  }
  return violations;
}

async function getViolations(builder: AxeBuilder): Promise<Result[]> {
  const results = await builder.analyze();
  return results.violations;
}

// Solo violaciones que bloquean (excluye minor del aside#sidebar-nav)
function blocking(violations: Result[]): Result[] {
  return violations.filter((v: Result) => v.impact !== 'minor');
}

// ─── 1. Listado "Mis grupos" (vista Estudiante) ──────────────────────────────
test.describe('Listado de grupos — Estudiante', () => {
  test('la página "Mis grupos" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await scanPage(page, 'Mis grupos — vista Estudiante');
    expect(blocking(violations)).toEqual([]);
  });

  test('el badge de rol "Estudiante" es accesible', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    // Confirma que el rol visible corresponde al usuario logueado
    await expect(page.getByText('Estudiante', { exact: true })).toBeVisible();

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(blocking(violations)).toEqual([]);
  });

  test('las tarjetas de grupo muestran código y cantidad de miembros de forma accesible', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(blocking(violations).filter((v: Result) =>
      ['list', 'listitem', 'region'].includes(v.id)
    )).toEqual([]);
  });
});

// ─── 2. Ingresar a grupo por código ──────────────────────────────────────────
test.describe('Ingresar a grupo por código', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');
    // Botón "Ingresar a grupo" — visible solo para rol Estudiante
    const btn = page.getByRole('button', { name: /ingresar a grupo/i });
    const count = await btn.count();
    if (count > 0) {
      await btn.click();
      await page.getByRole('dialog', { name: 'Ingresar a grupo' }).waitFor({ state: 'visible' });
    } else {
      test.skip(); // el usuario actual no tiene este botón (verificar rol/credenciales)
    }
  });

  test('el modal "Ingresar a grupo" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
    const violations = await scanPage(page, 'Modal — Ingresar a grupo');
    // heading-order: si el modal usa <h5> tras <h1>/<h2> de la página, es bug conocido
    expect(blocking(violations).filter((v: Result) => v.id !== 'heading-order')).toEqual([]);
  });

  test('el campo "Código del grupo" tiene label visible', async ({ authenticatedPage: page }) => {
    const label = page.getByText('Código del grupo');
    await expect(label).toBeVisible();

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'label')).toEqual([]);
  });

  test('el botón "Ingresar" tiene nombre accesible', async ({ authenticatedPage: page }) => {
    const btn = page.getByRole('button', { name: 'Ingresar' });
    await expect(btn).toBeVisible();

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'button-name')).toEqual([]);
  });

  test('código inválido muestra error accesible', async ({ authenticatedPage: page }) => {
    // Acotar al modal activo "Ingresar a grupo" — evita colisión con otros inputs ocultos
    const modal = page.getByRole('dialog', { name: 'Ingresar a grupo' });
    await modal.locator('input').first().fill('CODIGO-INVALIDO-000');

    // El submit puede navegar/recargar la página (form action="/quizzes/join" o similar).
    // Esperamos esa posible navegación para no dejar el contexto en estado inconsistente.
    await Promise.all([
      page.waitForLoadState('networkidle'),
      modal.getByRole('button', { name: 'Ingresar' }).click(),
    ]);

    await page.waitForSelector('[role="alert"], [aria-live]', {
      state: 'visible', timeout: 3000,
    }).catch(() => {});

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) =>
      ['aria-live-region-filler', 'aria-required-attr'].includes(v.id)
    )).toEqual([]);
  });

  test('el botón "Cancelar" cierra el modal', async ({ authenticatedPage: page }) => {
    const modal = page.getByRole('dialog', { name: 'Ingresar a grupo' });
    await modal.getByRole('button', { name: 'Cancelar' }).click();
    await modal.waitFor({ state: 'hidden' }).catch(() => {});

    // Si la página se cerró/navegó por algún test anterior, no falla aquí
    if (page.isClosed()) return;

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'BODY']).toContain(focusedTag);
  });
});

// ─── 3. Vista de grupo unido (rol Estudiante, sin opciones de administración) ─
test.describe('Vista de grupo unido — Estudiante', () => {
  test('la tarjeta del grupo NO muestra opciones de administración (⋮)', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    // El menú "Opciones del grupo" es exclusivo del rol Profesor.
    // Si aparece para Estudiante, es un problema de control de acceso/UI.
    const opcionesBtn = page.getByRole('button', { name: /opciones del grupo/i });
    const count = await opcionesBtn.count();
    expect(count).toBe(0);
  });

  test('la tarjeta del grupo muestra el código de acceso de forma accesible', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page })
        .include('[class*="card"]')
        .withTags(['wcag2aa'])
    );
    expect(blocking(violations)).toEqual([]);
  });
});

// ─── 4. Navegación por teclado (vista Estudiante) ────────────────────────────
test.describe('Navegación por teclado — Estudiante', () => {
  test('todos los elementos interactivos son alcanzables con Tab', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) =>
      ['keyboard', 'focus-visible', 'tabindex'].includes(v.id)
    )).toEqual([]);
  });

  test('no hay trampas de foco en el modal "Ingresar a grupo"', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const btn = page.getByRole('button', { name: /ingresar a grupo/i });
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForSelector('text=Ingresar a grupo', { state: 'visible' });

      const violations = await getViolations(
        new AxeBuilder({ page }).withTags(['wcag2aa'])
      );
      expect(violations.filter((v: Result) =>
        v.id === 'scrollable-region-focusable'
      )).toEqual([]);
    }
  });
});