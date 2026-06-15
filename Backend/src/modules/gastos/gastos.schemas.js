const categoriasGasto = ['operativo', 'administrativo', 'marketing', 'proveedor', 'impuesto', 'otro'];
const estadosGasto = ['registrado', 'pagado', 'cancelado'];

const allowedFields = [
  'Nom_Gas',
  'Des_Gas',
  'Cat_Gas',
  'Mon_Gas',
  'Fec_Gas',
  'Id_Pro',
  'Id_Com',
  'Com_Gas',
  'Est_Gas'
];

module.exports = {
  categoriasGasto,
  estadosGasto,
  allowedFields
};
