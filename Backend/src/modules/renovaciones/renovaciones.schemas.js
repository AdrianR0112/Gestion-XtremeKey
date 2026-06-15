const tiposRenovacion = ['automatica', 'manual', 'anticipada'];
const estadosRenovacion = ['pendiente', 'completada', 'rechazada', 'expirada'];

const allowedFields = [
  'Id_Dve_Ori',
  'Id_Dve_Nue',
  'Id_Cli',
  'Id_Prd',
  'Id_Var',
  'Fec_Ven_Ant_Ren',
  'Fec_Ini_Nue_Ren',
  'Fec_Fin_Nue_Ren',
  'Pre_Ori_Ren',
  'Pre_Ren',
  'Des_Ren',
  'Tip_Ren',
  'Est_Ren',
  'Not_Ren'
];

module.exports = {
  tiposRenovacion,
  estadosRenovacion,
  allowedFields
};
