function normalizePhoneNumber(value) {
	if (!value) return "";
	return String(value).replace(/\D/g, "");
}

export function mapRevendedorFromApi(value = {}) {
	return {
		Id_Rev: value.Id_Rev ?? null,
		Tel_Rev: value.Tel_Rev ?? "",
		Nom_Rev: value.Nom_Rev ?? "",
		Ape_Rev: value.Ape_Rev ?? "",
		Ema_Rev: value.Ema_Rev ?? "",
		Doc_Rev: value.Doc_Rev ?? "",
		Not_Rev: value.Not_Rev ?? "",
		Est_Rev: value.Est_Rev ?? "activo",
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

export function mapRevendedorPayload(form = {}) {
	return {
		Tel_Rev: normalizePhoneNumber(form.Tel_Rev),
		Nom_Rev: form.Nom_Rev?.trim() || null,
		Ape_Rev: form.Ape_Rev?.trim() || null,
		Ema_Rev: form.Ema_Rev?.trim() || null,
		Doc_Rev: form.Doc_Rev?.trim() || null,
		Not_Rev: form.Not_Rev?.trim() || null,
		Est_Rev: form.Est_Rev || "activo",
	};
}

export default mapRevendedorPayload;
