import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import clientesService from "../../clientes/services/clientes.service";
import configuracionService from "../../configuracion/services/configuracion.service";
import { cuentasService } from "../../cuentas/services/cuentas.service";
import { keysService } from "../../keys/services/keys.service";
import { productosService } from "../../productos/services/productos.service";
import revendedoresService from "../../revendedores/services/revendedores.service";
import { variantesService } from "../../variantes/services/variantes.service";
import {
	buildClienteMap,
	buildClienteSearchMap,
	buildProductoMap,
	buildRevendedorMap,
	buildRevendedorSearchMap,
	buildVarianteMap,
	filterVentas,
} from "../helpers/venta.mapper";
import { createDetalleForm, createVentaForm } from "../schemas/venta.schema";
import detalleVentasService from "../services/detalleVentas.service";
import ventasService from "../services/ventas.service";
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
			detalleEditandoIdx: typeof parsed?.detalleEditandoIdx === "number" ? parsed.detalleEditandoIdx : null,
		};
	} catch {
		return getEmptyVentaDraft();
	}
}

export default function useVentas() {
	const queryClient = useQueryClient();
	const draftPersistDisabledRef = useRef(false);
	const initialDraft = useMemo(() => readVentaDraft(), []);
	const [selectedVentaId, setSelectedVentaId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [actionLoading, setLoading] = useState(false);
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

	const ventasQueryKey = queryKeys.ventas.list();
	const detalleVentasQueryKey = queryKeys.detalleVentas.list();
	const clientesQueryKey = queryKeys.clientes.list();
	const revendedoresQueryKey = queryKeys.revendedores.list();
	const productosQueryKey = queryKeys.productos.list();
	const variantesQueryKey = queryKeys.variantes.list();
	const cuentasQueryKey = queryKeys.cuentas.list();
	const keysDataQueryKey = queryKeys.keys.list();
	const configuracionActualQueryKey = queryKeys.configuracion.current();

	const ventasQuery = useQuery({ queryKey: ventasQueryKey, queryFn: async () => toArray(await ventasService.list()) });
	const detalleVentasQuery = useQuery({ queryKey: detalleVentasQueryKey, queryFn: async () => toArray(await detalleVentasService.list()) });
	const clientesQuery = useQuery({ queryKey: clientesQueryKey, queryFn: async () => toArray(await clientesService.list()) });
	const revendedoresQuery = useQuery({ queryKey: revendedoresQueryKey, queryFn: async () => toArray(await revendedoresService.list()) });
	const productosQuery = useQuery({ queryKey: productosQueryKey, queryFn: async () => toArray(await productosService.list()) });
	const variantesQuery = useQuery({ queryKey: variantesQueryKey, queryFn: async () => toArray(await variantesService.list()) });
	const cuentasQuery = useQuery({ queryKey: cuentasQueryKey, queryFn: async () => toArray(await cuentasService.list()) });
	const keysDataQuery = useQuery({ queryKey: keysDataQueryKey, queryFn: async () => toArray(await keysService.list()) });
	const configuracionActualQuery = useQuery({
		queryKey: configuracionActualQueryKey,
		queryFn: async () => {
			return await configuracionService.getCurrent().catch((err) => {
				if (err?.status === 404) return null;
				throw err;
			});
		},
	});

	const ventas = ventasQuery.data ?? [];
	const detalleVentas = detalleVentasQuery.data ?? [];
	const clientes = clientesQuery.data ?? [];
	const revendedores = revendedoresQuery.data ?? [];
	const productos = productosQuery.data ?? [];
	const variantes = variantesQuery.data ?? [];
	const cuentas = cuentasQuery.data ?? [];
	const keysData = keysDataQuery.data ?? [];
	const configuracionActual = configuracionActualQuery.data ?? null;
	const setVentas = createQueryDataSetter(queryClient, ventasQueryKey, []);
	const setDetalleVentas = createQueryDataSetter(queryClient, detalleVentasQueryKey, []);
	const setClientes = createQueryDataSetter(queryClient, clientesQueryKey, []);
	const setRevendedores = createQueryDataSetter(queryClient, revendedoresQueryKey, []);
	const setProductos = createQueryDataSetter(queryClient, productosQueryKey, []);
	const setVariantes = createQueryDataSetter(queryClient, variantesQueryKey, []);
	const setCuentas = createQueryDataSetter(queryClient, cuentasQueryKey, []);
	const setKeysData = createQueryDataSetter(queryClient, keysDataQueryKey, []);
	const loading =
		actionLoading ||
		ventasQuery.isLoading || ventasQuery.isFetching ||
		detalleVentasQuery.isLoading || detalleVentasQuery.isFetching ||
		clientesQuery.isLoading || clientesQuery.isFetching ||
		revendedoresQuery.isLoading || revendedoresQuery.isFetching ||
		productosQuery.isLoading || productosQuery.isFetching ||
		variantesQuery.isLoading || variantesQuery.isFetching ||
		cuentasQuery.isLoading || cuentasQuery.isFetching ||
		keysDataQuery.isLoading || keysDataQuery.isFetching ||
		configuracionActualQuery.isLoading || configuracionActualQuery.isFetching;

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
		setSelectedVentaId((prev) => {
			if (prev && ventas.some((venta) => Number(venta.Id_Ven) === Number(prev))) return prev;
			return ventas[0]?.Id_Ven ?? null;
		});
	}, [ventas]);

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
		setError("");
		try {
			return await Promise.all([
				queryClient.fetchQuery({ queryKey: ventasQueryKey, queryFn: async () => toArray(await ventasService.list()) }),
				queryClient.fetchQuery({ queryKey: detalleVentasQueryKey, queryFn: async () => toArray(await detalleVentasService.list()) }),
				queryClient.fetchQuery({ queryKey: clientesQueryKey, queryFn: async () => toArray(await clientesService.list()) }),
				queryClient.fetchQuery({ queryKey: productosQueryKey, queryFn: async () => toArray(await productosService.list()) }),
				queryClient.fetchQuery({ queryKey: variantesQueryKey, queryFn: async () => toArray(await variantesService.list()) }),
				queryClient.fetchQuery({ queryKey: cuentasQueryKey, queryFn: async () => toArray(await cuentasService.list()) }),
				queryClient.fetchQuery({ queryKey: keysDataQueryKey, queryFn: async () => toArray(await keysService.list()) }),
				queryClient.fetchQuery({ queryKey: revendedoresQueryKey, queryFn: async () => toArray(await revendedoresService.list()) }),
				queryClient.fetchQuery({
					queryKey: configuracionActualQueryKey,
					queryFn: async () => {
						return await configuracionService.getCurrent().catch((err) => {
							if (err?.status === 404) return null;
							throw err;
						});
					},
				}),
			]);
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar ventas."));
			return [[], [], [], [], [], [], [], [], null];
		}
	};

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
		setVentas,
		detalleVentas,
		setDetalleVentas,
		clientes,
		setClientes,
		revendedores,
		setRevendedores,
		productos,
		setProductos,
		variantes,
		setVariantes,
		cuentas,
		setCuentas,
		keysData,
		setKeysData,
		configuracionActual,
		impuestoHabilitado,
		selectedVentaId,
		searchTerm,
		estadoFilter,
		loading,
		setLoading,
		saving,
		setSaving,
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
		guardarBorradorVenta,
		descartarBorradorVenta,
		cargarTodo,
		...acciones,
	};
}
