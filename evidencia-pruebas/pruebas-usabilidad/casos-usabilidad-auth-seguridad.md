# Pruebas usabilidad

Modulo trabajado: autenticacion, usuarios, perfil y seguridad.

## TC-USAB-AUTH-001 - Claridad de mensajes de error

- ID: TC-USAB-AUTH-001
- Nombre: Mensajes claros en login y registro
- Objetivo: Evaluar si los mensajes de error son comprensibles para el usuario.
- Requerimiento asociado: RNF-USAB-AUTH-01
- Tipo de prueba: Usabilidad
- Prioridad: Media
- Precondiciones: Aplicacion en ejecucion.
- Datos de prueba: Login incorrecto, email invalido, contrasena corta.
- Pasos:
  1. Ejecutar casos negativos de login y registro.
  2. Observar mensajes del sistema.
  3. Clasificar si son claros y no revelan informacion sensible.
- Resultado esperado: Los mensajes explican el problema sin revelar detalles internos.
- Resultado obtenido: Se observaron mensajes claros para credenciales invalidas (`Credenciales no válidas`), pero las validaciones de email y contrasena retornan mensajes tecnicos/no localizados desde Zod (`Invalid email`, `String must contain at least 6 character(s)`) o un mensaje generico `Error de validación`.
- Estado: Fallo
- Defecto asociado: DEF-AUTH-006
- Evidencia: `EV-TC-USAB-AUTH-001-mensajes-error.png`
- Responsable: Joshua
