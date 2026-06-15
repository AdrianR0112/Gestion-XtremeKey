function bufferObjectToBase64(value) {
	if (!value || typeof value !== "object") return "";
	if (value.type !== "Buffer" || !Array.isArray(value.data)) return "";

	let binary = "";
	value.data.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});

	return btoa(binary);
}

function parseOptionalNumber(value) {
	if (value === "" || value === null || value === undefined) return null;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? null : parsed;
}

function parseOptionalString(value) {
	const parsed = String(value ?? "").trim();
	return parsed ? parsed.toUpperCase() : null;
}

function normalizeOptionalNumber(value) {
	if (value === "" || value === null || value === undefined) return "";
	const parsed = Number(value);
	return Number.isNaN(parsed) ? "" : parsed;
}

export function mapConfiguracionFromApi(value = {}) {
	const logoRaw = value.Log_Con;
	const logoBase64 =
		typeof logoRaw === "string"
			? logoRaw
			: logoRaw instanceof Uint8Array
				? btoa(String.fromCharCode(...logoRaw))
				: bufferObjectToBase64(logoRaw);

	return {
		Id_Con: value.Id_Con ?? null,
		Nom_Emp_Con: value.Nom_Emp_Con ?? "",
		Dir_Con: value.Dir_Con ?? "",
		Tel_Con: value.Tel_Con ?? "",
		Ema_Con: value.Ema_Con ?? "",
		Log_Con: logoBase64 ?? "",
		Mon_Con: value.Mon_Con ?? "",
		Zon_Hor_Con: value.Zon_Hor_Con ?? "",
		Imp_Con: normalizeOptionalNumber(value.Imp_Con),
		Hab_Imp_Con: value.Hab_Imp_Con === undefined ? true : Boolean(Number(value.Hab_Imp_Con)),
	};
}

export function mapConfiguracionPayload(form = {}) {
	return {
		Nom_Emp_Con: form.Nom_Emp_Con?.trim() || "",
		Dir_Con: form.Dir_Con?.trim() || null,
		Tel_Con: form.Tel_Con?.trim() || null,
		Ema_Con: form.Ema_Con?.trim() || null,
		Log_Con: form.Log_Con?.trim() || null,
		Mon_Con: parseOptionalString(form.Mon_Con),
		Zon_Hor_Con: form.Zon_Hor_Con?.trim() || null,
		Imp_Con: parseOptionalNumber(form.Imp_Con),
		Hab_Imp_Con: Boolean(form.Hab_Imp_Con),
	};
}

export default mapConfiguracionPayload;
