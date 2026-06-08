# Resultados de ejecucion - Autenticacion, usuarios, perfil y seguridad

Ejecucion automatizada realizada contra `http://localhost:8080`. Run ID: `1780605803`.

## Resumen

| Total de casos ejecutados | Casos aprobados | Casos fallidos | Casos bloqueados |
|---|---|---|---|
| 19 | 15 | 4 | 0 |

## Resultados por caso

| Caso | Nombre | Estado | Resultado obtenido | Defecto | Evidencia sugerida |
|---|---|---|---|---|---|
| TC-AUTH-001 | Registro exitoso de estudiante | Paso | status=201, body={'success': True, 'user': {'id': 11, 'name': 'Estudiante QA', 'email': 'estudiante.qa.1780605803@testotron.local', 'role': 'student'}} | - | EV-TC-AUTH-001-registro-estudiante.png |
| TC-AUTH-002 | Login exitoso | Paso | status=200, user_id=11, token_presente=True, elapsed_ms=77.78 | - | EV-TC-AUTH-002-login-dashboard.png |
| TC-AUTH-004 | Consulta de usuario autenticado | Paso | status=200, contiene_password=False | - | EV-TC-AUTH-004-api-me.png |
| TC-PROFILE-001 | Visualizacion de perfil autenticado | Paso | status=200, url=http://localhost:8080/profile, contiene_configuracion=True | - | EV-TC-PROFILE-001-ver-perfil.png |
| TC-INT-AUTH-001 | Login, cookie JWT y acceso a dashboard | Paso | status=200, url=http://localhost:8080/dashboard, contiene_panel=True | - | EV-TC-INT-AUTH-001-cookie-dashboard.png |
| TC-PROFILE-002 | Actualizacion exitosa de perfil | Paso | status=200, final_url=http://localhost:8080/profile?updated=1 | - | EV-TC-PROFILE-002-perfil-actualizado.png |
| TC-SEG-006 | XSS en biografia | Paso | status=200, script_literal_en_html=False, escapado=True | - | EV-TC-SEG-006-xss-biografia.png |
| TC-AUTH-NEG-001 | Login con contrasena incorrecta | Paso | status=401, body={'error': 'Credenciales no válidas'} | - | EV-TC-AUTH-NEG-001-login-incorrecto.png |
| TC-AUTH-NEG-002 | Registro con email invalido | Paso | status=400, body={'error': 'Error de validación', 'issues': [{'validation': 'email', 'code': 'invalid_string', 'message': 'Invalid email', 'path': ['email']}]} | - | EV-TC-AUTH-NEG-002-email-invalido.png |
| TC-AUTH-NEG-003 | Registro con contrasena corta | Paso | status=400, body={'error': 'Error de validación', 'issues': [{'code': 'too_small', 'minimum': 6, 'type': 'string', 'inclusive': True, 'exact': False, 'message': 'String must contain at least 6 character(s)', 'path': ['password']}]} | - | EV-TC-AUTH-NEG-003-password-corta.png |
| TC-SEG-002 | GET /api/users sin autenticacion | Paso | status=401, body={'error': 'Encabezado de autorización o cookie faltante'} | - | EV-TC-SEG-002-api-users-sin-auth.png |
| TC-SEG-001 | Acceso a perfil sin autenticacion | Paso | status=200, final_url=http://localhost:8080/auth/login | - | EV-TC-SEG-001-profile-sin-auth.png |
| TC-SEG-003 | Registro de admin por API | Fallo | status=201, body={'success': True, 'user': {'id': 13, 'name': 'Admin No Autorizado', 'email': 'admin.noautorizado.1780605803@testotron.local', 'role': 'admin'}} | DEF-AUTH-001 | EV-TC-SEG-003-registro-admin-api.png |
| TC-SEG-004 | Consulta de datos de otro usuario | Fallo | status=200, expone_otro_usuario=True, contiene_password=True | DEF-AUTH-002 | EV-TC-SEG-004-consulta-usuario-ajeno.png |
| TC-SEG-005 | Intento de escalamiento de rol propio | Fallo | status=200, body={'updated': 1}; auth_me_despues={'user': {'id': 11, 'name': 'Estudiante QA XSS', 'email': 'estudiante.qa.actualizado.1780605803@testotron.local', 'role': 'admin', 'bio': "<script>alert('xss')</script>", 'created_at': '2026-06-04 20:43:23', 'updated_at': '2026-06-04 20:43:24'}} | DEF-AUTH-003 | EV-TC-SEG-005-escalamiento-rol.png |
| TC-SEG-007 | SQL injection basica en login | Paso | status=400, body={'error': 'Error de validación', 'issues': [{'validation': 'email', 'code': 'invalid_string', 'message': 'Invalid email', 'path': ['email']}]} | - | EV-TC-SEG-007-sql-injection-login.png |
| TC-PERF-AUTH-001 | Tiempo promedio de login | Paso | promedio=88.65ms, muestras=[120.81, 99.49, 81.04, 106.79, 79.18, 89.19, 77.26, 78.18, 78.41, 76.18] | - | EV-TC-PERF-AUTH-001-tiempo-login.png |
| TC-AUTH-003 | Cierre de sesion exitoso | Paso | logout_status=200, profile_final_url=http://localhost:8080/auth/login | - | EV-TC-AUTH-003-logout-login.png |
| TC-USAB-AUTH-001 | Mensajes claros en login y registro | Fallo | Mensajes de credenciales invalidas son claros, pero validaciones de email/contrasena devuelven mensajes tecnicos o genericos poco amigables | DEF-AUTH-006 | EV-TC-USAB-AUTH-001-mensajes-error.png |

## Interpretacion breve

El modulo de autenticacion, usuarios, perfil y seguridad ejecuto 19 casos automatizados, verificables por HTTP/API o evaluados por revision de mensajes. La funcionalidad base de registro, login, logout, perfil, validaciones negativas, proteccion de rutas sin sesion, XSS basico y SQL injection basico paso correctamente. Se confirmaron 3 fallos criticos relacionados con autorizacion y control de privilegios: registro publico de administradores por API, consulta de datos de otros usuarios y escalamiento de rol propio. Adicionalmente, se confirmo 1 fallo medio de usabilidad por mensajes de validacion tecnicos o poco amigables.
