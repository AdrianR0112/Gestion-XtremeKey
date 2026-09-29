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
  categorias: {
    list: () => ["categorias", "list"],
  },
  productos: {
    list: () => ["productos", "list"],
  },
  variantes: {
    list: () => ["variantes", "list"],
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
  renovaciones: {
    list: () => ["renovaciones", "list"],
  },
  suscripciones: {
    list: (params = {}) => [
      "suscripciones",
      "list",
      params.estado || "",
      params.titular || "",
      params.vencimiento || "",
      params.dias ?? "",
    ],
    resumen: (params = {}) => ["suscripciones", "resumen", params.dias ?? ""],
    historial: (id) => ["suscripciones", "historial", id ?? ""],
  },
  tareas: {
    list: () => ["tareas", "list"],
  },
  dashboard: {
    resumen: (params = {}) => ["dashboard", "resumen", params.periodo || "mes", params.ancla ?? 0],
  },
  calendario: {
    list: (params = {}) => ["calendario", "list", params.startDate || "", params.endDate || ""],
  },
  plantillas: {
    list: () => ["plantillas", "list"],
  },
  push: {
    subscriptions: () => ["push", "subscriptions"],
  },
  recordatorios: {
    list: () => ["recordatorios", "list"],
  },
};

export default queryKeys;
