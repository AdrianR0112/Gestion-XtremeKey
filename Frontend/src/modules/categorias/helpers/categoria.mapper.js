export function mapCategoriaFromApi(value = {}) {
	return {
		Id_Cat: value.Id_Cat ?? null,
		Nom_Cat: value.Nom_Cat ?? "",
		Des_Cat: value.Des_Cat ?? "",
		Id_Cat_Pad: value.Id_Cat_Pad ?? null,
		Ico_Cat: value.Ico_Cat ?? "",
		Ord_Cat: value.Ord_Cat ?? null,
		Est_Cat: value.Est_Cat ?? "activo",
	};
}

export function mapCategoriaPayload(form = {}) {
	const parentId = form.Id_Cat_Pad === "" || form.Id_Cat_Pad === null ? null : Number(form.Id_Cat_Pad);
	const orderValue = form.Ord_Cat === "" || form.Ord_Cat === null ? null : Number(form.Ord_Cat);

	return {
		Nom_Cat: form.Nom_Cat?.trim() || "",
		Des_Cat: form.Des_Cat?.trim() || null,
		Id_Cat_Pad: Number.isFinite(parentId) ? parentId : null,
		Ico_Cat: form.Ico_Cat?.trim() || null,
		Ord_Cat: Number.isFinite(orderValue) ? orderValue : null,
		Est_Cat: form.Est_Cat || "activo",
	};
}

export default mapCategoriaPayload;
