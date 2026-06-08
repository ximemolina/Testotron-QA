# Proyecto Integrado de Auditoría y Validación de Sistemas de Información

## Objetivo General

Ejecutar un proceso completo de aseguramiento de la calidad en una aplicación web real, combinando auditorías estáticas y dinámicas, pruebas funcionales y no funcionales, aplicando metodologías V&V (verificación y validación), herramientas automatizadas y principios modelos de calidad

El proyecto combina:

- Auditorías estáticas
- Pruebas dinámicas
- Evaluación de atributos de calidad
- Gestión de defectos
- Automatización
- Métricas de calidad
- Análisis técnico y recomendaciones

## Objetivos Específicos

Al finalizar el proyecto, el estudiante será capaz de:

- Analizar requerimientos funcionales y no funcionales de un sistema de información.
- Diseñar y ejecutar pruebas estáticas y dinámicas.
- Aplicar técnicas de verificación y validación de software.
- Evaluar atributos de calidad utilizando modelos reconocidos.
- Diseñar métricas cuantitativas de calidad.
- Detectar y documentar defectos de software.
- Automatizar pruebas utilizando herramientas profesionales.
- Analizar deuda técnica y mantenibilidad.
- Elaborar reportes técnicos de calidad.
- Formular recomendaciones de mejora basadas en evidencia.

## Selección del Proyecto

Cada equipo seleccionará una aplicación web ya desarrollada (propia o de uso público), que cuente con documentación técnica, requerimientos funcionales y no funcionales, acceso a la aplicación, y perfiles de usuarios.

Debe indicarse:

- Naturaleza de la aplicación
- Población meta
- Fuente del proyecto
- Tecnologías utilizadas
- URL de acceso
- Credenciales de usuario (si aplica)

La aplicación seleccionada debe contar con:

- Acceso funcional a la aplicación
- Requerimientos funcionales identificables
- Requerimientos no funcionales identificables
- Múltiples perfiles de usuario (si aplica)
- Flujo funcional completo
- Persistencia de datos
- Navegación web funcional

## Alcance del Proyecto

Cada equipo deberá definir claramente:

### Lo que Incluye

- Módulos auditados
- Funcionalidades evaluadas
- Interfaces incluidas
- APIs incluidas

### Lo que Excluye

- Módulos no evaluados
- Servicios de terceros
- Infraestructura externa
- Sistemas externos integrados

## Plan de Pruebas Completas

### Plan General de Calidad

Cada equipo deberá elaborar un Plan General de Calidad que incluya:

#### Elementos mínimos

- Objetivos de calidad
- Estrategia de pruebas
- Tipos de pruebas
- Riesgos identificados
- Recursos necesarios
- Cronograma
- Roles y responsabilidades
- Herramientas
- Métricas
- Criterios de aceptación
- Estrategia de automatización

## Tipos de pruebas a realizar

### Pruebas Estáticas

#### Revisión de Requerimientos

- Ambigüedad
- Completitud
- Consistencia
- Trazabilidad
- Correctitud

#### Revisión de Código

- Legibilidad
- Modularidad
- Duplicación
- Complejidad
- Convenciones
- Código muerto

#### Evaluación de Mantenibilidad

- Acoplamiento
- Cohesión
- Complejidad ciclomática
- Reutilización
- Facilidad de modificación

#### Evaluación de Deuda Técnica

- Código duplicado
- Código muerto
- Vulnerabilidades
- Smells
- Dependencias obsoletas

### Pruebas Dinámicas

- Pruebas Unitarias
- Pruebas de Integración
- Pruebas de Sistema
- Pruebas de Aceptación de Usuario (UAT)
- Pruebas Funcionales

#### Pruebas de Rendimiento

- Tiempo de respuesta
- Concurrencia
- Uso recursos
- Throughput

#### Pruebas de Carga

#### Pruebas de seguridad

- SQL injection
- Control de acceso
- XSS
- Contrasenas

#### Pruebas de usabilidad

- Facilidad de uso
- Navegacion
- Accesibilidad
- Experiencia de usuario

## Diseño de Métricas y Criterios de Aceptación

Para cada atributo elementos obligatorios

- Objetivo de la métrica
- Fórmula
- Unidad de medida
- Herramienta de medición
- Método de recolección
- Frecuencia
- Justificación
- Umbral de aceptación

Cada metrica debe de definir los criterios de aceptación y Establecer umbrales para aceptación total, parcial o rechazo

## Cobertura Mínima Obligatoria

Cada equipo debe realizar mínimo:

- Casos funcionales
- Casos negativos
- Pruebas de intregracion
- Pruebas de rendimiento
- Pruebas de seguridad
- Pruebas de usabilidad
- Automatizaciones

## Casos de Prueba

Cada integrante del equipo debe diseñar todos los casos de prueba (todo lo descrito anteriormente) para almenos 1 requerimiento funcional del sistema seleccionado, y 1 no funcional; para cada tipo de prueba, deben de realizar los casos de prueba necesarios

Los casos de prueba deben alinearse con los atributos de calidad seleccionados. Incluir los escenarios de prueba y resultados esperados.

Cada caso debe incluir:

- ID
- Nombre
- Objetivo
- Requerimiento asociado
- Tipo de prueba
- Prioridad
- Precondiciones
- Datos de prueba
- Pasos
- Resultado esperado
- Resultado obtenido
- Estado
- Evidencia

## Matriz de Trazabilidad

Debe existir una matriz que relacione:

- Requerimiento
- Caso de prueba
- Tipo de prueba
- Resultado
- Defecto

## Defectos

Cada defecto deberá registrarse formalmente.

### Información mínima

- ID
- Título
- Descripción
- Severidad
- Prioridad
- Pasos para reproducir
- Resultado esperado
- Resultado actual
- Evidencia
- Estado
- Responsable

## Herramientas a Utilizar

Indicar herramientas automatizadas y manuales a utilizar.

Ejemplos:

- Estáticas: SonarQube, ESLint, etc
- Dinámicas: JUnit, Postman, Selenium, JMeter, etc
- Rendimiento: Apache JMeter
- Funcionales: Selenium Cypress, Playwright
- API: Postman, Newman
- Etc

## Informe Final

Debe incluir al menos

- Portada
- Introducción
- Objetivos
- Descripción del sistema
- Alcance
- Metodología
- Plan de pruebas
- Herramientas utilizadas
- Casos de prueba
- Matriz de trazabilidad
- Gestión de defectos
- Resultados de ejecución
- Métricas
- Evaluación de deuda técnica
- Análisis de riesgos
- Análisis de resultados
- Conclusiones
- Recomendaciones
- Anexos

## Fechas Importantes

Entrega del proyecto: 14 Junio
