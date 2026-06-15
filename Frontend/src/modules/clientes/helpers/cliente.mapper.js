function parseBooleanValue(value) {
	if (typeof value === "boolean") return value;
	if (value === "true") return true;
	if (value === "false") return false;
	return Boolean(value);
}

function normalizePhoneNumber(value) {
	if (!value) return "";
	return String(value).replace(/\D/g, "");
}

export function mapClienteFromApi(value = {}) {
	return {
		Id_Cli: value.Id_Cli ?? null,
		Nom_Cli: value.Nom_Cli ?? "",
		Ape_Cli: value.Ape_Cli ?? "",
		Tel_Cli: value.Tel_Cli ?? "",
		Usu_Tel_Cli: value.Usu_Tel_Cli ?? "",
		Ema_Cli: value.Ema_Cli ?? "",
		Pai_Cli: value.Pai_Cli ?? "Ecuador",
		Doc_Cli: value.Doc_Cli ?? "",
		Cat_Cli: value.Cat_Cli ?? "nuevo",
		Pre_Con_Cli: value.Pre_Con_Cli ?? "",
		Ace_Not_Tel_Cli: Boolean(value.Ace_Not_Tel_Cli),
		Ace_Not_Cor_Cli: Boolean(value.Ace_Not_Cor_Cli),
		Not_Cli: value.Not_Cli ?? "",
		Est_Cli: value.Est_Cli ?? "activo",
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

export function mapClientePayload(form = {}) {
	return {
		Nom_Cli: form.Nom_Cli?.trim() || null,
		Ape_Cli: form.Ape_Cli?.trim() || null,
		Tel_Cli: normalizePhoneNumber(form.Tel_Cli),
		Usu_Tel_Cli: form.Usu_Tel_Cli?.trim() || null,
		Ema_Cli: form.Ema_Cli?.trim() || null,
		Pai_Cli: form.Pai_Cli?.trim() || "Ecuador",
		Doc_Cli: form.Doc_Cli?.trim() || null,
		Cat_Cli: form.Cat_Cli || null,
		Pre_Con_Cli: form.Pre_Con_Cli || null,
		Ace_Not_Tel_Cli: parseBooleanValue(form.Ace_Not_Tel_Cli),
		Ace_Not_Cor_Cli: parseBooleanValue(form.Ace_Not_Cor_Cli),
		Not_Cli: form.Not_Cli?.trim() || null,
		Est_Cli: form.Est_Cli || "activo",
	};
}

export default mapClientePayload;
