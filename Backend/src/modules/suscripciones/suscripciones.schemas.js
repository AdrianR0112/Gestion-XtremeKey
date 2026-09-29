const estados = ['activa', 'suspendida', 'cancelada', 'expirada'];

const allowedFields = [
  'Id_Cli',
  'Id_Rev',
  'Id_Prd',
  'Id_Var',
  // Correo del cliente final: la identidad real de la suscripcion cuando el
  // titular es un revendedor.
  'Cor_Cue_Sus',
  'Fec_Ini_Sus',
  'Fec_Fin_Sus',
  'Est_Sus',
  'Ren_Auto',
  'Not_Sus',
];

module.exports = {
  estados,
  allowedFields,
};
