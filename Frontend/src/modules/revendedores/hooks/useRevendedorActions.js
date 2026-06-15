import { mapRevendedorPayload } from "../helpers/revendedor.mapper";
import revendedoresService from "../services/revendedores.service";

export default function useRevendedorActions(state) {
	const {
		revendedores,
		setRevendedores,
		selectedRevendedorId,
		setSelectedRevendedorId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarRevendedores,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedRevendedorId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (revendedor) => {
		setSheetMode("edit");
		setForm({
			Id_Rev: revendedor.Id_Rev ?? "",
			Tel_Rev: revendedor.Tel_Rev ?? "",
			Nom_Rev: revendedor.Nom_Rev ?? "",
			Ape_Rev: revendedor.Ape_Rev ?? "",
			Ema_Rev: revendedor.Ema_Rev ?? "",
			Doc_Rev: revendedor.Doc_Rev ?? "",
			Not_Rev: revendedor.Not_Rev ?? "",
			Est_Rev: revendedor.Est_Rev ?? "activo",
		});
		setSelectedRevendedorId(revendedor.Id_Rev);
		setSheetOpen(true);
	};

	const guardarRevendedor = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapRevendedorPayload(form);
			if (sheetMode === "create") {
				const creado = await revendedoresService.create(payload);
				const revendedoresActualizados = await cargarRevendedores();
				setSelectedRevendedorId(creado?.Id_Rev ?? revendedoresActualizados[0]?.Id_Rev ?? null);
				setSuccess("Revendedor creado correctamente.");
			} else {
				await revendedoresService.update(selectedRevendedorId, payload);
				await cargarRevendedores();
				setSuccess("Revendedor actualizado correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar el revendedor.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminar = async () => {
		if (!selectedRevendedorId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await revendedoresService.remove(selectedRevendedorId);
			const revendedoresActualizados = await cargarRevendedores();
			setSelectedRevendedorId(revendedoresActualizados[0]?.Id_Rev ?? null);
			setSuccess("Revendedor eliminado correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar el revendedor.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarRevendedor,
		confirmarEliminar,
	};
}
