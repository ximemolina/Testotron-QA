# Pruebas de accesibilidad — Gestión de Grupos

Suite WCAG 2.1 AA con Playwright + axe-core.

## Instalación

```bash
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install chromium
```

## Configuración rápida

1. Abrí `tests/fixtures/auth.fixture.ts`
2. Cambiá `BASE_URL`, `GRUPOS_URL` y las credenciales de prueba
3. Ajustá los selectores de login si difieren de los placeholders

## Ejecutar pruebas

```bash
# Todas las pruebas de accesibilidad
# Suite Profesor
npx playwright test --config=evidencia-pruebas/pruebas-usabilidad/tests/playwright.config.ts

# Suite Estudiante
npx playwright test --config=evidencia-pruebas/pruebas-usabilidad/tests/playwright.estudiante.config.ts

# Solo un módulo
npx playwright test --config=evidencia-pruebas/pruebas-usabilidad/tests/playwright.config.ts --grep "Creación de grupo" --headed

# Con reporte visual
npx playwright show-report evidencia-pruebas\pruebas-usabilidad\tests\reports\html-profesor
npx playwright show-report evidencia-pruebas\pruebas-usabilidad\tests\reports\html-estudiante
```

## Estructura

```
tests/
├── fixtures/
│   └── auth.fixture.ts          ← credenciales y página autenticada
└── grupos.accessibility.spec.ts ← suite principal
playwright.config.ts
reports/
├── html/                        ← reporte visual (se genera al correr)
└── axe-results.json             ← resultados en JSON para CI/CD
```

## Módulos cubiertos

| Módulo                        | Tests |
|-------------------------------|-------|
| Listado / consulta de grupos  | 2     |
| Creación de grupo             | 3     |
| Modificación de grupo         | 2     |
| Eliminación de grupo          | 2     |
| Adición de miembro por correo | 2     |
| Expulsión de miembro          | 2     |
| Unión a grupo por código      | 3     |
| Navegación por teclado        | 2     |
| **Total**                     | **18**|

## Ajuste de selectores

Los selectores usan `getByRole` y `getByLabel` con expresiones regulares en español/inglés. Si tus botones tienen otros textos, actualizá los patrones:

```ts
// Ejemplo: si tu botón dice "Nuevo grupo"
page.getByRole('button', { name: /nuevo grupo/i })
```

## CI/CD (GitHub Actions)

```yaml
- name: Install deps
  run: npm ci

- name: Run accessibility tests
  run: npx playwright test --config=playwright.config.ts

- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: axe-report
    path: reports/
```
