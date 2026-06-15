const tiposPlantilla = ['bienvenida', 'venta', 'renovacion', 'vencimiento', 'recordatorio', 'personalizado'];
const canalesPlantilla = ['whatsapp', 'email', 'sms', 'push'];
const estadosPlantilla = ['activo', 'inactivo'];

const allowedFields = [
  'Nom_Pla',
  'Tip_Pla',
  'Can_Pla',
  'Asu_Pla',
  'Cue_Pla',
  'Var_Pla',
  'Est_Pla'
];

module.exports = {
  tiposPlantilla,
  canalesPlantilla,
  estadosPlantilla,
  allowedFields
};
