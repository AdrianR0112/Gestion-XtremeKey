# Backend API

API REST modular construida con Node.js, Express y MySQL. El prefijo base de todas las rutas es:

`/api/v1`

## Respuesta estándar

Todas las respuestas exitosas usan este formato:

```json
{
	"ok": true,
	"message": "Mensaje descriptivo",
	"data": {}
}
```

Las respuestas de error usan este formato:

```json
{
	"ok": false,
	"message": "Mensaje de error",
	"errors": [],
	"details": "stack trace solo en desarrollo"
}
```

## Autenticación y permisos

- La autenticación de staff usa JWT Bearer en el header `Authorization: Bearer <token>`.
- Los módulos de gestión suelen requerir `admin` o `vendedor`.
- `staff` y `jobs` quedan restringidos a `admin`.

## Mapa de endpoints

### Gestión

| Método | Ruta | Propósito |
| --- | --- | --- |
| GET | /api/v1 | Estado base de la API |
| POST | /api/v1/staff-auth/login | Iniciar sesión de staff |
| GET | /api/v1/staff-auth/session | Obtener sesión de staff |
| POST | /api/v1/staff-auth/logout | Cerrar sesión de staff |
| POST | /api/v1/staff-auth/change-password | Cambiar contraseña de staff |
| GET/POST/PUT/DELETE | /api/v1/configuracion | CRUD de configuración |
| GET/POST/PUT/PATCH/DELETE | /api/v1/staff | CRUD de usuarios internos |
| GET/POST/PUT/DELETE | /api/v1/clientes | CRUD de clientes |
| POST | /api/v1/clientes/import | Importar clientes desde CSV o XLSX |
| GET/POST/PUT/DELETE | /api/v1/categorias | CRUD de categorías |
| GET/POST/PUT/DELETE | /api/v1/productos | CRUD de productos |
| GET/POST/PUT/DELETE | /api/v1/variantes | CRUD de variantes |
| GET/POST/PUT/DELETE | /api/v1/cuentas | CRUD de cuentas |
| GET/POST/PUT/DELETE | /api/v1/keys | CRUD de keys |
| GET/POST/PUT/DELETE | /api/v1/ventas | CRUD de ventas |
| POST | /api/v1/ventas/con-detalles | Crear una venta y todos sus detalles en una transacción |
| GET/POST/PUT/DELETE | /api/v1/detalle-ventas | CRUD de detalle de ventas |
| GET | /api/v1/renovaciones | Historial derivado de renovaciones completadas |
| GET/POST/PUT/DELETE | /api/v1/tareas | CRUD de tareas |
| GET | /api/v1/calendario?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD | Eventos agregados de tareas y detalle-ventas |
| GET/POST/PUT/DELETE | /api/v1/plantillas | CRUD de plantillas de notificación |
| GET | /api/v1/dashboard | Resumen general para panel administrativo |
| GET/POST/PUT/DELETE | /api/v1/revendedores | CRUD de revendedores |
| POST | /api/v1/jobs/vencimientos-email/run | Ejecutar el job de recordatorios por vencimiento |
| GET/POST/PUT/DELETE | /api/v1/suscripciones | CRUD de suscripciones |
| GET | /api/v1/suscripciones/by-cliente | Listar suscripciones por cliente |

## Gestión

### Endpoints de staff

- `POST /api/v1/staff-auth/login`
- `GET /api/v1/staff-auth/session`
- `POST /api/v1/staff-auth/logout`
- `POST /api/v1/staff-auth/change-password`

#### POST /api/v1/staff-auth/login
Body:

```json
{
	"Ema_Usu": "ana@correo.com",
	"Pas_Usu": "123456"
}
```

#### POST /api/v1/staff-auth/change-password
Body:

```json
{
	"currentPassword": "123456",
	"newPassword": "654321"
}
```

### Configuración

- Endpoints: `GET /configuracion`, `GET /configuracion/actual`, `GET /configuracion/:id`, `POST /configuracion`, `PUT /configuracion/:id`, `DELETE /configuracion/:id`
- Campos:
	- `Nom_Emp_Con` requerido, string
	- `Dir_Con` opcional, string
	- `Tel_Con` opcional, string
	- `Ema_Con` opcional, email
	- `Log_Con` opcional, ruta de archivo o string
	- `Mon_Con` opcional, número
	- `Zon_Hor_Con` opcional, string
	- `Imp_Con` opcional, número 0-100
- Reglas:
	- `Log_Con` se envía como ruta o string plano en JSON.
	- `Ema_Con` se valida como correo si se envía.

### Staff

- Endpoints: `GET /staff`, `GET /staff/:id`, `POST /staff`, `PUT /staff/:id`, `PATCH /staff/:id/estado`, `DELETE /staff/:id`
- Campos:
	- `Nom_Usu` requerido, string
	- `Ape_Usu` requerido, string
	- `Ema_Usu` requerido, email
	- `Pas_Usu` requerido, string mínimo 6
	- `Tel_Usu` opcional, string
	- `Rol_Usu` opcional, enum `admin`, `vendedor`
	- `Est_Usu` opcional, enum `activo`, `inactivo`, `bloqueado`
- Reglas:
	- Solo `admin` puede acceder.
	- Password se guarda con hash bcrypt.

### Clientes

- Endpoints: `GET /clientes`, `GET /clientes/:id`, `POST /clientes`, `PUT /clientes/:id`, `DELETE /clientes/:id`, `POST /clientes/import`
- Importación masiva:
	- Recibe archivo `multipart/form-data` en el campo `file`.
	- Acepta `CSV` o `XLSX` con cabeceras iguales a los nombres de campo.
	- Valida campos obligatorios, normaliza datos y omite duplicados por `Tel_Cli`.
	- Devuelve un resumen con totales, duplicados, inválidos y filas insertadas.
- Campos:
	- `Nom_Cli` opcional, string (puede ser NULL)
	- `Ape_Cli` opcional, string (puede ser NULL)
	- `Tel_Cli` requerido, string (UNIQUE)
	- `Ema_Cli` opcional, email
	- `Pai_Cli` opcional, string, default `Ecuador`
	- `Doc_Cli` opcional, string
	- `Cat_Cli` opcional, enum `nuevo`, `ocasional`, `frecuente`, `vip`
	- `Pre_Con_Cli` opcional, enum `whatsapp`, `email`, `instagram`, `messenger`, `telegram`
	- `Ace_Not_Tel_Cli` opcional, boolean/tinyint
	- `Ace_Not_Cor_Cli` opcional, boolean/tinyint
	- `Not_Cli` opcional, text
	- `Est_Cli` opcional, enum `activo`, `inactivo`, `suspendido`

### Categorías

- Endpoints: `GET /categorias`, `GET /categorias/:id`, `POST /categorias`, `PUT /categorias/:id`, `DELETE /categorias/:id`
- Campos:
	- `Nom_Cat` requerido, string
	- `Des_Cat` opcional, text
	- `Id_Cat_Pad` opcional, FK a categoría padre
	- `Ico_Cat` opcional, string
	- `Ord_Cat` opcional, número
	- `Est_Cat` opcional, enum `activo`, `inactivo`

### Productos

- Endpoints: `GET /productos`, `GET /productos/:id`, `POST /productos`, `PUT /productos/:id`, `DELETE /productos/:id`
- Campos:
	- `Cod_Prd` opcional, string único
	- `Nom_Prd` requerido, string
	- `Des_Prd` opcional, text
	- `Des_Cor_Prd` opcional, string
	- `Id_Cat` opcional, FK a categorías
	- `Tip_Prd` opcional, enum `servicio`, `producto`, `suscripcion`
	- `Ima_Prd` opcional, ruta de archivo o string
	- `Est_Prd` opcional, enum `activo`, `inactivo`, `agotado`
- Reglas:
	- `Ima_Prd` se envía como ruta o string plano en JSON.
	- `Cod_Prd` debe ser único si se envía.

### Variantes

- Endpoints: `GET /variantes`, `GET /variantes/:id`, `POST /variantes`, `PUT /variantes/:id`, `DELETE /variantes/:id`
- Campos:
	- `Id_Prd` requerido, FK a productos
	- `Nom_Var` requerido, string
	- `Des_Var` opcional, text
	- `Pre_Cos_Var` requerido, número >= 0
	- `Pre_Ven_Var` requerido, número >= 0
	- `Pre_Rev_Var` opcional, número >= 0 o nulo
	- `Dur_Tip_Var` opcional, enum `dias`, `meses`, `anios`
	- `Dur_Val_Var` opcional, entero >= 1
	- `Max_Usu_Var` opcional, entero >= 1
	- `Atr_Var` opcional, JSON/string de atributos
	- `Est_Var` opcional, enum `activo`, `inactivo`
- Reglas:
	- `Dur_Tip_Var` y `Dur_Val_Var` pueden enviarse como `null`.

### Cuentas

- Endpoints: `GET /cuentas`, `GET /cuentas/:id`, `POST /cuentas`, `PUT /cuentas/:id`, `DELETE /cuentas/:id`
- Campos:
	- `Id_Prd` opcional, FK a productos
	- `Id_Var` opcional, FK a variantes
	- `Nom_Cue` opcional, string
	- `Usu_Cue` opcional, string
	- `Pas_Cue` opcional, string
	- `Pin_Cue` opcional, string
	- `Per_Cue` opcional, string
	- `Tot_Per_Cue` opcional, entero >= 1
	- `Per_Dis_Cue` opcional, entero >= 0
	- `Fec_Com_Cue` opcional, date/datetime
	- `Fec_Ven_Cue` opcional, date/datetime
	- `Cos_Cue` opcional, número
	- `Not_Cue` opcional, text
	- `Est_Cue` opcional, enum `disponible`, `ocupada`, `parcial`, `vencida`, `suspendida`
- Reglas:
	- Al crear, debe enviarse al menos uno entre `Id_Prd` o `Id_Var`.

### Keys

- Endpoints: `GET /keys`, `GET /keys/:id`, `POST /keys`, `PUT /keys/:id`, `DELETE /keys/:id`
- Campos:
	- `Id_Prd` opcional, FK a productos
	- `Id_Var` opcional, FK a variantes
	- `Cla_Key` opcional, string
	- `Des_Key` opcional, text
	- `Fec_Com_Key` opcional, date/datetime
	- `Fec_Ven_Key` opcional, date/datetime
	- `Cos_Key` opcional, número
	- `Pre_Ven_Key` opcional, número
	- `Es_Per_Vid_Key` opcional, boolean/tinyint
	- `Est_Key` opcional, enum `disponible`, `vendida`, `reservada`, `vencida`, `cancelada`
	- `Not_Key` opcional, text
- Reglas:
	- Al crear, debe enviarse `Cla_Key` y al menos uno entre `Id_Prd` o `Id_Var`.

### Ventas

- Endpoints: `GET /ventas`, `GET /ventas/:id`, `POST /ventas`, `PUT /ventas/:id`, `DELETE /ventas/:id`
- Campos:
	- `Id_Cli` requerido, FK a clientes
	- `Fec_Ven` opcional, datetime
	- `Sub_Tot_Ven` requerido, número >= 0
	- `Des_Tot_Ven` opcional, número >= 0
	- `Imp_Tot_Ven` opcional, número >= 0
	- `Tot_Ven` requerido, número >= 0
	- `Met_Pag_Ven` opcional, string
	- `Not_Ven` opcional, text
	- `Est_Ven` opcional, enum `pendiente`, `completada`, `cancelada`, `reembolsada`
- Reglas:
	- `Tot_Ven = Sub_Tot_Ven - Des_Tot_Ven + Imp_Tot_Ven`.
	- Si `Est_Ven` es `completada`, `Met_Pag_Ven` es obligatorio.

### Detalle de ventas

- Endpoints: `GET /detalle-ventas`, `GET /detalle-ventas/:id`, `POST /detalle-ventas`, `PUT /detalle-ventas/:id`, `DELETE /detalle-ventas/:id`
- Campos:
	- `Id_Ven` requerido, FK a ventas
	- `Id_Dve_Ant` opcional, FK autorreferenciada a `detalle_ventas`; identifica una renovación
	- `Id_Prd` opcional, FK a productos
	- `Id_Var` opcional, FK a variantes
	- `Id_Cue` opcional, FK a cuentas
	- `Id_Key` opcional, FK a keys
	- `Can_Dve` opcional, entero >= 1
	- `Pre_Uni_Dve` requerido al crear, número >= 0
	- `Des_Uni_Dve` opcional, número >= 0
	- `Sub_Tot_Dve` requerido al crear, número >= 0
	- `Fec_Ini_Dve` opcional, date
	- `Fec_Fin_Dve` opcional, date
	- `Cre_Usu_Dve`, `Cre_Pas_Dve`, `Cre_Per_Dve`, `Cre_Pin_Dve` opcionales, strings
	- `Not_Dve` opcional, text
	- `Est_Dve` opcional, enum `activo`, `vencido`, `cancelado`, `renovado`
- Reglas:
	- `Sub_Tot_Dve = Can_Dve * (Pre_Uni_Dve - Des_Uni_Dve)`.
	- Si `Fec_Ini_Dve` no se envía, se toma la fecha actual.
	- Si `Fec_Fin_Dve` no se envía, se usa el mismo valor que `Fec_Ini_Dve`.
	- `Fec_Fin_Dve` no puede ser anterior a `Fec_Ini_Dve`.
	- `Id_Dve_Ant` solo puede registrarse mediante `POST /ventas/con-detalles` y la venta debe estar completada.

### Renovaciones

- No existe una tabla ni CRUD independiente de renovaciones.
- Una renovación es un detalle de venta completado con `Id_Dve_Ant` apuntando al detalle anterior.
- `GET /renovaciones` devuelve el historial mediante una autorrelación de `detalle_ventas`.
- `POST /ventas/con-detalles` registra ventas normales y renovaciones dentro de una única transacción.
- `Id_Dve_Ant` debe ser un detalle existente del mismo cliente y producto, y cada detalle anterior solo puede tener un sucesor.

### Tareas

- Endpoints: `GET /tareas`, `GET /tareas/:id`, `POST /tareas`, `PUT /tareas/:id`, `DELETE /tareas/:id`
- Campos:
	- `Tit_Tar` requerido, string máximo 200
	- `Des_Tar` opcional, text
	- `Id_Cli` opcional, FK a clientes
	- `Id_Ven` opcional, FK a ventas
	- `Fec_Lim_Tar` opcional, date
	- `Pri_Tar` opcional, enum `baja`, `media`, `alta`, `urgente`
	- `Pro_Tar` opcional, entero 0-100
	- `Est_Tar` opcional, enum `pendiente`, `en_progreso`, `completada`, `cancelada`
	- `Fec_Com_Tar` opcional, datetime
- Reglas:
	- Si `Est_Tar = completada`, `Pro_Tar` debe ser 100.
	- Si `Pro_Tar = 100`, `Est_Tar` debe ser `completada`.
	- `Fec_Com_Tar` solo se acepta cuando la tarea está completada.
	- Si la tarea se marca como `completada` y no se envía `Fec_Com_Tar`, el backend la autocompleta con la fecha y hora actuales.

### Calendario

- Endpoint: `GET /calendario`
- Query params:
	- `startDate` opcional, date. Si no se envía, usa el primer día del mes actual.
	- `endDate` opcional, date. Si no se envía, usa el último día del mes actual.
- Origen de eventos:
	- `tareas` por `Fec_Lim_Tar`.
	- `detalle_ventas` por `Fec_Fin_Dve`.
- Respuesta:
	- `range`: rango de fechas usado en la consulta.
	- `summary`: total de eventos y desglose por tipo.
	- `events`: lista normalizada de eventos con `type`, `title`, `start`, `status`, `client`, `saleId`, `product` y `variant` cuando aplican.
- Reglas:
	- `startDate` no puede ser posterior a `endDate`.
	- Un detalle de venta aparece en el calendario según su fecha de vencimiento `Fec_Fin_Dve`.
	- Una tarea aparece en el calendario según su fecha límite `Fec_Lim_Tar`.
	- El calendario no crea ni modifica registros; solo agrega información de otras entidades.

### Plantillas de notificación

- Endpoints: `GET /plantillas`, `GET /plantillas/:id`, `POST /plantillas`, `PUT /plantillas/:id`, `DELETE /plantillas/:id`
- Campos:
	- `Nom_Pla` requerido, string máximo 150
	- `Tip_Pla` opcional, enum `bienvenida`, `venta`, `renovacion`, `vencimiento`, `recordatorio`, `personalizado`
	- `Can_Pla` opcional, enum `whatsapp`, `email`, `sms`, `push`
	- `Asu_Pla` opcional, string máximo 200
	- `Cue_Pla` requerido, text
	- `Var_Pla` opcional, JSON
	- `Est_Pla` opcional, enum `activo`, `inactivo`
- Reglas:
	- `Var_Pla` puede enviarse como objeto JSON o como string JSON válido.

### Operación y soporte

- `GET /api/v1/dashboard` devuelve un resumen general para el panel.
- `GET/POST/PUT/DELETE /api/v1/revendedores` administra revendedores.
- `POST /api/v1/jobs/vencimientos-email/run` ejecuta el proceso manual de notificaciones por vencimiento.

## Suscripciones

- Endpoints: `GET /suscripciones`, `GET /suscripciones/by-cliente`, `GET /suscripciones/:id`, `POST /suscripciones`, `PUT /suscripciones/:id`, `DELETE /suscripciones/:id`
- Uso:
	- Controla suscripciones asociadas a clientes y su trazabilidad.

## Reglas de negocio importantes

- Los listados no usan paginación ni filtros en el backend actual, salvo donde se indica explícitamente.
- Las rutas de gestión están protegidas con JWT y roles, salvo `configuracion`.
- En autenticación de staff y creación de usuarios, los passwords se guardan con bcrypt.
- Los campos calculados o validados por fórmula deben respetar el contrato:
	- ventas: `Tot_Ven = Sub_Tot_Ven - Des_Tot_Ven + Imp_Tot_Ven`
	- detalle ventas: `Sub_Tot_Dve = Can_Dve * (Pre_Uni_Dve - Des_Uni_Dve)`
	- tareas: `Pro_Tar` y `Est_Tar` deben ser coherentes
	- calendario: los eventos se derivan de `Fec_Lim_Tar` y `Fec_Fin_Dve`

## Archivos, blobs y JSON

- `Log_Con` en configuración: enviar como ruta o string plano en JSON.
- `Ima_Prd` en productos: enviar como ruta o string plano en JSON.
- `Var_Pla` en plantillas: enviar como objeto JSON o string JSON válido.
- No hay carga multipart/form-data implementada para estos campos; el frontend debe enviar JSON.

## Ejemplo de error

```json
{
	"ok": false,
	"message": "Payload invalido.",
	"errors": ["Nom_Pla is required"]
}
```

## Scripts

- `npm run dev`
- `npm start`

## Nota de implementación

La API está pensada para que el frontend consuma respuestas uniformes y construya sus formularios en JSON. Si se necesita validación previa en UI, las restricciones de enums, relaciones y fórmulas de totales están reflejadas arriba.
