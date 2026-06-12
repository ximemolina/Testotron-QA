# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: grupos-estudiante.accessibility.spec.ts >> Ingresar a grupo por código >> el botón "Ingresar" tiene nombre accesible
- Location: evidencia-pruebas\pruebas-usabilidad\tests\grupos-estudiante.accessibility.spec.ts:108:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Ingresar' })
Expected: visible
Error: strict mode violation: getByRole('button', { name: 'Ingresar' }) resolved to 2 elements:
    1) <button data-bs-toggle="modal" class="btn btn-success" data-bs-target="#joinGroupModal">…</button> aka getByRole('button', { name: ' Ingresar a grupo' })
    2) <button type="submit" form="joinGroupForm" class="btn btn-success">↵          Ingresar↵        </button> aka getByRole('button', { name: 'Ingresar', exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Ingresar' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - text: 
      - navigation "Barra de usuario" [ref=e5]:
        - generic [ref=e6]:
          - generic [ref=e7]:
            - img "Logo de Testotron" [ref=e8]
            - generic [ref=e9]: Testotron
          - generic [ref=e10]:
            - generic [ref=e11]:
              - paragraph [ref=e12]: Hola de nuevo,
              - paragraph [ref=e13]: Estudiante3
            - 'generic "Rol: Estudiante" [ref=e14]': Estudiante
            - link "Ir a mi perfil" [ref=e15] [cursor=pointer]:
              - /url: /profile
              - generic [ref=e16]: E
    - generic [ref=e17]:
      - navigation "Menú principal" [ref=e18]:
        - navigation "Menú de navegación principal" [ref=e19]:
          - list [ref=e20]:
            - listitem [ref=e21]:
              - link "Ir al panel de inicio" [ref=e22] [cursor=pointer]:
                - /url: /dashboard
                - generic [ref=e23]: 
                - text: Panel de inicio
            - listitem [ref=e24]:
              - link "Ir a mis cuestionarios" [ref=e25] [cursor=pointer]:
                - /url: /student/quizzes
                - generic [ref=e26]: 
                - text: Cuestionarios
            - listitem [ref=e27]:
              - link "Ir a mis grupos" [ref=e28] [cursor=pointer]:
                - /url: /groups
                - generic [ref=e29]: 
                - text: Grupos
          - list [ref=e31]:
            - listitem [ref=e32]:
              - link "Ir a mi perfil" [ref=e33] [cursor=pointer]:
                - /url: /profile
                - generic [ref=e34]: 
                - text: Mi perfil
            - listitem [ref=e35]:
              - button "Cerrar sesión" [ref=e37] [cursor=pointer]:
                - generic [ref=e38]: 
                - text: Cerrar sesión
      - generic [ref=e39]:
        - main [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]:
                - heading "Mis grupos" [level=1] [ref=e44]
                - paragraph [ref=e45]: Organiza estudiantes y asigna cuestionarios
              - button " Ingresar a grupo" [active] [ref=e46] [cursor=pointer]:
                - generic [ref=e47]: 
                - text: Ingresar a grupo
              - dialog "Ingresar a grupo" [ref=e48]:
                - generic [ref=e49]:
                  - generic [ref=e50]:
                    - heading "Ingresar a grupo" [level=5] [ref=e51]
                    - button "Cerrar" [ref=e52] [cursor=pointer]
                  - generic [ref=e55]:
                    - generic [ref=e56]: Código del grupo
                    - textbox "Código del grupo" [ref=e57]
                  - generic [ref=e58]:
                    - button "Cancelar" [ref=e59] [cursor=pointer]
                    - button "Ingresar" [ref=e60] [cursor=pointer]
            - region "Búsqueda de grupos" [ref=e61]:
              - generic [ref=e64]:
                - generic [ref=e66]: 
                - searchbox "Buscar grupos" [ref=e67]
            - region "Listado de grupos" [ref=e68]:
              - article [ref=e71]:
                - generic [ref=e72]:
                  - generic [ref=e73]:
                    - generic [ref=e75]: 
                    - button "Opciones del grupo Grupo01" [ref=e77] [cursor=pointer]:
                      - generic [ref=e78]: 
                  - heading "Grupo01" [level=2] [ref=e79]
                  - generic [ref=e80]: LBJ6617K
                  - generic [ref=e81]:
                    - generic [ref=e82]:
                      - generic [ref=e83]:
                        - generic [ref=e84]: 
                        - text: 1 miembros
                      - generic [ref=e85]:
                        - generic [ref=e86]: 
                        - text: 0 cuestionarios
                    - paragraph [ref=e87]: "Creado: 2026-06-11 10:17:39"
        - contentinfo [ref=e88]:
          - generic [ref=e91]:
            - generic [ref=e92]: © Testotron
            - generic [ref=e93]:
              - link "Ayuda" [ref=e94] [cursor=pointer]:
                - /url: /help
                - generic [ref=e95]: 
                - text: Ayuda
              - link "Acerca de Testotron" [ref=e96] [cursor=pointer]:
                - /url: /about
                - generic [ref=e97]: 
                - text: Acerca de Testotron
```

# Test source

```ts
  10  | import { test, expect, GRUPOS_URL } from './fixtures/auth-student.fixture';
  11  | 
  12  | // ─── Helper: escanea página completa, retorna violations[] ───────────────────
  13  | async function scanPage(page: import('@playwright/test').Page, context?: string): Promise<Result[]> {
  14  |   const results = await new AxeBuilder({ page })
  15  |     .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
  16  |     .analyze();
  17  | 
  18  |   const violations = results.violations;
  19  |   if (violations.length > 0) {
  20  |     const report = violations
  21  |       .map(v =>
  22  |         `\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n` +
  23  |         v.nodes.map(n => `  → ${n.html}`).join('\n')
  24  |       ).join('\n');
  25  |     console.error(`\n── Violaciones en: ${context ?? 'página'} ──${report}`);
  26  |   }
  27  |   return violations;
  28  | }
  29  | 
  30  | async function getViolations(builder: AxeBuilder): Promise<Result[]> {
  31  |   const results = await builder.analyze();
  32  |   return results.violations;
  33  | }
  34  | 
  35  | // Solo violaciones que bloquean (excluye minor del aside#sidebar-nav)
  36  | function blocking(violations: Result[]): Result[] {
  37  |   return violations.filter((v: Result) => v.impact !== 'minor');
  38  | }
  39  | 
  40  | // ─── 1. Listado "Mis grupos" (vista Estudiante) ──────────────────────────────
  41  | test.describe('Listado de grupos — Estudiante', () => {
  42  |   test('la página "Mis grupos" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
  43  |     await page.goto(GRUPOS_URL);
  44  |     await page.waitForLoadState('networkidle');
  45  | 
  46  |     const violations = await scanPage(page, 'Mis grupos — vista Estudiante');
  47  |     expect(blocking(violations)).toEqual([]);
  48  |   });
  49  | 
  50  |   test('el badge de rol "Estudiante" es accesible', async ({ authenticatedPage: page }) => {
  51  |     await page.goto(GRUPOS_URL);
  52  |     await page.waitForLoadState('networkidle');
  53  | 
  54  |     // Confirma que el rol visible corresponde al usuario logueado
  55  |     await expect(page.getByText('Estudiante', { exact: true })).toBeVisible();
  56  | 
  57  |     const violations = await getViolations(
  58  |       new AxeBuilder({ page }).withTags(['wcag2aa'])
  59  |     );
  60  |     expect(blocking(violations)).toEqual([]);
  61  |   });
  62  | 
  63  |   test('las tarjetas de grupo muestran código y cantidad de miembros de forma accesible', async ({ authenticatedPage: page }) => {
  64  |     await page.goto(GRUPOS_URL);
  65  |     await page.waitForLoadState('networkidle');
  66  | 
  67  |     const violations = await getViolations(
  68  |       new AxeBuilder({ page }).withTags(['wcag2aa'])
  69  |     );
  70  |     expect(blocking(violations).filter((v: Result) =>
  71  |       ['list', 'listitem', 'region'].includes(v.id)
  72  |     )).toEqual([]);
  73  |   });
  74  | });
  75  | 
  76  | // ─── 2. Ingresar a grupo por código ──────────────────────────────────────────
  77  | test.describe('Ingresar a grupo por código', () => {
  78  |   test.beforeEach(async ({ authenticatedPage: page }) => {
  79  |     await page.goto(GRUPOS_URL);
  80  |     await page.waitForLoadState('networkidle');
  81  |     // Botón "Ingresar a grupo" — visible solo para rol Estudiante
  82  |     const btn = page.getByRole('button', { name: /ingresar a grupo/i });
  83  |     const count = await btn.count();
  84  |     if (count > 0) {
  85  |       await btn.click();
  86  |       await page.getByRole('dialog', { name: 'Ingresar a grupo' }).waitFor({ state: 'visible' });
  87  |     } else {
  88  |       test.skip(); // el usuario actual no tiene este botón (verificar rol/credenciales)
  89  |     }
  90  |   });
  91  | 
  92  |   test('el modal "Ingresar a grupo" no tiene violaciones bloqueantes', async ({ authenticatedPage: page }) => {
  93  |     const violations = await scanPage(page, 'Modal — Ingresar a grupo');
  94  |     // heading-order: si el modal usa <h5> tras <h1>/<h2> de la página, es bug conocido
  95  |     expect(blocking(violations).filter((v: Result) => v.id !== 'heading-order')).toEqual([]);
  96  |   });
  97  | 
  98  |   test('el campo "Código del grupo" tiene label visible', async ({ authenticatedPage: page }) => {
  99  |     const label = page.getByText('Código del grupo');
  100 |     await expect(label).toBeVisible();
  101 | 
  102 |     const violations = await getViolations(
  103 |       new AxeBuilder({ page }).withTags(['wcag2aa'])
  104 |     );
  105 |     expect(violations.filter((v: Result) => v.id === 'label')).toEqual([]);
  106 |   });
  107 | 
  108 |   test('el botón "Ingresar" tiene nombre accesible', async ({ authenticatedPage: page }) => {
  109 |     const btn = page.getByRole('button', { name: 'Ingresar' });
> 110 |     await expect(btn).toBeVisible();
      |                       ^ Error: expect(locator).toBeVisible() failed
  111 | 
  112 |     const violations = await getViolations(
  113 |       new AxeBuilder({ page }).withTags(['wcag2aa'])
  114 |     );
  115 |     expect(violations.filter((v: Result) => v.id === 'button-name')).toEqual([]);
  116 |   });
  117 | 
  118 |   test('código inválido muestra error accesible', async ({ authenticatedPage: page }) => {
  119 |     // Acotar al modal activo "Ingresar a grupo" — evita colisión con otros inputs ocultos
  120 |     const modal = page.getByRole('dialog', { name: 'Ingresar a grupo' });
  121 |     await modal.locator('input').first().fill('CODIGO-INVALIDO-000');
  122 | 
  123 |     // El submit puede navegar/recargar la página (form action="/quizzes/join" o similar).
  124 |     // Esperamos esa posible navegación para no dejar el contexto en estado inconsistente.
  125 |     await Promise.all([
  126 |       page.waitForLoadState('networkidle'),
  127 |       modal.getByRole('button', { name: 'Ingresar' }).click(),
  128 |     ]);
  129 | 
  130 |     await page.waitForSelector('[role="alert"], [aria-live]', {
  131 |       state: 'visible', timeout: 3000,
  132 |     }).catch(() => {});
  133 | 
  134 |     const violations = await getViolations(
  135 |       new AxeBuilder({ page }).withTags(['wcag2aa'])
  136 |     );
  137 |     expect(violations.filter((v: Result) =>
  138 |       ['aria-live-region-filler', 'aria-required-attr'].includes(v.id)
  139 |     )).toEqual([]);
  140 |   });
  141 | 
  142 |   test('el botón "Cancelar" cierra el modal', async ({ authenticatedPage: page }) => {
  143 |     const modal = page.getByRole('dialog', { name: 'Ingresar a grupo' });
  144 |     await modal.getByRole('button', { name: 'Cancelar' }).click();
  145 |     await modal.waitFor({ state: 'hidden' }).catch(() => {});
  146 | 
  147 |     // Si la página se cerró/navegó por algún test anterior, no falla aquí
  148 |     if (page.isClosed()) return;
  149 | 
  150 |     const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
  151 |     expect(['BUTTON', 'A', 'INPUT', 'BODY']).toContain(focusedTag);
  152 |   });
  153 | });
  154 | 
  155 | // ─── 3. Vista de grupo unido (rol Estudiante, sin opciones de administración) ─
  156 | test.describe('Vista de grupo unido — Estudiante', () => {
  157 |   test('la tarjeta del grupo NO muestra opciones de administración (⋮)', async ({ authenticatedPage: page }) => {
  158 |     await page.goto(GRUPOS_URL);
  159 |     await page.waitForLoadState('networkidle');
  160 | 
  161 |     // El menú "Opciones del grupo" es exclusivo del rol Profesor.
  162 |     // Si aparece para Estudiante, es un problema de control de acceso/UI.
  163 |     const opcionesBtn = page.getByRole('button', { name: /opciones del grupo/i });
  164 |     const count = await opcionesBtn.count();
  165 |     expect(count).toBe(0);
  166 |   });
  167 | 
  168 |   test('la tarjeta del grupo muestra el código de acceso de forma accesible', async ({ authenticatedPage: page }) => {
  169 |     await page.goto(GRUPOS_URL);
  170 |     await page.waitForLoadState('networkidle');
  171 | 
  172 |     const violations = await getViolations(
  173 |       new AxeBuilder({ page })
  174 |         .include('[class*="card"]')
  175 |         .withTags(['wcag2aa'])
  176 |     );
  177 |     expect(blocking(violations)).toEqual([]);
  178 |   });
  179 | });
  180 | 
  181 | // ─── 4. Navegación por teclado (vista Estudiante) ────────────────────────────
  182 | test.describe('Navegación por teclado — Estudiante', () => {
  183 |   test('todos los elementos interactivos son alcanzables con Tab', async ({ authenticatedPage: page }) => {
  184 |     await page.goto(GRUPOS_URL);
  185 |     await page.waitForLoadState('networkidle');
  186 | 
  187 |     const violations = await getViolations(
  188 |       new AxeBuilder({ page }).withTags(['wcag2aa'])
  189 |     );
  190 |     expect(violations.filter((v: Result) =>
  191 |       ['keyboard', 'focus-visible', 'tabindex'].includes(v.id)
  192 |     )).toEqual([]);
  193 |   });
  194 | 
  195 |   test('no hay trampas de foco en el modal "Ingresar a grupo"', async ({ authenticatedPage: page }) => {
  196 |     await page.goto(GRUPOS_URL);
  197 |     await page.waitForLoadState('networkidle');
  198 | 
  199 |     const btn = page.getByRole('button', { name: /ingresar a grupo/i });
  200 |     if (await btn.count() > 0) {
  201 |       await btn.click();
  202 |       await page.waitForSelector('text=Ingresar a grupo', { state: 'visible' });
  203 | 
  204 |       const violations = await getViolations(
  205 |         new AxeBuilder({ page }).withTags(['wcag2aa'])
  206 |       );
  207 |       expect(violations.filter((v: Result) =>
  208 |         v.id === 'scrollable-region-focusable'
  209 |       )).toEqual([]);
  210 |     }
```