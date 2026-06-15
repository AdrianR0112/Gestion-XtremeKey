import { mapConfiguracionFromApi, mapConfiguracionPayload } from "../helpers/configuracion.mapper";
import { validateConfiguracionForm } from "../schemas/configuracion.schema";
import configuracionService from "../services/configuracion.service";

export default function useConfiguracionActions(state) {
	const {
		setConfiguraciones,
		selectedConfiguracionId,
		setSelectedConfiguracionId,
		form,
		setSaving,
		setError,
		setSuccess,
		cargarConfiguraciones,
	} = state;

	const guardarConfiguracion = async (event) => {
		event.preventDefault();
		const errors = validateConfiguracionForm(form);
		if (Object.keys(errors).length > 0) {
			setError(Object.values(errors)[0]);
			return;
		}

		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapConfiguracionPayload(form);
			if (selectedConfiguracionId) {
				const updated = mapConfiguracionFromApi(
					await configuracionService.update(selectedConfiguracionId, payload)
				);
				setConfiguraciones((prev) =>
					prev.map((item) => (item.Id_Con === selectedConfiguracionId ? updated : item))
				);
				setSelectedConfiguracionId(updated.Id_Con);
				setSuccess("Configuracion actualizada correctamente.");
			}

			await cargarConfiguraciones();
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar la configuracion.");
		} finally {
			setSaving(false);
		}
	};

	return {
		guardarConfiguracion,
	};
}
