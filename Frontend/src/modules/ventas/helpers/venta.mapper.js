import { NONE_VALUE, combineDateWithTimeInput, getCurrentDateTimeInputValue, getTodayDateInputValue, toDateInputValue, toDateTimeInputValue, toEcuadorDateTimeIso } from "../utils/constants";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";

export function getVentaEstadoVariant(estado) {
	if (estado === "completada") return "success";
	if (estado === "pendiente") return "warning";
	return "secondary";
}

export function buildClienteMap(clientes = []) {
	return new Map(clientes.map((item) => [Number(item.Id_Cli), `${item.Nom_Cli || ""} ${item.Ape_Cli || ""}`.trim()]));
}

export function buildClienteSearchMap(clientes = []) {
	return new Map(
		clientes.map((item) => [
			Number(item.Id_Cli),
			{
				text: [item.Nom_Cli, item.Ape_Cli, item.Ema_Cli, item.Doc_Cli],
				phones: [item.Tel_Cli, item.Tel_Alt_Cli, item.Usu_Tel_Cli],
			},
		])
	);
}

export function buildRevendedorMap(revendedores = []) {
	return new Map(revendedores.map((item) => [Number(item.Id_Rev), `${item.Nom_Rev || ""} ${item.Ape_Rev || ""}`.trim()]));
}

export function buildRevendedorSearchMap(revendedores = []) {
	return new Map(
		revendedores.map((item) => [
			Number(item.Id_Rev),
			{
				text: [item.Nom_Rev, item.Ape_Rev, item.Ema_Rev, item.Doc_Rev],
				phones: [item.Tel_Rev],
			},
		])
	);
}

export function buildProductoMap(productos = []) {
	return new Map(productos.map((item) => [Number(item.Id_Prd), item.Nom_Prd || `#${item.Id_Prd}`]));
}

export function buildVarianteMap(variantes = []) {
	return new Map(variantes.map((item) => [Number(item.Id_Var), item.Nom_Var || `#${item.Id_Var}`]));
}

export function mapVentaToForm(venta = {}) {
	return {
		Id_Cli: venta.Id_Cli ? String(venta.Id_Cli) : "",
		Id_Rev: venta.Id_Rev ? String(venta.Id_Rev) : "",
		Fec_Ven: toDateTimeInputValue(venta.Fec_Ven),
		Des_Tot_Ven: venta.Des_Tot_Ven ?? 0,
		Imp_Tot_Ven: venta.Imp_Tot_Ven ?? 0,
		Met_Pag_Ven: venta.Met_Pag_Ven || "",
		Not_Ven: venta.Not_Ven || "",
		Est_Ven: venta.Est_Ven || "pendiente",
	};
}

export function mapDetalleToForm(detalle = {}) {
	return {
		Id_Prd: detalle.Id_Prd ? String(detalle.Id_Prd) : "",
		Id_Var: detalle.Id_Var ? String(detalle.Id_Var) : "",
		Id_Cue: detalle.Id_Cue ? String(detalle.Id_Cue) : "",
		Id_Key: detalle.Id_Key ? String(detalle.Id_Key) : "",
		Can_Dve: String(detalle.Can_Dve ?? 1),
		Pre_Uni_Dve: String(detalle.Pre_Uni_Dve ?? ""),
		Des_Uni_Dve: String(detalle.Des_Uni_Dve ?? 0),
		Fec_Ini_Dve: toDateInputValue(detalle.Fec_Ini_Dve),
		Fec_Fin_Dve: toDateInputValue(detalle.Fec_Fin_Dve),
		Es_Suscripcion_Dve: Boolean(detalle.Es_Suscripcion_Dve),
		Cor_Cue: detalle.Cor_Cue || "",
		Con_Cue: detalle.Con_Cue || "",
		Not_Dve: detalle.Not_Dve || "",
		Est_Dve: detalle.Est_Dve || "activo",
	};
}

export function buildVentaPayload(ventaForm, ventaTotals) {
	const fechaVenta = ventaForm.Fec_Ven || getCurrentDateTimeInputValue();
	const payload = {
		Fec_Ven: toEcuadorDateTimeIso(fechaVenta),
		Des_Tot_Ven: Number(ventaTotals.des || 0),
		Imp_Tot_Ven: Number(ventaTotals.imp || 0),
		Tot_Ven: Number(ventaTotals.total),
		Met_Pag_Ven: ventaForm.Met_Pag_Ven || null,
		Not_Ven: ventaForm.Not_Ven || null,
		Est_Ven: ventaForm.Est_Ven || "pendiente",
	};

	if (ventaForm.Id_Cli) {
		payload.Id_Cli = Number(ventaForm.Id_Cli);
		payload.Id_Rev = null;
	} else if (ventaForm.Id_Rev) {
		payload.Id_Rev = Number(ventaForm.Id_Rev);
		payload.Id_Cli = null;
	}

	return payload;
}

export function buildDetallePayload(detalleForm, ventaDateTime = "") {
	const fechaInicio = detalleForm.Fec_Ini_Dve || getTodayDateInputValue();
	const fechaVenta = ventaDateTime || "";

	return {
		Id_Prd: detalleForm.Id_Prd === NONE_VALUE ? undefined : detalleForm.Id_Prd ? Number(detalleForm.Id_Prd) : undefined,
		Id_Var: detalleForm.Id_Var === NONE_VALUE ? undefined : detalleForm.Id_Var ? Number(detalleForm.Id_Var) : undefined,
		Id_Cue: detalleForm.Id_Cue === NONE_VALUE ? undefined : detalleForm.Id_Cue ? Number(detalleForm.Id_Cue) : undefined,
		Id_Key: detalleForm.Id_Key === NONE_VALUE ? undefined : detalleForm.Id_Key ? Number(detalleForm.Id_Key) : undefined,
		Can_Dve: Number(detalleForm.Can_Dve || 1),
		Pre_Uni_Dve: Number(detalleForm.Pre_Uni_Dve || 0),
		Des_Uni_Dve: Number(detalleForm.Des_Uni_Dve || 0),
		Fec_Ini_Dve: combineDateWithTimeInput(fechaInicio, fechaVenta),
		Fec_Fin_Dve: combineDateWithTimeInput(detalleForm.Fec_Fin_Dve || fechaInicio, fechaVenta),
		Cor_Cue: detalleForm.Cor_Cue || undefined,
		Con_Cue: detalleForm.Con_Cue || undefined,
		Not_Dve: detalleForm.Not_Dve || undefined,
		Est_Dve: detalleForm.Est_Dve || "activo",
	};
}

export function filterVentas(ventas = [], query = "", estadoFilter = "todos", clienteMap = new Map(), clienteSearchMap = new Map(), revendedorMap = new Map(), revendedorSearchMap = new Map()) {
	const normalizedQuery = normalizeSearchText(query);
	return ventas.filter((venta) => {
		const nombrePersona = venta.Id_Cli
			? (venta.Nom_Cli
				? `${venta.Nom_Cli || ""} ${venta.Ape_Cli || ""}`.trim()
				: clienteMap.get(Number(venta.Id_Cli)) || "")
			: (venta.Nom_Rev
				? `${venta.Nom_Rev || ""} ${venta.Ape_Rev || ""}`.trim()
				: revendedorMap.get(Number(venta.Id_Rev)) || "");

		const clienteSearch = clienteSearchMap.get(Number(venta.Id_Cli));
		const revendedorSearch = revendedorSearchMap.get(Number(venta.Id_Rev));

		const personText = [
			...(clienteSearch?.text || []),
			...(revendedorSearch?.text || []),
		];
		const personPhones = [
			...(clienteSearch?.phones || []),
			...(revendedorSearch?.phones || []),
		];

		const matchesSearch =
			!normalizedQuery ||
			matchesTextSearch([venta.Id_Ven, nombrePersona, venta.Met_Pag_Ven, venta.Est_Ven, ...personText], normalizedQuery) ||
			personPhones.some((phone) => matchesPhoneSearch(phone, normalizedQuery));
		const matchesEstado = estadoFilter === "todos" || venta.Est_Ven === estadoFilter;
		return matchesSearch && matchesEstado;
	});
}

export default {
	getVentaEstadoVariant,
	buildClienteMap,
	buildClienteSearchMap,
	buildRevendedorMap,
	buildRevendedorSearchMap,
	buildProductoMap,
	buildVarianteMap,
	mapVentaToForm,
	mapDetalleToForm,
	buildVentaPayload,
	buildDetallePayload,
	filterVentas,
};
