# Pruebas integracion api

Modulo trabajado: autenticacion, usuarios, perfil y seguridad.

## TC-AUTH-004 - Consulta del usuario autenticado

- ID: TC-AUTH-004
- Nombre: Consulta de usuario autenticado por API
- Objetivo: Verificar que `/api/auth/me` retorne el usuario autenticado sin exponer la contrasena.
- Requerimiento asociado: RF-AUTH-04, RNF-SEG-02
- Tipo de prueba: Integracion/API
- Prioridad: Alta
- Precondiciones: Existe un token/cookie valido de un usuario autenticado.
- Datos de prueba: Token obtenido por login.
- Pasos:
  1. Hacer login por API.
  2. Enviar `GET /api/auth/me` con cookie o bearer token.
  3. Revisar la respuesta JSON.
- Resultado esperado: La respuesta contiene `id`, `name`, `email`, `role` y no contiene `password`.
- Resultado obtenido: status=200, contiene_password=False
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-AUTH-004-api-me.png`
- Responsable: Joshua

## TC-INT-AUTH-001 - Login, cookie JWT y acceso a dashboard

- ID: TC-INT-AUTH-001
- Nombre: Login -> cookie JWT -> dashboard
- Objetivo: Verificar integracion entre API de login, cookie JWT, middleware y vista SSR protegida.
- Requerimiento asociado: RF-AUTH-02, RNF-SEG-01
- Tipo de prueba: Integracion/Sistema
- Prioridad: Alta
- Precondiciones: Usuario registrado.
- Datos de prueba: Usuario `estudiante.qa@testotron.local`.
- Pasos:
  1. Iniciar sesion.
  2. Verificar cookie `token` en navegador o Postman.
  3. Acceder a `/dashboard`.
- Resultado esperado: El middleware reconoce la cookie y permite ver dashboard.
- Resultado obtenido: status=200, url=http://localhost:8080/dashboard, contiene_panel=True
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-INT-AUTH-001-cookie-dashboard.png`
- Responsable: Joshua
