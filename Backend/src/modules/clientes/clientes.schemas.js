const categorias = ['nuevo', 'ocasional', 'frecuente', 'vip'];
const preferenciasContacto = ['whatsapp', 'email', 'instagram', 'messenger', 'telegram'];
const estados = ['activo', 'inactivo', 'suspendido'];

const allowedFields = [
  'Nom_Cli',
  'Ape_Cli',
  'Tel_Cli',
  'Ema_Cli',
  'Pai_Cli',
  'Doc_Cli',
  'Cat_Cli',
  'Pre_Con_Cli',
  'Ace_Not_Tel_Cli',
  'Ace_Not_Cor_Cli',
  'Not_Cli',
  'Est_Cli'
];

module.exports = {
  categorias,
  preferenciasContacto,
  estados,
  allowedFields
};
