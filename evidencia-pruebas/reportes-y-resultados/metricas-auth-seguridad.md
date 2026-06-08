# Catalogo operativo de metricas - Autenticacion y seguridad

## MET-AUTH-01 - Porcentaje de casos de autenticacion aprobados

| Campo | Valor |
|---|---|
| Atributo ISO/IEC 25010 | Adecuacion funcional |
| Objetivo | Medir el porcentaje de casos funcionales de autenticacion que pasan |
| Formula | `(casos auth aprobados / casos auth ejecutados) * 100` |
| Unidad | Porcentaje |
| Herramienta | Ejecucion manual, Postman, Playwright |
| Metodo de recoleccion | Contar casos `TC-AUTH-*` y `TC-PROFILE-*` ejecutados con estado `Paso` |
| Frecuencia | Al finalizar la ejecucion del modulo |
| Justificacion | Permite saber si el modulo cumple sus funciones principales |
| Aceptacion total | `>= 90%` |
| Aceptacion parcial | `70% - 89%` |
| Rechazo | `< 70%` |
| Interpretacion | Entre mas alto, mayor conformidad funcional del modulo |
| Retroalimentacion | Revisar los casos fallidos y registrar defectos asociados |

## MET-SEG-01 - Porcentaje de controles de seguridad superados

| Campo | Valor |
|---|---|
| Atributo ISO/IEC 25010 | Seguridad |
| Objetivo | Medir cuantos controles de seguridad basicos fueron superados |
| Formula | `(pruebas de seguridad aprobadas / pruebas de seguridad ejecutadas) * 100` |
| Unidad | Porcentaje |
| Herramienta | Postman, pruebas manuales, navegador |
| Metodo de recoleccion | Contar casos `TC-SEG-*` con estado `Paso` |
| Frecuencia | Al finalizar pruebas de seguridad |
| Justificacion | Evalua control de acceso, proteccion de rutas y resistencia a entradas maliciosas |
| Aceptacion total | `>= 90%` |
| Aceptacion parcial | `70% - 89%` |
| Rechazo | `< 70%` |
| Interpretacion | Un valor bajo indica riesgo de seguridad relevante |
| Retroalimentacion | Priorizar defectos criticos de autorizacion y privilegios |

## MET-SEG-02 - Bloqueo de accesos no autorizados

| Campo | Valor |
|---|---|
| Atributo ISO/IEC 25010 | Seguridad |
| Objetivo | Medir si las rutas privadas bloquean accesos no autenticados o no autorizados |
| Formula | `(intentos no autorizados bloqueados / intentos no autorizados ejecutados) * 100` |
| Unidad | Porcentaje |
| Herramienta | Postman, navegador |
| Metodo de recoleccion | Ejecutar TC-SEG-001, TC-SEG-002, TC-SEG-004 y TC-SEG-005 |
| Frecuencia | Una vez por ejecucion de seguridad |
| Justificacion | El control de acceso es una condicion critica para proteger datos de usuarios |
| Aceptacion total | `100%` |
| Aceptacion parcial | `80% - 99%` |
| Rechazo | `< 80%` |
| Interpretacion | Cualquier fallo debe considerarse riesgo alto o critico |
| Retroalimentacion | Revisar middleware, rutas y validaciones de propiedad del recurso |

## MET-PERF-AUTH-01 - Tiempo promedio de login

| Campo | Valor |
|---|---|
| Atributo ISO/IEC 25010 | Eficiencia de desempeno |
| Objetivo | Medir el tiempo promedio de respuesta del login |
| Formula | `suma de tiempos de login / numero de ejecuciones` |
| Unidad | Milisegundos |
| Herramienta | Postman o JMeter |
| Metodo de recoleccion | Ejecutar 10 solicitudes `POST /api/auth/login` y registrar tiempos |
| Frecuencia | Una vez en ambiente local |
| Justificacion | El login es una operacion frecuente y debe responder en tiempo aceptable |
| Aceptacion total | `<= 500 ms` |
| Aceptacion parcial | `501 ms - 1000 ms` |
| Rechazo | `> 1000 ms` |
| Interpretacion | Tiempos altos pueden afectar experiencia de usuario |
| Retroalimentacion | Revisar costo de bcrypt, base de datos y latencia local |

## MET-USAB-AUTH-01 - Claridad de mensajes de error

| Campo | Valor |
|---|---|
| Atributo ISO/IEC 25010 | Usabilidad |
| Objetivo | Medir si los mensajes de auth/perfil son claros y utiles |
| Formula | `(criterios de claridad cumplidos / criterios evaluados) * 100` |
| Unidad | Porcentaje |
| Herramienta | Checklist manual |
| Metodo de recoleccion | Evaluar mensajes de login incorrecto, email invalido, contrasena corta y perfil |
| Frecuencia | Una vez por ejecucion manual |
| Justificacion | Mensajes confusos reducen la facilidad de uso |
| Aceptacion total | `>= 90%` |
| Aceptacion parcial | `70% - 89%` |
| Rechazo | `< 70%` |
| Interpretacion | Valor bajo indica problemas de comunicacion con el usuario |
| Retroalimentacion | Proponer mensajes consistentes, claros y sin informacion sensible |

## MET-DEF-AUTH-01 - Defectos de seguridad por severidad

| Campo | Valor |
|---|---|
| Atributo ISO/IEC 25010 | Seguridad / Mantenibilidad |
| Objetivo | Clasificar defectos encontrados por severidad |
| Formula | `(defectos por severidad / total de defectos auth-seguridad) * 100` |
| Unidad | Porcentaje |
| Herramienta | Registro de defectos |
| Metodo de recoleccion | Contar defectos criticos, altos, medios y bajos del modulo |
| Frecuencia | Al cierre del modulo |
| Justificacion | Ayuda a priorizar recomendaciones y riesgos |
| Aceptacion total | 0 defectos criticos y maximo 1 alto |
| Aceptacion parcial | 1 defecto critico o hasta 3 altos documentados |
| Rechazo | Mas de 1 defecto critico o defectos altos sin documentar |
| Interpretacion | Mayor severidad implica mayor riesgo para usuarios y datos |
| Retroalimentacion | Priorizar correcciones de autorizacion y exposicion de datos |


## Valores obtenidos en ejecucion

| Metrica | Valor obtenido | Interpretacion |
|---|---|---|
| MET-AUTH-01 | 100.0% | Aceptacion total para funcionalidad base de autenticacion/perfil |
| MET-SEG-01 | 57.14% | Aceptacion parcial/rechazo por fallos criticos de autorizacion |
| MET-SEG-02 | 50% | Rechazo: se bloquearon accesos sin sesion, pero fallaron controles de privilegios |
| MET-PERF-AUTH-01 | promedio=88.65ms, muestras=[120.81, 99.49, 81.04, 106.79, 79.18, 89.19, 77.26, 78.18, 78.41, 76.18] | Aceptacion total en ambiente local |
| MET-USAB-AUTH-01 | 50% | Rechazo: credenciales invalidas se comunican claramente, pero validaciones de email/contrasena son tecnicas o genericas |
| MET-DEF-AUTH-01 | 3 defectos criticos y 1 defecto medio confirmados | Requiere correccion prioritaria antes de considerar aceptado el modulo de seguridad |
