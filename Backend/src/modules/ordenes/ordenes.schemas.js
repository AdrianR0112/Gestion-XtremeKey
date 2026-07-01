const estadosOrden = ['pendiente', 'pagada', 'completada', 'cancelada', 'reembolsada'];
const estadosPago = ['pendiente', 'pagado', 'fallido', 'reembolsado', 'parcial'];
const estadosItem = ['pendiente', 'entregado', 'cancelado'];

const orderAllowedFields = [
  'Numero_Ord',
  'Id_Cli',
  'Email_Invitado',
  'Estado_Ord',
  'Estado_Pago',
  'Moneda',
  'Subtotal',
  'Descuento',
  'Total',
  'Id_Cupon',
  'Codigo_Cupon',
  'Notas_Cliente',
  'Notas_Internas',
  'Metadatos'
];

const itemAllowedFields = [
  'Id_Prd',
  'Id_Var',
  'Id_Key',
  'Id_Cue',
  'Nombre_Prd',
  'Nombre_Var',
  'Precio_Unitario',
  'Cantidad',
  'Precio_Total',
  'Descuento_Item',
  'Clave_Licencia',
  'Correo_Asociado',
  'Contrasena_Asociada',
  'Fec_Ini_Licencia',
  'Fec_Fin_Licencia',
  'Estado_Item'
];

module.exports = {
  estadosOrden,
  estadosPago,
  estadosItem,
  orderAllowedFields,
  itemAllowedFields,
};
