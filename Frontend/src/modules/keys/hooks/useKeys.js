import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { productosService } from "../../productos/services/productos.service";
import { proveedoresService } from "../../proveedores/services/proveedores.service";
import { variantesService } from "../../variantes/services/variantes.service";
import { mapKeyFromApi } from "../helpers/key.mapper";
import { isKeyFormValid, KEY_INICIAL } from "../schemas/key.schema";
import keysService from "../services/keys.service";

export default function useKeys() {
	const queryClient = useQueryClient();
	const [selectedKeyId, setSelectedKeyId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(KEY_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [actionLoading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const keysQueryKey = queryKeys.keys.list();
	const productosQueryKey = queryKeys.productos.list();
	const variantesQueryKey = queryKeys.variantes.list();
	const proveedoresQueryKey = queryKeys.proveedores.list();

	const keysQuery = useQuery({
		queryKey: keysQueryKey,
		queryFn: async () => toArray(await keysService.list()).map((item) => mapKeyFromApi(item)),
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

	const keys = keysQuery.data ?? [];
	const productos = productosQuery.data ?? [];
	const variantes = variantesQuery.data ?? [];
	const proveedores = proveedoresQuery.data ?? [];
	const setKeys = createQueryDataSetter(queryClient, keysQueryKey, []);
	const setProductos = createQueryDataSetter(queryClient, productosQueryKey, []);
	const setVariantes = createQueryDataSetter(queryClient, variantesQueryKey, []);
	const setProveedores = createQueryDataSetter(queryClient, proveedoresQueryKey, []);
	const loading =
		actionLoading ||
		keysQuery.isLoading ||
		keysQuery.isFetching ||
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

	const cargarKeys = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: keysQueryKey,
				queryFn: async () => toArray(await keysService.list()).map((item) => mapKeyFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar keys."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedKeyId((prev) => {
			if (prev && keys.some((item) => Number(item.Id_Key) === Number(prev))) return prev;
			return keys[0]?.Id_Key ?? null;
		});
	}, [keys]);

	const productoMap = useMemo(() => new Map(productos.map((item) => [Number(item.Id_Prd), item.Nom_Prd || `#${item.Id_Prd}`])), [productos]);
	const varianteMap = useMemo(() => new Map(variantes.map((item) => [Number(item.Id_Var), item.Nom_Var || `#${item.Id_Var}`])), [variantes]);
	const proveedorMap = useMemo(() => new Map(proveedores.map((item) => [Number(item.Id_Pro), item.Nom_Pro || `#${item.Id_Pro}`])), [proveedores]);

	const keySeleccionada = useMemo(() => keys.find((key) => Number(key.Id_Key) === Number(selectedKeyId)) || null, [keys, selectedKeyId]);

	const keysFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return keys.filter((key) => {
			const productoNombre = key.Id_Prd ? productoMap.get(Number(key.Id_Prd)) || "" : "";
			const varianteNombre = key.Id_Var ? varianteMap.get(Number(key.Id_Var)) || "" : "";
			const proveedorNombre = key.Id_Pro ? proveedorMap.get(Number(key.Id_Pro)) || "" : "";

			const matchesSearch =
				!query ||
				`${key.Cla_Key || ""} ${key.Des_Key || ""} ${productoNombre} ${varianteNombre} ${proveedorNombre} ${key.Es_Per_Vid_Key ? "por vida" : "temporal"}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = estadoFilter === "todos" || key.Est_Key === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [estadoFilter, keys, productoMap, proveedorMap, searchTerm, varianteMap]);

	const resetForm = () => setForm(KEY_INICIAL);
	const formValido = isKeyFormValid(form);

	return {
		keys,
		setKeys,
		keysFiltradas,
		productos,
		setProductos,
		variantes,
		setVariantes,
		proveedores,
		setProveedores,
		productoMap,
		varianteMap,
		proveedorMap,
		selectedKeyId,
		setSelectedKeyId,
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
		keySeleccionada,
		formValido,
		resetForm,
		cargarCatalogos,
		cargarKeys,
	};
}
