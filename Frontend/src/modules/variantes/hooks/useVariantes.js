import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapProductoFromApi } from "../../productos/helpers/producto.mapper";
import { productosService } from "../../productos/services/productos.service";
import { mapVariantFromApi } from "../helpers/variant.mapper";
import { VARIANTE_INICIAL, isVariantFormValid } from "../schemas/variant.schema";
import { variantesService } from "../services/variantes.service";

export default function useVariantes() {
	const queryClient = useQueryClient();
	const [selectedId, setSelectedId] = useState(null);
	const [form, setForm] = useState(VARIANTE_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("");
	const [actionLoading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const variantesQueryKey = queryKeys.variantes.list();
	const productosQueryKey = queryKeys.productos.list();

	const variantesQuery = useQuery({
		queryKey: variantesQueryKey,
		queryFn: async () => toArray(await variantesService.list()).map(mapVariantFromApi),
	});

	const productosQuery = useQuery({
		queryKey: productosQueryKey,
		queryFn: async () => toArray(await productosService.list()).map(mapProductoFromApi),
	});

	const variantes = variantesQuery.data ?? [];
	const productos = productosQuery.data ?? [];
	const setVariantes = createQueryDataSetter(queryClient, variantesQueryKey, []);
	const setProductos = createQueryDataSetter(queryClient, productosQueryKey, []);
	const loading =
		actionLoading ||
		variantesQuery.isLoading ||
		variantesQuery.isFetching ||
		productosQuery.isLoading ||
		productosQuery.isFetching;

	const cargarVariantes = async () => {
		try {
			const data = await queryClient.fetchQuery({
				queryKey: variantesQueryKey,
				queryFn: async () => toArray(await variantesService.list()).map(mapVariantFromApi),
			});
			setError(null);
			return data;
		} catch (err) {
			setError(getErrorMessage(err, "Error al cargar variantes"));
			console.error("Error cargando variantes:", err);
			return [];
		}
	};

	const cargarProductos = async () => {
		try {
			return await queryClient.fetchQuery({
				queryKey: productosQueryKey,
				queryFn: async () => toArray(await productosService.list()).map(mapProductoFromApi),
			});
		} catch (err) {
			console.error("Error cargando productos:", err);
			setProductos([]);
			return [];
		}
	};

	useEffect(() => {
		setSelectedId((prev) => {
			if (prev && variantes.some((item) => item.Id_Var === prev)) return prev;
			return variantes[0]?.Id_Var ?? null;
		});
	}, [variantes]);

	const productoPorId = useMemo(() => new Map(productos.map((producto) => [Number(producto.Id_Prd), producto])), [productos]);

	const getProductoNombre = (idProducto) => {
		if (!idProducto) return "Sin producto";
		const producto = productoPorId.get(Number(idProducto));
		if (!producto) return `Producto #${idProducto}`;
		return producto.Nom_Prd || `Producto #${idProducto}`;
	};

	const variantesFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return variantes.filter((item) => {
			const atrValue = typeof item.Atr_Var === "string" ? item.Atr_Var : JSON.stringify(item.Atr_Var || {});
			const producto = productoPorId.get(Number(item.Id_Prd));
			const productoNombre = !item.Id_Prd ? "Sin producto" : producto?.Nom_Prd || `Producto #${item.Id_Prd}`;
			const matchesSearch =
				!query ||
				`${item.Nom_Var} ${item.Des_Var} ${atrValue} ${productoNombre} ${item.Not_Ven_Cor_Var ? "correo activo" : "correo inactivo"} ${item.Not_Ven_Wsp_Var ? "whatsapp activo" : "whatsapp inactivo"}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = !estadoFilter || item.Est_Var === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [variantes, searchTerm, estadoFilter, productoPorId]);

	const varianteSeleccionada = useMemo(() => variantes.find((item) => item.Id_Var === selectedId) || null, [variantes, selectedId]);

	const formValido = isVariantFormValid(form);

	return {
		variantes,
		setVariantes,
		variantesFiltradas,
		productos,
		setProductos,
		productoPorId,
		getProductoNombre,
		varianteSeleccionada,
		selectedId,
		setSelectedId,
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
		cargarVariantes,
		cargarProductos,
		formValido,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		setSheetMode,
	};
}
