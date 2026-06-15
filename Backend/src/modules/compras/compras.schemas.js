const estados = ['pendiente', 'completada', 'cancelada'];

const allowedFields = [
  'Id_Pro',
  'Fec_Com',
  'Sub_Tot_Com',
  'Imp_Tot_Com',
  'Tot_Com',
  'Met_Pag_Com',
  'Not_Com',
  'Est_Com'
];

module.exports = {
  estados,
  allowedFields
};
