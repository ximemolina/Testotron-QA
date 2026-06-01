# 🧪 Proyecto de Auditoría y Validación — Testotron

> **Curso:** Auditoría y Validación de Sistemas de Información  
> **Aplicación auditada:** Testotron v1.0  
> **Fecha de inicio:** 2026  
> **Equipo:** Joshua Corrales, Susana Feng, Ximena Molina y Natalia Orozco


---

## 📋 Descripción del Sistema Auditado

**Testotron** es una plataforma educativa web de gestión de exámenes y cuestionarios orientada a entornos hispanoparlantes. Permite a docentes crear, publicar y calificar evaluaciones; organizar estudiantes en grupos; y obtener reportes de resultados. Los estudiantes pueden unirse a grupos, rendir evaluaciones asignadas y consultar sus resultados.

### Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Runtime | Node.js | ≥ 18 |
| Framework HTTP | Express | 5.1.0 |
| Base de datos | SQLite (better-sqlite3) | 8.3.0 |
| Autenticación | JSON Web Tokens (jsonwebtoken) | — |
| Hash de contraseñas | bcrypt | — |
| Vistas (SSR) | express-handlebars | 8.0.7 |
| Validación | Zod | 3.25.65 |
| UI | Bootstrap | 5.3.8 |
| Frontend | Vanilla JavaScript (ES6+) | — |

### Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| `student` | Unirse a grupos, tomar exámenes, ver resultados |
| `teacher` | Crear/gestionar grupos, exámenes, preguntas, plantillas; calificar; ver estadísticas |
| `admin` | Acceso total al sistema |

### URL de Acceso

```
http://localhost:8080
```

---

## 🎯 Objetivo General

Ejecutar un proceso completo de aseguramiento de la calidad sobre Testotron, combinando auditorías estáticas y dinámicas, pruebas funcionales y no funcionales, aplicando metodologías V&V (Verificación y Validación), herramientas automatizadas y modelos de calidad reconocidos.

---

## 🎯 Objetivos Específicos

- Analizar los requerimientos funcionales y no funcionales de Testotron.
- Diseñar y ejecutar pruebas estáticas (revisión de código, mantenibilidad, deuda técnica) y dinámicas (funcionales, rendimiento, seguridad, usabilidad).
- Aplicar técnicas de verificación y validación de software.
- Evaluar atributos de calidad mediante modelos reconocidos (ISO 25010 / McCall).
- Diseñar métricas cuantitativas de calidad con umbrales de aceptación.
- Detectar y documentar defectos formalmente.
- Automatizar pruebas con herramientas profesionales.
- Analizar deuda técnica y mantenibilidad del código fuente.
- Elaborar un reporte técnico final con hallazgos y recomendaciones basadas en evidencia.

---

## 🗂️ Alcance

### Módulos / Funcionalidades Incluidas

| Módulo | Descripción |
|--------|-------------|
| Autenticación | Registro, login, logout, JWT |
| Gestión de usuarios | CRUD de perfiles, roles |
| Grupos | Creación, unión por código, membresía |
| Banco de preguntas | CRUD de preguntas por tipo |
| Plantillas de examen | Creación y reutilización |
| Exámenes (Tests) | Ciclo de vida completo: borrador → publicado → cerrado |
| Intentos (Attempts) | Inicio, respuesta y envío por parte del estudiante |
| Calificación | Calificación manual por docente y cálculo de puntaje |
| Resultados | Vista agregada con estado (Aprobado/Reprobado/Entregado/Pendiente) |
| Panel de administración | Gestión global por rol admin |
| Accesibilidad | Cumplimiento WCAG 2.1 nivel AA |

### Excluido del Alcance

- Infraestructura de producción (Nginx, TLS, CDN)
- Integración con servicios de terceros
- Procesos de respaldo y recuperación de base de datos en producción
- Migración de SQLite a motores externos (PostgreSQL)

---

## 🗃️ Estructura del Repositorio de Auditoría

```
auditoría-testotron/
├── README.md                        ← Este archivo
├── testotron                     ← Código fuente de Testotron
├── plan-de-calidad/
│   ├── plan-general.md              ← Plan General de Calidad
│   ├── estrategia-pruebas.md
│   ├── cronograma.md
│   └── roles-responsabilidades.md
├── pruebas-estaticas/
│   ├── revision-requerimientos/
│   ├── revision-codigo/
│   ├── mantenibilidad/
│   └── deuda-tecnica/
├── casos-de-prueba/
│   ├── funcionales/
│   ├── negativos/
│   ├── integracion/
│   ├── rendimiento/
│   ├── seguridad/
│   └── usabilidad/
├── automatizacion/
│   ├── selenium/
│   ├── jmeter/
│   ├── postman/
│   └── eslint-sonarqube/
├── defectos/
│   └── registro-defectos.md
├── metricas/
│   └── metricas-calidad.md
├── matriz-trazabilidad/
│   └── trazabilidad.md
└── informe-final/
    └── informe-final.pdf
```

---

## 🔬 Tipos de Pruebas

### Pruebas Estáticas

| Tipo | Enfoque en Testotron |
|------|---------------------|
| Revisión de requerimientos | Ambigüedad, completitud, consistencia, trazabilidad |
| Revisión de código | Legibilidad, modularidad, duplicación, complejidad, convenciones |
| Evaluación de mantenibilidad | Acoplamiento, cohesión, complejidad ciclomática |
| Evaluación de deuda técnica | Código duplicado/muerto, vulnerabilidades, smells, dependencias obsoletas |

### Pruebas Dinámicas

| Tipo | Descripción |
|------|-------------|
| Pruebas unitarias | Controladores, modelos, servicios individuales |
| Pruebas de integración | Flujos API: auth → grupo → examen → intento → calificación |
| Pruebas de sistema | Flujo completo end-to-end por rol |
| Pruebas de aceptación (UAT) | Validación con perfiles reales de docente y estudiante |
| Pruebas funcionales | Verificación de cada endpoint y flujo de negocio |
| Pruebas de rendimiento | Tiempo de respuesta, concurrencia, throughput |
| Pruebas de carga | Comportamiento bajo usuarios simultáneos |
| Pruebas de seguridad | SQL Injection, XSS, control de acceso, contraseñas |
| Pruebas de usabilidad | Navegación, accesibilidad, experiencia de usuario |

---

## 📏 Métricas de Calidad

Cada métrica incluye:

- Objetivo de la métrica
- Fórmula
- Unidad de medida
- Herramienta de medición
- Método de recolección
- Frecuencia de medición
- Justificación
- Umbral de aceptación (✅ total / ⚠️ parcial / ❌ rechazo)

Ver detalles en [`metricas/metricas-calidad.md`](./metricas/metricas-calidad.md).

---

## 📐 Casos de Prueba

Cada integrante del equipo diseña casos de prueba para **al menos 1 requerimiento funcional** y **1 no funcional**.

### Estructura de cada caso

| Campo | Descripción |
|-------|-------------|
| ID | Identificador único (ej. `TC-AUTH-001`) |
| Nombre | Nombre descriptivo |
| Objetivo | Qué se quiere verificar |
| Requerimiento asociado | RF o RNF correspondiente |
| Tipo de prueba | Funcional / Seguridad / Rendimiento / etc. |
| Prioridad | Alta / Media / Baja |
| Precondiciones | Estado del sistema antes de ejecutar |
| Datos de prueba | Entradas utilizadas |
| Pasos | Secuencia de acciones |
| Resultado esperado | Comportamiento correcto |
| Resultado obtenido | Lo que ocurrió realmente |
| Estado | ✅ Pasó / ❌ Falló / ⚠️ Bloqueado |
| Evidencia | Capturas, logs, reportes |

---

## 🐛 Gestión de Defectos

Cada defecto se registra con:

| Campo | Descripción |
|-------|-------------|
| ID | Identificador único (ej. `DEF-001`) |
| Título | Resumen del defecto |
| Descripción | Detalle del problema |
| Severidad | Crítico / Alto / Medio / Bajo |
| Prioridad | Alta / Media / Baja |
| Pasos para reproducir | Secuencia exacta |
| Resultado esperado | Comportamiento correcto |
| Resultado actual | Lo que ocurre |
| Evidencia | Capturas, logs |
| Estado | Abierto / En progreso / Resuelto / Cerrado |
| Responsable | Integrante asignado |

Ver registro completo en [`defectos/registro-defectos.md`](./defectos/registro-defectos.md).

---

## 🔗 Matriz de Trazabilidad

Relaciona cada requerimiento con sus casos de prueba, tipo, resultado y defectos asociados:

| Requerimiento | Caso de Prueba | Tipo | Resultado | Defecto |
|---------------|----------------|------|-----------|---------|
| RF-AUTH-01 (Registro de usuario) | TC-AUTH-001 | Funcional | ✅ | — |
| RF-AUTH-02 (Login) | TC-AUTH-002 | Funcional | — | — |
| ... | ... | ... | ... | ... |

Ver [`matriz-trazabilidad/trazabilidad.md`](./matriz-trazabilidad/trazabilidad.md).

---

## 🛠️ Herramientas Utilizadas

| Categoría | Herramienta |
|-----------|-------------|
| Análisis estático | ESLint, SonarQube |
| Pruebas funcionales / E2E | Playwright o Cypress |
| Pruebas de API | Postman / Newman |
| Pruebas de rendimiento | Apache JMeter |
| Pruebas de seguridad | OWASP ZAP, Burp Suite (Community) |
| Accesibilidad | axe DevTools, WAVE |
| Cobertura de código | Istanbul / nyc |
| Control de versiones | Git / GitHub |
| Gestión de defectos | GitHub Issues / hoja compartida |

---

## 👥 Equipo

| Integrante | Rol principal | Requerimientos asignados |
|------------|--------------|--------------------------|
| [Nombre 1] | Coordinador / Pruebas estáticas | RF-AUTH, RNF-SEG |
| [Nombre 2] | Pruebas funcionales | RF-GRUPOS, RF-EXAMENES |
| [Nombre 3] | Automatización | RF-INTENTOS, RNF-RENDIMIENTO |
| [Nombre 4] | Seguridad y usabilidad | RF-CALIFICACION, RNF-USABILIDAD |

---

## 📄 Informe Final

El informe final incluye:

1. Portada
2. Introducción
3. Objetivos
4. Descripción del sistema (Testotron)
5. Alcance
6. Metodología
7. Plan de pruebas
8. Herramientas utilizadas
9. Casos de prueba
10. Matriz de trazabilidad
11. Gestión de defectos
12. Resultados de ejecución
13. Métricas
14. Evaluación de deuda técnica
15. Análisis de riesgos
16. Análisis de resultados
17. Conclusiones
18. Recomendaciones
19. Anexos

---

## 📎 Referencias

- [Documentación técnica de Testotron](./docs/DOCS.md)
- [ISO/IEC 25010 — Calidad del producto de software](https://www.iso.org/standard/35733.html)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [WCAG 2.1 — W3C](https://www.w3.org/TR/WCAG21/)
- [JMeter Documentación](https://jmeter.apache.org/usermanual/index.html)
- [Playwright Docs](https://playwright.dev/docs/intro)