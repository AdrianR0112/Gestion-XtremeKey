const { Router } = require('express');

const { router: authRoutes } = require('./auth.routes');
const { router: configuracionRoutes } = require('./configuracion.routes');
const { router: usuariosRoutes } = require('./usuarios.routes');
const { router: clientesRoutes } = require('./clientes.routes');
const { router: proveedoresRoutes } = require('./proveedores.routes');
const { router: categoriasRoutes } = require('./categorias.routes');
const { router: productosRoutes } = require('./productos.routes');
const { router: variantesRoutes } = require('./variantes.routes');
const { router: proveedoresProductosRoutes } = require('./proveedoresProductos.routes');
const { router: cuentasRoutes } = require('./cuentas.routes');
const { router: keysRoutes } = require('./keys.routes');
const { router: ventasRoutes } = require('./ventas.routes');
const { router: detalleVentasRoutes } = require('./detalleVentas.routes');
const { router: comprasRoutes } = require('./compras.routes');
const { router: detalleComprasRoutes } = require('./detalleCompras.routes');
const { router: gastosRoutes } = require('./gastos.routes');
const { router: renovacionesRoutes } = require('./renovaciones.routes');
const { router: revendedoresRoutes } = require('./revendedores.routes');
const { router: tareasRoutes } = require('./tareas.routes');
const { router: calendarioRoutes } = require('./calendario.routes');
const { router: dashboardRoutes } = require('./dashboard.routes');
const { router: plantillasRoutes } = require('./plantillas.routes');
const { router: jobsRoutes } = require('./jobs.routes');

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ ok: true, message: 'API v1 ready' });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/configuracion', configuracionRoutes);
apiRouter.use('/usuarios', usuariosRoutes);
apiRouter.use('/clientes', clientesRoutes);
apiRouter.use('/proveedores', proveedoresRoutes);
apiRouter.use('/categorias', categoriasRoutes);
apiRouter.use('/productos', productosRoutes);
apiRouter.use('/variantes', variantesRoutes);
apiRouter.use('/proveedores-productos', proveedoresProductosRoutes);
apiRouter.use('/cuentas', cuentasRoutes);
apiRouter.use('/keys', keysRoutes);
apiRouter.use('/ventas', ventasRoutes);
apiRouter.use('/detalle-ventas', detalleVentasRoutes);
apiRouter.use('/compras', comprasRoutes);
apiRouter.use('/detalle-compras', detalleComprasRoutes);
apiRouter.use('/gastos', gastosRoutes);
apiRouter.use('/renovaciones', renovacionesRoutes);
apiRouter.use('/revendedores', revendedoresRoutes);
apiRouter.use('/tareas', tareasRoutes);
apiRouter.use('/calendario', calendarioRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/plantillas', plantillasRoutes);
apiRouter.use('/jobs', jobsRoutes);

module.exports = { apiRouter };
