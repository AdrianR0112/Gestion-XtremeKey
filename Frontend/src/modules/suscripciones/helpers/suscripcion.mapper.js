import { matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import { toEcuadorDateFromInput } from "../utils/date";

export function mapSuscripcionFromApi(row = {}) {
	const esRevendedor = Boolean(row.Id_Rev);
	return {
		...row,
		Id_Var: row.Id_Var ?? null,
		Id_Rev: row.Id_Rev ?? null,
		Ren_Auto: Boolean(Number(row.Ren_Auto)),
		Tip_Tit_Sus: row.Tip_Tit_Sus || (esRevendedor ? "revendedor" : "cliente"),
		Nom_Tit_Sus:
			row.Nom_Tit_Sus ||
			`${(esRevendedor ? row.Nom_Rev : row.Nom_Cli) || ""} ${(esRevendedor ? row.Ape_Rev : row.Ape_Cli) || ""}`.trim(),
		Ema_Tit_Sus: row.Ema_Tit_Sus ?? (esRevendedor ? row.Ema_Rev : row.Ema_Cli) ?? null,
		// Explicito, como Ema_Tit_Sus: lo usa el boton de WhatsApp para saber si
		// hay a quien escribir.
		Tel_Tit_Sus: row.Tel_Tit_Sus ?? (esRevendedor ? row.Tel_Rev : row.Tel_Cli) ?? null,
		// Correo del cliente final: en una suscripcion de revendedor es lo unico
		// que distingue una fila de otra del mismo titular.
		Cor_Cue_Sus: row.Cor_Cue_Sus ?? null,
		Dias_Restantes: row.Dias_Restantes === undefined || row.Dias_Restantes === null ? null : Number(row.Dias_Restantes),
	};
}

export function mapSuscripcionPayload(form = {}) {
	const esRevendedor = form.Tip_Tit === "revendedor";

	return {
		// El titular es excluyente: se manda siempre el par completo para que el
		// backend limpie la columna contraria al cambiar de tipo.
		Id_Cli: !esRevendedor && form.Id_Cli ? Number(form.Id_Cli) : null,
		Id_Rev: esRevendedor && form.Id_Rev ? Number(form.Id_Rev) : null,
		Id_Prd: form.Id_Prd ? Number(form.Id_Prd) : null,
		Id_Var: form.Id_Var ? Number(form.Id_Var) : null,
		Fec_Ini_Sus: toEcuadorDateFromInput(form.Fec_Ini_Sus),
		Fec_Fin_Sus: form.Fec_Fin_Sus ? toEcuadorDateFromInput(form.Fec_Fin_Sus) : null,
		Est_Sus: form.Est_Sus || "activa",
		Ren_Auto: form.Ren_Auto ? 1 : 0,
		Not_Sus: form.Not_Sus ? String(form.Not_Sus).trim() : null,
		Cor_Cue_Sus: form.Cor_Cue_Sus ? String(form.Cor_Cue_Sus).trim().toLowerCase() : null,
	};
}

export function getSuscripcionEstadoVariant(estado) {
	if (estado === "activa") return "success";
	if (estado === "suspendida") return "warning";
	if (estado === "cancelada") return "outline";
	if (estado === "expirada") return "secondary";
	return "secondary";
}

/**
 * Filtro de texto libre en cliente. El estado, el titular y el vencimiento se
 * filtran en el servidor para que "seleccionar todas" en la renovacion en lote
 * opere sobre el conjunto completo y no solo sobre la pagina visible.
 */
export function filterSuscripciones(suscripciones = [], query = "") {
	const normalizedQuery = normalizeSearchText(query);
	if (!normalizedQuery) return suscripciones;

	return suscripciones.filter((suscripcion) =>
		matchesTextSearch(
			[
				suscripcion.Nom_Tit_Sus,
				suscripcion.Ema_Tit_Sus,
				suscripcion.Nom_Cli,
				suscripcion.Ape_Cli,
				suscripcion.Nom_Rev,
				suscripcion.Ape_Rev,
				suscripcion.Nom_Prd,
				suscripcion.Nom_Var,
				suscripcion.Not_Sus,
				suscripcion.Cor_Cue_Sus,
			],
			normalizedQuery
		)
	);
}

export default {
	mapSuscripcionFromApi,
	mapSuscripcionPayload,
	getSuscripcionEstadoVariant,
	filterSuscripciones,
};
