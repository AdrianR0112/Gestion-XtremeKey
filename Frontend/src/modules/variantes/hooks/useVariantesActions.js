import { mapVariantFromApi, mapVariantPayload } from "../helpers/variant.mapper";
import { VARIANTE_INICIAL, validateVariantForm } from "../schemas/variant.schema";
import { variantesService } from "../services/variantes.service";

export default function useVariantesActions(state) {
	const {
		form,
		setForm,
		setSelectedId,
		cargarVariantes,
		setLoading,
		setSaving,
		setError,
		setSuccess,
		setSheetOpen,
		setSheetMode,
	} = state;

	const abrirCrear = () => {
		setForm(VARIANTE_INICIAL);
		setSelectedId(null);
		setSheetMode("create");
		setSheetOpen(true);
	};

	const abrirEditar = (variante) => {
		setSelectedId(variante.Id_Var);
		setForm(mapVariantFromApi(variante));
		setSheetMode("edit");
		setSheetOpen(true);
	};

	const guardarVariante = async (event) => {
		event?.preventDefault();

		const errors = validateVariantForm(form);
		if (Object.keys(errors).length > 0) {
			setError("Por favor completa los campos requeridos.");
			return false;
		}

		try {
			setSaving(true);
			const payload = mapVariantPayload(form);

			if (form.Id_Var) {
				await variantesService.update(form.Id_Var, payload);
				setSuccess("Variante actualizada correctamente.");
			} else {
				await variantesService.create(payload);
				setSuccess("Variante creada correctamente.");
			}

			await cargarVariantes();
			setSheetOpen(false);
			setForm(VARIANTE_INICIAL);
			setSelectedId(null);
			setError(null);
			setTimeout(() => setSuccess(null), 3000);
			return true;
		} catch (err) {
			setError(err?.message || "Error al guardar variante.");
			console.error("Error guardando variante:", err);
			return false;
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async (variante = state.varianteSeleccionada) => {
		const idToDelete = variante?.Id_Var ?? state.selectedId;
		if (!idToDelete) return false;

		try {
			setLoading(true);
			await variantesService.remove(idToDelete);
			setSuccess("Variante eliminada correctamente.");
			await cargarVariantes();
			setSelectedId(null);
			setError(null);
			setTimeout(() => setSuccess(null), 3000);
			return true;
		} catch (err) {
			setError(err?.message || "Error al eliminar variante.");
			console.error("Error eliminando variante:", err);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarVariante,
		confirmarEliminacion,
	};
}
