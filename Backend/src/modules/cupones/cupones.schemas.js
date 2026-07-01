const tiposCupon = ['porcentaje', 'fijo'];
const estadosCupon = ['activo', 'inactivo', 'expirado', 'programado'];
const aplicaA = ['todos', 'productos_especificos', 'categorias_especificas'];

const couponAllowedFields = [
  'Codigo_Cup',
  'Descripcion_Cup',
  'Tipo_Cup',
  'Monto_Descuento',
  'Minimo_Carrito',
  'Maximo_Descuento',
  'Fecha_Desde',
  'Fecha_Hasta',
  'Limite_Uso',
  'Limite_Uso_Por_Usuario',
  'Veces_Usado',
  'Esta_Activo',
  'Estado_Cup',
  'Aplica_A'
];

const usageAllowedFields = [
  'Id_Cup',
  'Id_Cli',
  'Id_Ord',
  'Descuento_Aplicado',
  'Usado_En'
];

module.exports = {
  tiposCupon,
  estadosCupon,
  aplicaA,
  couponAllowedFields,
  usageAllowedFields,
};
