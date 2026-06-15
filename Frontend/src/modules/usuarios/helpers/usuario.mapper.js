export function mapUsuarioFromApi(value = {}) {
	return {
		Id_Usu: value.Id_Usu ?? null,
		Nom_Usu: value.Nom_Usu ?? "",
		Ape_Usu: value.Ape_Usu ?? "",
		Ema_Usu: value.Ema_Usu ?? "",
		Tel_Usu: value.Tel_Usu ?? "",
		Rol_Usu: value.Rol_Usu ?? "vendedor",
		Est_Usu: value.Est_Usu ?? "activo",
		Ult_Acc_Usu: value.Ult_Acc_Usu ?? null,
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

export function mapUsuarioPayload(form = {}, { includePassword = true } = {}) {
	const payload = {
		Nom_Usu: form.Nom_Usu?.trim() || "",
		Ape_Usu: form.Ape_Usu?.trim() || "",
		Ema_Usu: form.Ema_Usu?.trim()?.toLowerCase() || "",
		Tel_Usu: form.Tel_Usu?.trim() || null,
		Rol_Usu: form.Rol_Usu || "vendedor",
		Est_Usu: form.Est_Usu || "activo",
	};

	if (includePassword && form.Pas_Usu?.trim()) {
		payload.Pas_Usu = form.Pas_Usu;
	}

	return payload;
}

export default mapUsuarioPayload;
