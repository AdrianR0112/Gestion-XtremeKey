export const endpoints = {
    auth: {
        login: "/staff-auth/login",
        register: "/staff",
        me: "/staff-auth/session",
        changePassword: "/staff-auth/change-password",
        logout: "/staff-auth/logout",
    },
    configuracion: "/configuracion",
    usuarios: "/staff",
    clientes: "/clientes",
    revendedores: "/revendedores",
    categorias: "/categorias",
    productos: "/productos",
    variantes: "/variantes",
    cuentas: "/cuentas",
    keys: "/keys",
    ventas: "/ventas",
    detalleVentas: "/detalle-ventas",
    renovaciones: "/renovaciones",
    suscripciones: "/suscripciones",
    tareas: "/tareas",
    calendario: "/calendario",
    dashboard: "/dashboard",
    plantillas: "/plantillas",
};

export default endpoints;
