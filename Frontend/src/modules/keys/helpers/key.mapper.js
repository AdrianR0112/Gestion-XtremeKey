export function mapKeyFromApi(value = {}) {
	return {
		Id_Key: value.Id_Key ?? null,
		Id_Prd: value.Id_Prd ?? null,
		Id_Var: value.Id_Var ?? null,
		Id_Pro: value.Id_Pro ?? null,
		Cla_Key: value.Cla_Key ?? "",
		Es_Per_Vid_Key: Number(value.Es_Per_Vid_Key ?? 0) === 1,
		Des_Key: value.Des_Key ?? "",
		Fec_Com_Key: value.Fec_Com_Key ?? "",
		Fec_Ven_Key: value.Fec_Ven_Key ?? "",
		Cos_Key: value.Cos_Key ?? "",
		Pre_Ven_Key: value.Pre_Ven_Key ?? "",
		Est_Key: value.Est_Key ?? "disponible",
		Not_Key: value.Not_Key ?? "",
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

function toNullableNumber(value) {
	if (value === "" || value === undefined || value === null) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

export function mapKeyPayload(form = {}) {
	const idProducto = toNullableNumber(form.Id_Prd);
	const idVariante = toNullableNumber(form.Id_Var);
	const idProveedor = toNullableNumber(form.Id_Pro);

	return {
		Id_Prd: idProducto,
		Id_Var: idVariante,
		Id_Pro: idProveedor,
		Cla_Key: form.Cla_Key?.trim() || "",
		Es_Per_Vid_Key: form.Es_Per_Vid_Key ? 1 : 0,
		Des_Key: form.Des_Key?.trim() || null,
		Fec_Com_Key: form.Fec_Com_Key?.trim() || null,
		Fec_Ven_Key: form.Fec_Ven_Key?.trim() || null,
		Cos_Key: toNullableNumber(form.Cos_Key),
		Pre_Ven_Key: toNullableNumber(form.Pre_Ven_Key),
		Est_Key: form.Est_Key || "disponible",
		Not_Key: form.Not_Key?.trim() || null,
	};
}

export const mapKey = mapKeyFromApi;
export default mapKey;
