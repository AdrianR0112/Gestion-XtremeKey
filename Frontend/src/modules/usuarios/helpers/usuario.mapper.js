export function mapUsuarioFromApi(value = {}) {
	return {
		Id_Usu: value.Id_Staff ?? value.Id_Usu ?? null,
		Nom_Usu: value.Nom_Staff ?? value.Nom_Usu ?? "",
		Ape_Usu: value.Ape_Staff ?? value.Ape_Usu ?? "",
		Ema_Usu: value.Ema_Staff ?? value.Ema_Usu ?? "",
		Tel_Usu: value.Tel_Staff ?? value.Tel_Usu ?? "",
		Rol_Usu: value.Rol_Staff ?? value.Rol_Usu ?? "admin",
		Est_Usu: value.Est_Staff ?? value.Est_Usu ?? "activo",
		Ult_Acc_Usu: value.Ult_Acc_Staff ?? value.Ult_Acc_Usu ?? null,
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

export function mapUsuarioPayload(form = {}, { includePassword = true } = {}) {
	const payload = {
		Nom_Staff: form.Nom_Usu?.trim() || "",
		Ape_Staff: form.Ape_Usu?.trim() || "",
		Ema_Staff: form.Ema_Usu?.trim()?.toLowerCase() || "",
		Tel_Staff: form.Tel_Usu?.trim() || null,
		Est_Staff: form.Est_Usu || "activo",
	};

	if (includePassword && form.Pas_Usu?.trim()) {
		payload.Pas_Staff = form.Pas_Usu;
	}

	return payload;
}

export default mapUsuarioPayload;
