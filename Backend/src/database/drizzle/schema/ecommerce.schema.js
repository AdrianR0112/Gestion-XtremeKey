const { sql } = require('drizzle-orm');
const {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  decimal,
  mysqlEnum,
  tinyint,
  json,
  primaryKey,
  index,
  uniqueIndex,
} = require('drizzle-orm/mysql-core');

const categoriasProductos = mysqlTable('categorias_productos', {
  Id_Cat: int('Id_Cat').autoincrement().primaryKey(),
});

const clientes = mysqlTable('clientes', {
  Id_Cli: int('Id_Cli').autoincrement().primaryKey(),
  Nom_Cli: varchar('Nom_Cli', { length: 100 }),
  Ape_Cli: varchar('Ape_Cli', { length: 100 }),
  Tel_Cli: varchar('Tel_Cli', { length: 20 }).notNull(),
  Ema_Cli: varchar('Ema_Cli', { length: 100 }),
  Password_Hash: varchar('Password_Hash', { length: 255 }),
  Email_Verificado: tinyint('Email_Verificado').notNull().default(0),
  Token_Verificacion: varchar('Token_Verificacion', { length: 255 }),
  Fec_Ultimo_Acceso: datetime('Fec_Ultimo_Acceso'),
  Usu_Tel_Cli: varchar('Usu_Tel_Cli', { length: 100 }),
  Pai_Cli: varchar('Pai_Cli', { length: 100 }).default('Ecuador'),
  Doc_Cli: varchar('Doc_Cli', { length: 50 }),
  Cat_Cli: mysqlEnum('Cat_Cli', ['nuevo', 'ocasional', 'frecuente', 'vip']).default('nuevo'),
  Pre_Con_Cli: mysqlEnum('Pre_Con_Cli', ['whatsapp', 'email', 'instagram', 'messenger', 'telegram']).default('whatsapp'),
  Ace_Not_Tel_Cli: tinyint('Ace_Not_Tel_Cli').default(1),
  Ace_Not_Cor_Cli: tinyint('Ace_Not_Cor_Cli').default(1),
  Not_Cli: text('Not_Cli'),
  Est_Cli: mysqlEnum('Est_Cli', ['activo', 'inactivo', 'suspendido']).default('activo'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  ukTelCli: uniqueIndex('uk_tel_cli').on(table.Tel_Cli),
  idxNomCli: index('idx_nom_cli').on(table.Nom_Cli, table.Ape_Cli),
  idxTelCli: index('idx_tel_cli').on(table.Tel_Cli),
  idxEmaCli: index('idx_ema_cli').on(table.Ema_Cli),
}));

const productos = mysqlTable('productos', {
  Id_Prd: int('Id_Prd').autoincrement().primaryKey(),
  Cod_Prd: varchar('Cod_Prd', { length: 50 }),
  Nom_Prd: varchar('Nom_Prd', { length: 150 }).notNull(),
  Slug_Prd: varchar('Slug_Prd', { length: 200 }),
  Des_Prd: text('Des_Prd'),
  Des_Cor_Prd: varchar('Des_Cor_Prd', { length: 255 }),
  Precio_Venta: decimal('Precio_Venta', { precision: 10, scale: 2 }),
  Precio_Regular: decimal('Precio_Regular', { precision: 10, scale: 2 }),
  Id_Cat: int('Id_Cat').references(() => categoriasProductos.Id_Cat, { onDelete: 'set null' }),
  Tip_Prd: mysqlEnum('Tip_Prd', ['servicio', 'producto', 'suscripcion']).default('producto'),
  Ima_Prd: varchar('Ima_Prd', { length: 255 }),
  Est_Prd: mysqlEnum('Est_Prd', ['activo', 'inactivo', 'agotado']).default('activo'),
  Estado_Tienda: mysqlEnum('Estado_Tienda', ['borrador', 'activo', 'archivado']).default('activo'),
  Es_Destacado: tinyint('Es_Destacado').notNull().default(0),
  Meta_Titulo: varchar('Meta_Titulo', { length: 200 }),
  Meta_Descripcion: text('Meta_Descripcion'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  ukCodPrd: uniqueIndex('Cod_Prd').on(table.Cod_Prd),
  ukSlugPrd: uniqueIndex('uk_slug_prd').on(table.Slug_Prd),
  idxIdCat: index('Id_Cat').on(table.Id_Cat),
  idxNomPrd: index('idx_nom_prd').on(table.Nom_Prd),
  idxEstPrd: index('idx_est_prd').on(table.Est_Prd),
  idxEstadoTiendaPrd: index('idx_estado_tienda_prd').on(table.Estado_Tienda),
}));

const variantesProductos = mysqlTable('variantes_productos', {
  Id_Var: int('Id_Var').autoincrement().primaryKey(),
  Id_Prd: int('Id_Prd').notNull().references(() => productos.Id_Prd, { onDelete: 'cascade' }),
});

const keysProductos = mysqlTable('keys_productos', {
  Id_Key: int('Id_Key').autoincrement().primaryKey(),
});

const cuentas = mysqlTable('cuentas', {
  Id_Cue: int('Id_Cue').autoincrement().primaryKey(),
});

const carritoSesiones = mysqlTable('carrito_sesiones', {
  Id_Car_Ses: varchar('Id_Car_Ses', { length: 64 }).primaryKey(),
  Id_Cli: int('Id_Cli').references(() => clientes.Id_Cli, { onDelete: 'set null' }),
  Id_Sesion_Tmp: varchar('Id_Sesion_Tmp', { length: 64 }),
  Expira_En: datetime('Expira_En'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idxCarritoCliente: index('idx_carrito_cliente').on(table.Id_Cli),
  idxCarritoSesionTmp: index('idx_carrito_sesion_tmp').on(table.Id_Sesion_Tmp),
}));

const carritoItems = mysqlTable('carrito_items', {
  Id_Car_Item: int('Id_Car_Item').autoincrement().primaryKey(),
  Id_Car_Ses: varchar('Id_Car_Ses', { length: 64 }).notNull().references(() => carritoSesiones.Id_Car_Ses, { onDelete: 'cascade' }),
  Id_Prd: int('Id_Prd').notNull().references(() => productos.Id_Prd),
  Id_Var: int('Id_Var').references(() => variantesProductos.Id_Var),
  Cantidad: int('Cantidad').default(1),
  Fec_Agregado: datetime('Fec_Agregado').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idxCarritoItemSesion: index('idx_carrito_item_sesion').on(table.Id_Car_Ses),
  idxCarritoItemProducto: index('idx_carrito_item_producto').on(table.Id_Prd),
  idxCarritoItemVariante: index('idx_carrito_item_variante').on(table.Id_Var),
}));

const cupones = mysqlTable('cupones', {
  Id_Cup: int('Id_Cup').autoincrement().primaryKey(),
  Codigo_Cup: varchar('Codigo_Cup', { length: 50 }).notNull(),
  Descripcion_Cup: text('Descripcion_Cup'),
  Tipo_Cup: mysqlEnum('Tipo_Cup', ['porcentaje', 'fijo']).default('porcentaje'),
  Monto_Descuento: decimal('Monto_Descuento', { precision: 10, scale: 2 }).default('0.00'),
  Minimo_Carrito: decimal('Minimo_Carrito', { precision: 10, scale: 2 }).default('0.00'),
  Maximo_Descuento: decimal('Maximo_Descuento', { precision: 10, scale: 2 }),
  Fecha_Desde: datetime('Fecha_Desde').notNull(),
  Fecha_Hasta: datetime('Fecha_Hasta').notNull(),
  Limite_Uso: int('Limite_Uso'),
  Limite_Uso_Por_Usuario: int('Limite_Uso_Por_Usuario').default(1),
  Veces_Usado: int('Veces_Usado').default(0),
  Esta_Activo: tinyint('Esta_Activo').default(1),
  Estado_Cup: mysqlEnum('Estado_Cup', ['activo', 'inactivo', 'expirado', 'programado']).default('activo'),
  Aplica_A: mysqlEnum('Aplica_A', ['todos', 'productos_especificos', 'categorias_especificas']).default('todos'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  ukCodigoCup: uniqueIndex('Codigo_Cup').on(table.Codigo_Cup),
}));

const ordenes = mysqlTable('ordenes', {
  Id_Ord: int('Id_Ord').autoincrement().primaryKey(),
  Numero_Ord: varchar('Numero_Ord', { length: 50 }).notNull(),
  Id_Cli: int('Id_Cli').references(() => clientes.Id_Cli, { onDelete: 'set null' }),
  Email_Invitado: varchar('Email_Invitado', { length: 150 }),
  Estado_Ord: mysqlEnum('Estado_Ord', ['pendiente', 'pagada', 'completada', 'cancelada', 'reembolsada']).default('pendiente'),
  Estado_Pago: mysqlEnum('Estado_Pago', ['pendiente', 'pagado', 'fallido', 'reembolsado', 'parcial']).default('pendiente'),
  Moneda: varchar('Moneda', { length: 10 }).default('USD'),
  Subtotal: decimal('Subtotal', { precision: 10, scale: 2 }).notNull(),
  Descuento: decimal('Descuento', { precision: 10, scale: 2 }).default('0.00'),
  Total: decimal('Total', { precision: 10, scale: 2 }).notNull(),
  Id_Cupon: int('Id_Cupon'),
  Codigo_Cupon: varchar('Codigo_Cupon', { length: 50 }),
  Notas_Cliente: text('Notas_Cliente'),
  Notas_Internas: text('Notas_Internas'),
  Metadatos: json('Metadatos'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  ukNumeroOrd: uniqueIndex('Numero_Ord').on(table.Numero_Ord),
  idxOrdenCliente: index('idx_orden_cliente').on(table.Id_Cli),
}));

const itemsOrden = mysqlTable('items_orden', {
  Id_Item_Ord: int('Id_Item_Ord').autoincrement().primaryKey(),
  Id_Ord: int('Id_Ord').notNull().references(() => ordenes.Id_Ord, { onDelete: 'cascade' }),
  Id_Prd: int('Id_Prd').notNull().references(() => productos.Id_Prd),
  Id_Var: int('Id_Var').references(() => variantesProductos.Id_Var),
  Id_Key: int('Id_Key').references(() => keysProductos.Id_Key, { onDelete: 'set null' }),
  Id_Cue: int('Id_Cue').references(() => cuentas.Id_Cue, { onDelete: 'set null' }),
  Nombre_Prd: varchar('Nombre_Prd', { length: 150 }).notNull(),
  Nombre_Var: varchar('Nombre_Var', { length: 100 }),
  Precio_Unitario: decimal('Precio_Unitario', { precision: 10, scale: 2 }).notNull(),
  Cantidad: int('Cantidad').default(1),
  Precio_Total: decimal('Precio_Total', { precision: 10, scale: 2 }).notNull(),
  Descuento_Item: decimal('Descuento_Item', { precision: 10, scale: 2 }).default('0.00'),
  Clave_Licencia: text('Clave_Licencia'),
  Correo_Asociado: varchar('Correo_Asociado', { length: 150 }),
  Contrasena_Asociada: varchar('Contrasena_Asociada', { length: 255 }),
  Fec_Ini_Licencia: datetime('Fec_Ini_Licencia'),
  Fec_Fin_Licencia: datetime('Fec_Fin_Licencia'),
  Estado_Item: mysqlEnum('Estado_Item', ['pendiente', 'entregado', 'cancelado']).default('pendiente'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idxItemOrden: index('idx_item_orden').on(table.Id_Ord),
  idxItemProducto: index('idx_item_producto').on(table.Id_Prd),
  idxItemVariante: index('idx_item_variante').on(table.Id_Var),
  idxItemKey: index('idx_item_key').on(table.Id_Key),
  idxItemCuenta: index('idx_item_cuenta').on(table.Id_Cue),
}));

const pagos = mysqlTable('pagos', {
  Id_Pag: int('Id_Pag').autoincrement().primaryKey(),
  Id_Ord: int('Id_Ord').notNull().references(() => ordenes.Id_Ord),
  Metodo_Pago: mysqlEnum('Metodo_Pago', ['tarjeta', 'paypal', 'cripto', 'transferencia']).notNull(),
  Proveedor_Pago: varchar('Proveedor_Pago', { length: 50 }).default('stripe'),
  Monto: decimal('Monto', { precision: 10, scale: 2 }).notNull(),
  Moneda: varchar('Moneda', { length: 10 }).default('USD'),
  Estado_Pago_Prov: varchar('Estado_Pago_Prov', { length: 50 }).default('pendiente'),
  Id_Transaccion: varchar('Id_Transaccion', { length: 255 }),
  Stripe_PaymentIntent_Id: varchar('Stripe_PaymentIntent_Id', { length: 255 }),
  Metadatos: json('Metadatos'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idxPagoOrden: index('idx_pago_orden').on(table.Id_Ord),
}));

const cuponesProductos = mysqlTable('cupones_productos', {
  Id_Cup: int('Id_Cup').notNull().references(() => cupones.Id_Cup, { onDelete: 'cascade' }),
  Id_Prd: int('Id_Prd').notNull().references(() => productos.Id_Prd, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.Id_Cup, table.Id_Prd] }),
  idxProducto: index('idx_cupones_productos_producto').on(table.Id_Prd),
}));

const usoCupones = mysqlTable('uso_cupones', {
  Id_Uso: int('Id_Uso').autoincrement().primaryKey(),
  Id_Cup: int('Id_Cup').notNull().references(() => cupones.Id_Cup),
  Id_Cli: int('Id_Cli').notNull().references(() => clientes.Id_Cli),
  Id_Ord: int('Id_Ord').references(() => ordenes.Id_Ord),
  Descuento_Aplicado: decimal('Descuento_Aplicado', { precision: 10, scale: 2 }).default('0.00'),
  Usado_En: datetime('Usado_En').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idxUsoCupon: index('idx_uso_cupon').on(table.Id_Cup),
  idxUsoCliente: index('idx_uso_cliente').on(table.Id_Cli),
  idxUsoOrden: index('idx_uso_orden').on(table.Id_Ord),
}));

const resenias = mysqlTable('resenias', {
  Id_Res: int('Id_Res').autoincrement().primaryKey(),
  Id_Cli: int('Id_Cli').notNull().references(() => clientes.Id_Cli),
  Id_Prd: int('Id_Prd').notNull().references(() => productos.Id_Prd),
  Id_Ord: int('Id_Ord').notNull().references(() => ordenes.Id_Ord),
  Id_Item_Ord: int('Id_Item_Ord').notNull().references(() => itemsOrden.Id_Item_Ord),
  Calificacion: tinyint('Calificacion').notNull(),
  Titulo_Res: varchar('Titulo_Res', { length: 200 }).notNull(),
  Comentario_Res: text('Comentario_Res').notNull(),
  Estado_Res: mysqlEnum('Estado_Res', ['pendiente', 'aprobada', 'rechazada']).default('aprobada'),
  Votos_Utiles: int('Votos_Utiles').default(0),
  Es_Compra_Verificada: tinyint('Es_Compra_Verificada').default(1),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
  Fec_Mod: datetime('Fec_Mod').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idxReseniaCliente: index('idx_resenia_cliente').on(table.Id_Cli),
  idxReseniaProducto: index('idx_resenia_producto').on(table.Id_Prd),
  idxReseniaOrden: index('idx_resenia_orden').on(table.Id_Ord),
  idxReseniaItemOrden: index('idx_resenia_item_orden').on(table.Id_Item_Ord),
}));

const listaDeseos = mysqlTable('lista_deseos', {
  Id_Des: int('Id_Des').autoincrement().primaryKey(),
  Id_Cli: int('Id_Cli').notNull().references(() => clientes.Id_Cli, { onDelete: 'cascade' }),
  Id_Prd: int('Id_Prd').notNull().references(() => productos.Id_Prd, { onDelete: 'cascade' }),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  ukClienteProducto: uniqueIndex('uk_lista_deseos_cliente_producto').on(table.Id_Cli, table.Id_Prd),
  idxProducto: index('idx_lista_deseos_producto').on(table.Id_Prd),
}));

const notificaciones = mysqlTable('notificaciones', {
  Id_Not: int('Id_Not').autoincrement().primaryKey(),
  Tipo_Not: mysqlEnum('Tipo_Not', ['nuevo_pedido', 'pago', 'stock_bajo', 'sistema']).notNull(),
  Titulo_Not: varchar('Titulo_Not', { length: 200 }).notNull(),
  Mensaje_Not: text('Mensaje_Not').notNull(),
  Datos_Not: json('Datos_Not'),
  Leida: tinyint('Leida').default(0),
  Fecha_Lectura: datetime('Fecha_Lectura'),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
});

const imagenesProductos = mysqlTable('imagenes_productos', {
  Id_Ima: int('Id_Ima').autoincrement().primaryKey(),
  Id_Prd: int('Id_Prd').notNull().references(() => productos.Id_Prd, { onDelete: 'cascade' }),
  Url_Ima: varchar('Url_Ima', { length: 500 }).notNull(),
  Texto_Alt: varchar('Texto_Alt', { length: 255 }),
  Orden: int('Orden').default(0),
  Es_Primaria: tinyint('Es_Primaria').default(0),
  Fec_Cre: datetime('Fec_Cre').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idxImagenProducto: index('idx_imagen_producto').on(table.Id_Prd),
}));

module.exports = {
  categoriasProductos,
  clientes,
  productos,
  variantesProductos,
  keysProductos,
  cuentas,
  carritoSesiones,
  carritoItems,
  cupones,
  cuponesProductos,
  ordenes,
  itemsOrden,
  pagos,
  usoCupones,
  resenias,
  listaDeseos,
  notificaciones,
  imagenesProductos,
};
