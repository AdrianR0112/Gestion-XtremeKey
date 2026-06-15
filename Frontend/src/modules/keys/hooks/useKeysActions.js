import { mapKeyFromApi, mapKeyPayload } from "../helpers/key.mapper";
import keysService from "../services/keys.service";

export default function useKeysActions(state) {
	const {
		selectedKeyId,
		setSelectedKeyId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarKeys,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedKeyId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (key) => {
		setSheetMode("edit");
		setForm(mapKeyFromApi(key));
		setSelectedKeyId(key.Id_Key);
		setSheetOpen(true);
	};

	const guardarKey = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapKeyPayload(form);
			if (sheetMode === "create") {
				const creada = await keysService.create(payload);
				const keysActualizadas = await cargarKeys();
				setSelectedKeyId(creada?.Id_Key ?? keysActualizadas[0]?.Id_Key ?? null);
				setSuccess("Key creada correctamente.");
			} else {
				await keysService.update(selectedKeyId, payload);
				await cargarKeys();
				setSuccess("Key actualizada correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar la key.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedKeyId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await keysService.remove(selectedKeyId);
			const keysActualizadas = await cargarKeys();
			setSelectedKeyId(keysActualizadas[0]?.Id_Key ?? null);
			setSuccess("Key eliminada correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar la key.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarKey,
		confirmarEliminacion,
	};
}
