let cachedTimezone = "America/Guayaquil";
let loaded = false;

export function getTimezone() {
	return cachedTimezone;
}

export async function loadTimezone(configuracionService) {
	if (loaded) return cachedTimezone;
	try {
		const config = await configuracionService.getCurrent();
		const tz =
			(config && config.Zon_Hor_Con && typeof config.Zon_Hor_Con === "string" && config.Zon_Hor_Con.trim()) ||
			"America/Guayaquil";
		cachedTimezone = tz;
	} catch {
		// keep default
	}
	loaded = true;
	return cachedTimezone;
}

export function isLoaded() {
	return loaded;
}

export default { getTimezone, loadTimezone, isLoaded };
