const roles = ['admin', 'vendedor'];
const estados = ['activo', 'inactivo', 'bloqueado'];

const createAllowedFields = [
  'Nom_Usu',
  'Ape_Usu',
  'Ema_Usu',
  'Pas_Usu',
  'Tel_Usu',
  'Rol_Usu'
];

const publicUserColumns = [
  'Id_Usu',
  'Nom_Usu',
  'Ape_Usu',
  'Ema_Usu',
  'Tel_Usu',
  'Rol_Usu',
  'Est_Usu',
  'Ult_Acc_Usu',
  'Fec_Cre',
  'Fec_Mod'
];

module.exports = {
  roles,
  estados,
  createAllowedFields,
  publicUserColumns
};
