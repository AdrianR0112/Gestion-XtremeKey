const estados = ['activa', 'suspendida', 'cancelada', 'expirada'];

const allowedFields = [
  'Id_Cli',
  'Id_Prd',
  'Id_Var',
  'Fec_Ini_Sus',
  'Fec_Fin_Sus',
  'Est_Sus',
  'Ren_Auto',
  'Not_Sus',
];

module.exports = {
  estados,
  allowedFields,
};
