const estados = ['activo', 'inactivo', 'bloqueado'];

const createAllowedFields = [
  'Nom_Staff',
  'Ape_Staff',
  'Ema_Staff',
  'Pas_Staff',
  'Tel_Staff',
  'Est_Staff',
];

const updateAllowedFields = [
  'Nom_Staff',
  'Ape_Staff',
  'Ema_Staff',
  'Pas_Staff',
  'Tel_Staff',
  'Est_Staff',
];

const publicStaffColumns = [];

module.exports = {
  estados,
  createAllowedFields,
  updateAllowedFields,
  publicStaffColumns,
};
