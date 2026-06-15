const estados = ['disponible', 'vendida', 'reservada', 'vencida', 'cancelada'];

const allowedFields = [
  'Id_Prd',
  'Id_Var',
  'Id_Pro',
  'Cla_Key',
  'Des_Key',
  'Fec_Com_Key',
  'Fec_Ven_Key',
  'Cos_Key',
  'Pre_Ven_Key',
  'Es_Per_Vid_Key',
  'Est_Key',
  'Not_Key'
];

module.exports = {
  estados,
  allowedFields
};
