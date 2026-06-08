# Pruebas negativas validacion

Modulo trabajado: autenticacion, usuarios, perfil y seguridad.

## TC-AUTH-NEG-001 - Login con contrasena incorrecta

- ID: TC-AUTH-NEG-001
- Nombre: Login con contrasena incorrecta
- Objetivo: Verificar que el sistema rechace credenciales invalidas.
- Requerimiento asociado: RF-AUTH-02, RNF-USAB-AUTH-01
- Tipo de prueba: Negativa
- Prioridad: Alta
- Precondiciones: Existe el usuario `estudiante.qa@testotron.local`.
- Datos de prueba:
  - Email: estudiante.qa@testotron.local
  - Contrasena: Incorrecta123
- Pasos:
  1. Abrir `/auth/login`.
  2. Ingresar email valido y contrasena incorrecta.
  3. Enviar formulario.
- Resultado esperado: El sistema rechaza el login y muestra mensaje claro sin iniciar sesion.
- Resultado obtenido: status=401, body={'error': 'Credenciales no válidas'}
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-AUTH-NEG-001-login-incorrecto.png`
- Responsable: Joshua

## TC-AUTH-NEG-002 - Registro con email invalido

- ID: TC-AUTH-NEG-002
- Nombre: Registro con email invalido
- Objetivo: Verificar que el sistema valide formato de correo.
- Requerimiento asociado: RF-AUTH-01
- Tipo de prueba: Negativa
- Prioridad: Media
- Precondiciones: Aplicacion en ejecucion.
- Datos de prueba:
  - Nombre: Usuario Email Invalido
  - Email: correo-invalido
  - Contrasena: Test1234
  - Rol: student
- Pasos:
  1. Abrir `/auth/register`.
  2. Ingresar email sin formato valido.
  3. Enviar formulario.
- Resultado esperado: El sistema bloquea o rechaza el registro con error de validacion.
- Resultado obtenido: status=400, body={'error': 'Error de validación', 'issues': [{'validation': 'email', 'code': 'invalid_string', 'message': 'Invalid email', 'path': ['email']}]}
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-AUTH-NEG-002-email-invalido.png`
- Responsable: Joshua

## TC-AUTH-NEG-003 - Registro con contrasena menor a 6 caracteres

- ID: TC-AUTH-NEG-003
- Nombre: Registro con contrasena corta
- Objetivo: Verificar que el sistema rechace contrasenas menores a 6 caracteres.
- Requerimiento asociado: RF-AUTH-01, RNF-SEG-02
- Tipo de prueba: Negativa
- Prioridad: Media
- Precondiciones: Aplicacion en ejecucion.
- Datos de prueba:
  - Nombre: Usuario Password Corta
  - Email: password.corta@testotron.local
  - Contrasena: 123
  - Rol: student
- Pasos:
  1. Enviar registro con contrasena `123`.
  2. Revisar respuesta del sistema.
- Resultado esperado: El sistema rechaza el registro con error de validacion.
- Resultado obtenido: status=400, body={'error': 'Error de validación', 'issues': [{'code': 'too_small', 'minimum': 6, 'type': 'string', 'inclusive': True, 'exact': False, 'message': 'String must contain at least 6 character(s)', 'path': ['password']}]}
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-AUTH-NEG-003-password-corta.png`
- Responsable: Joshua
