# Checklist de evidencias - Autenticacion y seguridad

## Como guardar evidencias

Crear esta carpeta dentro del ZIP de anexos:

```text
Anexos_Testotron_QA/evidencias/auth-seguridad/
```

Usar nombres consistentes:

```text
EV-[ID-CASO]-[descripcion].png
```

## Pantallazos manuales obligatorios

| Evidencia | Caso asociado | Que debe mostrar |
|---|---|---|
| `EV-TC-AUTH-001-registro-estudiante.png` | TC-AUTH-001 | Formulario de registro lleno o redireccion a login tras registro |
| `EV-TC-AUTH-002-login-dashboard.png` | TC-AUTH-002 | Dashboard visible despues del login |
| `EV-TC-AUTH-003-logout-login.png` | TC-AUTH-003 | Redireccion a login tras cerrar sesion |
| `EV-TC-PROFILE-001-ver-perfil.png` | TC-PROFILE-001 | Pagina `/profile` con datos del usuario |
| `EV-TC-PROFILE-002-perfil-actualizado.png` | TC-PROFILE-002 | Mensaje de perfil actualizado y datos nuevos |
| `EV-TC-AUTH-NEG-001-login-incorrecto.png` | TC-AUTH-NEG-001 | Mensaje de credenciales invalidas |
| `EV-TC-AUTH-NEG-002-email-invalido.png` | TC-AUTH-NEG-002 | Validacion de email invalido |
| `EV-TC-AUTH-NEG-003-password-corta.png` | TC-AUTH-NEG-003 | Error por contrasena corta |
| `EV-TC-SEG-001-profile-sin-auth.png` | TC-SEG-001 | Intento de abrir `/profile` sin sesion y redireccion a login |
| `EV-TC-SEG-006-xss-biografia.png` | TC-SEG-006 | Payload XSS guardado sin ejecutarse o evidencia de ejecucion si falla |
| `EV-TC-USAB-AUTH-001-mensajes-error.png` | TC-USAB-AUTH-001 | Mensajes de error visibles y evaluables |

## Evidencias Postman/API obligatorias

| Evidencia | Caso asociado | Que debe mostrar |
|---|---|---|
| `EV-TC-AUTH-004-api-me.png` | TC-AUTH-004 | Respuesta de `/api/auth/me` sin campo `password` |
| `EV-TC-SEG-002-api-users-sin-auth.png` | TC-SEG-002 | `GET /api/users` sin auth devuelve 401 |
| `EV-TC-SEG-003-registro-admin-api.png` | TC-SEG-003 / DEF-AUTH-001 | Resultado de intentar registrar `role=admin` |
| `EV-TC-SEG-004-consulta-usuario-ajeno.png` | TC-SEG-004 / DEF-AUTH-002 | Resultado de consultar otro usuario por ID |
| `EV-TC-SEG-005-escalamiento-rol.png` | TC-SEG-005 / DEF-AUTH-003 | Resultado de intentar cambiar rol propio |
| `EV-TC-SEG-007-sql-injection-login.png` | TC-SEG-007 | Login con payload SQL rechazado |
| `EV-TC-INT-AUTH-001-cookie-dashboard.png` | TC-INT-AUTH-001 | Cookie/token y acceso exitoso a dashboard |
| `EV-TC-PERF-AUTH-001-tiempo-login.png` | TC-PERF-AUTH-001 | Tiempos de respuesta de login en Postman |

## Evidencia opcional de DevTools

| Evidencia | Defecto asociado | Que debe mostrar |
|---|---|---|
| `EV-DEF-AUTH-004-fetch-current-user-url.png` | DEF-AUTH-004 | Consola o Network mostrando si `fetchCurrentUser` falla por URL invalida |

## Comandos utiles para levantar el proyecto

Desde la raiz del repositorio:

```powershell
cd testotron
npm install
npm run api:init
npm start
```

Luego abrir:

```text
http://localhost:8080
```

Si ya esta instalado e inicializado:

```powershell
cd testotron
npm start
```

## Orden recomendado para tomar pantallazos

1. Abrir navegador sin sesion y capturar `/profile` redirigiendo a login.
2. Registrar usuario estudiante.
3. Iniciar sesion y capturar dashboard.
4. Capturar perfil.
5. Actualizar perfil y capturar mensaje de exito.
6. Probar login incorrecto.
7. Probar email invalido.
8. Probar contrasena corta.
9. Probar XSS en biografia.
10. Ejecutar coleccion Postman y capturar requests criticos.
11. Tomar captura de tiempos de login.
12. Actualizar estados de casos y defectos.

