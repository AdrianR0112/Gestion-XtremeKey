import { mapRenovacionPayload } from "../helpers/renovacion.mapper";
import { RENOVACION_INICIAL } from "../schemas/renovacion.schema";

export default function useRenovacionesActions({
	renovacionesService,
	selectedRenovacionId,
	sheetMode,
	form,
	renovacionAEliminar,
	setSaving,
	setError,
	setSuccess,
	setSelectedRenovacionId,
	setSheetMode,
	setForm,
	setSheetOpen,
	setRenovacionAEliminar,
	setRenovacionDeleteDialogOpen,
	setRenovaciones,
	resetForm,
	cargarRenovaciones,
}) {
	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSheetOpen(true);
	};

	const abrirEditar = (renovacion) => {
		setSelectedRenovacionId(renovacion.Id_Ren);
		setSheetMode("edit");
		setForm({
			Id_Dve_Ori: renovacion.Id_Dve_Ori ? String(renovacion.Id_Dve_Ori) : "",
			Id_Dve_Nue: renovacion.Id_Dve_Nue ? String(renovacion.Id_Dve_Nue) : "",
			Id_Cli: renovacion.Id_Cli ? String(renovacion.Id_Cli) : "",
			Id_Prd: renovacion.Id_Prd ? String(renovacion.Id_Prd) : "",
			Id_Var: renovacion.Id_Var ? String(renovacion.Id_Var) : "",
			Fec_Ven_Ant_Ren: renovacion.Fec_Ven_Ant_Ren || "",
			Fec_Ini_Nue_Ren: renovacion.Fec_Ini_Nue_Ren || "",
			Fec_Fin_Nue_Ren: renovacion.Fec_Fin_Nue_Ren || "",
			Pre_Ori_Ren: renovacion.Pre_Ori_Ren != null ? String(renovacion.Pre_Ori_Ren) : "",
			Pre_Ren: renovacion.Pre_Ren != null ? String(renovacion.Pre_Ren) : "",
			Des_Ren: renovacion.Des_Ren != null ? String(renovacion.Des_Ren) : "0",
			Tip_Ren: renovacion.Tip_Ren || "manual",
			Est_Ren: renovacion.Est_Ren || "pendiente",
			Not_Ren: renovacion.Not_Ren || "",
		});
		setSheetOpen(true);
	};

	const abrirEliminar = (renovacion) => {
		setRenovacionAEliminar(renovacion);
		setRenovacionDeleteDialogOpen(true);
	};

	const confirmarEliminar = async () => {
		if (!renovacionAEliminar) return;
		setSaving(true);
		setError("");
		try {
			await renovacionesService.remove(renovacionAEliminar.Id_Ren);
			setSuccess("Renovacion eliminada correctamente.");
			await cargarRenovaciones();
		} catch (error) {
			setError(error?.message || "Error al eliminar renovacion.");
		} finally {
			setSaving(false);
			setRenovacionDeleteDialogOpen(false);
			setRenovacionAEliminar(null);
		}
	};

	const guardarRenovacion = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");
		try {
			const payload = mapRenovacionPayload(form);
			if (sheetMode === "create") {
				await renovacionesService.create(payload);
				setSuccess("Renovacion creada correctamente.");
			} else {
				await renovacionesService.update(selectedRenovacionId, payload);
				setSuccess("Renovacion actualizada correctamente.");
			}
			await cargarRenovaciones();
			setSheetOpen(false);
			resetForm();
		} catch (error) {
			setError(error?.message || "Error al guardar renovacion.");
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		abrirEliminar,
		confirmarEliminar,
		guardarRenovacion,
	};
}
