export function mapProveedorFromApi(value = {}) {
	return {
		Id_Pro: value.Id_Pro ?? null,
		Nom_Pro: value.Nom_Pro ?? "",
		Tip_Pro: value.Tip_Pro ?? "empresa",
		Con_Pri_Pro: value.Con_Pri_Pro ?? "",
		Tel_Pro: value.Tel_Pro ?? "",
		Wha_Pro: value.Wha_Pro ?? "",
		Ema_Pro: value.Ema_Pro ?? "",
		Tel_Gram_Pro: value.Tel_Gram_Pro ?? "",
		Web_Pro: value.Web_Pro ?? "",
		Pai_Pro: value.Pai_Pro ?? "",
		Med_Con_Pro: value.Med_Con_Pro ?? "whatsapp",
		Con_Com_Pro: value.Con_Com_Pro ?? "",
		Cal_Pro: value.Cal_Pro ?? 5,
		Not_Pro: value.Not_Pro ?? "",
		Est_Pro: value.Est_Pro ?? "activo",
	};
}

export function mapProveedorPayload(form = {}) {
	return {
		Nom_Pro: form.Nom_Pro?.trim() || "",
		Tip_Pro: form.Tip_Pro || "empresa",
		Con_Pri_Pro: form.Con_Pri_Pro?.trim() || null,
		Tel_Pro: form.Tel_Pro?.trim() || null,
		Wha_Pro: form.Wha_Pro?.trim() || null,
		Ema_Pro: form.Ema_Pro?.trim()?.toLowerCase() || null,
		Tel_Gram_Pro: form.Tel_Gram_Pro?.trim() || null,
		Web_Pro: form.Web_Pro?.trim() || null,
		Pai_Pro: form.Pai_Pro?.trim() || null,
		Med_Con_Pro: form.Med_Con_Pro || "whatsapp",
		Con_Com_Pro: form.Con_Com_Pro?.trim() || null,
		Cal_Pro: form.Cal_Pro === "" ? null : Number(form.Cal_Pro),
		Not_Pro: form.Not_Pro?.trim() || null,
		Est_Pro: form.Est_Pro || "activo",
	};
}

export default mapProveedorPayload;
