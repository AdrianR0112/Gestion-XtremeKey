import { buildDetallePayload, buildVentaPayload, mapDetalleToForm, mapVentaToForm } from "../helpers/venta.mapper";
import { createDetalleForm, createVentaForm } from "../schemas/venta.schema";

export default function useVentasActions({
	ventasService,
	detalleVentasService,
	selectedVentaId,
	ventaSheetMode,
	ventaForm,
	detalleForm,
	detallesTemporales,
	ventaTotals,
	detalleSubtotal,
	ventaAEliminar,
	detalleVentas,
	detalleEditandoIdx,
	setLoading,
	setSaving,
	setError,
	setSuccess,
	setSelectedVentaId,
	setVentaSheetMode,
	setVentaForm,
	setVentaSheetOpen,
	setDetallesTemporales,
	setDetalleViewOpen,
	setVentaAEliminar,
	setVentaDeleteDialogOpen,
	setDetalleFormOpen,
	setDetalleForm,
	setDetalleEditandoIdx,
	setVentas,
	setDetalleVentas,
	setClientes,
	setProductos,
	setVariantes,
	setCuentas,
	setKeysData,
	cargarTodo,
}) {
	const abrirCrearVenta = () => {
		setVentaSheetMode("create");
		setVentaForm(createVentaForm());
		setDetallesTemporales([]);
		setVentaSheetOpen(true);
	};

	const cerrarDetalleForm = () => {
		setDetalleFormOpen(false);
		setDetalleForm(createDetalleForm());
		setDetalleEditandoIdx(null);
	};

	const abrirEditarVenta = (venta) => {
		setSelectedVentaId(venta.Id_Ven);
		setVentaSheetMode("edit");
		setVentaForm(mapVentaToForm(venta));
		const detallesExistentes = detalleVentas.filter((item) => Number(item.Id_Ven) === Number(venta.Id_Ven));
		setDetallesTemporales(detallesExistentes);
		cerrarDetalleForm();
		setVentaSheetOpen(true);
	};

	const abrirEliminarVenta = (venta) => {
		setSelectedVentaId(venta.Id_Ven);
		setVentaAEliminar(venta);
		setVentaDeleteDialogOpen(true);
	};

	const confirmarEliminarVenta = async () => {
		if (!ventaAEliminar) return;
		setSaving(true);
		setError("");
		try {
			await ventasService.remove(ventaAEliminar.Id_Ven);
			setSuccess("Venta eliminada correctamente.");
			await cargarTodo();
		} catch (error) {
			setError(error?.message || "Error al eliminar venta.");
		} finally {
			setSaving(false);
			setVentaDeleteDialogOpen(false);
			setVentaAEliminar(null);
		}
	};

	const guardarVenta = async (event) => {
		event.preventDefault();
		const requiereMetodoPago = ventaForm.Est_Ven === "completada";
		if ((!ventaForm.Id_Cli && !ventaForm.Id_Rev) || detallesTemporales.length === 0 || ventaTotals.sub < 0 || ventaTotals.total < 0) {
			setError("Completa los campos requeridos de la venta.");
			return false;
		}

		if (requiereMetodoPago && !String(ventaForm.Met_Pag_Ven || "").trim()) {
			setError("El metodo de pago es obligatorio cuando la venta esta pagada.");
			return false;
		}

		const tieneRenovaciones = detallesTemporales.some((d) => d.tipoOperacion === "renovacion" && d.renovacion?.Id_Dve_Ori);

		setSaving(true);
		setError("");
		setSuccess("");
		try {
			if (ventaSheetMode === "create") {
				const ventaPayload = buildVentaPayload(ventaForm, ventaTotals);

				if (tieneRenovaciones) {
					const detallesPayload = detallesTemporales.map((detalle) => ({
						...buildDetallePayload(detalle, ventaForm.Fec_Ven),
						tipoOperacion: detalle.tipoOperacion || "nueva",
						renovacion: detalle.tipoOperacion === "renovacion" && detalle.renovacion ? {
							Id_Dve_Ori: Number(detalle.renovacion.Id_Dve_Ori),
							Tip_Ren: detalle.renovacion.Tip_Ren || "manual",
							Not_Ren: detalle.renovacion.Not_Ren || null,
							Des_Ren: Number(detalle.renovacion.Des_Ren || 0),
						} : undefined,
					}));

					const result = await ventasService.createConRenovaciones({
						venta: ventaPayload,
						detalles: detallesPayload,
					});

					setSelectedVentaId(Number(result?.venta?.Id_Ven) || null);
				} else {
					const ventaCreada = await ventasService.create(ventaPayload);
					let ventaId = Number(ventaCreada?.Id_Ven ?? ventaCreada?.id ?? ventaCreada?.Id_Venta);
					if (!Number.isFinite(ventaId) || ventaId <= 0) {
						throw new Error("No se pudo obtener el identificador de la venta creada.");
					}
					setSelectedVentaId(ventaId);

					for (const detalle of detallesTemporales) {
						await detalleVentasService.create({
							...buildDetallePayload(detalle, ventaForm.Fec_Ven),
							Id_Ven: ventaId,
						});
					}
				}
			} else {
				await ventasService.update(selectedVentaId, buildVentaPayload(ventaForm, ventaTotals));
				const ventaId = Number(selectedVentaId);
				for (const detalle of detallesTemporales) {
					if (!detalle.Id_Dve) {
						await detalleVentasService.create({
							...buildDetallePayload(detalle, ventaForm.Fec_Ven),
							Id_Ven: ventaId,
						});
					}
				}
			}

			setSuccess(`Venta ${ventaSheetMode === "create" ? "creada" : "actualizada"} correctamente.`);
			await cargarTodo();
			setVentaSheetOpen(false);
			setVentaForm(createVentaForm());
			setDetallesTemporales([]);
			return true;
		} catch (error) {
			setError(error.message || "Error al guardar la venta.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	const abrirDetalleVenta = (venta) => {
		setSelectedVentaId(venta.Id_Ven);
		setDetalleViewOpen(true);
	};

	const abrirCrearDetalle = (initialDetail = null) => {
		setDetalleEditandoIdx(null);
		setDetalleForm(initialDetail ?? createDetalleForm());
		setDetalleFormOpen(true);
	};

	const abrirEditarDetalle = (idx) => {
		setDetalleEditandoIdx(idx);
		setDetalleForm(mapDetalleToForm(detallesTemporales[idx] || detalleForm));
		setDetalleFormOpen(true);
	};

	const eliminarDetalle = (idx) => {
		setDetallesTemporales(detallesTemporales.filter((_, index) => index !== idx));
	};

	return {
		abrirCrearVenta,
		abrirEditarVenta,
		abrirEliminarVenta,
		confirmarEliminarVenta,
		guardarVenta,
		abrirDetalleVenta,
		abrirCrearDetalle,
		abrirEditarDetalle,
		cerrarDetalleForm,
		eliminarDetalle,
	};
}
