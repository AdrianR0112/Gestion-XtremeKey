import { buildDetalleCompraPayload, buildProveedorMap, buildProductoMap, buildVarianteMap, filterCompras, mapCompraPayload, mapCompraToForm, mapDetalleCompraToForm } from "../helpers/compra.mapper";
import { createDetalleCompraForm, createCompraForm } from "../schemas/compra.schema";

export default function useComprasActions({
	comprasService,
	detalleComprasService,
	selectedCompraId,
	compraSheetMode,
	compraForm,
	detalleForm,
	detallesTemporales,
	compraTotals,
	detalleSubtotal,
	compraAEliminar,
	detalleCompras,
	detalleEditandoIdx,
	setLoading,
	setSaving,
	setError,
	setSuccess,
	setSelectedCompraId,
	setCompraSheetMode,
	setCompraForm,
	setCompraSheetOpen,
	setDetallesTemporales,
	setDetalleViewOpen,
	setCompraAEliminar,
	setCompraDeleteDialogOpen,
	setDetalleFormOpen,
	setDetalleForm,
	setDetalleEditandoIdx,
	setCompras,
	setDetalleCompras,
	setProveedores,
	setProductos,
	setVariantes,
	cargarTodo,
}) {
	const abrirCrearCompra = () => {
		setCompraSheetMode("create");
		setCompraForm(createCompraForm());
		setDetallesTemporales([]);
		setCompraSheetOpen(true);
	};

	const cerrarDetalleForm = () => {
		setDetalleFormOpen(false);
		setDetalleForm(createDetalleCompraForm());
		setDetalleEditandoIdx(null);
	};

	const abrirEditarCompra = (compra) => {
		setSelectedCompraId(compra.Id_Com);
		setCompraSheetMode("edit");
		setCompraForm(mapCompraToForm(compra));
		const detallesExistentes = detalleCompras.filter((item) => Number(item.Id_Com) === Number(compra.Id_Com));
		setDetallesTemporales(detallesExistentes);
		cerrarDetalleForm();
		setCompraSheetOpen(true);
	};

	const abrirEliminarCompra = (compra) => {
		setSelectedCompraId(compra.Id_Com);
		setCompraAEliminar(compra);
		setCompraDeleteDialogOpen(true);
	};

	const confirmarEliminarCompra = async () => {
		if (!compraAEliminar) return;
		setSaving(true);
		setError("");
		try {
			await comprasService.remove(compraAEliminar.Id_Com);
			setSuccess("Compra eliminada correctamente.");
			await cargarTodo();
		} catch (error) {
			setError(error?.message || "Error al eliminar compra.");
		} finally {
			setSaving(false);
			setCompraDeleteDialogOpen(false);
			setCompraAEliminar(null);
		}
	};

	const guardarCompra = async (event) => {
		event.preventDefault();
		if (!compraForm.Id_Pro || detallesTemporales.length === 0 || compraTotals.sub < 0 || compraTotals.total < 0) {
			setError("Completa los campos requeridos de la compra.");
			return false;
		}

		setSaving(true);
		setError("");
		setSuccess("");
		try {
			const compraPayload = mapCompraPayload(compraForm, compraTotals);
			let compraId;
			let compraCreada;
			if (compraSheetMode === "create") {
				compraCreada = await comprasService.create(compraPayload);
				compraId = Number(compraCreada?.Id_Com ?? compraCreada?.id ?? compraCreada?.Id_Compra);
				if (!Number.isFinite(compraId) || compraId <= 0) {
					throw new Error("No se pudo obtener el identificador de la compra creada.");
				}
				setSelectedCompraId(compraId);
			} else {
				await comprasService.update(selectedCompraId, compraPayload);
				compraId = Number(selectedCompraId);
				compraCreada = { Id_Com: compraId };
			}

			for (const detalle of detallesTemporales) {
				if (!detalle.Id_Dco) {
					await detalleComprasService.create({
						...buildDetalleCompraPayload(detalle, detalle.Sub_Tot_Dco),
						Id_Com: compraCreada.Id_Com,
					});
				}
			}

			setSuccess(`Compra ${compraSheetMode === "create" ? "creada" : "actualizada"} correctamente.`);
			await cargarTodo();
			setCompraSheetOpen(false);
			setCompraForm(createCompraForm());
			setDetallesTemporales([]);
			return true;
		} catch (error) {
			setError(error.message || "Error al guardar la compra.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	const abrirDetalleCompra = (compra) => {
		setSelectedCompraId(compra.Id_Com);
		setDetalleViewOpen(true);
	};

	const abrirCrearDetalle = (initialDetail = null) => {
		setDetalleEditandoIdx(null);
		setDetalleForm(initialDetail ?? createDetalleCompraForm());
		setDetalleFormOpen(true);
	};

	const abrirEditarDetalle = (detalle, index) => {
		setDetalleEditandoIdx(index);
		setDetalleForm(mapDetalleCompraToForm(detalle));
		setDetalleFormOpen(true);
	};

	const eliminarDetalle = (index) => {
		setDetallesTemporales((prev) => prev.filter((_, i) => i !== index));
	};

	const agregarDetalle = () => {
		const nuevoDetalle = {
			...detalleForm,
			Sub_Tot_Dco: detalleSubtotal,
		};
		if (detalleEditandoIdx !== null) {
			setDetallesTemporales((prev) => {
				const updated = [...prev];
				updated[detalleEditandoIdx] = nuevoDetalle;
				return updated;
			});
		} else {
			setDetallesTemporales((prev) => [...prev, nuevoDetalle]);
		}
		cerrarDetalleForm();
	};

	return {
		abrirCrearCompra,
		abrirEditarCompra,
		abrirEliminarCompra,
		confirmarEliminarCompra,
		guardarCompra,
		abrirDetalleCompra,
		abrirCrearDetalle,
		abrirEditarDetalle,
		eliminarDetalle,
		agregarDetalle,
		cerrarDetalleForm,
	};
}
