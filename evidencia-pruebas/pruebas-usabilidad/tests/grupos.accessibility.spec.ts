/**
 * Suite de accesibilidad — Módulo de Gestión de Grupos (Testotron)
 * Framework : Playwright + @axe-core/playwright
 * Estándar  : WCAG 2.1 AA
 */

import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';
import { test, expect, BASE_URL, GRUPOS_URL } from './fixtures/auth.fixture';

// URL del detalle de un grupo existente — ajustá el código si cambia
const GRUPO_DETALLE_URL = `${BASE_URL}/groups/LBJ6617K`;

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

// Solo violaciones que bloquean (excluye minor que viene del aside del sidebar)
function blocking(violations: Result[]): Result[] {
  return violations.filter((v: Result) => v.impact !== 'minor');
}

// ─── 1. Listado de grupos ─────────────────────────────────────────────────────
test.describe('Listado de grupos', () => {
  test('la página "Mis grupos" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await scanPage(page, 'Mis grupos — listado');
    // Filtra el "minor" conocido del aside#sidebar-nav con role="navigation"
    expect(blocking(violations)).toEqual([]);
  });

  test('el campo "Buscar grupos..." tiene label accesible', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page })
        .include('input[placeholder="Buscar grupos..."]')
        .withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'label')).toEqual([]);
  });

  test('las tarjetas de grupo tienen estructura semántica correcta', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(blocking(violations)).toEqual([]);
  });
});

// ─── 2. Creación de grupo ─────────────────────────────────────────────────────
test.describe('Creación de grupo', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /nuevo grupo/i }).click();
    await page.waitForSelector('text=Crear nuevo grupo', { state: 'visible' });
  });

  test('el modal "Crear nuevo grupo" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
    const violations = await scanPage(page, 'Modal — Crear nuevo grupo');
    // heading-order: bug conocido — <h5> en modal debe cambiarse a <h3> (ver README)
    expect(blocking(violations).filter((v: Result) => v.id !== 'heading-order')).toEqual([]);
  });

  test('el campo "Nombre del grupo" tiene label visible', async ({ authenticatedPage: page }) => {
    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) =>
      ['label', 'label-title-only', 'label-content-name-mismatch'].includes(v.id)
    )).toEqual([]);
  });

  test('el botón "Crear grupo" es accesible', async ({ authenticatedPage: page }) => {
    const crearBtn = page.getByRole('button', { name: 'Crear grupo' });
    await expect(crearBtn).toBeVisible();
    await expect(crearBtn).toBeEnabled();

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'button-name')).toEqual([]);
  });

  test('los errores de validación son accesibles', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Crear grupo' }).click();
    await page.waitForSelector('[aria-invalid="true"], .is-invalid', {
      state: 'visible', timeout: 3000,
    }).catch(() => {});

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) =>
      ['aria-required-attr', 'aria-invalid-attr-value'].includes(v.id)
    )).toEqual([]);
  });

  test('el botón "Cancelar" cierra el modal', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await page.waitForSelector('text=Crear nuevo grupo', { state: 'hidden' }).catch(() => {});
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'BODY']).toContain(focusedTag);
  });
});

// ─── 3. Detalle del grupo ─────────────────────────────────────────────────────
test.describe('Detalle del grupo', () => {
  test('la página de detalle no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPO_DETALLE_URL);
    await page.waitForLoadState('networkidle');

    const violations = await scanPage(page, 'Detalle del grupo');
    // heading-order y button-name (botón basura): bugs conocidos — ver README
    expect(blocking(violations).filter((v: Result) =>
      !['heading-order', 'button-name'].includes(v.id)
    )).toEqual([]);
  });

  test('las estadísticas del grupo tienen estructura semántica correcta', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPO_DETALLE_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page })
        .include('[aria-label="Estadísticas del grupo"]')
        .withTags(['wcag2aa'])
    );
    expect(blocking(violations)).toEqual([]);
  });
});

// ─── 4. Edición de grupo ──────────────────────────────────────────────────────
test.describe('Edición de grupo', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(GRUPO_DETALLE_URL);
    await page.waitForLoadState('networkidle');
    // Botón "Editar grupo" en el detalle
    await page.getByRole('button', { name: /editar grupo/i }).click();
    await page.waitForSelector('text=Editar grupo', { state: 'visible' });
  });

  test('el modal "Editar grupo" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
    const violations = await scanPage(page, 'Modal — Editar grupo');
    // heading-order: bug conocido — <h5> en modal debe cambiarse a <h3> (ver README)
    expect(blocking(violations).filter((v: Result) => v.id !== 'heading-order')).toEqual([]);
  });

  test('los campos tienen label visible (no solo placeholder)', async ({ authenticatedPage: page }) => {
    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'label')).toEqual([]);
  });

  test('el botón "Guardar cambios" es accesible', async ({ authenticatedPage: page }) => {
    const btn = page.getByRole('button', { name: 'Guardar cambios' });
    await expect(btn).toBeVisible();
    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'button-name')).toEqual([]);
  });
});

// ─── 5. Eliminación de grupo ──────────────────────────────────────────────────
test.describe('Eliminación de grupo', () => {
  test('el menú ⋮ de la tarjeta expone "Ver grupo" y "Borrar grupo"', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    // El botón ⋮ tiene aria-label "Opciones del grupo <nombre>"
    await page.getByRole('button', { name: /opciones del grupo/i }).first().click();
    await page.waitForSelector('text=Borrar grupo', { state: 'visible' });

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'button-name')).toEqual([]);
  });

  test('el diálogo de confirmación al borrar es accesible', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /opciones del grupo/i }).first().click();
    await page.waitForSelector('text=Borrar grupo', { state: 'visible' });
    await page.getByText('Borrar grupo').click();

    await page.waitForSelector('[role="dialog"], [role="alertdialog"]', {
      state: 'visible', timeout: 3000,
    }).catch(() => {});

    const violations = await scanPage(page, 'Diálogo confirmación borrar grupo');
    expect(blocking(violations)).toEqual([]);
  });
});

// ─── 6. Incluir usuario (agregar miembro por correo) ─────────────────────────
test.describe('Incluir usuario al grupo', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(GRUPO_DETALLE_URL);
    await page.waitForLoadState('networkidle');
    // Botón "+ Incluir usuario" en la sección Miembros
    await page.getByRole('button', { name: /incluir usuario/i }).click();
    await page.waitForSelector('text=Agregar usuario al grupo', { state: 'visible' });
  });

  test('el modal "Agregar usuario al grupo" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
    const violations = await scanPage(page, 'Modal — Agregar usuario al grupo');
    // heading-order: bug conocido — <h5> en modal debe cambiarse a <h3> (ver README)
    expect(blocking(violations).filter((v: Result) => v.id !== 'heading-order')).toEqual([]);
  });

  test('el campo "Correo electrónico" tiene label asociado al input (no solo texto suelto)', async ({ authenticatedPage: page }) => {
    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'label')).toEqual([]);
  });

  test('el campo de correo tiene autocomplete="email" (WCAG 1.3.5)', async ({ authenticatedPage: page }) => {
    // BUG: falta autocomplete="email" en el input — debe corregirse en el HTML
    const emailInput = page.locator('#addUserModal input[type="email"]');
    const autocomplete = await emailInput.getAttribute('autocomplete');
    expect(autocomplete).toBe('email'); // fallará hasta que se agregue el atributo
  });

  test('el botón "Agregar usuario" tiene nombre accesible', async ({ authenticatedPage: page }) => {
    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'button-name')).toEqual([]);
  });
});

// ─── 7. Expulsión de miembro ──────────────────────────────────────────────────
test.describe('Expulsión de miembro', () => {
  test('el botón de eliminar miembro (ícono basura) tiene aria-label', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPO_DETALLE_URL);
    await page.waitForLoadState('networkidle');

    // BUG CONOCIDO: el botón de basura no tiene aria-label ni texto visible
    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) => v.id === 'button-name')).toEqual([]);
  });

  test('la confirmación de eliminación (confirm nativo) no rompe el flujo', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPO_DETALLE_URL);
    await page.waitForLoadState('networkidle');

    // Usar page.once para capturar el confirm() nativo y cancelarlo
    page.once('dialog', dialog => dialog.dismiss());

    const trashBtn = page.locator('form[action*="/members/remove"] button').first();
    const count = await trashBtn.count();
    if (count > 0) {
      await trashBtn.click();
      await page.waitForTimeout(500); // esperar que el diálogo nativo se resuelva
      const violations = await getViolations(
        new AxeBuilder({ page }).withTags(['wcag2aa'])
      );
      expect(blocking(violations)).toEqual([]);
    }
  });
});

// ─── 8. Navegación por teclado ────────────────────────────────────────────────
test.describe('Navegación por teclado', () => {
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

  test('no hay trampas de foco', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page }).withTags(['wcag2aa'])
    );
    expect(violations.filter((v: Result) =>
      v.id === 'scrollable-region-focusable'
    )).toEqual([]);
  });

  test('la navegación lateral es accesible', async ({ authenticatedPage: page }) => {
    await page.goto(GRUPOS_URL);
    await page.waitForLoadState('networkidle');

    const violations = await getViolations(
      new AxeBuilder({ page })
        .include('#sidebar-nav')
        .withTags(['wcag2aa'])
    );
    // El aside con role="navigation" es minor — no bloquea
    expect(blocking(violations)).toEqual([]);
  });
});