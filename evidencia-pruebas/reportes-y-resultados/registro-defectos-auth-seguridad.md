# Registro de defectos - Autenticacion y seguridad

Los siguientes defectos fueron detectados por revision estatica del codigo. Deben confirmarse con ejecucion dinamica y pantallazos antes de marcarlos como definitivos.

## DEF-AUTH-001 - Registro publico permite solicitar rol admin por API

- ID: DEF-AUTH-001
- Titulo: Registro publico permite solicitar rol `admin` por API
- Descripcion: La ruta `POST /api/auth/register` valida `role` con `z.enum(['student','teacher','admin'])` y crea el usuario con `role: data.role || 'student'`. Aunque la vista de registro solo muestra estudiante/profesor, una llamada directa a la API podria crear un usuario administrador.
- Severidad: Critico
- Prioridad: Alta
- Pasos para reproducir:
  1. Enviar `POST /api/auth/register`.
  2. Usar body `{ "name": "Admin No Autorizado", "email": "admin.noautorizado@testotron.local", "password": "Test1234", "role": "admin" }`.
  3. Revisar si la respuesta crea el usuario con rol `admin`.
- Resultado esperado: El registro publico debe rechazar `admin` o forzar rol `student`.
- Resultado actual: Confirmado por ejecucion dinamica: `POST /api/auth/register` respondio 201 y creo un usuario con rol `admin`.
- Evidencia: `EV-TC-SEG-003-registro-admin-api.png`
- Estado: Confirmado
- Responsable: Joshua
- Caso relacionado: TC-SEG-003
- Requerimiento relacionado: RF-ROLE-01, RNF-SEG-03
- Recomendacion: No permitir `admin` en registro publico. Crear administradores solo por flujo administrativo protegido.

## DEF-AUTH-002 - Usuario autenticado puede consultar datos de otros usuarios por ID

- ID: DEF-AUTH-002
- Titulo: Consulta de usuarios por ID no valida propiedad del recurso
- Descripcion: La ruta `GET /api/users/:id` permite roles `admin`, `teacher` y `student`. El controlador `UserController.get` retorna el usuario solicitado sin verificar si el estudiante consulta su propio ID. Ademas, el modelo retorna el campo `password`, por lo que podria exponerse hash de contrasena.
- Severidad: Critico
- Prioridad: Alta
- Pasos para reproducir:
  1. Iniciar sesion como estudiante A.
  2. Enviar `GET /api/users/{id_de_otro_usuario}`.
  3. Revisar si se devuelven datos del otro usuario.
- Resultado esperado: Estudiantes solo deben consultar su propio perfil o recibir 403. La respuesta no debe incluir `password`.
- Resultado actual: Confirmado por ejecucion dinamica: `GET /api/users/{id_ajeno}` respondio 200 y expuso datos de otro usuario, incluyendo hash de `password`.
- Evidencia: `EV-TC-SEG-004-consulta-usuario-ajeno.png`
- Estado: Confirmado
- Responsable: Joshua
- Caso relacionado: TC-SEG-004
- Requerimiento relacionado: RF-ROLE-01, RNF-SEG-03
- Recomendacion: En `UserController.get`, restringir estudiantes a `req.user.id === id` y eliminar siempre `password` de la respuesta.

## DEF-AUTH-003 - Usuario no-admin podria cambiar su propio rol con PUT

- ID: DEF-AUTH-003
- Titulo: Posible escalamiento de privilegios por actualizacion de rol propio
- Descripcion: La ruta `PUT /api/users/:id` permite roles `admin`, `teacher` y `student`. El controlador impide que no-admins modifiquen a otros usuarios, pero permite que actualicen su propio usuario. El esquema de actualizacion acepta `role`, por lo que un estudiante podria intentar actualizar su propio rol a `admin`.
- Severidad: Critico
- Prioridad: Alta
- Pasos para reproducir:
  1. Iniciar sesion como estudiante.
  2. Enviar `PUT /api/users/{id_propio}` con body `{ "role": "admin" }`.
  3. Consultar usuario o intentar acceder a funciones admin.
- Resultado esperado: Solo administradores deben modificar roles.
- Resultado actual: Confirmado por ejecucion dinamica: `PUT /api/users/{id_propio}` respondio 200 y cambio el rol del usuario a `admin`.
- Evidencia: `EV-TC-SEG-005-escalamiento-rol.png`
- Estado: Confirmado
- Responsable: Joshua
- Caso relacionado: TC-SEG-005
- Requerimiento relacionado: RF-ROLE-01, RNF-SEG-03
- Recomendacion: Ignorar `role` para usuarios no-admin o crear endpoint administrativo separado para cambios de rol.

## DEF-AUTH-004 - Posible URL invalida en consulta frontend de usuario actual

- ID: DEF-AUTH-004
- Titulo: `fetchCurrentUser` usa ruta sin slash inicial
- Descripcion: En `frontend/assets/js/api-client.js`, `fetchCurrentUser` llama `fetchWithAuth('api/auth/me')`. Como `fetchWithAuth` concatena `BASE + path`, podria generar `http://localhost:8080api/auth/me` en lugar de `http://localhost:8080/api/auth/me`.
- Severidad: Medio
- Prioridad: Media
- Pasos para reproducir:
  1. Abrir DevTools en navegador.
  2. Hacer login.
  3. Revisar consola/red para verificar si falla `fetchCurrentUser`.
- Resultado esperado: El frontend debe llamar `/api/auth/me` correctamente.
- Resultado actual: Confirmado por revision estatica: `fetchCurrentUser` llama `fetchWithAuth('api/auth/me')`, mientras `fetchWithAuth` concatena `BASE + path`; esto produce una URL sin separador (`http://localhost:8080api/auth/me`). En el flujo actual el error queda capturado y no bloquea el login, pero la consulta del usuario actual falla silenciosamente.
- Evidencia: `EV-DEF-AUTH-004-fetch-current-user-url.png`
- Estado: Confirmado por revision estatica
- Responsable: Joshua
- Caso relacionado: TC-INT-AUTH-001
- Requerimiento relacionado: RF-AUTH-04
- Recomendacion: Cambiar `fetchWithAuth('api/auth/me')` por `fetchWithAuth('/api/auth/me')`.

## DEF-AUTH-006 - Mensajes de validacion tecnicos o poco amigables

- ID: DEF-AUTH-006
- Titulo: Mensajes de validacion de auth no son suficientemente claros para usuario final
- Descripcion: En pruebas negativas de registro/login se observaron respuestas tecnicas o genericas para validaciones de entrada, por ejemplo `Invalid email`, `String must contain at least 6 character(s)` o `Error de validación`. Estos mensajes no estan completamente localizados ni explican de forma amigable que debe corregir el usuario.
- Severidad: Medio
- Prioridad: Media
- Pasos para reproducir:
  1. Enviar registro con email invalido.
  2. Enviar registro con contrasena menor a 6 caracteres.
  3. Observar el mensaje retornado por la API o mostrado por el frontend.
- Resultado esperado: El sistema debe mostrar mensajes claros en espanol, por ejemplo `Ingrese un correo electronico valido` o `La contrasena debe tener al menos 6 caracteres`.
- Resultado actual: Se muestran mensajes tecnicos o genericos provenientes de validacion interna.
- Evidencia: `EV-TC-USAB-AUTH-001-mensajes-error.png`
- Estado: Confirmado
- Responsable: Joshua
- Caso relacionado: TC-USAB-AUTH-001
- Requerimiento relacionado: RNF-USAB-AUTH-01
- Recomendacion: Mapear errores de Zod a mensajes amigables y localizados antes de responder al usuario.

