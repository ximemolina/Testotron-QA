# Pruebas rendimiento

Modulo trabajado: autenticacion, usuarios, perfil y seguridad.

## TC-PERF-AUTH-001 - Tiempo promedio de login

- ID: TC-PERF-AUTH-001
- Nombre: Tiempo promedio de respuesta del login
- Objetivo: Medir tiempo promedio de respuesta de `POST /api/auth/login`.
- Requerimiento asociado: RNF-PERF-AUTH-01
- Tipo de prueba: Rendimiento basico
- Prioridad: Media
- Precondiciones: Usuario registrado y aplicacion en ejecucion local.
- Datos de prueba: 10 ejecuciones de login con credenciales validas.
- Pasos:
  1. Ejecutar 10 solicitudes `POST /api/auth/login` en Postman.
  2. Registrar tiempos de respuesta.
  3. Calcular promedio.
- Resultado esperado: Tiempo promedio menor o igual a 1000 ms en ambiente local.
- Resultado obtenido: promedio=88.65ms, muestras=[120.81, 99.49, 81.04, 106.79, 79.18, 89.19, 77.26, 78.18, 78.41, 76.18]
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-PERF-AUTH-001-tiempo-login.png`
- Responsable: Joshua
