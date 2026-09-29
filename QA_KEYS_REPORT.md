# Informe de verificación del módulo de Keys

Fecha: 2026-08-31  
Entorno: base de desarrollo existente `sistema_gestion_xk`, MariaDB 10.4.28, zona horaria de sesión `-05:00`  
Método: revisión estática, validadores ejecutados de forma aislada, inserciones SQL dentro de una transacción revertida y revisión visual con datos ficticios.

## Resultado ejecutivo

- 10 casos aprobados, 14 fallidos y 2 bloqueados.
- Las inserciones usaron el identificador enmascarado `QA_KEYS_<timestamp>` y finalizaron con `0` keys y `0` ventas QA en la base.
- El CRUD básico, las relaciones por FK, el listado, la actualización parcial, la búsqueda local, los filtros, la paginación y la composición responsive funcionan en sus recorridos principales.
- El módulo no cumple todavía las reglas acordadas de unicidad, venta exclusiva, trazabilidad de keys vendidas ni vencimiento automático.
- No se corrigieron estos defectos, de acuerdo con el alcance de auditoría solicitado.

## Matriz de verificación

| Caso | Precondición | Acción | Resultado esperado | Resultado real y evidencia | Estado |
|---|---|---|---|---|---|
| KEY-001 Acceso por rol | Código de rutas disponible | Revisar guardas del router | Solo `admin` y `vendedor` acceden | `keys.routes.js` aplica autenticación y esos dos roles antes del CRUD | Aprobado |
| KEY-002 Respuestas 401/403 | API ejecutándose y sesiones de prueba | Invocar endpoints sin sesión y con rol no permitido | 401 y 403 respectivamente | No se levantó el backend porque su arranque ejecuta verificaciones/migraciones de esquema; no había sesiones QA reutilizables | Bloqueado |
| KEY-003 Creación válida | Producto y variante existentes | Validar e insertar key con importes, fechas y opcionales | Registro creado; clave recortada | El validador recortó espacios y la inserción válida fue aceptada | Aprobado |
| KEY-004 Campos obligatorios | Payload sin clave o sin producto/variante | Ejecutar validador | Rechazo controlado | Ambos payloads devolvieron `isValid: false` | Aprobado |
| KEY-005 Valores inválidos | Precio negativo, estado o fecha inválidos | Ejecutar validador | Resultado de validación controlado y posterior HTTP 400 | El `transform` lanzó `ZodError` en vez de devolver un resultado; el middleware lo resolvería como 500 | Fallido |
| KEY-006 Conservación de fechas | Fechas `2026-08-01` y `2026-08-31` | Normalizar payload | Se conservan los días elegidos | Se transformaron en `2026-07-31` y `2026-08-30` por conversión UTC → Ecuador | Fallido |
| KEY-007 Rango invertido | Compra posterior al vencimiento | Revisar servicio y ejecutar payload | Rechazo 400 | `validateDateRange` detecta el rango después de normalizar | Aprobado |
| KEY-008 FK inexistente | ID de producto inexistente | Insertar key | Rechazo | MariaDB devolvió `ER_NO_REFERENCED_ROW_2` | Aprobado |
| KEY-009 Variante incompatible | Producto A con variante de producto B | Insertar y revisar servicio | Rechazo 400 | La base aceptó la fila y el servicio solo verifica que ambos IDs existan | Fallido |
| KEY-010 Duplicado por producto | Misma clave con diferente capitalización en el mismo producto | Insertar segunda fila | Rechazo por coincidencia sin distinguir mayúsculas | La segunda fila fue aceptada; no existe índice ni consulta de unicidad | Fallido |
| KEY-011 Misma clave en otro producto | Clave existente en producto A | Insertar en producto B | Aceptación | La fila fue aceptada | Aprobado |
| KEY-012 Actualización parcial | Key existente | Cambiar solo descripción | Se conserva el resto del registro | Descripción actualizada y estado preservado | Aprobado |
| KEY-013 Listado y detalle | Varias keys QA | Listar y revisar repositorio | Orden descendente por ID y nombres asociados | Consulta ordenada por `Id_Key DESC`; joins de producto y variante presentes | Aprobado |
| KEY-014 Búsqueda, estado y paginación | 12 filas ficticias | Buscar, filtrar y paginar en UI | Resultados coherentes | Filtro por estado, búsqueda por clave/descripción/producto/variante y páginas de 10 filas funcionan localmente | Aprobado |
| KEY-015 Responsive | Datos ficticios en 1280 px y 320 px | Revisar tabla y lista expandible | Sin desbordamiento y acciones utilizables | Tabla en escritorio y tarjetas expandibles en móvil; sin overflow horizontal | Aprobado |
| KEY-016 Acciones accesibles en escritorio | Tabla visible | Inspeccionar árbol accesible | Ver, editar y eliminar tienen nombre accesible | Los tres botones de icono aparecen como botones sin nombre | Fallido |
| KEY-017 Selector en venta | Abrir alta de venta | Buscar selección de key | Solo keys compatibles, disponibles y no vencidas | `keysData` se carga y se pasa desde ventas, pero `DetalleVentasManager` no recibe ni renderiza el selector | Fallido |
| KEY-018 Transición por venta | Venta completada con key disponible | Insertar detalle enlazado | La key pasa a `vendida` dentro de la transacción | La venta quedó enlazada y la key continuó `disponible`; no hay actualización en `createVentaConDetalles` | Fallido |
| KEY-019 Reutilización | Key ya enlazada | Añadir un segundo detalle con la misma key | Rechazo 409 | La base aceptó dos detalles y reportó dos enlaces a la misma key | Fallido |
| KEY-020 Concurrencia | Dos ventas intentan la misma key | Revisar bloqueo y restricciones | Solo una venta confirma | No existe `FOR UPDATE`, transición atómica ni restricción única sobre `detalle_ventas.Id_Key`; el segundo enlace fue aceptado | Fallido |
| KEY-021 Rollback funcional | Venta fallida después de reservar key | Ejecutar flujo completo de servicio | La key vuelve a estar disponible | El flujo no reserva ni vende la key, y ejecutar el backend habría activado migraciones; no se pudo validar la regla futura | Bloqueado |
| KEY-022 Eliminación histórica | Key vinculada a un detalle | Eliminar la key | Rechazo para conservar trazabilidad | El borrado fue aceptado y la FK cambió el detalle a `Id_Key = NULL` | Fallido |
| KEY-023 Vencimiento automático | Keys `disponible`, `reservada` y `vendida` vencidas ayer | Consultar estados | Las dos primeras pasan a `vencida`; la vendida se conserva | Los estados permanecieron `disponible`, `reservada` y `vendida`; no existe job ni derivación de lectura | Fallido |
| KEY-024 Límite del día de vencimiento | Key vence hoy | Revisar motor de expiración | Sigue vigente hoy y vence al día siguiente | No existe motor de expiración para aplicar o verificar el límite | Fallido |
| KEY-025 Estados de carga/error y guardado | Fallo inicial o doble envío | Revisar hooks y formulario | Error visible y submit bloqueado mientras guarda | Los errores iniciales de React Query no llegan a `FeedbackAlert` y `saving` no se pasa al botón del formulario | Fallido |
| KEY-026 Validación accesible del formulario | Formulario abierto | Revisar etiquetas y errores | Etiquetas asociadas, mensajes por campo y foco al error | Los `Label` no usan `htmlFor`, no se renderizan errores por campo y la validez frontend no exige producto/variante ni rango de fechas | Fallido |

## Hallazgos priorizados

### Bloqueantes

1. **Duplicados dentro del mismo producto.** No hay restricción de unicidad ni comprobación previa normalizada.
2. **Una key puede venderse varias veces.** El backend solo comprueba existencia; no comprueba disponibilidad, no bloquea la fila y no actualiza el estado.
3. **Pérdida de trazabilidad.** La FK de `detalle_ventas` usa `ON DELETE SET NULL` y el servicio permite borrar una key utilizada.

### Mayores

1. **Fechas desplazadas un día.** La normalización de valores `YYYY-MM-DD` pasa por `Date` UTC antes de convertir a la zona ecuatoriana.
2. **Errores de validación convertibles en HTTP 500.** Precio negativo, enum o fecha inválida lanzan desde el `transform` de Zod.
3. **Producto y variante incoherentes.** Se valida la existencia individual, no la pertenencia de la variante.
4. **Vencimiento no automatizado.** La fecha no modifica ni deriva el estado.
5. **Integración de ventas incompleta.** La UI no ofrece selector y la transacción no gestiona el ciclo de vida de la key.
6. **Estado vacío admitido por la base.** Con el modo SQL actual, un enum desconocido se guardó como cadena vacía; la API debe ser la defensa efectiva.

### Menores

1. Los botones de acciones de la tabla de escritorio no tienen `aria-label` ni texto accesible.
2. Los campos del formulario no están asociados programáticamente con sus etiquetas.
3. Un fallo de carga inicial puede presentarse como tabla vacía en vez de error recuperable.

## Observación de calidad de datos

La consulta real del archivo encontró una suscripción marcada `expirada` cuya fecha de fin es `2026-09-12`, posterior a la fecha de verificación. El nuevo orden cumple `Fec_Fin_Sus DESC`, por lo que esa anomalía aparece antes que los vencimientos recientes válidos. Conviene auditar por separado cómo una fecha futura llegó al estado `expirada`.

## Evidencia de limpieza

Las inserciones se ejecutaron en una única transacción y finalizaron con rollback. La comprobación posterior devolvió:

```text
keys QA restantes: 0
ventas QA restantes: 0
```

No se crearon bases, tablas, índices, migraciones, usuarios ni catálogos.

## Verificación técnica final

- `npm test` en Backend: 9/9 pruebas aprobadas.
- `npm run build` en Frontend: compilación y service worker completados; permanece el aviso existente por un chunk principal mayor de 500 kB.
- ESLint focalizado en `src/layouts/Navbar.jsx`: sin errores ni advertencias.
- Detector visual focalizado en el navbar: sin hallazgos.
- `git diff --check` sobre los archivos entregados: sin errores de whitespace; Git solo informa la política existente de conversión LF → CRLF.
- El lint global no se tomó como puerta de aceptación porque la línea base ya contiene 18 errores y 57 advertencias ajenos a esta entrega.
