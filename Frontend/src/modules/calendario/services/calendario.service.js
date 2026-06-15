import { api } from "../../../services/api";
import endpoints from "../../../services/endpoints";

const basePath = endpoints.calendario;

function extractPayload(response) {
	if (response && typeof response === "object" && "ok" in response && "data" in response) {
		return response.data;
	}

	if (response && typeof response === "object" && "data" in response) {
		return response.data;
	}

	return response;
}

function buildQueryString(params = {}) {
	const query = new URLSearchParams();

	if (params.startDate) query.set("startDate", params.startDate);
	if (params.endDate) query.set("endDate", params.endDate);

	const queryString = query.toString();
	return queryString ? `?${queryString}` : "";
}

function toTextValue(value) {
	if (value == null) return "";

	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	if (typeof value === "object") {
		return String(
			value.name ??
			value.Nom ??
			value.title ??
			value.label ??
			value.text ??
			value.id ??
			value.Id ??
			""
		);
	}

	return String(value);
}

function pickFirstValue(...values) {
	return values.find((value) => value != null && String(value).trim() !== "");
}

function normalizeTypeValue(value) {
	const normalized = toTextValue(value)
		.toLowerCase()
		.trim()
		.replace(/[\s-]+/g, "_");

	if (!normalized) return "";
	if (normalized === "tarea") return "tareas";
	if (normalized === "detalleventa" || normalized === "detalleventas") return "detalle_ventas";
	if (normalized === "detalle_venta") return "detalle_ventas";

	return normalized;
}

function inferEventType(event = {}) {
	const explicitType = normalizeTypeValue(event.type ?? event.eventType ?? event.tipo);
	if (explicitType) return explicitType;

	if (pickFirstValue(event.Fec_Lim_Tar, event.Id_Tar, event.Tit_Tar, event.Est_Tar) != null) {
		return "tareas";
	}

	if (pickFirstValue(event.Fec_Fin_Dve, event.Id_Dve, event.Id_Ven, event.Nom_Pro, event.Nom_Var) != null) {
		return "detalle_ventas";
	}

	return "";
}

function normalizeEvent(event = {}) {
	const saleId = event.saleId ?? event.saleID ?? event.Id_Dve ?? event.idSale ?? null;

	return {
		...event,
		type: inferEventType(event),
		title: toTextValue(pickFirstValue(event.title, event.Tit_Tar, event.Titulo, event.titleText, event.Nom_Pro, event.Des_Dve)),
		start: toTextValue(pickFirstValue(event.start, event.date, event.fecha, event.Fec_Lim_Tar, event.Fec_Fin_Dve, event.Fec_Ini_Dve)),
		status: toTextValue(pickFirstValue(event.status, event.Est_Tar, event.Est_Dve, event.estado)),
		client: toTextValue(pickFirstValue(event.client, event.Nom_Cli, event.cliente, event.customer)),
		saleId: saleId == null ? "" : String(saleId),
		product: toTextValue(pickFirstValue(event.product, event.Nom_Pro, event.productName)),
		variant: toTextValue(pickFirstValue(event.variant, event.Nom_Var, event.variantName)),
	};
}

function validateDateRange(params = {}) {
	if (!params.startDate || !params.endDate) return;

	const start = new Date(params.startDate);
	const end = new Date(params.endDate);

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
		throw new Error("Las fechas del calendario no son validas.");
	}

	if (start.getTime() > end.getTime()) {
		throw new Error("startDate no puede ser posterior a endDate.");
	}
}

export const calendarioService = {
	list: async (params = {}, options) => {
		validateDateRange(params);
		const path = `${basePath}${buildQueryString(params)}`;
		const payload = extractPayload(await api.get(path, options));

		if (!payload || typeof payload !== "object") {
			return payload;
		}

		return {
			...payload,
			range: payload.range ?? null,
			summary: payload.summary ?? { total: 0, byType: {} },
			events: Array.isArray(payload.events) ? payload.events.map(normalizeEvent) : [],
		};
	},
};

export default calendarioService;
