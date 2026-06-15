function normalizeAttributesForForm(value) {
	if (value === undefined || value === null || value === "") return "";

	if (typeof value === "string") {
		try {
			return JSON.stringify(JSON.parse(value), null, 2);
		} catch {
			return value;
		}
	}

	return JSON.stringify(value, null, 2);
}

function parseAttributesForPayload(value) {
	if (value === undefined || value === null || value === "") return null;
	if (typeof value === "object") return value;
	if (typeof value === "string") return JSON.parse(value);
	return null;
}

function normalizeBoolean(value, fallback = true) {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value === 1;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if (["1", "true", "si", "sí", "on"].includes(normalized)) return true;
		if (["0", "false", "no", "off"].includes(normalized)) return false;
	}
	return fallback;
}

export function mapVariantFromApi(value = {}) {
	return {
		Id_Var: value.Id_Var ?? null,
		Id_Prd: value.Id_Prd ?? "",
		Nom_Var: value.Nom_Var ?? "",
		Des_Var: value.Des_Var ?? "",
		Pre_Cos_Var: value.Pre_Cos_Var ?? "",
		Pre_Ven_Var: value.Pre_Ven_Var ?? "",
		Pre_Rev_Var: value.Pre_Rev_Var ?? "",
		Dur_Tip_Var: value.Dur_Tip_Var ?? "",
		Dur_Val_Var: value.Dur_Val_Var ?? "",
		Max_Usu_Var: value.Max_Usu_Var ?? "",
		Not_Ven_Cor_Var: normalizeBoolean(value.Not_Ven_Cor_Var, true),
		Not_Ven_Wsp_Var: normalizeBoolean(value.Not_Ven_Wsp_Var, true),
		Atr_Var: normalizeAttributesForForm(value.Atr_Var),
		Est_Var: value.Est_Var ?? "activo",
	};
}

export function mapVariantPayload(form = {}) {
	return {
		Id_Prd: form.Id_Prd === "" ? null : Number(form.Id_Prd),
		Nom_Var: form.Nom_Var?.trim() || "",
		Des_Var: form.Des_Var?.trim() || null,
		Pre_Cos_Var: Number(form.Pre_Cos_Var),
		Pre_Ven_Var: Number(form.Pre_Ven_Var),
		Pre_Rev_Var: form.Pre_Rev_Var === "" ? null : Number(form.Pre_Rev_Var),
		Dur_Tip_Var: form.Dur_Tip_Var || null,
		Dur_Val_Var: form.Dur_Val_Var === "" || form.Dur_Val_Var === null || form.Dur_Val_Var === undefined ? null : Number(form.Dur_Val_Var),
		Max_Usu_Var: form.Max_Usu_Var === "" ? null : Number(form.Max_Usu_Var),
		Not_Ven_Cor_Var: !!form.Not_Ven_Cor_Var,
		Not_Ven_Wsp_Var: !!form.Not_Ven_Wsp_Var,
		Atr_Var: parseAttributesForPayload(form.Atr_Var),
		Est_Var: form.Est_Var || "activo",
	};
}

export default mapVariantFromApi;
