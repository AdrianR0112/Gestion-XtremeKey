import { mapDetalleCompraPayload } from "../helpers/detalleCompra.mapper";
import detalleComprasService from "../services/detalleCompras.service";

export default function useDetalleComprasActions(state) {
	const {
		detalles,
		setDetalles,
		selectedDetalleId,
		setSelectedDetalleId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarDetalles,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedDetalleId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (detalle) => {
		setSheetMode("edit");
		setForm({
			Id_Com: detalle.Id_Com ?? null,
			Id_Prd: detalle.Id_Prd ?? null,
			Id_Var: detalle.Id_Var ?? null,
			Can_Dco: detalle.Can_Dco ?? 1,
			Pre_Uni_Dco: detalle.Pre_Uni_Dco ?? 0,
			Sub_Tot_Dco: detalle.Sub_Tot_Dco ?? 0,
			Not_Dco: detalle.Not_Dco ?? "",
		});
		setSelectedDetalleId(detalle.Id_Dco);
		setSheetOpen(true);
	};

	const guardarDetalle = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapDetalleCompraPayload(form);
			if (sheetMode === "create") {
				const creado = await detalleComprasService.create(payload);
				const detallesActualizados = await cargarDetalles();
				setSelectedDetalleId(creado?.Id_Dco ?? detallesActualizados[0]?.Id_Dco ?? null);
				setSuccess("Detalle de compra creado correctamente.");
			} else {
				await detalleComprasService.update(selectedDetalleId, payload);
				await cargarDetalles();
				setSuccess("Detalle de compra actualizado correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar el detalle de compra.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedDetalleId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await detalleComprasService.remove(selectedDetalleId);
			const detallesActualizados = await cargarDetalles();
			setSelectedDetalleId(detallesActualizados[0]?.Id_Dco ?? null);
			setSuccess("Detalle de compra eliminado correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar el detalle de compra.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarDetalle,
		confirmarEliminacion,
	};
}
