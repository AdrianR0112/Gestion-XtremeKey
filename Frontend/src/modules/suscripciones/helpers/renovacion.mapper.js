import { toEcuadorDateFromInput } from "../utils/date";
import {
	addDurationToDateInput,
	calcularInicioPeriodo,
	DEFAULT_DIAS_GRACIA,
	toDateInputValue,
} from "../../../utils/duration";

/**
 * Duracion sugerida: la de la variante contratada. Si la suscripcion no tiene
 * variante (o la variante no define duracion), se cae a un mes.
 */
export function getDuracionSugerida(entrada) {
	// Los defaults de parametro no cubren null, y las llamadas pueden venir con
	// la suscripcion aun sin seleccionar.
	const suscripcion = entrada ?? {};
	const tipo = suscripcion.Dur_Tip_Var;
	const valor = Number(suscripcion.Dur_Val_Var);

	if (["dias", "meses", "anios"].includes(tipo) && Number.isInteger(valor) && valor > 0) {
		return { Dur_Tip: tipo, Dur_Val: String(valor) };
	}

	return { Dur_Tip: "meses", Dur_Val: "1" };
}

/** Precio de revendedor si el titular lo es; si no, el precio de venta. */
export function getPrecioSugerido(entrada) {
	const suscripcion = entrada ?? {};
	const precio =
		suscripcion.Tip_Tit_Sus === "revendedor"
			? suscripcion.Pre_Rev_Var ?? suscripcion.Pre_Ven_Var
			: suscripcion.Pre_Ven_Var;

	return precio === undefined || precio === null ? "" : String(Number(precio));
}

/**
 * Periodo que va a quedar registrado, con la misma regla que aplica el backend:
 * arranca en el vencimiento anterior (aunque ya haya pasado, mientras siga
 * dentro de la gracia) para no dejar huecos de cobertura.
 *
 * Si el formulario trae una fecha de inicio elegida a mano, esa manda.
 */
export function getPeriodoSugerido(entrada, opciones = {}) {
	const suscripcion = entrada ?? {};
	const { graciaDias = DEFAULT_DIAS_GRACIA, ahora = new Date(), form = {} } = opciones;

	const automatico = calcularInicioPeriodo(suscripcion.Fec_Fin_Sus, { graciaDias, ahora });
	const manual = form.Fec_Ini ? toDateInputValue(form.Fec_Ini) : "";
	const inicio = manual || automatico.inicio;

	const duracion = form.Dur_Tip ? form : getDuracionSugerida(suscripcion);
	const fin = addDurationToDateInput(inicio, duracion.Dur_Tip, duracion.Dur_Val);

	return {
		inicio,
		fin,
		// Con fecha manual el encadenado deja de ser una decision automatica.
		encadenado: manual ? null : automatico.encadenado,
		diasVencida: automatico.diasVencida,
		graciaDias,
	};
}

export function getSubtotalEstimado(suscripcion, form) {
	const precio = form.Pre_Uni === "" ? Number(getPrecioSugerido(suscripcion) || 0) : Number(form.Pre_Uni || 0);
	const descuento = Number(form.Des_Uni || 0);
	return Number(Math.max(0, precio - descuento).toFixed(2));
}

export function getTotalEstimado(suscripciones = [], form = {}) {
	return Number(
		suscripciones.reduce((suma, suscripcion) => suma + getSubtotalEstimado(suscripcion, form), 0).toFixed(2)
	);
}

function baseRenovacionPayload(form = {}) {
	const payload = {
		Dur_Tip: form.Dur_Tip,
		Dur_Val: Number(form.Dur_Val),
		generarVenta: form.generarVenta !== false,
	};

	if (form.Pre_Uni !== "" && form.Pre_Uni !== undefined && form.Pre_Uni !== null) {
		payload.Pre_Uni = Number(form.Pre_Uni);
	}
	if (form.Des_Uni) payload.Des_Uni = Number(form.Des_Uni);
	if (form.Fec_Ini) payload.Fec_Ini = toEcuadorDateFromInput(form.Fec_Ini);
	if (form.Id_Var !== "" && form.Id_Var !== undefined && form.Id_Var !== null) {
		payload.Id_Var = Number(form.Id_Var);
	}
	// El revendedor puede reasignar el cupo a otro cliente final al renovar.
	if (form.Cor_Cue) payload.Cor_Cue = String(form.Cor_Cue).trim().toLowerCase();
	if (form.Not_Ven) payload.Not_Ven = String(form.Not_Ven).trim();

	if (payload.generarVenta) {
		payload.Est_Ven = form.Est_Ven || "completada";
		if (form.Met_Pag) payload.Met_Pag = String(form.Met_Pag).trim();
	}

	return payload;
}

export function buildRenovarPayload(suscripcion = {}, form = {}) {
	return {
		...baseRenovacionPayload(form),
		// Control optimista: si la vigencia cambio desde que se cargo la tabla
		// (doble clic, u otro usuario), el backend responde 409 en vez de crear
		// un periodo de mas.
		Fec_Fin_Esperada: suscripcion.Fec_Fin_Sus ?? null,
	};
}

export function buildRenovarLotePayload(suscripciones = [], form = {}) {
	const overrides = baseRenovacionPayload(form);

	// En lote la duracion comun se manda como override, pero el precio se
	// resuelve por suscripcion: cada plan tiene el suyo.
	delete overrides.Pre_Uni;
	// Por el mismo motivo, ni la fecha de inicio, ni la variante, ni la cuenta
	// son comunes: cada suscripcion encadena desde SU vencimiento, conserva SU
	// plan y pertenece a SU cliente final.
	delete overrides.Fec_Ini;
	delete overrides.Id_Var;
	delete overrides.Cor_Cue;

	return {
		ids: suscripciones.map((suscripcion) => suscripcion.Id_Sus),
		agrupar: form.agrupar === "por-suscripcion" ? "por-suscripcion" : "por-titular",
		overrides,
		porItem: Object.fromEntries(
			suscripciones.map((suscripcion) => [
				suscripcion.Id_Sus,
				{ Fec_Fin_Esperada: suscripcion.Fec_Fin_Sus ?? null },
			])
		),
	};
}

export default {
	getDuracionSugerida,
	getPrecioSugerido,
	getPeriodoSugerido,
	getSubtotalEstimado,
	getTotalEstimado,
	buildRenovarPayload,
	buildRenovarLotePayload,
};
