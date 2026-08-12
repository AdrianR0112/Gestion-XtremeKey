const tiposPlantilla = [
  'bienvenida',
  'venta',
  'renovacion',
  'vencimiento',
  // Los revendedores reciben el aviso de la cuenta de SU cliente final, asi que
  // llevan su propia redaccion con {{cuenta}}.
  'vencimiento_revendedor',
  'recordatorio',
  'personalizado'
];
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
