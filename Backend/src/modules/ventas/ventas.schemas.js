const estados = ['pendiente', 'completada', 'cancelada', 'reembolsada'];

const allowedFields = [
  'Id_Cli',
  'Id_Rev',
  'Fec_Ven',
  'Des_Tot_Ven',
  'Imp_Tot_Ven',
  'Tot_Ven',
  'Met_Pag_Ven',
  'Not_Ven',
  'Est_Ven'
];

module.exports = {
  estados,
  allowedFields
};
