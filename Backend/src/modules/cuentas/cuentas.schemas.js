const estados = ['disponible', 'ocupada', 'parcial', 'vencida', 'suspendida'];

const allowedFields = [
  'Id_Prd',
  'Id_Var',
  'Id_Pro',
  'Nom_Cue',
  'Usu_Cue',
  'Pas_Cue',
  'Pin_Cue',
  'Per_Cue',
  'Tot_Per_Cue',
  'Per_Dis_Cue',
  'Fec_Com_Cue',
  'Fec_Ven_Cue',
  'Cos_Cue',
  'Not_Cue',
  'Est_Cue'
];

module.exports = {
  estados,
  allowedFields
};
