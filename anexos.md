# 20. Anexos

Los anexos de esta sección se entregan junto con el informe en el archivo comprimido (ZIP), dentro de la carpeta `evidencia-pruebas/`, organizada por tipo de prueba. Para cada anexo se indica la ruta del archivo correspondiente dentro de esa carpeta.

---

## 20.1 Evidencias

### Autenticación, usuarios, perfil y seguridad

Para esta sección no se adjuntan fotografías adicionales, ya que las evidencias visuales se incorporaron directamente en el cuerpo del informe como figuras. Como respaldo documental se anexa el checklist de evidencias que utilicé para organizar y validar las capturas durante la ejecución de pruebas.

Este anexo contiene la lista de evidencias planificadas para el módulo, indicando el identificador de cada evidencia, el caso de prueba asociado y el comportamiento que debía observarse durante la ejecución.

Archivo: `evidencia-pruebas/reportes-y-resultados/checklist-evidencias-auth-seguridad.md`

---

## 20.2 Capturas de pantalla

### Autenticación, usuarios, perfil y seguridad

No aplica como anexo independiente. Las capturas de pantalla se integraron directamente en el informe como figuras, por lo que no se adjuntan archivos PNG adicionales.

---

## 20.3 Logs

### Autenticación, usuarios, perfil y seguridad

Se anexan los resultados generados por la ejecución automatizada de pruebas del módulo. Este archivo contiene el registro producido por el script automatizado, con el identificador de cada caso, el nombre de la prueba, el estado, el resultado esperado, el resultado obtenido y los defectos asociados cuando corresponde.

Archivo: `evidencia-pruebas/reportes-y-resultados/resultados-auth-seguridad.json`

---

## 20.4 Reportes de herramientas

### Autenticación, usuarios, perfil y seguridad

Se anexan los documentos con los que consolidé la ejecución, el análisis y la medición de resultados del módulo. El primero resume la ejecución de pruebas (casos evaluados, aprobados, fallidos y defectos identificados) y el segundo presenta las métricas de calidad del módulo con sus valores obtenidos.

Archivos:

- `evidencia-pruebas/reportes-y-resultados/resultados-ejecucion-auth-seguridad.md`
- `evidencia-pruebas/reportes-y-resultados/metricas-auth-seguridad.md`

---

## 20.5 Colecciones Postman

### Autenticación, usuarios, perfil y seguridad

Se anexa la colección de Postman que utilicé para ejecutar pruebas sobre la API del módulo. Contiene las solicitudes para validar el registro de usuarios, el inicio de sesión, la consulta de usuario autenticado, el acceso sin autenticación, la validación de roles y los intentos de abuso sobre la API.

Archivo: `evidencia-pruebas/automatizacion/auth-seguridad.postman_collection.json`

---

## 20.6 Scripts de automatización

### Autenticación, usuarios, perfil y seguridad

Se anexan los scripts que usé como apoyo para automatizar las pruebas del módulo, junto con el README que explica cómo ejecutarlas. El script principal genera los resultados en formato JSON a partir de los casos positivos, negativos, de integración, seguridad y rendimiento básico. El script de Playwright queda como base opcional para automatizar flujos web.

Archivos:

- `evidencia-pruebas/automatizacion/run-auth-security-tests.py`
- `evidencia-pruebas/automatizacion/auth-seguridad.spec.js`
- `evidencia-pruebas/automatizacion/README.md`

---

## 20.7 Planes JMeter

### Autenticación, usuarios, perfil y seguridad

No aplica. Para este módulo no se generaron planes de prueba en JMeter. La validación de rendimiento básica se realizó mediante el script automatizado y la colección de Postman.

---

## 20.8 Matriz de trazabilidad completa

La matriz de trazabilidad del módulo ya fue adjuntada en la sección 12 del informe, por lo que no se duplica como anexo.

---

## 20.9 Registro completo de defectos

### Autenticación, usuarios, perfil y seguridad

Se anexa el registro de defectos identificados durante la revisión y la ejecución de pruebas del módulo. Documenta cada defecto con su identificador, título, descripción, severidad, prioridad, pasos de reproducción, resultado esperado, resultado obtenido, evidencia asociada, estado, caso relacionado, requerimiento relacionado y recomendación de corrección.

Archivo: `evidencia-pruebas/reportes-y-resultados/registro-defectos-auth-seguridad.md`
