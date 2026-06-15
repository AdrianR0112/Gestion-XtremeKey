import { useEffect, useMemo, useRef, useState } from "react";
import clientesService from "../../clientes/services/clientes.service";
import revendedoresService from "../../revendedores/services/revendedores.service";
import configuracionService from "../../configuracion/services/configuracion.service";
import { cuentasService } from "../../cuentas/services/cuentas.service";
import { keysService } from "../../keys/services/keys.service";
import { productosService } from "../../productos/services/productos.service";
import { variantesService } from "../../variantes/services/variantes.service";
import detalleVentasService from "../services/detalleVentas.service";
import ventasService from "../services/ventas.service";
import { buildClienteMap, buildClienteSearchMap, buildProductoMap, buildVarianteMap, buildRevendedorMap, buildRevendedorSearchMap, filterVentas } from "../helpers/venta.mapper";
import { createDetalleForm, createVentaForm } from "../schemas/venta.schema";
import useVentasActions from "./useVentasActions";

const VENTA_DRAFT_STORAGE_KEY = "ventas.create.draft";

function removeFechaVentaFromDraft(ventaForm = {}) {
	const { Fec_Ven: _Fec_Ven, ...rest } = ventaForm;
	return rest;
}

function getEmptyVentaDraft() {
	return {
		ventaForm: createVentaForm(),
		detallesTemporales: [],
		detalleForm: createDetalleForm(),
		detalleFormOpen: false,
		detalleEditandoIdx: null,
	};
}
function readVentaDraft() {
	if (typeof window === "undefined") return getEmptyVentaDraft();

	try {
		const raw = window.localStorage.getItem(VENTA_DRAFT_STORAGE_KEY);
		if (!raw) return getEmptyVentaDraft();

		const parsed = JSON.parse(raw);
		const { Fec_Ven: _Fec_Ven, ...draftVentaForm } = parsed?.ventaForm || {};
		return {
			ventaForm: {
				...createVentaForm(),
				...draftVentaForm,
			},
			detallesTemporales: Array.isArray(parsed?.detallesTemporales) ? parsed.detallesTemporales : [],
			detalleForm: parsed?.detalleForm || createDetalleForm(),
			detalleFormOpen: Boolean(parsed?.detalleFormOpen),
			detalleEditandoIdx:
				typeof parsed?.detalleEditandoIdx === "number" ? parsed.detalleEditandoIdx : null,
		};
	} catch (_error) {
		return getEmptyVentaDraft();
	}
}

export default function useVentas() {
	const draftPersistDisabledRef = useRef(false);
	const initialDraft = useMemo(() => readVentaDraft(), []);
	const [ventas, setVentas] = useState([]);
	const [detalleVentas, setDetalleVentas] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [revendedores, setRevendedores] = useState([]);
	const [productos, setProductos] = useState([]);
	const [variantes, setVariantes] = useState([]);
	const [cuentas, setCuentas] = useState([]);
	const [keysData, setKeysData] = useState([]);
	const [configuracionActual, setConfiguracionActual] = useState(null);
	const [selectedVentaId, setSelectedVentaId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [ventaSheetOpen, setVentaSheetOpen] = useState(false);
	const [ventaSheetMode, setVentaSheetMode] = useState("create");
	const [ventaForm, setVentaForm] = useState(() => initialDraft.ventaForm);
	const [detallesTemporales, setDetallesTemporales] = useState(() => initialDraft.detallesTemporales);
	const [detalleViewOpen, setDetalleViewOpen] = useState(false);
	const [ventaAEliminar, setVentaAEliminar] = useState(null);
	const [ventaDeleteDialogOpen, setVentaDeleteDialogOpen] = useState(false);
	const [detalleFormOpen, setDetalleFormOpen] = useState(() => initialDraft.detalleFormOpen);
	const [detalleForm, setDetalleForm] = useState(() => initialDraft.detalleForm);
	const [detalleEditandoIdx, setDetalleEditandoIdx] = useState(() => initialDraft.detalleEditandoIdx);

	const clienteMap = useMemo(() => buildClienteMap(clientes), [clientes]);
	const clienteSearchMap = useMemo(() => buildClienteSearchMap(clientes), [clientes]);
	const revendedorMap = useMemo(() => buildRevendedorMap(revendedores), [revendedores]);
	const revendedorSearchMap = useMemo(() => buildRevendedorSearchMap(revendedores), [revendedores]);
	const productoMap = useMemo(() => buildProductoMap(productos), [productos]);
	const varianteMap = useMemo(() => buildVarianteMap(variantes), [variantes]);
	const ventaSeleccionada = useMemo(() => ventas.find((venta) => Number(venta.Id_Ven) === Number(selectedVentaId)) || null, [ventas, selectedVentaId]);
	const detallesDeVenta = useMemo(() => detalleVentas.filter((item) => Number(item.Id_Ven) === Number(selectedVentaId)), [detalleVentas, selectedVentaId]);
	const subtotalFinalDetalles = useMemo(
		() => Number(detallesTemporales.reduce((sum, det) => sum + (Number(det.Can_Dve || 0) * (Number(det.Pre_Uni_Dve || 0) - Number(det.Des_Uni_Dve || 0))), 0).toFixed(2)),
		[detallesTemporales]
	);
	const impuestoHabilitado = configuracionActual?.Hab_Imp_Con ?? true;
	const ventaTotals = useMemo(() => {
		const sub = subtotalFinalDetalles;
		const des = Number(ventaForm.Des_Tot_Ven || 0);
		const imp = impuestoHabilitado ? Number(ventaForm.Imp_Tot_Ven || 0) : 0;
		const total = Number((sub - des + imp).toFixed(2));
		return { sub, des, imp, total };
	}, [impuestoHabilitado, subtotalFinalDetalles, ventaForm.Des_Tot_Ven, ventaForm.Imp_Tot_Ven]);
	const detalleSubtotal = useMemo(() => {
		const can = Number(detalleForm.Can_Dve || 0);
		const pre = Number(detalleForm.Pre_Uni_Dve || 0);
		const des = Number(detalleForm.Des_Uni_Dve || 0);
		return Number((can * (pre - des)).toFixed(2));
	}, [detalleForm.Can_Dve, detalleForm.Des_Uni_Dve, detalleForm.Pre_Uni_Dve]);
	const totalesDetalles = useMemo(() => ({ subtotal: subtotalFinalDetalles }), [subtotalFinalDetalles]);
	const ventasFiltradas = useMemo(
		() => filterVentas(ventas, searchTerm, estadoFilter, clienteMap, clienteSearchMap, revendedorMap, revendedorSearchMap),
		[clienteMap, clienteSearchMap, revendedorMap, revendedorSearchMap, estadoFilter, searchTerm, ventas]
	);

	const resetVentaDraftState = (options = {}) => {
		const { clearMessages = true, closeSheet = true } = options;
		draftPersistDisabledRef.current = true;
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(VENTA_DRAFT_STORAGE_KEY);
		}
		setSelectedVentaId(null);
		setVentaSheetMode("create");
		setVentaForm(createVentaForm());
		setDetallesTemporales([]);
		setDetalleViewOpen(false);
		setVentaAEliminar(null);
		setVentaDeleteDialogOpen(false);
		setDetalleFormOpen(false);
		setDetalleForm(createDetalleForm());
		setDetalleEditandoIdx(null);
		if (closeSheet) setVentaSheetOpen(false);
		if (clearMessages) {
			setError("");
			setSuccess("");
		}
	};

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (ventaSheetMode !== "create") return;
		if (draftPersistDisabledRef.current) {
			draftPersistDisabledRef.current = false;
			return;
		}

		window.localStorage.setItem(
			VENTA_DRAFT_STORAGE_KEY,
			JSON.stringify({
				ventaForm: removeFechaVentaFromDraft(ventaForm),
				detallesTemporales,
				detalleForm,
				detalleFormOpen,
				detalleEditandoIdx,
			})
		);
	}, [ventaSheetMode, ventaForm, detallesTemporales, detalleForm, detalleFormOpen, detalleEditandoIdx]);

	useEffect(() => {
		if (impuestoHabilitado) return;
		setVentaForm((prev) => {
			if (String(prev.Imp_Tot_Ven || "0") === "0") return prev;
			return { ...prev, Imp_Tot_Ven: "0" };
		});
	}, [impuestoHabilitado]);

	const descartarBorradorVenta = () => {
		resetVentaDraftState({ clearMessages: true, closeSheet: true });
	};

	const guardarBorradorVenta = () => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(
			VENTA_DRAFT_STORAGE_KEY,
			JSON.stringify({
				ventaForm: removeFechaVentaFromDraft(ventaForm),
				detallesTemporales,
				detalleForm,
				detalleFormOpen,
				detalleEditandoIdx,
			})
		);
		setSuccess("Borrador guardado.");
	};

	const cargarTodo = async () => {
		setLoading(true);
		setError("");
		try {
			const [ventasData, detalleData, clientesData, productosData, variantesData, cuentasData, keysList, revendedoresData, currentConfig] = await Promise.all([
				ventasService.list(),
				detalleVentasService.list(),
				clientesService.list(),
				productosService.list(),
				variantesService.list(),
				cuentasService.list(),
				keysService.list(),
				revendedoresService.list(),
				configuracionService.getCurrent().catch((err) => {
					if (err?.status === 404) return null;
					throw err;
				}),
			]);

			setVentas(Array.isArray(ventasData) ? ventasData : []);
			setDetalleVentas(Array.isArray(detalleData) ? detalleData : []);
			setClientes(Array.isArray(clientesData) ? clientesData : []);
			setRevendedores(Array.isArray(revendedoresData) ? revendedoresData : []);
			setProductos(Array.isArray(productosData) ? productosData : []);
			setVariantes(Array.isArray(variantesData) ? variantesData : []);
			setCuentas(Array.isArray(cuentasData) ? cuentasData : []);
			setKeysData(Array.isArray(keysList) ? keysList : []);
			setConfiguracionActual(currentConfig || null);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar ventas.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarTodo();
	}, []);

	const acciones = useVentasActions({
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
	});

	return {
		ventas,
		detalleVentas,
		clientes,
		revendedores,
		productos,
		variantes,
		cuentas,
		keysData,
		configuracionActual,
		impuestoHabilitado,
		selectedVentaId,
		searchTerm,
		estadoFilter,
		loading,
		saving,
		error,
		success,
		ventaSheetOpen,
		ventaSheetMode,
		ventaForm,
		detallesTemporales,
		detalleViewOpen,
		ventaAEliminar,
		ventaDeleteDialogOpen,
		detalleFormOpen,
		detalleForm,
		detalleEditandoIdx,
		clienteMap,
		productoMap,
		varianteMap,
		revendedorMap,
		ventaSeleccionada,
		detallesDeVenta,
		ventaTotals,
		detalleSubtotal,
		totalesDetalles,
		ventasFiltradas,
		setSearchTerm,
		setEstadoFilter,
		setClientes,
		setRevendedores,
		setVentaSheetOpen,
		setVentaForm,
		setDetalleForm,
		setDetallesTemporales,
		setDetalleFormOpen,
		setDetalleEditandoIdx,
		setVentaDeleteDialogOpen,
		setDetalleViewOpen,
		setSuccess,
		setError,
		setLoading,
		setSaving,
		guardarBorradorVenta,
		descartarBorradorVenta,
		...acciones,
	};
}
