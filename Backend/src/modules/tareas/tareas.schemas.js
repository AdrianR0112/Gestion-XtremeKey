const prioridadesTarea = ['baja', 'media', 'alta', 'urgente'];
const estadosTarea = ['pendiente', 'en_progreso', 'completada', 'cancelada'];

const allowedFields = [
  'Tit_Tar',
  'Des_Tar',
  'Id_Cli',
  'Id_Ven',
  'Fec_Lim_Tar',
  'Pri_Tar',
  'Pro_Tar',
  'Est_Tar',
  'Fec_Com_Tar'
];

module.exports = {
  prioridadesTarea,
  estadosTarea,
  allowedFields
};
