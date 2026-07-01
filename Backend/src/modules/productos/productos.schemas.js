const tiposProducto = ['servicio', 'producto', 'suscripcion'];
const estados = ['activo', 'inactivo', 'agotado'];
const estadosTienda = ['borrador', 'activo', 'archivado'];

const allowedFields = [
  'Cod_Prd',
  'Nom_Prd',
  'Slug_Prd',
  'Des_Prd',
  'Des_Cor_Prd',
  'Precio_Venta',
  'Precio_Regular',
  'Id_Cat',
  'Tip_Prd',
  'Ima_Prd',
  'Est_Prd',
  'Estado_Tienda',
  'Es_Destacado',
  'Meta_Titulo',
  'Meta_Descripcion'
];

module.exports = {
  tiposProducto,
  estados,
  estadosTienda,
  allowedFields
};
