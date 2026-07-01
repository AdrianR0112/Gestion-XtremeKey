export const queryKeys = {
  auth: {
    me: () => ["auth", "me"],
  },
  configuracion: {
    list: () => ["configuracion", "list"],
    current: () => ["configuracion", "current"],
  },
  usuarios: {
    list: () => ["usuarios", "list"],
  },
  clientes: {
    list: () => ["clientes", "list"],
  },
  revendedores: {
    list: () => ["revendedores", "list"],
  },
  proveedores: {
    list: () => ["proveedores", "list"],
  },
  categorias: {
    list: () => ["categorias", "list"],
  },
  productos: {
    list: () => ["productos", "list"],
  },
  variantes: {
    list: () => ["variantes", "list"],
  },
  proveedoresProductos: {
    list: () => ["proveedores-productos", "list"],
  },
  cuentas: {
    list: () => ["cuentas", "list"],
  },
  keys: {
    list: () => ["keys", "list"],
  },
  ventas: {
    list: () => ["ventas", "list"],
  },
  detalleVentas: {
    list: () => ["detalle-ventas", "list"],
  },
  compras: {
    list: () => ["compras", "list"],
  },
  detalleCompras: {
    list: () => ["detalle-compras", "list"],
  },
  gastos: {
    list: () => ["gastos", "list"],
  },
  renovaciones: {
    list: () => ["renovaciones", "list"],
  },
  tareas: {
    list: () => ["tareas", "list"],
  },
  dashboard: {
    resumen: () => ["dashboard", "resumen"],
  },
  calendario: {
    list: (params = {}) => ["calendario", "list", params.startDate || "", params.endDate || ""],
  },
  plantillas: {
    list: () => ["plantillas", "list"],
  },
};

export default queryKeys;
