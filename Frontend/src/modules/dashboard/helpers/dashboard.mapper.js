const EMPTY_RANGE = {
	periodo: "mes",
	ancla: 0,
	desde: "",
	hasta: "",
	etiqueta: "Periodo actual",
};

export const EMPTY_DASHBOARD = {
	rango: EMPTY_RANGE,
	rangoAnterior: { desde: "", hasta: "", etiqueta: "Periodo anterior" },
	totales: {
		ingresos: 0,
		costo: 0,
		ganancia: 0,
		margen: 0,
		cantidadVentas: 0,
		unidades: 0,
		ticketMedio: 0,
		lineasSinCosto: 0,
	},
	comparacion: { ingresos: null, ganancia: null, cantidadVentas: null, ticketMedio: null },
	serie: [],
	conteos: { productos: 0, clientes: 0, revendedores: 0 },
	suscripciones: { activas: 0, porVencer: 0, vencidas: 0, expiradas: 0 },
	renovaciones: { cantidad: 0, importe: 0, tasaRenovacion: 0 },
	topProductos: [],
	topClientes: [],
	ultimasVentas: [],
};

function toNumber(value) {
	return Number(value || 0);
}

function toVariation(value) {
	return value == null ? null : Number(value);
}

export function mapDashboardFromApi(payload) {
	if (!payload || typeof payload !== "object") return EMPTY_DASHBOARD;

	return {
		rango: { ...EMPTY_RANGE, ...(payload.rango || {}) },
		rangoAnterior: { ...EMPTY_DASHBOARD.rangoAnterior, ...(payload.rangoAnterior || {}) },
		totales: Object.fromEntries(
			Object.keys(EMPTY_DASHBOARD.totales).map((key) => [key, toNumber(payload.totales?.[key])])
		),
		comparacion: Object.fromEntries(
			Object.keys(EMPTY_DASHBOARD.comparacion).map((key) => [key, toVariation(payload.comparacion?.[key])])
		),
		serie: Array.isArray(payload.serie)
			? payload.serie.map((item) => ({
				...item,
				ingresos: toNumber(item.ingresos),
				ganancia: toNumber(item.ganancia),
				cantidad: toNumber(item.cantidad),
			}))
			: [],
		conteos: {
			productos: toNumber(payload.conteos?.productos),
			clientes: toNumber(payload.conteos?.clientes),
			revendedores: toNumber(payload.conteos?.revendedores),
		},
		suscripciones: {
			activas: toNumber(payload.suscripciones?.activas),
			porVencer: toNumber(payload.suscripciones?.porVencer),
			vencidas: toNumber(payload.suscripciones?.vencidas),
			expiradas: toNumber(payload.suscripciones?.expiradas),
		},
		renovaciones: {
			cantidad: toNumber(payload.renovaciones?.cantidad),
			importe: toNumber(payload.renovaciones?.importe),
			tasaRenovacion: toNumber(payload.renovaciones?.tasaRenovacion),
		},
		topProductos: Array.isArray(payload.topProductos) ? payload.topProductos : [],
		topClientes: Array.isArray(payload.topClientes) ? payload.topClientes : [],
		ultimasVentas: Array.isArray(payload.ultimasVentas) ? payload.ultimasVentas : [],
	};
}
