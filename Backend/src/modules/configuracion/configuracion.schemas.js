const requiredCreateFields = ['Nom_Emp_Con'];

const allowedFields = [
  'Nom_Emp_Con',
  'Dir_Con',
  'Tel_Con',
  'Ema_Con',
  'Log_Con',
  'Mon_Con',
  'Zon_Hor_Con',
  'Imp_Con',
  'Hab_Imp_Con',
  'Dia_Gra_Ren_Con',
  'Dia_Arc_Ven_Con'
];

// Gracia maxima al renovar: mas de un anio de retraso ya no es "renovar tarde",
// es una suscripcion nueva.
const MAX_DIAS_GRACIA_RENOVACION = 365;
const DEFAULT_DIAS_GRACIA_RENOVACION = 30;

// Dias que una vencida sigue en el listado principal antes de pasar al archivo.
const MAX_DIAS_ARCHIVO_VENCIDA = 365;
const DEFAULT_DIAS_ARCHIVO_VENCIDA = 5;

module.exports = {
  requiredCreateFields,
  allowedFields,
  MAX_DIAS_GRACIA_RENOVACION,
  DEFAULT_DIAS_GRACIA_RENOVACION,
  MAX_DIAS_ARCHIVO_VENCIDA,
  DEFAULT_DIAS_ARCHIVO_VENCIDA,
};
