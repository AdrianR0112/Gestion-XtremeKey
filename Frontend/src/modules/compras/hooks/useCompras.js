import { useEffect, useMemo, useRef, useState } from "react";
import proveedoresService from "../../proveedores/services/proveedores.service";
import { productosService } from "../../productos/services/productos.service";
import { variantesService } from "../../variantes/services/variantes.service";
import detalleComprasService from "../services/detalleCompras.service";
import comprasService from "../services/compras.service";
import { buildProveedorMap, buildProductoMap, buildVarianteMap, filterCompras } from "../helpers/compra.mapper";
import { createDetalleCompraForm, createCompraForm } from "../schemas/compra.schema";
import useComprasActions from "./useComprasActions";

const COMPRA_DRAFT_STORAGE_KEY = "compras.create.draft";

function getEmptyCompraDraft() {
	return {
		compraForm: createCompraForm(),
		detallesTemporales: [],
		detalleForm: createDetalleCompraForm(),
		detalleFormOpen: false,
		detalleEditandoIdx: null,
	};
}

function readCompraDraft() {
	if (typeof window === "undefined") return getEmptyCompraDraft();

	try {
		const raw = window.localStorage.getItem(COMPRA_DRAFT_STORAGE_KEY);
		if (!raw) return getEmptyCompraDraft();

		const parsed = JSON.parse(raw);
		return {
			compraForm: parsed?.compraForm || createCompraForm(),
			detallesTemporales: Array.isArray(parsed?.detallesTemporales) ? parsed.detallesTemporales : [],
			detalleForm: parsed?.detalleForm || createDetalleCompraForm(),
			detalleFormOpen: Boolean(parsed?.detalleFormOpen),
			detalleEditandoIdx: typeof parsed?.detalleEditandoIdx === "number" ? parsed.detalleEditandoIdx : null,
		};
	} catch (_error) {
		return getEmptyCompraDraft();
	}
}

export default function useCompras() {
	const draftPersistDisabledRef = useRef(false);
	const initialDraft = useMemo(() => readCompraDraft(), []);
	const [compras, setCompras] = useState([]);
	const [detalleCompras, setDetalleCompras] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const [productos, setProductos] = useState([]);
	const [variantes, setVariantes] = useState([]);
	const [selectedCompraId, setSelectedCompraId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [compraSheetOpen, setCompraSheetOpen] = useState(false);
	const [compraSheetMode, setCompraSheetMode] = useState("create");
	const [compraForm, setCompraForm] = useState(() => initialDraft.compraForm);
	const [detallesTemporales, setDetallesTemporales] = useState(() => initialDraft.detallesTemporales);
	const [detalleViewOpen, setDetalleViewOpen] = useState(false);
	const [compraAEliminar, setCompraAEliminar] = useState(null);
	const [compraDeleteDialogOpen, setCompraDeleteDialogOpen] = useState(false);
	const [detalleFormOpen, setDetalleFormOpen] = useState(() => initialDraft.detalleFormOpen);
	const [detalleForm, setDetalleForm] = useState(() => initialDraft.detalleForm);
	const [detalleEditandoIdx, setDetalleEditandoIdx] = useState(() => initialDraft.detalleEditandoIdx);

	const proveedorMap = useMemo(() => buildProveedorMap(proveedores), [proveedores]);
	const productoMap = useMemo(() => buildProductoMap(productos), [productos]);
	const varianteMap = useMemo(() => buildVarianteMap(variantes), [variantes]);
	const compraSeleccionada = useMemo(() => compras.find((compra) => Number(compra.Id_Com) === Number(selectedCompraId)) || null, [compras, selectedCompraId]);
	const detallesDeCompra = useMemo(() => detalleCompras.filter((item) => Number(item.Id_Com) === Number(selectedCompraId)), [detalleCompras, selectedCompraId]);
	const subtotalFinalDetalles = useMemo(
		() => Number(detallesTemporales.reduce((sum, det) => sum + (Number(det.Sub_Tot_Dco || 0)), 0).toFixed(2)),
		[detallesTemporales]
	);
	const compraTotals = useMemo(() => {
		const sub = subtotalFinalDetalles;
		const imp = Number(compraForm.Imp_Tot_Com || 0);
		const total = Number((sub + imp).toFixed(2));
		return { sub, imp, total };
	}, [subtotalFinalDetalles, compraForm.Imp_Tot_Com]);
	const detalleSubtotal = useMemo(() => {
		const can = Number(detalleForm.Can_Dco || 0);
		const pre = Number(detalleForm.Pre_Uni_Dco || 0);
		return Number((can * pre).toFixed(2));
	}, [detalleForm.Can_Dco, detalleForm.Pre_Uni_Dco]);
	const totalesDetalles = useMemo(() => ({ subtotal: subtotalFinalDetalles }), [subtotalFinalDetalles]);
	const comprasFiltradas = useMemo(() => filterCompras(compras, searchTerm, estadoFilter, proveedorMap), [proveedorMap, estadoFilter, searchTerm, compras]);

	const resetCompraDraftState = (options = {}) => {
		const { clearMessages = true, closeSheet = true } = options;
		draftPersistDisabledRef.current = true;
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(COMPRA_DRAFT_STORAGE_KEY);
		}
		setSelectedCompraId(null);
		setCompraSheetMode("create");
		setCompraForm(createCompraForm());
		setDetallesTemporales([]);
		setDetalleViewOpen(false);
		setCompraAEliminar(null);
		setCompraDeleteDialogOpen(false);
		setDetalleFormOpen(false);
		setDetalleForm(createDetalleCompraForm());
		setDetalleEditandoIdx(null);
		if (closeSheet) setCompraSheetOpen(false);
		if (clearMessages) {
			setError("");
			setSuccess("");
		}
	};

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (compraSheetMode !== "create") return;
		if (draftPersistDisabledRef.current) {
			draftPersistDisabledRef.current = false;
			return;
		}

		window.localStorage.setItem(
			COMPRA_DRAFT_STORAGE_KEY,
			JSON.stringify({
				compraForm,
				detallesTemporales,
				detalleForm,
				detalleFormOpen,
				detalleEditandoIdx,
			})
		);
	}, [compraSheetMode, compraForm, detallesTemporales, detalleForm, detalleFormOpen, detalleEditandoIdx]);

	useEffect(() => {
		setCompraForm((prev) => {
			const subtotalString = String(subtotalFinalDetalles);
			if (prev.Sub_Tot_Com === subtotalString) return prev;
			return { ...prev, Sub_Tot_Com: subtotalString };
		});
	}, [setCompraForm, subtotalFinalDetalles]);

	const descartarBorradorCompra = () => {
		resetCompraDraftState({ clearMessages: true, closeSheet: true });
	};

	const guardarBorradorCompra = () => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(
			COMPRA_DRAFT_STORAGE_KEY,
			JSON.stringify({
				compraForm,
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
			const [comprasData, detalleData, proveedoresData, productosData, variantesData] = await Promise.all([
				comprasService.list(),
				detalleComprasService.list(),
				proveedoresService.list(),
				productosService.list(),
				variantesService.list(),
			]);

			setCompras(Array.isArray(comprasData) ? comprasData : []);
			setDetalleCompras(Array.isArray(detalleData) ? detalleData : []);
			setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
			setProductos(Array.isArray(productosData) ? productosData : []);
			setVariantes(Array.isArray(variantesData) ? variantesData : []);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar compras.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarTodo();
	}, []);

	const acciones = useComprasActions({
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
	});

	return {
		compras,
		detalleCompras,
		proveedores,
		productos,
		variantes,
		selectedCompraId,
		searchTerm,
		estadoFilter,
		loading,
		saving,
		error,
		success,
		compraSheetOpen,
		compraSheetMode,
		compraForm,
		detallesTemporales,
		detalleViewOpen,
		compraAEliminar,
		compraDeleteDialogOpen,
		detalleFormOpen,
		detalleForm,
		detalleEditandoIdx,
		proveedorMap,
		productoMap,
		varianteMap,
		compraSeleccionada,
		detallesDeCompra,
		compraTotals,
		detalleSubtotal,
		totalesDetalles,
		comprasFiltradas,
		setSearchTerm,
		setEstadoFilter,
		setProveedores,
		setCompraSheetOpen,
		setCompraForm,
		setDetalleForm,
		setDetallesTemporales,
		setDetalleFormOpen,
		setDetalleEditandoIdx,
		setCompraDeleteDialogOpen,
		setDetalleViewOpen,
		setSuccess,
		setError,
		setLoading,
		setSaving,
		guardarBorradorCompra,
		descartarBorradorCompra,
		...acciones,
	};
}
