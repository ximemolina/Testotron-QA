# Guia del proyecto QA - Auditoria y validacion de Testotron

## 1. Proposito de esta guia

Esta guia es el documento interno que vamos a usar para organizarnos como equipo. La idea es que sepamos que pide la especificacion del proyecto, como lo vamos a cubrir, que le toca hacer a cada persona, que formato vamos a mantener y que evidencias debemos generar.

El trabajo se va a hacer  en un **Google Docs compartido**. Ese Google Docs va a ser la base del informe final. Al final, exportamos ese documento como **PDF** para entregarlo.

Los archivos Markdown del repositorio nos sirven como guia y organizacion tecnica, pero el entregable principal deberia quedar en formato de informe formal.

## 2. Que vamos a entregar

La especificacion pide un proyecto completo de auditoria y validacion. Por eso, nuestra entrega deberia tener dos partes:

### 2.1 Entregable principal

Un archivo:

```text
Informe_Final_Testotron.pdf
```

Este PDF debe salir del Google Docs compartido y debe incluir todas las secciones obligatorias de la especificacion.

### 2.2 Anexos recomendados

Un archivo comprimido:

```text
Anexos_Testotron_QA.zip
```

Este ZIP deberia incluir evidencias, automatizaciones, reportes y, si queremos dejar la entrega mas completa, una copia del codigo auditado.

Estructura recomendada del ZIP:

```text
Anexos_Testotron_QA/
├── codigo-testotron/
├── evidencias/
│   ├── capturas/
│   ├── logs/
│   ├── reportes-estaticos/
│   ├── reportes-rendimiento/
│   └── reportes-seguridad/
├── automatizacion/
│   ├── postman/
│   ├── playwright/
│   ├── jmeter/
│   └── eslint-sonarqube/
├── matriz-trazabilidad.xlsx
└── registro-defectos.xlsx
```

La especificacion no dice literalmente que haya que entregar el codigo fuente en ZIP, pero si es recomendable adjuntarlo o al menos indicar claramente que version del proyecto se audito. Asi queda evidencia de que las pruebas se hicieron sobre una version concreta de Testotron.

## 3. Donde vamos a trabajar

Vamos a trabajar en dos niveles:

| Lugar | Uso |
|---|---|
| Google Docs compartido | Informe final formal que se exporta a PDF |
| Repositorio local | Codigo de Testotron, guias, automatizaciones, evidencias y archivos tecnicos |
| Grupo de WhatsApp | Compartir el link del Google Docs, coordinar avances y avisar bloqueos |

La redaccion final debe estar en el Google Docs. Los scripts, colecciones y evidencias van aparte como anexos.

## 4. Codigo vs documentacion

Este proyecto no consiste principalmente en programar nuevas funciones. Consiste en auditar y validar una aplicacion existente.

| Actividad | Donde se hace | Es codigo? |
|---|---|---|
| Plan general de calidad | Google Docs | No |
| Requerimientos funcionales y no funcionales | Google Docs | No |
| Casos de prueba | Google Docs | No |
| Matriz de trazabilidad | Google Docs o Google Sheets | No |
| Registro de defectos | Google Docs o Google Sheets | No |
| Metricas de calidad | Google Docs | No |
| Conclusiones y recomendaciones | Google Docs | No |
| Capturas de pantalla | Carpeta de evidencias | No |
| Colecciones Postman | Anexos / automatizacion | Si, archivo tecnico |
| Scripts Playwright/Cypress/Selenium | Anexos / automatizacion | Si |
| Planes JMeter | Anexos / automatizacion | Configuracion tecnica |
| Configuracion ESLint/SonarQube | Anexos / automatizacion | Configuracion tecnica |

En resumen: **el informe se trabaja en Google Docs**, y lo tecnico automatizado se guarda como anexo.

## 5. Descripcion del sistema que vamos a auditar

La aplicacion seleccionada es **Testotron**, una plataforma web educativa para crear, asignar, responder y calificar cuestionarios.

### 5.1 Naturaleza de la aplicacion

Testotron es una aplicacion web de gestion de examenes y cuestionarios. Permite que docentes creen evaluaciones, organicen estudiantes en grupos, publiquen pruebas y revisen resultados. Los estudiantes pueden unirse a grupos, realizar cuestionarios y consultar sus resultados.

### 5.2 Poblacion meta

La poblacion meta son:

- Docentes que crean y califican evaluaciones.
- Estudiantes que responden cuestionarios.
- Administradores que gestionan usuarios y datos generales del sistema.

### 5.3 Tecnologias identificadas

| Capa | Tecnologia |
|---|---|
| Backend | Node.js, Express |
| Base de datos | SQLite con better-sqlite3 |
| Autenticacion | JWT, cookies, bcrypt |
| Vistas | Handlebars SSR |
| Frontend | HTML, CSS, JavaScript vanilla |
| UI | Bootstrap |
| Validacion | Zod |

### 5.4 URL de acceso

```text
http://localhost:8080
```

## 6. Alcance del proyecto

### 6.1 Incluido

Vamos a auditar los siguientes modulos:

| Modulo | Incluido |
|---|---|
| Autenticacion | Registro, login, logout, JWT, roles |
| Usuarios y perfil | Consulta y actualizacion de datos |
| Grupos | Creacion, union por codigo, miembros |
| Preguntas | Banco de preguntas y tipos de pregunta |
| Plantillas | Creacion y reutilizacion de plantillas |
| Examenes | Creacion, edicion, publicacion, cierre |
| Intentos | Inicio, respuesta y envio de examenes |
| Calificacion | Calificacion automatica y manual |
| Resultados | Visualizacion de notas y estados |
| Administracion | Gestion general segun rol admin |
| Usabilidad y accesibilidad | Navegacion, claridad, WCAG basico |

### 6.2 Excluido

No vamos a auditar:

- Infraestructura de produccion.
- TLS, Nginx, CDN o despliegue cloud.
- Servicios externos.
- Respaldos productivos.
- Migracion de SQLite a otro motor.
- Integraciones con terceros.

## 7. Division del trabajo

Cada persona debe cubrir minimo:

- 1 requerimiento funcional.
- 1 requerimiento no funcional.
- Casos funcionales.
- Casos negativos.
- Casos de integracion.
- Al menos una parte no funcional: seguridad, rendimiento, usabilidad, accesibilidad o mantenibilidad.
- Evidencias.
- Defectos encontrados.
- Aporte a la matriz de trazabilidad.
- Aporte a metricas y conclusiones.

### 7.1 Distribucion recomendada

| Persona | Modulo | Requerimientos funcionales | Requerimiento no funcional principal | Evidencia esperada |
|---|---|---|---|---|
| Persona 1 | Autenticacion, usuarios, perfil y seguridad | Registro, login, logout, perfil, roles | Seguridad | Casos funcionales, negativos, seguridad, integracion, defectos y metricas |
| Persona 2 | Grupos y membresias | Crear grupo, editar grupo, unirse por codigo, agregar/eliminar miembros | Usabilidad/accesibilidad | Casos funcionales, negativos, usabilidad, capturas y defectos |
| Persona 3 | Preguntas, plantillas y examenes | Banco de preguntas, plantillas, crear/editar/publicar/cerrar examenes | Mantenibilidad/deuda tecnica | Revision estatica, casos funcionales, defectos de codigo y metricas |
| Persona 4 | Intentos, respuestas, calificacion y resultados | Tomar examen, responder, enviar, calificar, ver resultados | Rendimiento/integracion | Casos E2E, rendimiento, integracion, defectos y metricas |

## 8. Secciones del Google Docs

El Google Docs debe mantener esta estructura.

### 8.1 Portada

Debe incluir:

- Nombre del curso.
- Nombre del proyecto.
- Nombre de la aplicacion auditada: Testotron.
- Integrantes.
- Profesor.
- Fecha de entrega: 14/06/2026.

### 8.2 Introduccion

Debe explicar brevemente que se va a ejecutar una auditoria de calidad sobre Testotron, combinando pruebas estaticas, dinamicas, funcionales, no funcionales, automatizacion, metricas y recomendaciones.

### 8.3 Objetivos

Debe incluir:

- Objetivo general.
- Objetivos especificos.

Los objetivos deben alinearse con la especificacion: analizar requerimientos, ejecutar pruebas, evaluar calidad, automatizar, detectar defectos y proponer recomendaciones.

### 8.4 Descripcion del sistema

Debe incluir:

- Que es Testotron.
- Poblacion meta.
- Roles de usuario.
- Tecnologias.
- URL de acceso.
- Credenciales de prueba si se usan.

### 8.5 Alcance

Debe separar:

- Lo incluido.
- Lo excluido.

### 8.6 Metodologia

Debe explicar que vamos a aplicar V&V y modelos de calidad vistos en el curso.

| Concepto | Como lo aplicamos |
|---|---|
| Verificacion | Revisamos requerimientos, codigo, estructura, mantenibilidad y trazabilidad |
| Validacion | Ejecutamos pruebas funcionales, de sistema, UAT, seguridad, rendimiento y usabilidad |

La evaluacion de calidad debe tomar como referencia principal **ISO/IEC 25010**, porque permite clasificar la calidad del producto en atributos como adecuacion funcional, eficiencia de desempeno, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad y portabilidad. Tambien podemos usar **McCall** como complemento para justificar criterios como correccion, fiabilidad, eficiencia, integridad, usabilidad, mantenibilidad, flexibilidad y capacidad de prueba.

Texto sugerido para el informe:

```text
Para evaluar los atributos de calidad de Testotron se toma como referencia principal el modelo ISO/IEC 25010, debido a que permite clasificar la calidad del producto en caracteristicas como adecuacion funcional, eficiencia de desempeno, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad y portabilidad. De forma complementaria, se consideran criterios del modelo de McCall, especialmente correccion, fiabilidad, eficiencia, integridad, usabilidad, mantenibilidad, flexibilidad y capacidad de prueba.
```

Mapa recomendado de atributos:

| Atributo ISO/IEC 25010 | Como lo aplicamos en Testotron | Responsable sugerido |
|---|---|---|
| Adecuacion funcional | Validar que registro, grupos, examenes, intentos, calificacion y resultados funcionen segun lo esperado | Todas |
| Eficiencia de desempeno | Medir tiempos de respuesta, carga y concurrencia en login, listado o envio de examenes | Persona 4 |
| Compatibilidad | Revisar funcionamiento basico en navegador y convivencia entre API, SSR y base de datos | Equipo |
| Usabilidad | Evaluar navegacion, claridad de mensajes, facilidad de uso y experiencia de docente/estudiante | Persona 2 |
| Fiabilidad | Revisar comportamiento ante errores, intentos invalidos, datos incorrectos y continuidad del flujo | Equipo |
| Seguridad | Evaluar autenticacion, autorizacion, contrasenas, XSS, SQL injection y control de acceso | Persona 1 |
| Mantenibilidad | Revisar complejidad, modularidad, duplicacion, convenciones y facilidad de modificacion | Persona 3 |
| Portabilidad | Documentar que el sistema corre localmente con Node.js y SQLite; no se evalua despliegue productivo | Equipo |

### 8.7 Plan de pruebas

Debe incluir:

- Tipos de prueba.
- Estrategia.
- Datos de prueba.
- Ambientes.
- Herramientas.
- Responsables.
- Criterios de entrada.
- Criterios de salida.

Debemos diferenciar estos tipos de prueba, porque en la materia se tratan como niveles distintos:

| Tipo | Quien prueba | Que valida | Como lo aplicamos |
|---|---|---|---|
| Pruebas unitarias | Desarrollador/equipo QA | Unidades aisladas como funciones, controladores o modelos | Si no se implementan, se justifica y se priorizan API/E2E por alcance |
| Pruebas de integracion | Equipo QA | Colaboracion entre dos o mas componentes | API + base de datos, SSR + API, auth + rutas protegidas |
| Pruebas de sistema | Equipo QA | Producto completo de extremo a extremo | Flujo docente -> examen -> estudiante -> respuestas -> calificacion |
| Pruebas de aceptacion | Cliente, negocio o QA con criterios de aceptacion | Si el sistema es aceptable para entrega | Validar si Testotron cumple los criterios definidos |
| UAT | Usuario final o alguien actuando como usuario final | Si el sistema sirve y es usable desde la perspectiva real del usuario | Simular docente y estudiante ejecutando tareas reales |

Para nuestro caso, como no tenemos un cliente externo real, podemos indicar que las pruebas UAT fueron ejecutadas por integrantes del equipo actuando como usuarios finales de los roles docente y estudiante, usando escenarios realistas del contexto educativo de Testotron.

### 8.8 Herramientas utilizadas

Ejemplos:

| Tipo | Herramienta |
|---|---|
| API | Postman / Newman |
| E2E | Playwright, Cypress o Selenium |
| Rendimiento | Apache JMeter |
| Seguridad | OWASP ZAP, Burp Suite Community, pruebas manuales |
| Accesibilidad | WAVE, axe DevTools |
| Analisis estatico | ESLint, SonarQube |
| Documentacion | Google Docs, Google Sheets |

### 8.9 Casos de prueba

Cada integrante debe agregar sus casos en el formato definido en esta guia.

Los casos de integracion deben conectar componentes reales del sistema. No deben ser solo pantallas aisladas. Ejemplos:

| ID | Flujo integrado | Componentes |
|---|---|---|
| TC-INT-001 | Login y acceso a dashboard | Auth, JWT, SSR, middleware |
| TC-INT-002 | Crear grupo y agregar estudiante | Groups API, users, SQLite |
| TC-INT-003 | Crear examen desde preguntas existentes | Tests, questions, test_questions |
| TC-INT-004 | Estudiante responde y envia examen | Attempts, attempt_answers, tests |
| TC-INT-005 | Calificacion automatica y resultados | Grading, attempts, results |

### 8.10 Matriz de trazabilidad

Debe mapear:

```text
Requerimiento -> Caso de prueba -> Tipo -> Resultado -> Defecto
```

### 8.11 Gestion de defectos

Debe contener todos los defectos encontrados, con severidad, prioridad, pasos y evidencia.

### 8.12 Resultados de ejecucion

Debe mostrar:

- Casos ejecutados.
- Casos pasados.
- Casos fallidos.
- Casos bloqueados.
- Defectos encontrados.
- Evidencia.

### 8.13 Metricas

Esta seccion deberia presentarse como **catalogo operativo de metricas de calidad**, alineado con ISO/IEC 25010 y con el enfoque de medicion visto en clase.

Cada metrica debe incluir:

- Objetivo.
- Formula.
- Unidad.
- Herramienta.
- Metodo de recoleccion.
- Frecuencia.
- Justificacion.
- Umbral de aceptacion total, parcial y rechazo.
- Interpretacion del resultado.
- Recomendacion asociada.

Ademas, el catalogo debe reflejar el ciclo de medicion:

| Elemento | Que significa |
|---|---|
| Formulacion | Definir claramente que se va a medir |
| Recoleccion | Indicar como se obtienen los datos |
| Analisis | Calcular la metrica con una formula |
| Interpretacion | Explicar que significa el resultado |
| Retroalimentacion | Indicar que recomendacion surge del resultado |

Metricas minimas recomendadas:

| ID | Metrica | Formula | Interpretacion |
|---|---|---|---|
| MET-COB-01 | Cobertura de requerimientos | Requerimientos con casos asociados / total de requerimientos * 100 | Mide si todos los requerimientos tienen pruebas |
| MET-EJEC-01 | Porcentaje de casos ejecutados | Casos ejecutados / casos disenados * 100 | Mide avance real de ejecucion |
| MET-EXITO-01 | Porcentaje de casos aprobados | Casos aprobados / casos ejecutados * 100 | Mide calidad funcional observada |
| MET-FALLO-01 | Porcentaje de casos fallidos | Casos fallidos / casos ejecutados * 100 | Mide nivel de fallos detectados |
| MET-BLOQ-01 | Porcentaje de casos bloqueados | Casos bloqueados / casos disenados * 100 | Mide problemas para ejecutar pruebas |
| MET-DEF-01 | Densidad de defectos por modulo | Defectos encontrados / modulo evaluado | Permite comparar modulos con mayor riesgo |
| MET-DEF-02 | Distribucion de defectos por severidad | Defectos por severidad / total de defectos * 100 | Mide criticidad de los hallazgos |
| MET-PERF-01 | Tiempo promedio de respuesta | Suma de tiempos / numero de ejecuciones | Evalua eficiencia de desempeno |
| MET-SEG-01 | Controles de seguridad superados | Pruebas de seguridad aprobadas / pruebas de seguridad ejecutadas * 100 | Evalua seguridad basica |
| MET-USAB-01 | Cumplimiento de checklist de usabilidad | Criterios cumplidos / criterios evaluados * 100 | Evalua facilidad de uso |

### 8.14 Evaluacion de deuda tecnica

Debe incluir hallazgos sobre:

- Codigo duplicado.
- Codigo muerto.
- Dependencias obsoletas.
- Complejidad.
- Smells.
- Vulnerabilidades.
- Mantenibilidad.

### 8.15 Analisis de riesgos

Debe incluir riesgos del sistema y del proceso de QA.

Ejemplos:

- Riesgo de acceso indebido por validaciones de rol incompletas.
- Riesgo de errores en calificacion automatica.
- Riesgo de bajo rendimiento en envio simultaneo de examenes.
- Riesgo de baja accesibilidad para usuarios con discapacidad.

### 8.16 Analisis de resultados

Debe interpretar los resultados, no solo listarlos. Debe explicar que significan los defectos, que tan grave es el estado del sistema y que areas necesitan mejora.

### 8.17 Conclusiones

Debe resumir:

- Estado general de calidad.
- Modulos mas fuertes.
- Modulos con mayor riesgo.
- Cumplimiento de objetivos.

### 8.18 Recomendaciones

Debe proponer mejoras concretas:

- Mejoras de seguridad.
- Mejoras de usabilidad.
- Mejoras de pruebas automatizadas.
- Mejoras de mantenibilidad.
- Mejoras de rendimiento.

### 8.19 Anexos

Debe referenciar:

- Capturas.
- Logs.
- Colecciones Postman.
- Scripts Playwright.
- Planes JMeter.
- Reportes de herramientas.
- Matriz completa si se maneja en Google Sheets.
- Registro completo de defectos.

## 9. Formato de requerimientos

Cada requerimiento debe tener este formato:

| Campo | Descripcion |
|---|---|
| ID | Identificador unico, por ejemplo `RF-AUTH-01` o `RNF-SEG-01` |
| Tipo | Funcional o no funcional |
| Nombre | Nombre corto |
| Descripcion | Que debe hacer o cumplir el sistema |
| Modulo | Area del sistema |
| Prioridad | Alta, media o baja |
| Criterio de aceptacion | Como sabemos que se cumple |

Ejemplo:

| ID | Tipo | Nombre | Descripcion | Modulo | Prioridad | Criterio de aceptacion |
|---|---|---|---|---|---|---|
| RF-AUTH-01 | Funcional | Registro de usuario | El sistema debe permitir registrar usuarios con nombre, correo, contrasena y rol valido | Autenticacion | Alta | Un usuario valido queda registrado y puede iniciar sesion |

## 10. Formato de casos de prueba

Todos los casos de prueba deben usar el mismo formato:

```md
## TC-XXX-001 - Nombre del caso

- ID:
- Nombre:
- Objetivo:
- Requerimiento asociado:
- Tipo de prueba:
- Prioridad:
- Precondiciones:
- Datos de prueba:
- Pasos:
  1. 
  2. 
  3. 
- Resultado esperado:
- Resultado obtenido:
- Estado: Pendiente / Paso / Fallo / Bloqueado
- Evidencia:
- Responsable:
```

Tipos de prueba que debemos cubrir:

- Funcional.
- Negativa.
- Integracion.
- Sistema.
- Aceptacion.
- Aceptacion de usuario (UAT).
- Rendimiento.
- Carga.
- Seguridad.
- Usabilidad.
- Accesibilidad.
- Estatica/mantenibilidad.

Para pruebas de aceptacion y UAT, se puede usar este formato resumido adicional:

| ID | Escenario de aceptacion | Rol | Criterio de aceptacion | Resultado | Aceptado | Evidencia | Observaciones |
|---|---|---|---|---|---|---|---|
| UAT-001 | Docente crea y publica un examen para un grupo | Teacher | El examen queda publicado y visible para estudiantes | Pendiente | Si/No | - | - |
| UAT-002 | Estudiante responde y envia un examen | Student | El intento queda enviado y con estado correcto | Pendiente | Si/No | - | - |
| UAT-003 | Docente revisa resultados | Teacher | El docente puede ver intentos, notas y estado | Pendiente | Si/No | - | - |

Al final de las pruebas de aceptacion debemos indicar un resultado general:

```text
Resultado general de aceptacion: Aceptado / Aceptado con observaciones / No aceptado.
```

## 11. Formato de defectos

Todos los defectos deben registrarse asi:

Para usar el vocabulario de la materia, debemos diferenciar:

| Concepto | Significado para el proyecto |
|---|---|
| Error | Accion humana equivocada, por ejemplo una validacion mal programada |
| Defecto | Problema presente en el software o documentacion |
| Falla | Comportamiento incorrecto observado al ejecutar el sistema |

Ejemplo: si una ruta no valida el rol del usuario, el defecto esta en el control de acceso. La falla se observa cuando un estudiante logra acceder a una funcion de docente.

```md
## DEF-001 - Titulo breve

- ID:
- Titulo:
- Descripcion:
- Severidad: Critico / Alto / Medio / Bajo
- Prioridad: Alta / Media / Baja
- Pasos para reproducir:
  1. 
  2. 
  3. 
- Resultado esperado:
- Resultado actual:
- Evidencia:
- Estado: Abierto / En progreso / Resuelto / Cerrado
- Responsable:
- Caso de prueba relacionado:
- Requerimiento relacionado:
```

## 12. Formato de metricas

Cada metrica debe usar este formato:

| Campo | Descripcion |
|---|---|
| ID | Identificador, por ejemplo `MET-SEG-01` |
| Atributo de calidad | Seguridad, rendimiento, usabilidad, mantenibilidad, funcionalidad |
| Objetivo | Que mide |
| Formula | Como se calcula |
| Unidad | Porcentaje, segundos, cantidad, etc. |
| Herramienta | Postman, JMeter, WAVE, ESLint, etc. |
| Metodo de recoleccion | Como se obtiene |
| Frecuencia | Una vez, por iteracion, por ejecucion |
| Justificacion | Por que importa |
| Aceptacion total | Umbral ideal |
| Aceptacion parcial | Umbral aceptable con observaciones |
| Rechazo | Umbral no aceptable |
| Interpretacion | Como se lee el resultado |
| Retroalimentacion | Recomendacion o accion sugerida |

Ejemplo:

| ID | Atributo | Objetivo | Formula | Unidad | Herramienta | Total | Parcial | Rechazo |
|---|---|---|---|---|---|---|---|---|
| MET-FUNC-01 | Funcionalidad | Medir porcentaje de casos funcionales exitosos | Casos pasados / casos ejecutados * 100 | % | Ejecucion manual/Postman | >= 90% | 70%-89% | < 70% |

## 13. Formato de matriz de trazabilidad

La matriz debe tener al menos:

| Requerimiento | Caso de prueba | Tipo de prueba | Resultado | Defecto asociado | Responsable |
|---|---|---|---|---|---|
| RF-AUTH-01 | TC-AUTH-001 | Funcional | Pendiente | - | Persona 1 |

Esta matriz es clave porque demuestra donde se cubre cada requerimiento de la especificacion.

## 14. Evidencias que debemos guardar

Cada prueba debe tener evidencia cuando sea posible.

| Tipo de prueba | Evidencia recomendada |
|---|---|
| Funcional manual | Capturas de pantalla antes/despues |
| API | Capturas de Postman, export de coleccion, logs de Newman |
| E2E | Reporte de Playwright/Cypress/Selenium |
| Rendimiento | Reporte JMeter, tiempos promedio, throughput |
| Seguridad | Capturas de intentos, reporte OWASP ZAP, descripcion de payloads usados |
| Usabilidad | Capturas, checklist, observaciones |
| Accesibilidad | Reporte WAVE/axe, capturas de problemas |
| Estatica | Reporte ESLint/SonarQube, capturas de hallazgos |

Formato recomendado para nombrar evidencias:

```text
EV-[CASO]-[descripcion].png
EV-TC-AUTH-001-registro-exitoso.png
EV-TC-SEG-003-xss-bio.png
EV-TC-PERF-001-jmeter-summary.pdf
```

## 15. Automatizaciones esperadas

No todo debe automatizarse, pero la especificacion pide automatizacion con herramientas profesionales. Por eso deberiamos generar al menos algunas de estas:

| Herramienta | Que automatiza | Responsable sugerido |
|---|---|---|
| Postman/Newman | Pruebas de API para auth, grupos, tests, attempts | Persona 1 o equipo |
| Playwright/Cypress/Selenium | Flujos de usuario en navegador | Equipo |
| JMeter | Rendimiento y carga | Persona 4 |
| ESLint/SonarQube | Revision estatica, smells, mantenibilidad | Persona 3 |
| WAVE/axe | Accesibilidad | Persona 2 |

Ejemplos de automatizacion minima:

- Coleccion Postman para login, registro y acceso a rutas protegidas.
- Script Playwright para login y flujo basico de estudiante.
- Plan JMeter para medir login o envio de cuestionario.
- Reporte ESLint o SonarQube para mantenibilidad.

## 16. Mapeo de la especificacion con nuestro trabajo

Esta tabla muestra donde vamos a cubrir cada cosa que pide la especificacion.

| Requerido por la especificacion | Donde lo cubrimos | Responsable |
|---|---|---|
| Seleccionar una aplicacion web real | Descripcion del sistema | Equipo |
| Naturaleza de la aplicacion | Descripcion del sistema | Equipo |
| Poblacion meta | Descripcion del sistema | Equipo |
| Fuente del proyecto | Descripcion del sistema / anexos | Equipo |
| Tecnologias utilizadas | Descripcion del sistema | Equipo |
| URL de acceso | Descripcion del sistema | Equipo |
| Credenciales de usuario | Descripcion del sistema / anexos | Equipo |
| Acceso funcional a la aplicacion | Evidencias de ejecucion | Equipo |
| Requerimientos funcionales identificables | Seccion de requerimientos | Cada persona |
| Requerimientos no funcionales identificables | Seccion de requerimientos | Cada persona |
| Multiples perfiles de usuario | Descripcion del sistema y casos por rol | Equipo |
| Flujo funcional completo | Casos de sistema e integracion | Equipo |
| Persistencia de datos | Descripcion tecnica y pruebas | Equipo |
| Navegacion web funcional | Pruebas de sistema/usabilidad | Equipo |
| Modulos auditados | Alcance | Equipo |
| Funcionalidades evaluadas | Requerimientos y casos | Cada persona |
| Interfaces incluidas | Alcance y plan de pruebas | Equipo |
| APIs incluidas | Requerimientos y casos API | Cada persona |
| Modulos no evaluados | Alcance excluido | Equipo |
| Servicios de terceros excluidos | Alcance excluido | Equipo |
| Infraestructura externa excluida | Alcance excluido | Equipo |
| Plan general de calidad | Plan de pruebas / metodologia | Equipo |
| Objetivos de calidad | Objetivos y metricas | Equipo |
| Estrategia de pruebas | Plan de pruebas | Equipo |
| Tipos de pruebas | Plan de pruebas | Equipo |
| Riesgos identificados | Analisis de riesgos | Equipo |
| Recursos necesarios | Plan de pruebas | Equipo |
| Cronograma | Plan de pruebas o anexo | Equipo |
| Roles y responsabilidades | Division del trabajo | Equipo |
| Herramientas | Herramientas utilizadas | Equipo |
| Metricas | Seccion de metricas | Equipo |
| Criterios de aceptacion | Metricas y casos de prueba | Equipo |
| Estrategia de automatizacion | Automatizaciones esperadas | Equipo |
| Revision de requerimientos | Requerimientos y trazabilidad | Equipo |
| Ambiguedad | Revision de requerimientos | Equipo |
| Completitud | Revision de requerimientos | Equipo |
| Consistencia | Revision de requerimientos | Equipo |
| Trazabilidad | Matriz de trazabilidad | Equipo |
| Correctitud | Casos de prueba y resultados | Equipo |
| Revision de codigo | Evaluacion estatica | Persona 3 |
| Legibilidad | Evaluacion estatica | Persona 3 |
| Modularidad | Evaluacion estatica | Persona 3 |
| Duplicacion | Evaluacion estatica | Persona 3 |
| Complejidad | Evaluacion estatica / metricas | Persona 3 |
| Convenciones | Evaluacion estatica | Persona 3 |
| Codigo muerto | Deuda tecnica | Persona 3 |
| Mantenibilidad | Metricas y deuda tecnica | Persona 3 |
| Acoplamiento | Evaluacion de mantenibilidad | Persona 3 |
| Cohesion | Evaluacion de mantenibilidad | Persona 3 |
| Complejidad ciclomatica | Evaluacion de mantenibilidad | Persona 3 |
| Reutilizacion | Evaluacion de mantenibilidad | Persona 3 |
| Facilidad de modificacion | Evaluacion de mantenibilidad | Persona 3 |
| Deuda tecnica | Evaluacion de deuda tecnica | Persona 3 |
| Vulnerabilidades | Seguridad | Persona 1 |
| Smells | Evaluacion estatica | Persona 3 |
| Dependencias obsoletas | Deuda tecnica | Persona 3 |
| Pruebas unitarias | Automatizacion o justificacion | Equipo |
| Pruebas de integracion | Casos de integracion | Cada persona |
| Pruebas de sistema | Flujos completos | Equipo |
| UAT | Casos de aceptacion | Equipo |
| Pruebas funcionales | Casos funcionales | Cada persona |
| Pruebas negativas | Casos negativos | Cada persona |
| Pruebas de rendimiento | JMeter/resultados | Persona 4 |
| Tiempo de respuesta | Metricas de rendimiento | Persona 4 |
| Concurrencia | JMeter | Persona 4 |
| Uso de recursos | Rendimiento, si se logra medir | Persona 4 |
| Throughput | JMeter | Persona 4 |
| Pruebas de carga | JMeter | Persona 4 |
| SQL injection | Seguridad | Persona 1 |
| Control de acceso | Seguridad | Persona 1 |
| XSS | Seguridad | Persona 1 |
| Contrasenas | Seguridad | Persona 1 |
| Facilidad de uso | Usabilidad | Persona 2 |
| Navegacion | Usabilidad | Persona 2 |
| Accesibilidad | Accesibilidad | Persona 2 |
| Experiencia de usuario | Usabilidad | Persona 2 |
| Casos de prueba completos | Seccion de casos | Cada persona |
| Escenarios y resultados esperados | Casos de prueba | Cada persona |
| Resultado obtenido | Resultados de ejecucion | Cada persona |
| Estado del caso | Resultados de ejecucion | Cada persona |
| Evidencia | Anexos y resultados | Cada persona |
| Matriz de trazabilidad | Matriz de trazabilidad | Equipo |
| Defectos formales | Registro de defectos | Cada persona |
| Informe final | PDF final | Equipo |

## 17. Checklist individual

Cada persona debe completar:

- [ ] Requerimientos funcionales de su modulo.
- [ ] Requerimientos no funcionales de su modulo.
- [ ] Casos funcionales.
- [ ] Casos negativos.
- [ ] Casos de integracion.
- [ ] Casos no funcionales segun su area.
- [ ] Ejecucion de pruebas.
- [ ] Evidencias guardadas.
- [ ] Defectos registrados.
- [ ] Metricas propuestas o ejecutadas.
- [ ] Aporte a matriz de trazabilidad.
- [ ] Resumen de resultados.
- [ ] Recomendaciones.

## 18. Checklist final del equipo

Antes de entregar, debemos validar:

- [ ] El Google Docs tiene todas las secciones obligatorias.
- [ ] Todas las personas agregaron su parte.
- [ ] Todos los requerimientos tienen al menos un caso asociado.
- [ ] Todos los casos tienen resultado obtenido.
- [ ] Los defectos tienen evidencia.
- [ ] Las metricas tienen formula y umbrales.
- [ ] Hay capturas/reportes suficientes.
- [ ] El informe se exporto a PDF.
- [ ] El ZIP de anexos contiene evidencias y automatizaciones.
- [ ] El documento final tiene redaccion uniforme.
- [ ] La matriz de trazabilidad esta completa.

## 19. Como hacer la matriz de trazabilidad

La matriz de trazabilidad es una tabla que demuestra que cada requerimiento del sistema fue cubierto por al menos un caso de prueba. Tambien permite relacionar los casos ejecutados con sus resultados, defectos y evidencias.

En palabras simples:

```text
Si tenemos un requerimiento, debe existir al menos un caso de prueba que lo valide.
Si existe un caso de prueba, debe estar relacionado con algun requerimiento.
Si una prueba falla, debe existir un defecto asociado.
```

Esta matriz es importante porque le permite al profesor ver rapidamente donde estamos cubriendo cada parte de la especificacion.

### 19.1 Donde hacerla

La mejor forma de hacerla es en **Google Sheets**, porque todas podemos agregar filas al mismo tiempo y filtrar por responsable, modulo, tipo de prueba o estado.

Luego, en el Google Docs final podemos incluir:

- Una captura o version resumida de la matriz.
- Un link o referencia al archivo completo.
- La matriz completa como anexo.

Formato recomendado:

```text
Matriz_Trazabilidad_Testotron.xlsx
```

o en Google Sheets:

```text
Matriz de Trazabilidad - Testotron QA
```

### 19.2 Como debe trabajar cada persona

Cada integrante debe agregar filas segun su modulo.

Regla principal:

```text
Cada requerimiento funcional y no funcional que una persona defina debe tener al menos un caso de prueba asociado.
```

Ejemplo:

- Si una persona tiene 5 requerimientos, no basta con escribirlos.
- Debe agregar esos requerimientos a la matriz.
- Debe agregar los casos de prueba que los validan.
- Debe actualizar el resultado cuando los ejecute.
- Si encuentra un fallo, debe colocar el ID del defecto.
- Si tiene evidencia, debe colocar el nombre o ruta de la evidencia.

### 19.3 Columnas recomendadas

Estas son las columnas que deberiamos usar en Google Sheets:

| Columna | Que se coloca |
|---|---|
| ID Requerimiento | Codigo del requerimiento, por ejemplo `RF-AUTH-01` |
| Tipo de requerimiento | Funcional o no funcional |
| Modulo | Auth, grupos, examenes, intentos, resultados, etc. |
| Descripcion del requerimiento | Resumen claro del requerimiento |
| ID Caso de prueba | Codigo del caso, por ejemplo `TC-AUTH-001` |
| Nombre del caso | Nombre corto del caso |
| Tipo de prueba | Funcional, negativa, integracion, seguridad, rendimiento, usabilidad, etc. |
| Prioridad | Alta, media o baja |
| Responsable | Persona asignada |
| Estado de ejecucion | Pendiente, paso, fallo o bloqueado |
| Resultado obtenido | Resumen breve de lo que paso |
| ID Defecto | `DEF-001`, `DEF-002` o `-` si no hay defecto |
| Evidencia | Nombre de captura, reporte o archivo |
| Observaciones | Comentarios adicionales |

### 19.4 Esqueleto listo para copiar a Google Sheets

Podemos copiar esta tabla a Google Sheets y que cada persona agregue sus filas:

| ID Requerimiento | Tipo Req. | Modulo | Descripcion del requerimiento | ID Caso | Nombre del caso | Tipo prueba | Prioridad | Responsable | Estado | Resultado obtenido | ID Defecto | Evidencia | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RF-AUTH-01 | Funcional | Autenticacion | El sistema permite registrar usuarios validos | TC-AUTH-001 | Registro exitoso de estudiante | Funcional | Alta | Persona 1 | Pendiente | Pendiente | - | - | - |
| RF-AUTH-02 | Funcional | Autenticacion | El sistema permite iniciar sesion con credenciales validas | TC-AUTH-002 | Login exitoso | Funcional | Alta | Persona 1 | Pendiente | Pendiente | - | - | - |
| RNF-SEG-01 | No funcional | Seguridad | Las rutas protegidas requieren autenticacion | TC-SEG-001 | Acceso a perfil sin autenticacion | Seguridad | Alta | Persona 1 | Pendiente | Pendiente | - | - | - |
| RF-GRP-01 | Funcional | Grupos | El docente puede crear grupos | TC-GRP-001 | Crear grupo exitosamente | Funcional | Alta | Persona 2 | Pendiente | Pendiente | - | - | - |
| RNF-USAB-01 | No funcional | Usabilidad | La navegacion de grupos debe ser clara | TC-USAB-GRP-001 | Evaluacion de navegacion en grupos | Usabilidad | Media | Persona 2 | Pendiente | Pendiente | - | - | - |
| RF-QUIZ-01 | Funcional | Examenes | El docente puede crear un examen | TC-QUIZ-001 | Crear examen exitosamente | Funcional | Alta | Persona 3 | Pendiente | Pendiente | - | - | - |
| RNF-MANT-01 | No funcional | Mantenibilidad | El codigo debe mantener complejidad aceptable | TC-MANT-001 | Revision estatica de complejidad | Estatica | Media | Persona 3 | Pendiente | Pendiente | - | - | - |
| RF-ATT-01 | Funcional | Intentos | El estudiante puede iniciar un intento de examen | TC-ATT-001 | Iniciar intento exitosamente | Funcional | Alta | Persona 4 | Pendiente | Pendiente | - | - | - |
| RF-GRADE-01 | Funcional | Calificacion | El sistema calcula el puntaje de respuestas objetivas | TC-GRADE-001 | Calificacion automatica | Integracion | Alta | Persona 4 | Pendiente | Pendiente | - | - | - |
| RNF-PERF-01 | No funcional | Rendimiento | El sistema responde en tiempo aceptable bajo carga basica | TC-PERF-001 | Prueba de carga basica | Rendimiento | Media | Persona 4 | Pendiente | Pendiente | - | - | - |

### 19.5 Ejemplo de una fila completa

Cuando ya se ejecuta una prueba, la fila debe quedar asi:

| ID Requerimiento | Tipo Req. | Modulo | Descripcion del requerimiento | ID Caso | Nombre del caso | Tipo prueba | Prioridad | Responsable | Estado | Resultado obtenido | ID Defecto | Evidencia | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RF-AUTH-02 | Funcional | Autenticacion | El sistema permite iniciar sesion con credenciales validas | TC-AUTH-002 | Login exitoso | Funcional | Alta | Persona 1 | Paso | El usuario inicio sesion y fue redirigido al dashboard | - | EV-TC-AUTH-002-login-dashboard.png | Sin observaciones |

Si falla:

| ID Requerimiento | Tipo Req. | Modulo | Descripcion del requerimiento | ID Caso | Nombre del caso | Tipo prueba | Prioridad | Responsable | Estado | Resultado obtenido | ID Defecto | Evidencia | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RNF-SEG-01 | No funcional | Seguridad | Las rutas protegidas requieren autenticacion | TC-SEG-001 | Acceso a perfil sin autenticacion | Seguridad | Alta | Persona 1 | Fallo | Se pudo acceder a una ruta protegida sin autenticacion | DEF-001 | EV-TC-SEG-001-acceso-sin-auth.png | Requiere correccion de middleware |

### 19.6 Reglas para mantener la matriz ordenada

- Cada fila representa una relacion entre un requerimiento y un caso de prueba.
- Si un requerimiento tiene varios casos, se crean varias filas con el mismo ID de requerimiento.
- Si un caso cubre varios requerimientos, se puede repetir el caso en varias filas.
- No deben existir requerimientos sin casos asociados.
- No deben existir casos sin requerimiento asociado.
- Si el estado es `Fallo`, debe existir un `ID Defecto`.
- Si el estado es `Paso`, el campo defecto puede quedar como `-`.
- Si el estado es `Bloqueado`, se debe explicar el bloqueo en observaciones.
- La evidencia debe tener un nombre claro y coincidir con el archivo guardado.
- Cada persona actualiza solamente sus filas, salvo que se acuerde lo contrario.

### 19.7 Como revisar si la matriz esta completa

Antes de entregar, debemos revisar:

- Todos los `RF` tienen al menos un caso de prueba.
- Todos los `RNF` tienen al menos un caso de prueba o evaluacion.
- Hay pruebas funcionales, negativas, integracion, seguridad, rendimiento y usabilidad.
- Todos los casos tienen estado final.
- Todos los fallos tienen defecto asociado.
- Todos los defectos aparecen tambien en el registro de defectos.
- Las evidencias existen en la carpeta de anexos.

### 19.8 Recursos para entender mejor la matriz

Estos recursos pueden servir si alguien quiere ver ejemplos adicionales:

- [GeeksforGeeks - Requirement Traceability Matrix](https://www.geeksforgeeks.org/software-testing/requirement-traceability-matrix/): explica el proposito de la RTM y muestra formatos de ejemplo.
- [TestKarts - RTM with Example and Template](https://www.testkarts.com/manual-testing/traceability-matrix): incluye un ejemplo practico de columnas para relacionar requerimientos, casos y defectos.
- [Jama Software - Traceability Matrix Guide](https://www.jamasoftware.com/requirements-management-guide/requirements-traceability/traceability-matrix/): explica trazabilidad hacia adelante y hacia atras.
- [ISTQB Glossary - Traceability Matrix](https://istqb.missionwares.com/glossary/traceability-matrix.html): definicion corta y formal de matriz de trazabilidad.

Para nuestro proyecto, no necesitamos una matriz compleja de herramienta empresarial. Una Google Sheet bien ordenada, con las columnas anteriores, es suficiente y cumple el objetivo de demostrar cobertura.
