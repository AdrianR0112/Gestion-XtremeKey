const tiposProveedor = ['persona', 'empresa', 'plataforma', 'tienda_web', 'otro'];
const mediosContacto = ['whatsapp', 'telegram', 'web', 'email', 'telefono'];
const estados = ['activo', 'inactivo', 'suspendido'];

const allowedFields = [
  'Nom_Pro',
  'Tip_Pro',
  'Con_Pri_Pro',
  'Tel_Pro',
  'Wha_Pro',
  'Ema_Pro',
  'Tel_Gram_Pro',
  'Web_Pro',
  'Pai_Pro',
  'Med_Con_Pro',
  'Con_Com_Pro',
  'Cal_Pro',
  'Not_Pro',
  'Est_Pro'
];

module.exports = {
  tiposProveedor,
  mediosContacto,
  estados,
  allowedFields
};
