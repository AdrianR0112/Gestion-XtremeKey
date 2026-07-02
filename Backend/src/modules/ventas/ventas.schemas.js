const estados = ['pendiente', 'completada', 'cancelada', 'reembolsada'];
const origenes = ['ecommerce', 'whatsapp', 'manual'];

const allowedFields = [
  'Id_Cli',
  'Id_Rev',
  'Auth_User_Id',
  'Origen_Ven',
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
  origenes,
  allowedFields
};
