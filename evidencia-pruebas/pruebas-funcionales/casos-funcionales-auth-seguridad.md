# Pruebas funcionales

Modulo trabajado: autenticacion, usuarios, perfil y seguridad.

## TC-AUTH-001 - Registro exitoso de estudiante

- ID: TC-AUTH-001
- Nombre: Registro exitoso de estudiante
- Objetivo: Verificar que un usuario estudiante pueda crear una cuenta valida.
- Requerimiento asociado: RF-AUTH-01
- Tipo de prueba: Funcional
- Prioridad: Alta
- Precondiciones: La aplicacion esta ejecutandose en `http://localhost:8080`.
- Datos de prueba:
  - Nombre: Estudiante QA
  - Email: estudiante.qa@testotron.local
  - Contrasena: Test1234
  - Rol: student
- Pasos:
  1. Abrir `http://localhost:8080/auth/register`.
  2. Ingresar nombre, correo, contrasena y rol estudiante.
  3. Presionar `Registrarse`.
  4. Verificar la redireccion a login.
- Resultado esperado: El usuario se registra correctamente y queda disponible para iniciar sesion.
- Resultado obtenido: status=201, body={'success': True, 'user': {'id': 11, 'name': 'Estudiante QA', 'email': 'estudiante.qa.1780605803@testotron.local', 'role': 'student'}}
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-AUTH-001-registro-estudiante.png`
- Responsable: Joshua

## TC-AUTH-002 - Login exitoso

- ID: TC-AUTH-002
- Nombre: Login exitoso con credenciales validas
- Objetivo: Verificar que un usuario registrado pueda iniciar sesion.
- Requerimiento asociado: RF-AUTH-02
- Tipo de prueba: Funcional
- Prioridad: Alta
- Precondiciones: Existe el usuario `estudiante.qa@testotron.local`.
- Datos de prueba:
  - Email: estudiante.qa@testotron.local
  - Contrasena: Test1234
- Pasos:
  1. Abrir `http://localhost:8080/auth/login`.
  2. Ingresar correo y contrasena.
  3. Presionar `Iniciar sesion`.
  4. Verificar que se redirige a `/dashboard`.
- Resultado esperado: El sistema inicia sesion, crea cookie JWT y muestra el dashboard.
- Resultado obtenido: status=200, user_id=11, token_presente=True, elapsed_ms=77.78
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-AUTH-002-login-dashboard.png`
- Responsable: Joshua

## TC-AUTH-003 - Logout exitoso

- ID: TC-AUTH-003
- Nombre: Cierre de sesion exitoso
- Objetivo: Verificar que el usuario pueda cerrar sesion.
- Requerimiento asociado: RF-AUTH-03
- Tipo de prueba: Funcional
- Prioridad: Alta
- Precondiciones: El usuario esta autenticado.
- Datos de prueba: Usuario `estudiante.qa@testotron.local`.
- Pasos:
  1. Iniciar sesion.
  2. Ejecutar logout desde la interfaz o enviar `POST /api/logout`.
  3. Intentar volver a `/dashboard` o `/profile`.
- Resultado esperado: La sesion se elimina y el usuario es redirigido a login al intentar acceder a rutas privadas.
- Resultado obtenido: logout_status=200, profile_final_url=http://localhost:8080/auth/login
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-AUTH-003-logout-login.png`
- Responsable: Joshua

## TC-PROFILE-001 - Visualizacion de perfil autenticado

- ID: TC-PROFILE-001
- Nombre: Visualizacion de perfil
- Objetivo: Verificar que el usuario autenticado pueda ver su perfil.
- Requerimiento asociado: RF-PROFILE-01
- Tipo de prueba: Funcional/Sistema
- Prioridad: Media
- Precondiciones: Usuario autenticado.
- Datos de prueba: Usuario `estudiante.qa@testotron.local`.
- Pasos:
  1. Iniciar sesion.
  2. Abrir `http://localhost:8080/profile`.
  3. Revisar datos mostrados.
- Resultado esperado: La pagina muestra nombre, correo, rol y biografia del usuario autenticado.
- Resultado obtenido: status=200, url=http://localhost:8080/profile, contiene_configuracion=True
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-PROFILE-001-ver-perfil.png`
- Responsable: Joshua

## TC-PROFILE-002 - Actualizacion de perfil

- ID: TC-PROFILE-002
- Nombre: Actualizacion exitosa de perfil
- Objetivo: Verificar que el usuario pueda actualizar nombre, correo y biografia.
- Requerimiento asociado: RF-PROFILE-02
- Tipo de prueba: Funcional
- Prioridad: Media
- Precondiciones: Usuario autenticado.
- Datos de prueba:
  - Nombre nuevo: Estudiante QA Actualizado
  - Email: estudiante.qa.actualizado@testotron.local
  - Bio: Biografia de prueba QA
- Pasos:
  1. Abrir `/profile`.
  2. Modificar nombre, correo y biografia.
  3. Presionar `Guardar cambios`.
  4. Verificar mensaje de exito y datos actualizados.
- Resultado esperado: Los datos se guardan y se muestran actualizados en el perfil.
- Resultado obtenido: status=200, final_url=http://localhost:8080/profile?updated=1
- Estado: Paso
- Defecto asociado: -
- Evidencia: `EV-TC-PROFILE-002-perfil-actualizado.png`
- Responsable: Joshua
