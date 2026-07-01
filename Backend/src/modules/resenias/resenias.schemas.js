const estados = ['pendiente', 'aprobada', 'rechazada'];

const allowedFields = [
  'Id_Cli',
  'Id_Prd',
  'Id_Ord',
  'Id_Item_Ord',
  'Calificacion',
  'Titulo_Res',
  'Comentario_Res',
  'Estado_Res',
  'Votos_Utiles',
  'Es_Compra_Verificada'
];

module.exports = { estados, allowedFields };
