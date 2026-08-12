const { Router } = require('express');

const { router: staffAuthRoutes } = require('./staffAuth.routes');
const { router: configuracionRoutes } = require('./configuracion.routes');
const { router: staffRoutes } = require('./staff.routes');
const { router: clientesRoutes } = require('./clientes.routes');
const { router: categoriasRoutes } = require('./categorias.routes');
const { router: productosRoutes } = require('./productos.routes');
const { router: variantesRoutes } = require('./variantes.routes');
const { router: cuentasRoutes } = require('./cuentas.routes');
const { router: keysRoutes } = require('./keys.routes');
const { router: ventasRoutes } = require('./ventas.routes');
const { router: detalleVentasRoutes } = require('./detalleVentas.routes');
const { router: suscripcionesRoutes } = require('./suscripciones.routes');
const { router: renovacionesRoutes } = require('./renovaciones.routes');
const { router: revendedoresRoutes } = require('./revendedores.routes');
const { router: tareasRoutes } = require('./tareas.routes');
const { router: calendarioRoutes } = require('./calendario.routes');
const { router: dashboardRoutes } = require('./dashboard.routes');
const { router: plantillasRoutes } = require('./plantillas.routes');
const { router: jobsRoutes } = require('./jobs.routes');
const { router: telegramRoutes } = require('./telegram.routes');

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ ok: true, message: 'API v1 ready' });
});

apiRouter.use('/staff-auth', staffAuthRoutes);
apiRouter.use('/configuracion', configuracionRoutes);
apiRouter.use('/staff', staffRoutes);
apiRouter.use('/clientes', clientesRoutes);
apiRouter.use('/categorias', categoriasRoutes);
apiRouter.use('/productos', productosRoutes);
apiRouter.use('/variantes', variantesRoutes);
apiRouter.use('/cuentas', cuentasRoutes);
apiRouter.use('/keys', keysRoutes);
apiRouter.use('/ventas', ventasRoutes);
apiRouter.use('/detalle-ventas', detalleVentasRoutes);
apiRouter.use('/suscripciones', suscripcionesRoutes);
apiRouter.use('/renovaciones', renovacionesRoutes);
apiRouter.use('/revendedores', revendedoresRoutes);
apiRouter.use('/tareas', tareasRoutes);
apiRouter.use('/calendario', calendarioRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/plantillas', plantillasRoutes);
apiRouter.use('/jobs', jobsRoutes);
apiRouter.use('/telegram', telegramRoutes);

module.exports = { apiRouter };
