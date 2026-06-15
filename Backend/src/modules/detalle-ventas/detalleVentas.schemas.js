const estados = ['activo', 'vencido', 'cancelado', 'renovado'];

const allowedFields = [
  'Id_Ven',
  'Id_Prd',
  'Id_Var',
  'Id_Cue',
  'Id_Key',
  'Cor_Cue',
  'Con_Cue',
  'Can_Dve',
  'Pre_Uni_Dve',
  'Des_Uni_Dve',
  'Fec_Ini_Dve',
  'Fec_Fin_Dve',
  'Not_Dve',
  'Est_Dve'
];

module.exports = {
  estados,
  allowedFields
};
