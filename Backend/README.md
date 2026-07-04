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
- La autenticación de clientes expone sesión propia para ecommerce.

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
| GET/POST/PUT/DELETE | /api/v1/proveedores | CRUD de proveedores |
| GET/POST/PUT/DELETE | /api/v1/categorias | CRUD de categorías |
| GET/POST/PUT/DELETE | /api/v1/productos | CRUD de productos |
| GET/POST/PUT/DELETE | /api/v1/variantes | CRUD de variantes |
| GET/POST/PUT/DELETE | /api/v1/proveedores-productos | CRUD de relación proveedor-producto |
| GET/POST/PUT/DELETE | /api/v1/cuentas | CRUD de cuentas |
| GET/POST/PUT/DELETE | /api/v1/keys | CRUD de keys |
| GET/POST/PUT/DELETE | /api/v1/ventas | CRUD de ventas |
| GET/POST/PUT/DELETE | /api/v1/detalle-ventas | CRUD de detalle de ventas |
| GET/POST/PUT/DELETE | /api/v1/compras | CRUD de compras |
| GET/POST/PUT/DELETE | /api/v1/detalle-compras | CRUD de detalle de compras |
| GET/POST/PUT/DELETE | /api/v1/gastos | CRUD de gastos |
| GET/POST/PUT/DELETE | /api/v1/renovaciones | CRUD de renovaciones |
| GET/POST/PUT/DELETE | /api/v1/tareas | CRUD de tareas |
| GET | /api/v1/calendario?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD | Eventos agregados de tareas y detalle-ventas |
| GET/POST/PUT/DELETE | /api/v1/plantillas | CRUD de plantillas de notificación |
| GET | /api/v1/dashboard | Resumen general para panel administrativo |
| GET/POST/PUT/DELETE | /api/v1/imagenes-productos | CRUD de imágenes de productos |
| GET/POST/PUT/DELETE | /api/v1/revendedores | CRUD de revendedores |
| POST | /api/v1/jobs/vencimientos-email/run | Ejecutar el job de recordatorios por vencimiento |

### Ecommerce

| Método | Ruta | Propósito |
| --- | --- | --- |
| POST | /api/v1/customer-auth/register | Registrar cliente |
| POST | /api/v1/customer-auth/login | Iniciar sesión de cliente |
| GET | /api/v1/customer-auth/session | Obtener sesión de cliente |
| POST | /api/v1/customer-auth/logout | Cerrar sesión de cliente |
| GET/POST/PUT/DELETE | /api/v1/carrito | CRUD del carrito |
| GET/POST/PUT/DELETE | /api/v1/carrito/:id/items | CRUD de items del carrito |
| GET/PUT/DELETE | /api/v1/carrito/items/:itemId | Operaciones directas sobre un item del carrito |
| GET/POST/PUT/DELETE | /api/v1/ordenes | CRUD de órdenes |
| GET/POST/PUT/DELETE | /api/v1/ordenes/:id/items | CRUD de items de la orden |
| GET/PUT/DELETE | /api/v1/ordenes/items/:itemId | Operaciones directas sobre un item de la orden |
| GET/POST/PUT/DELETE | /api/v1/pagos | CRUD de pagos |
| GET/POST/PUT/DELETE | /api/v1/cupones | CRUD de cupones |
| GET | /api/v1/cupones/usos | Listado de usos de cupones |
| GET | /api/v1/cupones/usos/:usoId | Obtener uso de cupón |
| POST/PUT/DELETE | /api/v1/cupones/usos | CRUD de usos de cupones |
| GET/POST/DELETE | /api/v1/cupones/:id/productos | Asignar o listar productos por cupón |
| DELETE | /api/v1/cupones/:id/productos/:productoId | Quitar producto de un cupón |
| GET/POST/PUT/DELETE | /api/v1/lista-deseos | CRUD de lista de deseos |
| GET/POST/PUT/DELETE | /api/v1/resenias | CRUD de reseñas |
| GET/POST/PUT/DELETE | /api/v1/notificaciones | CRUD de notificaciones de ecommerce |
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

### Proveedores

- Endpoints: `GET /proveedores`, `GET /proveedores/:id`, `POST /proveedores`, `PUT /proveedores/:id`, `DELETE /proveedores/:id`
- Campos:
	- `Nom_Pro` requerido, string
	- `Tip_Pro` opcional, enum `persona`, `empresa`, `plataforma`, `tienda_web`, `otro`
	- `Con_Pri_Pro` opcional, string
	- `Tel_Pro` opcional, string
	- `Wha_Pro` opcional, string
	- `Ema_Pro` opcional, email
	- `Tel_Gram_Pro` opcional, string
	- `Web_Pro` opcional, string
	- `Pai_Pro` opcional, string
	- `Med_Con_Pro` opcional, enum `whatsapp`, `telegram`, `web`, `email`, `telefono`
	- `Con_Com_Pro` opcional, string
	- `Cal_Pro` opcional, número entero 1-5
	- `Not_Pro` opcional, text
	- `Est_Pro` opcional, enum `activo`, `inactivo`, `suspendido`

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

### Proveedores-productos

- Endpoints: `GET /proveedores-productos`, `GET /proveedores-productos/:id`, `POST /proveedores-productos`, `PUT /proveedores-productos/:id`, `DELETE /proveedores-productos/:id`
- Campos:
	- `Id_Pro` requerido, FK a proveedores
	- `Id_Prd` opcional, FK a productos
	- `Id_Var` opcional, FK a variantes
	- `Pre_Com_Pro_Prd` opcional, número >= 0
	- `Es_Pri_Pro_Prd` opcional, boolean/tinyint
	- `Not_Pro_Prd` opcional, text
- Reglas:
	- Al crear, debe enviarse `Id_Pro` y al menos uno entre `Id_Prd` o `Id_Var`.

### Cuentas

- Endpoints: `GET /cuentas`, `GET /cuentas/:id`, `POST /cuentas`, `PUT /cuentas/:id`, `DELETE /cuentas/:id`
- Campos:
	- `Id_Prd` opcional, FK a productos
	- `Id_Var` opcional, FK a variantes
	- `Id_Pro` opcional, FK a proveedores
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
	- `Id_Pro` opcional, FK a proveedores
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

### Compras

- Endpoints: `GET /compras`, `GET /compras/:id`, `POST /compras`, `PUT /compras/:id`, `DELETE /compras/:id`
- Campos:
	- `Id_Pro` requerido, FK a proveedores
	- `Fec_Com` opcional, datetime
	- `Sub_Tot_Com` requerido, número >= 0
	- `Imp_Tot_Com` opcional, número >= 0
	- `Tot_Com` requerido, número >= 0
	- `Met_Pag_Com` opcional, string
	- `Not_Com` opcional, text
	- `Est_Com` opcional, enum `pendiente`, `completada`, `cancelada`
- Reglas:
	- `Tot_Com = Sub_Tot_Com + Imp_Tot_Com`.

### Detalle de compras

- Endpoints: `GET /detalle-compras`, `GET /detalle-compras/:id`, `POST /detalle-compras`, `PUT /detalle-compras/:id`, `DELETE /detalle-compras/:id`
- Campos:
	- `Id_Com` requerido, FK a compras
	- `Id_Prd` opcional, FK a productos
	- `Id_Var` opcional, FK a variantes
	- `Can_Dco` opcional, entero >= 1
	- `Pre_Uni_Dco` requerido al crear, número >= 0
	- `Sub_Tot_Dco` requerido al crear, número >= 0
	- `Not_Dco` opcional, text
- Reglas:
	- `Sub_Tot_Dco = Can_Dco * Pre_Uni_Dco`.

### Gastos

- Endpoints: `GET /gastos`, `GET /gastos/:id`, `POST /gastos`, `PUT /gastos/:id`, `DELETE /gastos/:id`
- Campos:
	- `Nom_Gas` requerido, string máximo 150
	- `Des_Gas` opcional, text
	- `Cat_Gas` opcional, enum `operativo`, `administrativo`, `marketing`, `proveedor`, `impuesto`, `otro`
	- `Mon_Gas` requerido, número >= 0
	- `Fec_Gas` requerido, date
	- `Id_Pro` opcional, FK a proveedores
	- `Id_Com` opcional, FK a compras
	- `Com_Gas` opcional, ruta de archivo o string
	- `Est_Gas` opcional, enum `registrado`, `pagado`, `cancelado`
- Reglas:
	- `Com_Gas` se envía como ruta o string plano en JSON.

### Renovaciones

- Endpoints: `GET /renovaciones`, `GET /renovaciones/:id`, `POST /renovaciones`, `PUT /renovaciones/:id`, `DELETE /renovaciones/:id`
- Campos:
	- `Id_Dve_Ori` requerido, FK a detalle_ventas
	- `Id_Dve_Nue` opcional, FK a detalle_ventas
	- `Id_Cli` requerido, FK a clientes
	- `Id_Prd` opcional, FK a productos
	- `Id_Var` opcional, FK a variantes
	- `Fec_Ven_Ant_Ren` requerido, date
	- `Fec_Ini_Nue_Ren` opcional, date
	- `Fec_Fin_Nue_Ren` opcional, date
	- `Pre_Ori_Ren` opcional, número >= 0
	- `Pre_Ren` opcional, número >= 0
	- `Des_Ren` opcional, número >= 0, default 0
	- `Tip_Ren` opcional, enum `automatica`, `manual`, `anticipada`
	- `Est_Ren` opcional, enum `pendiente`, `completada`, `rechazada`, `expirada`
	- `Not_Ren` opcional, text
- Reglas:
	- `Pre_Ren` debe ser igual a `Pre_Ori_Ren - Des_Ren` cuando esos valores se envían juntos.
	- `Fec_Fin_Nue_Ren` no puede ser anterior a `Fec_Ini_Nue_Ren`.

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
- `GET/POST/PUT/DELETE /api/v1/imagenes-productos` administra las imágenes asociadas a productos.
- `GET/POST/PUT/DELETE /api/v1/revendedores` administra revendedores.
- `POST /api/v1/jobs/vencimientos-email/run` ejecuta el proceso manual de notificaciones por vencimiento.

## Ecommerce

### Autenticación de clientes

- `POST /api/v1/customer-auth/register`
- `POST /api/v1/customer-auth/login`
- `GET /api/v1/customer-auth/session`
- `POST /api/v1/customer-auth/logout`

#### POST /api/v1/customer-auth/register
Registro del cliente para acceso al flujo de compra.

#### POST /api/v1/customer-auth/login
Inicio de sesión del cliente para acceder a carrito, órdenes y suscripciones.

#### GET /api/v1/customer-auth/session
Devuelve la sesión actual del cliente autenticado.

#### POST /api/v1/customer-auth/logout
Cierra la sesión de cliente.

### Carrito

- Endpoints: `GET /carrito`, `GET /carrito/:id`, `POST /carrito`, `PUT /carrito/:id`, `DELETE /carrito/:id`
- Endpoints de items: `GET /carrito/:id/items`, `POST /carrito/:id/items`, `GET /carrito/items/:itemId`, `PUT /carrito/items/:itemId`, `DELETE /carrito/items/:itemId`
- Uso:
	- El carrito agrupa items antes de crear una orden.
	- Los items tienen operaciones directas por `itemId` y operaciones por carrito padre.

### Órdenes

- Endpoints: `GET /ordenes`, `GET /ordenes/:id`, `POST /ordenes`, `PUT /ordenes/:id`, `DELETE /ordenes/:id`
- Endpoints de items: `GET /ordenes/:id/items`, `POST /ordenes/:id/items`, `GET /ordenes/items/:itemId`, `PUT /ordenes/items/:itemId`, `DELETE /ordenes/items/:itemId`
- Uso:
	- La orden conserva el detalle de compra finalizada y sus items.
	- Estas rutas están protegidas con JWT y roles `admin` o `vendedor`.

### Pagos

- Endpoints: `GET /pagos`, `GET /pagos/:id`, `POST /pagos`, `PUT /pagos/:id`, `DELETE /pagos/:id`
- Uso:
	- Registra y consulta los pagos asociados al flujo ecommerce.

### Cupones

- Endpoints: `GET /cupones`, `GET /cupones/:id`, `POST /cupones`, `PUT /cupones/:id`, `DELETE /cupones/:id`
- Endpoints adicionales: `GET /cupones/usos`, `GET /cupones/usos/:usoId`, `POST /cupones/usos`, `PUT /cupones/usos/:usoId`, `DELETE /cupones/usos/:usoId`, `GET /cupones/:id/productos`, `POST /cupones/:id/productos`, `DELETE /cupones/:id/productos/:productoId`
- Uso:
	- Permite administrar el cupón, sus usos y su alcance por producto.

### Lista de deseos

- Endpoints: `GET /lista-deseos`, `GET /lista-deseos/:id`, `POST /lista-deseos`, `PUT /lista-deseos/:id`, `DELETE /lista-deseos/:id`
- Uso:
	- Gestiona los productos guardados por el cliente para compra futura.

### Reseñas

- Endpoints: `GET /resenias`, `GET /resenias/:id`, `POST /resenias`, `PUT /resenias/:id`, `DELETE /resenias/:id`
- Uso:
	- Administra la opinión de clientes sobre productos o servicios.

### Notificaciones

- Endpoints: `GET /notificaciones`, `GET /notificaciones/:id`, `POST /notificaciones`, `PUT /notificaciones/:id`, `DELETE /notificaciones/:id`
- Uso:
	- Persistencia de notificaciones operativas y de ecommerce.

### Suscripciones

- Endpoints: `GET /suscripciones`, `GET /suscripciones/by-cliente`, `GET /suscripciones/:id`, `POST /suscripciones`, `PUT /suscripciones/:id`, `DELETE /suscripciones/:id`
- Uso:
	- Controla suscripciones asociadas a clientes y su trazabilidad.

## Reglas de negocio importantes

- Los listados no usan paginación ni filtros en el backend actual, salvo donde se indica explícitamente.
- Las rutas de gestión están protegidas con JWT y roles, salvo `configuracion`.
- En autenticación de staff y creación de usuarios, los passwords se guardan con bcrypt.
- Los campos calculados o validados por fórmula deben respetar el contrato:
	- ventas: `Tot_Ven = Sub_Tot_Ven - Des_Tot_Ven + Imp_Tot_Ven`
	- compras: `Tot_Com = Sub_Tot_Com + Imp_Tot_Com`
	- detalle ventas: `Sub_Tot_Dve = Can_Dve * (Pre_Uni_Dve - Des_Uni_Dve)`
	- detalle compras: `Sub_Tot_Dco = Can_Dco * Pre_Uni_Dco`
	- tareas: `Pro_Tar` y `Est_Tar` deben ser coherentes
	- renovaciones: `Pre_Ren = Pre_Ori_Ren - Des_Ren`
	- calendario: los eventos se derivan de `Fec_Lim_Tar` y `Fec_Fin_Dve`

## Archivos, blobs y JSON

- `Log_Con` en configuración: enviar como ruta o string plano en JSON.
- `Ima_Prd` en productos: enviar como ruta o string plano en JSON.
- `Com_Gas` en gastos: enviar como ruta o string plano en JSON.
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
