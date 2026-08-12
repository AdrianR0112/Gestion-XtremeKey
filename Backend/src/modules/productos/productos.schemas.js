const tiposProducto = ['servicio', 'producto', 'suscripcion'];
const estados = ['activo', 'inactivo', 'agotado'];

const allowedFields = [
  'Cod_Prd',
  'Nom_Prd',
  'Des_Prd',
  'Des_Cor_Prd',
  'Id_Cat',
  'Tip_Prd',
  'Ima_Prd',
  'Est_Prd'
];

module.exports = {
  tiposProducto,
  estados,
  allowedFields
};
