import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import clientesService from "../../clientes/services/clientes.service";
import configuracionService from "../../configuracion/services/configuracion.service";
import revendedoresService from "../../revendedores/services/revendedores.service";
import { productosService } from "../../productos/services/productos.service";
import { variantesService } from "../../variantes/services/variantes.service";
import { DEFAULT_DIAS_GRACIA } from "../../../utils/duration";
import { filterSuscripciones, mapSuscripcionFromApi } from "../helpers/suscripcion.mapper";
import { isSuscripcionFormValid, SUSCRIPCION_INICIAL } from "../schemas/suscripcion.schema";
import suscripcionesService from "../services/suscripciones.service";

export default function useSuscripciones() {
	const [searchParams] = useSearchParams();
	const queryClient = useQueryClient();
	const [selectedId, setSelectedId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(SUSCRIPCION_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState(() => {
		const value = searchParams.get("estado");
		return ["todos", "activa", "suspendida", "cancelada", "expirada"].includes(value) ? value : "todos";
	});
	const [vencimientoFilter, setVencimientoFilter] = useState(() => {
		const value = searchParams.get("vencimiento");
		return ["todas", "por_vencer", "vencidas", "vigentes", "sin_vencimiento", "archivadas"].includes(value) ? value : "todas";
	});
	const [titularFilter, setTitularFilter] = useState("todos");
	const [selectedIds, setSelectedIds] = useState(() => new Set());
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const configuracionActualQueryKey = queryKeys.configuracion.current();
	const configuracionActualQuery = useQuery({
		queryKey: configuracionActualQueryKey,
		queryFn: async () => configuracionService.getCurrent().catch((err) => {
			if (err?.status === 404) return null;
			throw err;
		}),
	});
	const configuracionActual = configuracionActualQuery.data ?? null;
	const diasPorVencer = Number.isInteger(Number(configuracionActual?.Dia_Ant_Not_Con))
		? Number(configuracionActual.Dia_Ant_Not_Con)
		: 7;

	// Estos filtros viajan al servidor: la definicion de "por vencer" vive en
	// SQL y la comparten la tabla, las tarjetas KPI y el job de expiracion.
	const filtros = useMemo(
		() => ({
			estado: estadoFilter,
			vencimiento: vencimientoFilter,
			titular: titularFilter,
			dias: diasPorVencer,
		}),
		[estadoFilter, vencimientoFilter, titularFilter, diasPorVencer]
	);

	const suscripcionesQueryKey = queryKeys.suscripciones.list(filtros);
	const resumenQueryKey = queryKeys.suscripciones.resumen({ dias: diasPorVencer });
	const clientesQueryKey = queryKeys.clientes.list();
	const revendedoresQueryKey = queryKeys.revendedores.list();
	const productosQueryKey = queryKeys.productos.list();
	const variantesQueryKey = queryKeys.variantes.list();

	const fetchSuscripciones = async () =>
		toArray(await suscripcionesService.list(filtros)).map((item) => mapSuscripcionFromApi(item));

	const suscripcionesQuery = useQuery({ queryKey: suscripcionesQueryKey, queryFn: fetchSuscripciones });
	const resumenQuery = useQuery({
		queryKey: resumenQueryKey,
		queryFn: async () => suscripcionesService.getResumen({ dias: diasPorVencer }),
	});
	const clientesQuery = useQuery({ queryKey: clientesQueryKey, queryFn: async () => toArray(await clientesService.list()) });
	const revendedoresQuery = useQuery({
		queryKey: revendedoresQueryKey,
		queryFn: async () => toArray(await revendedoresService.list()),
	});
	const productosQuery = useQuery({ queryKey: productosQueryKey, queryFn: async () => toArray(await productosService.list()) });
	const variantesQuery = useQuery({ queryKey: variantesQueryKey, queryFn: async () => toArray(await variantesService.list()) });

	const suscripciones = suscripcionesQuery.data ?? [];
	const resumen = resumenQuery.data ?? null;
	const clientes = clientesQuery.data ?? [];
	const revendedores = revendedoresQuery.data ?? [];
	const productos = productosQuery.data ?? [];
	const variantes = variantesQuery.data ?? [];

	const graciaDias = Number.isInteger(Number(configuracionActual?.Dia_Gra_Ren_Con))
		? Number(configuracionActual.Dia_Gra_Ren_Con)
		: DEFAULT_DIAS_GRACIA;
	// Solo para el texto explicativo del archivo: quien decide que se archiva es
	// el servidor.
	const diasArchivo = Number.isInteger(Number(configuracionActual?.Dia_Arc_Ven_Con))
		? Number(configuracionActual.Dia_Arc_Ven_Con)
		: 5;

	const setSuscripciones = createQueryDataSetter(queryClient, suscripcionesQueryKey, []);

	const loading =
		suscripcionesQuery.isLoading || suscripcionesQuery.isFetching ||
		clientesQuery.isLoading || clientesQuery.isFetching ||
		revendedoresQuery.isLoading || revendedoresQuery.isFetching ||
		productosQuery.isLoading || productosQuery.isFetching ||
		variantesQuery.isLoading || variantesQuery.isFetching;

	const cargarSuscripciones = async () => {
		setError("");
		try {
			const [datos] = await Promise.all([
				queryClient.fetchQuery({ queryKey: suscripcionesQueryKey, queryFn: fetchSuscripciones }),
				queryClient.invalidateQueries({ queryKey: ["suscripciones"] }),
				// Renovar crea ventas y detalles: sin esto, esos modulos quedarian
				// desactualizados hasta un refresh manual.
				queryClient.invalidateQueries({ queryKey: queryKeys.ventas.list() }),
				queryClient.invalidateQueries({ queryKey: queryKeys.detalleVentas.list() }),
			]);
			return datos;
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar las suscripciones."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedId((prev) => {
			if (prev && suscripciones.some((item) => item.Id_Sus === prev)) return prev;
			return suscripciones[0]?.Id_Sus ?? null;
		});
	}, [suscripciones]);

	const suscripcionSeleccionada = useMemo(
		() => suscripciones.find((item) => item.Id_Sus === selectedId) || null,
		[suscripciones, selectedId]
	);

	const resetForm = () => setForm(SUSCRIPCION_INICIAL);

	const productosSuscripcion = useMemo(
		() => productos.filter((producto) => producto.Tip_Prd === "suscripcion"),
		[productos]
	);

	const variantesDelProducto = useMemo(
		() => variantes.filter((variante) => Number(variante.Id_Prd) === Number(form.Id_Prd)),
		[variantes, form.Id_Prd]
	);

	// variantesDelProducto sigue al producto del formulario de crear/editar; el
	// modal de renovacion necesita las variantes de una suscripcion cualquiera,
	// asi que se indexan todas por producto.
	const variantesPorProducto = useMemo(() => {
		const mapa = new Map();
		for (const variante of variantes) {
			if ((variante.Est_Var || "").toString().toLowerCase() !== "activo") continue;
			const idProducto = Number(variante.Id_Prd);
			if (!idProducto) continue;
			if (!mapa.has(idProducto)) mapa.set(idProducto, []);
			mapa.get(idProducto).push(variante);
		}
		return mapa;
	}, [variantes]);

	// Solo el texto libre se filtra en cliente.
	const suscripcionesFiltradas = useMemo(
		() => filterSuscripciones(suscripciones, searchTerm),
		[suscripciones, searchTerm]
	);

	// La seleccion se limpia de lo que ya no esta a la vista, para que "renovar
	// N seleccionadas" nunca incluya filas que el usuario dejo de ver al cambiar
	// de filtro.
	useEffect(() => {
		setSelectedIds((prev) => {
			if (prev.size === 0) return prev;
			const visibles = new Set(suscripcionesFiltradas.map((item) => item.Id_Sus));
			const siguiente = new Set([...prev].filter((id) => visibles.has(id)));
			return siguiente.size === prev.size ? prev : siguiente;
		});
	}, [suscripcionesFiltradas]);

	const toggleSelected = (id) => {
		setSelectedIds((prev) => {
			const siguiente = new Set(prev);
			if (siguiente.has(id)) siguiente.delete(id);
			else siguiente.add(id);
			return siguiente;
		});
	};

	// Marca TODAS las filtradas, no solo la pagina visible.
	const selectAllFiltradas = () => setSelectedIds(new Set(suscripcionesFiltradas.map((item) => item.Id_Sus)));
	const clearSelection = () => setSelectedIds(new Set());

	const suscripcionesSeleccionadas = useMemo(
		() => suscripcionesFiltradas.filter((item) => selectedIds.has(item.Id_Sus)),
		[suscripcionesFiltradas, selectedIds]
	);

	const formValido = isSuscripcionFormValid(form);

	return {
		suscripciones,
		setSuscripciones,
		suscripcionesFiltradas,
		resumen,
		clientes,
		revendedores,
		productos,
		productosSuscripcion,
		variantes,
		variantesDelProducto,
		variantesPorProducto,
		configuracionActual,
		graciaDias,
		diasArchivo,
		selectedId,
		setSelectedId,
		selectedIds,
		toggleSelected,
		selectAllFiltradas,
		clearSelection,
		suscripcionesSeleccionadas,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		setSheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		estadoFilter,
		setEstadoFilter,
		vencimientoFilter,
		setVencimientoFilter,
		titularFilter,
		setTitularFilter,
		diasPorVencer,
		loading,
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		suscripcionSeleccionada,
		formValido,
		resetForm,
		cargarSuscripciones,
	};
}
