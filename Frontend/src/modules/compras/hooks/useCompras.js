import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import proveedoresService from "../../proveedores/services/proveedores.service";
import { productosService } from "../../productos/services/productos.service";
import { variantesService } from "../../variantes/services/variantes.service";
import { buildProductoMap, buildProveedorMap, buildVarianteMap, filterCompras } from "../helpers/compra.mapper";
import { createCompraForm, createDetalleCompraForm } from "../schemas/compra.schema";
import comprasService from "../services/compras.service";
import detalleComprasService from "../services/detalleCompras.service";
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
	} catch {
		return getEmptyCompraDraft();
	}
}

export default function useCompras() {
	const queryClient = useQueryClient();
	const draftPersistDisabledRef = useRef(false);
	const initialDraft = useMemo(() => readCompraDraft(), []);
	const [selectedCompraId, setSelectedCompraId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [actionLoading, setLoading] = useState(false);
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

	const comprasQueryKey = queryKeys.compras.list();
	const detalleComprasQueryKey = queryKeys.detalleCompras.list();
	const proveedoresQueryKey = queryKeys.proveedores.list();
	const productosQueryKey = queryKeys.productos.list();
	const variantesQueryKey = queryKeys.variantes.list();

	const comprasQuery = useQuery({
		queryKey: comprasQueryKey,
		queryFn: async () => toArray(await comprasService.list()),
	});
	const detalleComprasQuery = useQuery({
		queryKey: detalleComprasQueryKey,
		queryFn: async () => toArray(await detalleComprasService.list()),
	});
	const proveedoresQuery = useQuery({
		queryKey: proveedoresQueryKey,
		queryFn: async () => toArray(await proveedoresService.list()),
	});
	const productosQuery = useQuery({
		queryKey: productosQueryKey,
		queryFn: async () => toArray(await productosService.list()),
	});
	const variantesQuery = useQuery({
		queryKey: variantesQueryKey,
		queryFn: async () => toArray(await variantesService.list()),
	});

	const compras = comprasQuery.data ?? [];
	const detalleCompras = detalleComprasQuery.data ?? [];
	const proveedores = proveedoresQuery.data ?? [];
	const productos = productosQuery.data ?? [];
	const variantes = variantesQuery.data ?? [];
	const setCompras = createQueryDataSetter(queryClient, comprasQueryKey, []);
	const setDetalleCompras = createQueryDataSetter(queryClient, detalleComprasQueryKey, []);
	const setProveedores = createQueryDataSetter(queryClient, proveedoresQueryKey, []);
	const setProductos = createQueryDataSetter(queryClient, productosQueryKey, []);
	const setVariantes = createQueryDataSetter(queryClient, variantesQueryKey, []);
	const loading =
		actionLoading ||
		comprasQuery.isLoading ||
		comprasQuery.isFetching ||
		detalleComprasQuery.isLoading ||
		detalleComprasQuery.isFetching ||
		proveedoresQuery.isLoading ||
		proveedoresQuery.isFetching ||
		productosQuery.isLoading ||
		productosQuery.isFetching ||
		variantesQuery.isLoading ||
		variantesQuery.isFetching;

	const proveedorMap = useMemo(() => buildProveedorMap(proveedores), [proveedores]);
	const productoMap = useMemo(() => buildProductoMap(productos), [productos]);
	const varianteMap = useMemo(() => buildVarianteMap(variantes), [variantes]);
	const compraSeleccionada = useMemo(() => compras.find((compra) => Number(compra.Id_Com) === Number(selectedCompraId)) || null, [compras, selectedCompraId]);
	const detallesDeCompra = useMemo(() => detalleCompras.filter((item) => Number(item.Id_Com) === Number(selectedCompraId)), [detalleCompras, selectedCompraId]);
	const subtotalFinalDetalles = useMemo(
		() => Number(detallesTemporales.reduce((sum, det) => sum + Number(det.Sub_Tot_Dco || 0), 0).toFixed(2)),
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
		setSelectedCompraId((prev) => {
			if (prev && compras.some((item) => Number(item.Id_Com) === Number(prev))) return prev;
			return compras[0]?.Id_Com ?? null;
		});
	}, [compras]);

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
	}, [subtotalFinalDetalles]);

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
		setError("");
		try {
			const data = await Promise.all([
				queryClient.fetchQuery({ queryKey: comprasQueryKey, queryFn: async () => toArray(await comprasService.list()) }),
				queryClient.fetchQuery({ queryKey: detalleComprasQueryKey, queryFn: async () => toArray(await detalleComprasService.list()) }),
				queryClient.fetchQuery({ queryKey: proveedoresQueryKey, queryFn: async () => toArray(await proveedoresService.list()) }),
				queryClient.fetchQuery({ queryKey: productosQueryKey, queryFn: async () => toArray(await productosService.list()) }),
				queryClient.fetchQuery({ queryKey: variantesQueryKey, queryFn: async () => toArray(await variantesService.list()) }),
			]);

			return data;
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar compras."));
			return [[], [], [], [], []];
		}
	};

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
		setCompras,
		detalleCompras,
		setDetalleCompras,
		proveedores,
		setProveedores,
		productos,
		setProductos,
		variantes,
		setVariantes,
		selectedCompraId,
		searchTerm,
		estadoFilter,
		loading,
		setLoading,
		saving,
		setSaving,
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
		guardarBorradorCompra,
		descartarBorradorCompra,
		cargarTodo,
		...acciones,
	};
}
