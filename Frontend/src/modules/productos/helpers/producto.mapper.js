export function mapProductoFromApi(value = {}) {
	return {
		Id_Prd: value.Id_Prd ?? null,
		Cod_Prd: value.Cod_Prd ?? "",
		Nom_Prd: value.Nom_Prd ?? "",
		Des_Prd: value.Des_Prd ?? "",
		Des_Cor_Prd: value.Des_Cor_Prd ?? "",
		Id_Cat: value.Id_Cat ?? null,
		Tip_Prd: value.Tip_Prd ?? "producto",
		Ima_Prd: value.Ima_Prd ?? "",
		Est_Prd: value.Est_Prd ?? "activo",
	};
}

export function mapProductoPayload(form = {}) {

	return {
		Cod_Prd: form.Cod_Prd?.trim() || null,
		Nom_Prd: form.Nom_Prd?.trim() || "",
		Des_Prd: form.Des_Prd?.trim() || null,
		Des_Cor_Prd: form.Des_Cor_Prd?.trim() || null,
		Id_Cat: form.Id_Cat === "" || form.Id_Cat === null ? null : Number(form.Id_Cat),
		Tip_Prd: form.Tip_Prd || "producto",
		Ima_Prd: form.Ima_Prd?.trim() || null,
		Est_Prd: form.Est_Prd || "activo",
	};
}

export default mapProductoPayload;
