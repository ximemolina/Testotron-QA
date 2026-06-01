# Informes de accesibilidad y usabilidad — Testotron

> **Nota**: Este documento es una base redactada para adaptar con los datos reales del grupo, las capturas de pantalla y los resultados finales obtenidos durante la validación.  
> Los apartados de **resultados esperados** están formulados como hipótesis de evaluación sobre el proyecto Testotron.

---

# INFORME 01 — EVALUACIÓN DE ACCESIBILIDAD

## Portada

**Título:** Informe de evaluación de accesibilidad del sistema Testotron  
**Curso:** [Nombre del curso]  
**Docente:** [Nombre del docente]  
**Grupo:** [Número o nombre del grupo]  
**Integrantes:** [Nombre 1], [Nombre 2], [Nombre 3], [Nombre 4]  
**Fecha:** [dd/mm/aaaa]

---

## 1. Introducción

La accesibilidad en software busca que todas las personas puedan percibir, entender, navegar e interactuar con un sistema, incluyendo usuarios con discapacidad visual, motora, auditiva, cognitiva o con necesidades temporales de acceso. En un proyecto como Testotron, donde se gestionan exámenes, grupos, preguntas, plantillas y resultados, la accesibilidad no solo debe estar presente en la interfaz principal, sino también en formularios, navegación por teclado, mensajes de error, temporizadores y documentos generados.

Este informe presenta una evaluación de accesibilidad aplicada al propio proyecto Testotron. La revisión se orienta por los principios de las WCAG y por criterios prácticos de interfaz observables en la plataforma, con énfasis en el idioma de la interfaz, semántica HTML, contraste, uso de teclado, feedback de errores, etiquetas ARIA y componentes dinámicos como modales y temporizadores. La documentación técnica del proyecto ya contempla varios elementos accesibles, como idioma español, enlace de salto al contenido principal, uso de HTML semántico, formularios etiquetados y anuncios mediante `aria-live`. fileciteturn1file2turn1file13

---

## 2. Descripción del proyecto

Testotron es una plataforma educativa de gestión de exámenes y cuestionarios para entornos hispanoparlantes. Permite a docentes crear, publicar y calificar evaluaciones; organizar estudiantes en grupos; y revisar resultados agregados. Los estudiantes pueden unirse a grupos, rendir exámenes y consultar sus resultados una vez calificados. El sistema trabaja con roles de estudiante, docente y administrador, y combina una capa SSR con una API REST. fileciteturn1file2turn1file19

Entre sus componentes funcionales se incluyen autenticación, gestión de grupos, banco de preguntas, plantillas, creación y publicación de exámenes, manejo de intentos, respuestas y calificación. Las features esperadas refuerzan además el uso de navegación sencilla, responsive, compatibilidad con lectores de pantalla, contraste accesible, idioma en español y textos alternativos. fileciteturn1file3turn1file10

---

## 3. Resumen de principios y criterios de accesibilidad basados en WCAG 2.2

Para este informe, la evaluación se organiza siguiendo los cuatro principios clásicos de accesibilidad:

### 3.1 Perceptible
La información debe presentarse de forma que pueda ser percibida por los sentidos del usuario. En Testotron esto implica:
- texto alternativo para imágenes e íconos;
- contraste suficiente entre texto y fondo;
- mensajes claros de estado y error;
- temporizador anunciable por tecnologías de apoyo.

### 3.2 Operable
La interfaz debe poder utilizarse con teclado y otros dispositivos de entrada. En Testotron esto implica:
- navegación por teclado completa;
- orden de foco lógico;
- enlace de salto al contenido principal;
- controles interactivos con foco visible;
- modales accesibles y cerrables sin ratón.

### 3.3 Comprensible
La información y el funcionamiento deben ser claros y previsibles. En Testotron esto implica:
- idioma de la interfaz definido como español;
- etiquetas comprensibles;
- errores descritos con mensajes útiles;
- consistencia en botones, formularios y flujos.

### 3.4 Robusto
El contenido debe ser compatible con tecnologías de asistencia y con distintos agentes de usuario. En Testotron esto implica:
- HTML semántico;
- atributos ARIA bien empleados;
- componentes con nombre, rol y valor claros;
- estructura estable en vistas SSR y formularios dinámicos.

La documentación técnica del proyecto ya declara varias de estas medidas: `lang="es"`, enlace “Saltar al contenido principal”, uso de `<main>`, `<nav>`, `<header>`, `<footer>`, etiquetas `aria-describedby`, `aria-invalid`, `role="dialog"`, `aria-live` y foco visible. fileciteturn1file13turn1file16

---

## 4. Rúbrica de evaluación

> Esta rúbrica evalúa el documento y la prueba, no solo el código.

| Criterio | Descripción | Evidencia esperada |
|---|---|---|
| Estructura mínima | Portada, introducción, criterios, prueba, actividades, resultados, conclusiones y bibliografía | Documento completo y ordenado |
| Ortografía | Redacción correcta y sin errores frecuentes | Revisión final del texto |
| Calidad de fuentes | Uso de documentación oficial y referencias académicas | WCAG, documentación del proyecto, manuales de accesibilidad |
| Instrumentos | Rúbrica clara y normas WCAG citadas | Tabla de criterios y observaciones |
| Tareas de prueba | Secuencia clara de actividades previas y durante la validación | Agenda de evaluación |
| Evidencias | Capturas, registros y observaciones | Imágenes y anexos |
| Resultados | Hallazgos claros, tabulados y objetivos | Tabla de conformidades y problemas |
| Conclusiones | Mejoras al software y aprendizaje del proceso | Recomendaciones concretas |

---

## 5. Instrumento de evaluación

### 5.1 Escala sugerida

- **Cumple adecuadamente**
- **Cumple parcialmente**
- **No cumple**
- **No aplica**
- **Imposible de comprobar**

### 5.2 Criterios evaluados

| # | Criterio | Pregunta guía |
|---|---|---|
| 1 | Idioma de la interfaz | ¿Toda la interfaz está en español y declara `lang="es"`? |
| 2 | Estructura semántica | ¿Se usan correctamente `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>` y `<form>`? |
| 3 | Navegación por teclado | ¿Se puede usar el sistema sin mouse? |
| 4 | Orden de foco | ¿El foco avanza de forma lógica? |
| 5 | Enlace de salto | ¿Existe un enlace para ir al contenido principal? |
| 6 | Formularios | ¿Todos los campos tienen `label` asociado? |
| 7 | Mensajes de error | ¿Los errores se explican de forma clara y accesible? |
| 8 | Contraste | ¿El texto y los elementos cumplen contraste suficiente? |
| 9 | Componentes dinámicos | ¿Modales y alertas anuncian información con ARIA? |
| 10 | Temporizador | ¿El temporizador anuncia cambios importantes? |
| 11 | Íconos y botones | ¿Los íconos no sustituyen texto útil? |
| 12 | Compatibilidad con lectores | ¿La interfaz es interpretable por tecnologías de apoyo? |

---

## 6. Descripción de la prueba de accesibilidad

### 6.1 Objetivo de la prueba
Verificar si la interfaz de Testotron permite un uso accesible en tareas principales como iniciar sesión, navegar por el panel, crear o revisar cuestionarios, completar formularios y participar en exámenes.

### 6.2 Alcance
Se recomienda evaluar al menos estas pantallas:
- inicio de sesión y registro;
- panel principal;
- lista de grupos;
- creación y edición de exámenes;
- banco de preguntas;
- plantillas;
- vista de estudiante al resolver un cuestionario;
- modales y formularios;
- panel de resultados.

### 6.3 Herramientas empleadas
- Navegación con teclado.
- Inspección manual del HTML y de los atributos ARIA.
- Revisión visual de contraste.
- Lectores de pantalla o simulación equivalente.
- Verificación de foco visible y orden de tabulación.
- Capturas de evidencia.

### 6.4 Actividades previas
1. Identificar las pantallas clave del sistema.
2. Definir la lista de criterios WCAG a revisar.
3. Preparar una rúbrica simple de verificación.
4. Organizar capturas y espacios para observaciones.
5. Revisar la documentación técnica del proyecto antes de probar la interfaz. fileciteturn1file2turn1file13

### 6.5 Actividades durante la validación
1. Recorrer la interfaz usando solo teclado.
2. Verificar que los enlaces, botones y formularios sean operables.
3. Revisar si el contenido principal se puede alcanzar con facilidad.
4. Comprobar que los mensajes de error se asocien a los campos.
5. Revisar el comportamiento de modales y temporizadores.
6. Registrar hallazgos, inconsistencias y oportunidades de mejora.

---

## 7. Agenda de validación

| Fase | Actividad | Duración estimada |
|---|---|---|
| Preparación | Revisión de pantallas y criterios | 15–20 min |
| Inspección manual | Teclado, foco, labels, orden semántico | 20–30 min |
| Revisión de componentes dinámicos | Modales, alertas, temporizador | 15–20 min |
| Registro de evidencias | Capturas y observaciones | 15 min |
| Análisis | Clasificación de hallazgos | 20 min |
| Cierre | Conclusiones y mejoras | 15 min |

---

## 8. Resultados esperados de la evaluación

> Estos resultados son esperados y deben validarse con la prueba real.

### 8.1 Hallazgos positivos esperados
- La interfaz está en español y el sistema declara el idioma correctamente.
- Existe un enlace para saltar al contenido principal.
- La estructura HTML es semántica en la mayoría de vistas.
- Los formularios poseen etiquetas visibles.
- Los mensajes de error y alerta pueden anunciarse mediante ARIA.
- El temporizador del cuestionario puede exponer cambios por `aria-live`.
- Los botones incluyen texto comprensible y no dependen solo de íconos.

### 8.2 Hallazgos por revisar
- Contraste real de botones, textos secundarios y estados de hover.
- Orden de foco en vistas con muchos controles.
- Comportamiento accesible de modales al abrirse y cerrarse.
- Accesibilidad del cuestionario en pantalla pequeña.
- Claridad de mensajes de error cuando un usuario omite datos.

### 8.3 Riesgos probables
- Uso irregular de `aria-*` en componentes personalizados.
- Texto pequeño o bajo contraste en tarjetas, tablas o menús laterales.
- Navegación complicada en pantallas con muchas acciones.
- Temporizador excesivamente llamativo o insuficientemente anunciado.
- Íconos sin texto alternativo adecuado.

---

## 9. Tabla de resultados de ejemplo

| Criterio | Estado esperado | Observación esperada |
|---|---|---|
| Idioma | Cumple | UI en español, `lang="es"` |
| Salto al contenido | Cumple | Enlace disponible en el layout principal |
| Semántica HTML | Cumple | Uso de estructura semántica en vistas principales |
| Teclado | Cumple parcialmente | Algunas pantallas pueden requerir ajustes |
| Foco visible | Cumple | Debe existir estilo visible al navegar |
| Formularios | Cumple | Etiquetas asociadas a campos |
| Errores | Cumple parcialmente | Deben ser descriptivos y persistentes |
| Contraste | Cumple parcialmente | Verificar texto secundario y botones |
| Modales | Cumple parcialmente | Necesitan cierre y foco manejado correctamente |
| Temporizador | Cumple parcialmente | Debe anunciarse de forma comprensible |

---

## 10. Conclusiones

La revisión de accesibilidad muestra que Testotron ya parte de una base favorable: trabaja en español, incorpora estructura semántica, prevé un enlace de salto, contempla mensajes accesibles y define buenas prácticas para formularios, alertas y temporizador. Esto es coherente con un sistema académico que necesita ser usable por estudiantes y docentes con perfiles diversos. fileciteturn1file2turn1file13turn1file16

Como mejora principal, se recomienda validar cada pantalla con teclado y lector de pantalla, corregir contrastes dudosos, asegurar foco visible en todos los componentes interactivos y reforzar los estados de error. También es importante documentar evidencia visual de cada prueba para respaldar el informe final.

---

## 11. Referencias

- Documentación técnica de Testotron. fileciteturn1file2
- Requisitos funcionales y de accesibilidad esperados para Testotron. fileciteturn1file3
- Implementaciones accesibles ya contempladas en la documentación del sistema. fileciteturn1file13turn1file16

---

## 12. Anexos sugeridos

- Capturas de pantalla del login, dashboard, cuestionario y modales.
- Evidencia de navegación con teclado.
- Captura del inspector mostrando `lang="es"` y atributos ARIA.
- Captura de contraste.
- Registro de hallazgos.

---

# INFORME 02 — EVALUACIÓN DE USABILIDAD

## Portada

**Título:** Informe de evaluación de usabilidad del sistema Testotron  
**Curso:** [Nombre del curso]  
**Docente:** [Nombre del docente]  
**Grupo:** [Número o nombre del grupo]  
**Integrantes:** [Nombre 1], [Nombre 2], [Nombre 3], [Nombre 4]  
**Fecha:** [dd/mm/aaaa]

---

## 1. Introducción

La usabilidad evalúa qué tan fácil, eficiente y satisfactorio resulta usar un sistema. En Testotron, la usabilidad es especialmente importante porque la plataforma debe servir a docentes que crean y organizan evaluaciones, y a estudiantes que resuelven cuestionarios en tiempos limitados. Por ello, este informe combina dos instrumentos de uso común en clase: el cuestionario SUS y la evaluación heurística.

El proyecto ya define varios elementos pensados para facilitar el uso: interfaz simple, navegación intuitiva, responsive móvil/escritorio, barra de progreso, temporizador, guardado o interacción rápida, además de un diseño consistente con sidebar, navbar y dashboard. fileciteturn1file3turn1file10

---

## 2. Descripción del proyecto

Testotron es una plataforma educativa para gestionar exámenes, preguntas, grupos y resultados. Tiene tres roles principales: estudiante, docente y administrador. El sistema está pensado para entornos académicos hispanoparlantes y usa SSR + API, lo que favorece un flujo de navegación relativamente directo entre pantallas de autenticación, panel principal, grupos, exámenes, preguntas, plantillas, resultados y perfil. fileciteturn1file2turn1file19

La arquitectura del sistema favorece la consistencia porque centraliza el acceso mediante un layout principal, vistas por rol y componentes reutilizables como navbar, sidebar, tarjetas, modales, barra de progreso y temporizador. Esto ayuda a que el usuario encuentre patrones repetidos y no tenga que aprender una interfaz distinta en cada pantalla. fileciteturn1file15turn1file17

---

## 3. Resumen de principios y criterios de usabilidad

### 3.1 Principios generales
- Facilidad de aprendizaje.
- Eficiencia en tareas frecuentes.
- Prevención y recuperación de errores.
- Consistencia visual y funcional.
- Satisfacción del usuario.

### 3.2 Criterios prácticos observables
- claridad de navegación;
- consistencia entre botones y mensajes;
- facilidad para encontrar exámenes, grupos y preguntas;
- simplicidad al crear y editar cuestionarios;
- comprensión de estados y resultados;
- tolerancia a errores en formularios.

### 3.3 Relación con el proyecto
Las features esperadas del sistema refuerzan esta visión: interfaz simple, navegación intuitiva, barra de progreso, confirmación antes de enviar, guardado automático, soporte para grupos, plantillas, exportación e importación y un panel de administración. fileciteturn1file3turn1file10

---

## 4. Instrumentos de evaluación

### 4.1 SUS (System Usability Scale)

El SUS es un cuestionario de 10 ítems con escala de 1 a 5. Produce una puntuación global entre 0 y 100. En la referencia de clase, un valor de 68 se toma como promedio; por encima de 68 se interpreta como buen nivel de usabilidad, y por encima de 80.3 como sobresaliente.

#### Preguntas SUS
1. Creo que me gustaría utilizar este sistema frecuentemente.  
2. Encuentro el sistema innecesariamente complejo.  
3. Creo que el sistema es fácil de usar.  
4. Creo que necesito el apoyo de un experto para poder usar este sistema.  
5. Considero que todas las funcionalidades que ofrece este sistema están bien integradas.  
6. Pienso que el sistema tiene muchas inconsistencias.  
7. Creo que la mayoría de la gente podría aprender a usar el sistema de forma rápida.  
8. Creo que el sistema es muy complicado de usar.  
9. Me he sentido muy seguro usando el sistema.  
10. Creo que necesito aprender muchas cosas antes de poder seguir utilizando el sistema.

### 4.2 Evaluación heurística

La evaluación heurística se basa en los principios de Nielsen y en principios de diseño de interfaces vistos en clase. Las 10 categorías usadas son:

1. Visibility of System Status  
2. Match Between the System and the Real World  
3. User Control and Freedom  
4. Consistency and Standards  
5. Error Prevention  
6. Recognition Rather than Recall  
7. Flexibility and Efficiency of Use  
8. Aesthetic and Minimalist Design  
9. Help Users Recognize, Diagnose, and Recover from Errors  
10. Help and Documentation

### 4.3 Escala de respuesta para heurística

- Sí, en todos los casos
- Sí, pero faltan algunos casos
- No siempre
- No, en ningún caso
- No aplica
- No es un problema
- Imposible de comprobar

---

## 5. Descripción de la prueba de usabilidad

### 5.1 Objetivo
Evaluar qué tan fácil resulta usar Testotron para realizar tareas reales del sistema y detectar problemas de interacción, claridad, aprendizaje y eficiencia.

### 5.2 Población participante
Se recomienda registrar al menos:
- número total de participantes;
- edades;
- género;
- rol o perfil de uso;
- nivel de experiencia tecnológica;
- interés en el proyecto.

### 5.3 Perfil sugerido de muestra
Para un proyecto académico, una muestra razonable puede ser:
- 2 a 5 estudiantes;
- 1 a 3 docentes;
- opcionalmente 1 usuario con perfil administrativo o de apoyo.

### 5.4 Actividades previas
1. Definir tareas representativas.
2. Preparar consentimiento informado.
3. Explicar el objetivo de la prueba.
4. Organizar el orden de las tareas.
5. Preparar hojas o formularios SUS y heurísticos.
6. Definir cómo se registrarán capturas y observaciones.

### 5.5 Actividades durante la validación
1. Solicitar al participante completar tareas concretas.
2. Observar tiempos, dudas y errores.
3. Aplicar SUS al finalizar el uso.
4. Aplicar la evaluación heurística por parte del equipo.
5. Registrar evidencias y comentarios textuales.
6. Identificar problemas frecuentes y oportunidades de mejora.

---

## 6. Tareas de prueba sugeridas

### Para estudiantes
1. Iniciar sesión.
2. Localizar un quiz disponible.
3. Leer instrucciones.
4. Iniciar el intento.
5. Navegar entre preguntas.
6. Responder y enviar.

### Para docentes
1. Iniciar sesión.
2. Crear o editar un quiz.
3. Agregar preguntas.
4. Reordenar preguntas.
5. Publicar un quiz.
6. Revisar resultados.

### Para administración o revisión general
1. Localizar un grupo.
2. Revisar panel de resultados.
3. Ver estructura de plantillas y banco de preguntas.
4. Comprobar mensajes, filtros y navegación.

---

## 7. Agenda de validación

| Fase | Actividad | Duración estimada |
|---|---|---|
| Antes de la prueba | Consentimiento y explicación | 10 min |
| Parte 1 | Tareas con estudiantes | 20–30 min |
| Parte 2 | Tareas con docentes | 20–30 min |
| Parte 3 | Aplicación de SUS | 5–10 min |
| Parte 4 | Evaluación heurística | 20–30 min |
| Cierre | Observaciones y conclusiones | 15 min |

---

## 8. Resultados esperados de SUS

> Estos valores son ejemplos razonables de referencia. Deben sustituirse por los datos reales obtenidos.

### 8.1 Interpretación esperada
Si Testotron mantiene su enfoque de interfaz simple, navegación clara y consistencia visual, la puntuación SUS podría ubicarse en un rango medio-alto, por encima del promedio de 68.

### 8.2 Posibles escenarios
- **80 o más:** usabilidad sobresaliente.
- **68 a 79:** buena usabilidad con ajustes menores.
- **50 a 67:** usabilidad aceptable, pero con problemas relevantes.
- **Menos de 50:** problemas serios de uso.

### 8.3 Plantilla de resultados SUS

| Participante | Puntuación SUS |
|---|---:|
| Usuario 1 | [ ] |
| Usuario 2 | [ ] |
| Usuario 3 | [ ] |
| Usuario 4 | [ ] |
| Usuario 5 | [ ] |
| **Promedio** | [ ] |

### 8.4 Hallazgos esperados del SUS
- Los usuarios podrían valorar bien la facilidad de uso si el flujo de resolver un quiz es claro.
- La puntuación podría bajar si la edición de quizzes es extensa o si hay demasiadas opciones en pantalla.
- La percepción de seguridad del usuario probablemente mejore si el sistema confirma acciones importantes y muestra progreso.

---

## 9. Resultados esperados de la evaluación heurística

### 9.1 Ejemplo de tabla

| Heurística | Estado esperado | Observación esperada |
|---|---|---|
| 1. Visibilidad del estado | Cumple | Barra de progreso, estados de quiz y mensajes visibles |
| 2. Relación con el mundo real | Cumple | Lenguaje académico comprensible |
| 3. Control y libertad | Cumple parcialmente | Debe permitir volver atrás o deshacer |
| 4. Consistencia | Cumple | Botones y patrones repetidos |
| 5. Prevención de errores | Cumple parcialmente | Confirmación al enviar y validaciones |
| 6. Reconocimiento antes que recuerdo | Cumple | Menús y tarjetas visibles |
| 7. Flexibilidad y eficiencia | Cumple parcialmente | Atajos y filtros mejorarían |
| 8. Diseño estético y minimalista | Cumple | Estructura simple y ordenada |
| 9. Ayuda a detectar errores | Cumple parcialmente | Mensajes más claros serían mejor |
| 10. Ayuda y documentación | Cumple parcialmente | Puede reforzarse con guías breves |

### 9.2 Hallazgos esperados
- El diseño general debería ser consistente.
- La barra lateral y la barra superior ayudan a orientarse.
- El quiz podría requerir mejor navegación para preguntas largas.
- La gestión de preguntas y plantillas puede resultar compleja para usuarios novatos.
- La ayuda contextual y los mensajes de error todavía pueden fortalecerse.

---

## 10. Consentimiento informado

### Modelo breve

Yo, ______________________, autorizo participar en la evaluación de usabilidad del sistema Testotron. Entiendo que la actividad consiste en realizar tareas de prueba, responder un cuestionario SUS y permitir el registro de observaciones, capturas o anotaciones para fines académicos. Se me informó que mi participación es voluntaria y que los datos serán usados únicamente con fines educativos.

**Firma:** ____________________  
**Fecha:** ____________________

---

## 11. Resultados esperados por población

### Estudiantes
- buena comprensión de inicio de sesión, acceso a quizzes y navegación por preguntas;
- dificultades posibles en tiempos limitados o en pantallas con demasiados elementos;
- mejor experiencia si la interfaz del quiz es limpia y muestra progreso claro.

### Docentes
- buena valoración si crear y editar quizzes es rápido;
- posibles problemas si la edición de preguntas requiere muchos pasos;
- mejora si hay borradores, plantillas y reordenamiento simple.

### Usuarios con menor experiencia
- podrían necesitar más ayuda si aparecen muchas funciones al mismo tiempo;
- agradecerán etiquetas claras, botones visibles y mensajes directos.

---

## 12. Conclusiones

La usabilidad de Testotron tiene una base prometedora porque el sistema fue concebido con una interfaz simple, clara y orientada al contexto académico. La presencia de sidebar, navbar, dashboard, plantillas, barra de progreso y componentes reutilizables favorece la consistencia y reduce el aprendizaje inicial. fileciteturn1file3turn1file15turn1file17

Aun así, la evaluación debe confirmar si la experiencia realmente es fluida para usuarios reales. Las mejoras más probables se concentran en simplificar flujos largos, mejorar la retroalimentación de errores, reducir carga cognitiva en la creación de cuestionarios y documentar mejor las acciones principales. La combinación de SUS y heurística permite mostrar tanto la percepción del usuario como la inspección experta del equipo.

---

## 13. Referencias

- Documentación técnica de Testotron. fileciteturn1file2
- Features necesarias para Testotron. fileciteturn1file3
- Material de accesibilidad y estructura interna del proyecto. fileciteturn1file13turn1file16turn1file17
- Sistema SUS y evaluación heurística vistos en clase. *(Agregar referencia de clase o material del profesor si aplica.)*

---

## 14. Anexos sugeridos

- Formularios SUS contestados.
- Tabla de evaluación heurística.
- Consentimientos informados firmados.
- Capturas de pantalla de cada tarea.
- Tabla de observaciones por participante.
- Gráficos de resultados SUS.
