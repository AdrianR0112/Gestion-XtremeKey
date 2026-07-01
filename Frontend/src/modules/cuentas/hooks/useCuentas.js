import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { productosService } from "../../productos/services/productos.service";
import { proveedoresService } from "../../proveedores/services/proveedores.service";
import { variantesService } from "../../variantes/services/variantes.service";
import { mapCuentaFromApi } from "../helpers/cuenta.mapper";
import { CUENTA_INICIAL, isCuentaFormValid } from "../schemas/cuenta.schema";
import cuentasService from "../services/cuentas.service";

export default function useCuentas() {
	const queryClient = useQueryClient();
	const [selectedCuentaId, setSelectedCuentaId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(CUENTA_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [actionLoading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const cuentasQueryKey = queryKeys.cuentas.list();
	const productosQueryKey = queryKeys.productos.list();
	const variantesQueryKey = queryKeys.variantes.list();
	const proveedoresQueryKey = queryKeys.proveedores.list();

	const cuentasQuery = useQuery({
		queryKey: cuentasQueryKey,
		queryFn: async () => toArray(await cuentasService.list()).map((item) => mapCuentaFromApi(item)),
	});
	const productosQuery = useQuery({
		queryKey: productosQueryKey,
		queryFn: async () => toArray(await productosService.list()),
	});
	const variantesQuery = useQuery({
		queryKey: variantesQueryKey,
		queryFn: async () => toArray(await variantesService.list()),
	});
	const proveedoresQuery = useQuery({
		queryKey: proveedoresQueryKey,
		queryFn: async () => toArray(await proveedoresService.list()),
	});

	const cuentas = cuentasQuery.data ?? [];
	const productos = productosQuery.data ?? [];
	const variantes = variantesQuery.data ?? [];
	const proveedores = proveedoresQuery.data ?? [];
	const setCuentas = createQueryDataSetter(queryClient, cuentasQueryKey, []);
	const setProductos = createQueryDataSetter(queryClient, productosQueryKey, []);
	const setVariantes = createQueryDataSetter(queryClient, variantesQueryKey, []);
	const setProveedores = createQueryDataSetter(queryClient, proveedoresQueryKey, []);
	const loading =
		actionLoading ||
		cuentasQuery.isLoading ||
		cuentasQuery.isFetching ||
		productosQuery.isLoading ||
		productosQuery.isFetching ||
		variantesQuery.isLoading ||
		variantesQuery.isFetching ||
		proveedoresQuery.isLoading ||
		proveedoresQuery.isFetching;

	const cargarCatalogos = async () => {
		try {
			return await Promise.all([
				queryClient.fetchQuery({ queryKey: productosQueryKey, queryFn: async () => toArray(await productosService.list()) }),
				queryClient.fetchQuery({ queryKey: variantesQueryKey, queryFn: async () => toArray(await variantesService.list()) }),
				queryClient.fetchQuery({ queryKey: proveedoresQueryKey, queryFn: async () => toArray(await proveedoresService.list()) }),
			]);
		} catch {
			return [[], [], []];
		}
	};

	const cargarCuentas = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: cuentasQueryKey,
				queryFn: async () => toArray(await cuentasService.list()).map((item) => mapCuentaFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar cuentas."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedCuentaId((prev) => {
			if (prev && cuentas.some((item) => Number(item.Id_Cue) === Number(prev))) return prev;
			return cuentas[0]?.Id_Cue ?? null;
		});
	}, [cuentas]);

	const productoMap = useMemo(() => new Map(productos.map((item) => [Number(item.Id_Prd), item.Nom_Prd || `#${item.Id_Prd}`])), [productos]);
	const varianteMap = useMemo(() => new Map(variantes.map((item) => [Number(item.Id_Var), item.Nom_Var || `#${item.Id_Var}`])), [variantes]);
	const proveedorMap = useMemo(() => new Map(proveedores.map((item) => [Number(item.Id_Pro), item.Nom_Pro || `#${item.Id_Pro}`])), [proveedores]);

	const cuentaSeleccionada = useMemo(
		() => cuentas.find((cuenta) => Number(cuenta.Id_Cue) === Number(selectedCuentaId)) || null,
		[cuentas, selectedCuentaId]
	);

	const cuentasFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return cuentas.filter((cuenta) => {
			const productoNombre = cuenta.Id_Prd ? productoMap.get(Number(cuenta.Id_Prd)) || "" : "";
			const varianteNombre = cuenta.Id_Var ? varianteMap.get(Number(cuenta.Id_Var)) || "" : "";
			const proveedorNombre = cuenta.Id_Pro ? proveedorMap.get(Number(cuenta.Id_Pro)) || "" : "";

			const matchesSearch =
				!query ||
				`${cuenta.Nom_Cue || ""} ${cuenta.Usu_Cue || ""} ${cuenta.Per_Cue || ""} ${productoNombre} ${varianteNombre} ${proveedorNombre}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = estadoFilter === "todos" || cuenta.Est_Cue === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [cuentas, estadoFilter, productoMap, proveedorMap, searchTerm, varianteMap]);

	const resetForm = () => setForm(CUENTA_INICIAL);
	const formValido = isCuentaFormValid(form);

	return {
		cuentas,
		setCuentas,
		cuentasFiltradas,
		productos,
		setProductos,
		variantes,
		setVariantes,
		proveedores,
		setProveedores,
		productoMap,
		varianteMap,
		proveedorMap,
		selectedCuentaId,
		setSelectedCuentaId,
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
		loading,
		setLoading,
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		cuentaSeleccionada,
		formValido,
		resetForm,
		cargarCatalogos,
		cargarCuentas,
	};
}
