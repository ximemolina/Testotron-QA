# Pruebas seguridad

Modulo trabajado: autenticacion, usuarios, perfil y seguridad.

## TC-SEG-001 - Acceso a perfil sin autenticacion

- ID: TC-SEG-001
- Nombre: Acceso a perfil sin autenticacion
- Objetivo: Verificar que `/profile` no sea accesible sin sesion.
- Requerimiento asociado: RNF-SEG-01
- Tipo de prueba: Seguridad
- Prioridad: Alta
- Precondiciones: No hay sesion activa o se usa ventana incognito.
- Datos de prueba: Ninguno.
- Pasos:
  1. Abrir navegador sin sesion.
  2. Entrar a `http://localhost:8080/profile`.
- Resultado esperado: El sistema redirige a `/auth/login`.
- Resultado obtenido: status=200, final_url=http://localhost:8080/auth/login
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-SEG-001-profile-sin-auth.png`
- Responsable: Joshua

## TC-SEG-002 - Acceso a API protegida sin autenticacion

- ID: TC-SEG-002
- Nombre: Acceso a `/api/users` sin autenticacion
- Objetivo: Verificar que la API de usuarios exija autenticacion.
- Requerimiento asociado: RNF-SEG-01
- Tipo de prueba: Seguridad/API
- Prioridad: Alta
- Precondiciones: No enviar cookie ni bearer token.
- Datos de prueba: `GET /api/users`
- Pasos:
  1. Enviar `GET http://localhost:8080/api/users` sin autenticacion.
  2. Revisar codigo de respuesta.
- Resultado esperado: Respuesta `401` con error de autenticacion.
- Resultado obtenido: status=401, body={'error': 'Encabezado de autorización o cookie faltante'}
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-SEG-002-api-users-sin-auth.png`
- Responsable: Joshua

## TC-SEG-003 - Registro de administrador desde API

- ID: TC-SEG-003
- Nombre: Registro de rol admin por API
- Objetivo: Verificar si la API permite crear usuarios `admin` desde registro publico.
- Requerimiento asociado: RF-ROLE-01, RNF-SEG-03
- Tipo de prueba: Seguridad/API
- Prioridad: Critica
- Precondiciones: Aplicacion en ejecucion.
- Datos de prueba:
  - Nombre: Admin No Autorizado
  - Email: admin.noautorizado@testotron.local
  - Contrasena: Test1234
  - Rol: admin
- Pasos:
  1. Enviar `POST /api/auth/register` con `role=admin`.
  2. Revisar respuesta.
  3. Intentar login con ese usuario.
- Resultado esperado: El registro publico no debe permitir crear administradores.
- Resultado obtenido: status=201, body={'success': True, 'user': {'id': 13, 'name': 'Admin No Autorizado', 'email': 'admin.noautorizado.1780605803@testotron.local', 'role': 'admin'}}
- Estado: Fallo
- Defecto asociado: DEF-AUTH-001
- Evidencia: `EV-TC-SEG-003-registro-admin-api.png`
- Responsable: Joshua

## TC-SEG-004 - Consulta de datos de otro usuario

- ID: TC-SEG-004
- Nombre: Consulta de otro usuario por `/api/users/:id`
- Objetivo: Verificar si un estudiante puede consultar datos de otro usuario.
- Requerimiento asociado: RF-ROLE-01, RNF-SEG-03
- Tipo de prueba: Seguridad/API
- Prioridad: Critica
- Precondiciones: Existen dos usuarios. Se autentica como estudiante A.
- Datos de prueba:
  - Usuario autenticado: estudiante A
  - ID consultado: usuario B
- Pasos:
  1. Hacer login como estudiante A.
  2. Enviar `GET /api/users/{id_de_usuario_B}`.
  3. Revisar respuesta.
- Resultado esperado: El sistema debe responder 403 o limitar la consulta al propio usuario.
- Resultado obtenido: status=200, expone_otro_usuario=True, contiene_password=True
- Estado: Fallo
- Defecto asociado: DEF-AUTH-002
- Evidencia: `EV-TC-SEG-004-consulta-usuario-ajeno.png`
- Responsable: Joshua

## TC-SEG-005 - Intento de escalamiento de rol propio

- ID: TC-SEG-005
- Nombre: Usuario intenta cambiar su propio rol a admin
- Objetivo: Verificar que un usuario no-admin no pueda elevar su rol.
- Requerimiento asociado: RF-ROLE-01, RNF-SEG-03
- Tipo de prueba: Seguridad/API
- Prioridad: Critica
- Precondiciones: Usuario estudiante autenticado.
- Datos de prueba:
  - Metodo: `PUT /api/users/{id_propio}`
  - Body: `{ "role": "admin" }`
- Pasos:
  1. Hacer login como estudiante.
  2. Enviar `PUT /api/users/{id_propio}` con body `role=admin`.
  3. Consultar el usuario o intentar acceder a funcionalidades admin.
- Resultado esperado: El sistema debe rechazar el cambio de rol con 403 o ignorar el campo `role`.
- Resultado obtenido: status=200, body={'updated': 1}; auth_me_despues={'user': {'id': 11, 'name': 'Estudiante QA XSS', 'email': 'estudiante.qa.actualizado.1780605803@testotron.local', 'role': 'admin', 'bio': "<script>alert('xss')</script>", 'created_at': '2026-06-04 20:43:23', 'updated_at': '2026-06-04 20:43:24'}}
- Estado: Fallo
- Defecto asociado: DEF-AUTH-003
- Evidencia: `EV-TC-SEG-005-escalamiento-rol.png`
- Responsable: Joshua

## TC-SEG-006 - XSS en biografia de perfil

- ID: TC-SEG-006
- Nombre: Prueba XSS en biografia
- Objetivo: Verificar que el sistema no ejecute scripts ingresados en la biografia.
- Requerimiento asociado: RNF-SEG-04
- Tipo de prueba: Seguridad
- Prioridad: Alta
- Precondiciones: Usuario autenticado.
- Datos de prueba: `<script>alert('xss')</script>`
- Pasos:
  1. Abrir `/profile`.
  2. Guardar el payload en el campo biografia.
  3. Recargar el perfil.
  4. Verificar si se ejecuta un alert o si se muestra como texto escapado.
- Resultado esperado: El script no se ejecuta. El contenido debe escaparse o sanitizarse.
- Resultado obtenido: status=200, script_literal_en_html=False, escapado=True
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-SEG-006-xss-biografia.png`
- Responsable: Joshua

## TC-SEG-007 - SQL injection basica en login

- ID: TC-SEG-007
- Nombre: SQL injection basica en login
- Objetivo: Verificar que el login no sea vulnerable a payload SQL basico.
- Requerimiento asociado: RNF-SEG-04
- Tipo de prueba: Seguridad/API
- Prioridad: Alta
- Precondiciones: Aplicacion en ejecucion.
- Datos de prueba:
  - Email: `' OR '1'='1`
  - Contrasena: cualquier
- Pasos:
  1. Enviar login con payload SQL en email.
  2. Revisar respuesta.
- Resultado esperado: El sistema rechaza el login por validacion o credenciales invalidas.
- Resultado obtenido: status=400, body={'error': 'Error de validación', 'issues': [{'validation': 'email', 'code': 'invalid_string', 'message': 'Invalid email', 'path': ['email']}]}
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-SEG-007-sql-injection-login.png`
- Responsable: Joshua
