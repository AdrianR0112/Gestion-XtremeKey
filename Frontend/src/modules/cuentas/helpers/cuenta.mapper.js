export function mapCuentaFromApi(value = {}) {
	return {
		Id_Cue: value.Id_Cue ?? null,
		Id_Prd: value.Id_Prd ?? null,
		Id_Var: value.Id_Var ?? null,
		Id_Pro: value.Id_Pro ?? null,
		Nom_Cue: value.Nom_Cue ?? "",
		Usu_Cue: value.Usu_Cue ?? "",
		Pas_Cue: value.Pas_Cue ?? "",
		Pin_Cue: value.Pin_Cue ?? "",
		Per_Cue: value.Per_Cue ?? "",
		Tot_Per_Cue: value.Tot_Per_Cue ?? "",
		Per_Dis_Cue: value.Per_Dis_Cue ?? "",
		Fec_Com_Cue: value.Fec_Com_Cue ?? "",
		Fec_Ven_Cue: value.Fec_Ven_Cue ?? "",
		Cos_Cue: value.Cos_Cue ?? "",
		Not_Cue: value.Not_Cue ?? "",
		Est_Cue: value.Est_Cue ?? "disponible",
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

function toNullableNumber(value) {
	if (value === "" || value === undefined || value === null) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

export function mapCuentaPayload(form = {}) {
	const idProducto = toNullableNumber(form.Id_Prd);
	const idVariante = toNullableNumber(form.Id_Var);
	const idProveedor = toNullableNumber(form.Id_Pro);

	return {
		Id_Prd: idProducto,
		Id_Var: idVariante,
		Id_Pro: idProveedor,
		Nom_Cue: form.Nom_Cue?.trim() || "",
		Usu_Cue: form.Usu_Cue?.trim() || null,
		Pas_Cue: form.Pas_Cue?.trim() || null,
		Pin_Cue: form.Pin_Cue?.trim() || null,
		Per_Cue: form.Per_Cue?.trim() || null,
		Tot_Per_Cue: toNullableNumber(form.Tot_Per_Cue),
		Per_Dis_Cue: toNullableNumber(form.Per_Dis_Cue),
		Fec_Com_Cue: form.Fec_Com_Cue?.trim() || null,
		Fec_Ven_Cue: form.Fec_Ven_Cue?.trim() || null,
		Cos_Cue: toNullableNumber(form.Cos_Cue),
		Not_Cue: form.Not_Cue?.trim() || null,
		Est_Cue: form.Est_Cue || "disponible",
	};
}

export const mapCuenta = mapCuentaFromApi;
export default mapCuenta;
