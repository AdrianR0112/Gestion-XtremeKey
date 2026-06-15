import { mapProveedorPayload } from "../helpers/proveedor.mapper";
import proveedoresService from "../services/proveedores.service";

export default function useProveedoresActions(state) {
	const {
		selectedProveedorId,
		setSelectedProveedorId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarProveedores,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedProveedorId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (proveedor) => {
		setSheetMode("edit");
		setForm({
			Nom_Pro: proveedor.Nom_Pro ?? "",
			Tip_Pro: proveedor.Tip_Pro ?? "empresa",
			Con_Pri_Pro: proveedor.Con_Pri_Pro ?? "",
			Tel_Pro: proveedor.Tel_Pro ?? "",
			Wha_Pro: proveedor.Wha_Pro ?? "",
			Ema_Pro: proveedor.Ema_Pro ?? "",
			Tel_Gram_Pro: proveedor.Tel_Gram_Pro ?? "",
			Web_Pro: proveedor.Web_Pro ?? "",
			Pai_Pro: proveedor.Pai_Pro ?? "",
			Med_Con_Pro: proveedor.Med_Con_Pro ?? "whatsapp",
			Con_Com_Pro: proveedor.Con_Com_Pro ?? "",
			Cal_Pro: proveedor.Cal_Pro ?? 5,
			Not_Pro: proveedor.Not_Pro ?? "",
			Est_Pro: proveedor.Est_Pro ?? "activo",
		});
		setSelectedProveedorId(proveedor.Id_Pro);
		setSheetOpen(true);
	};

	const guardarProveedor = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapProveedorPayload(form);
			if (sheetMode === "create") {
				const creado = await proveedoresService.create(payload);
				const proveedoresActualizados = await cargarProveedores();
				setSelectedProveedorId(creado?.Id_Pro ?? proveedoresActualizados[0]?.Id_Pro ?? null);
				setSuccess("Proveedor creado correctamente.");
			} else {
				await proveedoresService.update(selectedProveedorId, payload);
				await cargarProveedores();
				setSuccess("Proveedor actualizado correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar el proveedor.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedProveedorId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await proveedoresService.remove(selectedProveedorId);
			const proveedoresActualizados = await cargarProveedores();
			setSelectedProveedorId(proveedoresActualizados[0]?.Id_Pro ?? null);
			setSuccess("Proveedor eliminado correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar el proveedor.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarProveedor,
		confirmarEliminacion,
	};
}
