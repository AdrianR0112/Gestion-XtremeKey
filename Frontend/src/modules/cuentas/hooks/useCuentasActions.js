import { mapCuentaFromApi, mapCuentaPayload } from "../helpers/cuenta.mapper";
import cuentasService from "../services/cuentas.service";

export default function useCuentasActions(state) {
	const {
		selectedCuentaId,
		setSelectedCuentaId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarCuentas,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedCuentaId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (cuenta) => {
		setSheetMode("edit");
		setForm(mapCuentaFromApi(cuenta));
		setSelectedCuentaId(cuenta.Id_Cue);
		setSheetOpen(true);
	};

	const guardarCuenta = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapCuentaPayload(form);
			if (sheetMode === "create") {
				const creada = await cuentasService.create(payload);
				const cuentasActualizadas = await cargarCuentas();
				setSelectedCuentaId(creada?.Id_Cue ?? cuentasActualizadas[0]?.Id_Cue ?? null);
				setSuccess("Cuenta creada correctamente.");
			} else {
				await cuentasService.update(selectedCuentaId, payload);
				await cargarCuentas();
				setSuccess("Cuenta actualizada correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar la cuenta.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedCuentaId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await cuentasService.remove(selectedCuentaId);
			const cuentasActualizadas = await cargarCuentas();
			setSelectedCuentaId(cuentasActualizadas[0]?.Id_Cue ?? null);
			setSuccess("Cuenta eliminada correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar la cuenta.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarCuenta,
		confirmarEliminacion,
	};
}
