import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import categoriasService from "../../categorias/services/categorias.service";
import { mapVariantFromApi } from "../../variantes/helpers/variant.mapper";
import { variantesService } from "../../variantes/services/variantes.service";
import { mapProductoFromApi } from "../helpers/producto.mapper";
import { PRODUCTO_INICIAL, isProductoFormValid } from "../schemas/producto.schema";
import { productosService } from "../services/productos.service";

export default function useProductos() {
	const queryClient = useQueryClient();
	const [selectedId, setSelectedId] = useState(null);
	const [form, setForm] = useState(PRODUCTO_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("");
	const [actionLoading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const productosQueryKey = queryKeys.productos.list();
	const categoriasQueryKey = queryKeys.categorias.list();
	const variantesQueryKey = queryKeys.variantes.list();

	const productosQuery = useQuery({
		queryKey: productosQueryKey,
		queryFn: async () => toArray(await productosService.list()).map(mapProductoFromApi),
	});

	const categoriasQuery = useQuery({
		queryKey: categoriasQueryKey,
		queryFn: async () => toArray(await categoriasService.list()),
	});

	const variantesQuery = useQuery({
		queryKey: variantesQueryKey,
		queryFn: async () => toArray(await variantesService.list()).map(mapVariantFromApi),
	});

	const productos = productosQuery.data ?? [];
	const variantes = variantesQuery.data ?? [];
	const categorias = categoriasQuery.data ?? [];
	const setProductos = createQueryDataSetter(queryClient, productosQueryKey, []);
	const setCategorias = createQueryDataSetter(queryClient, categoriasQueryKey, []);
	const setVariantes = createQueryDataSetter(queryClient, variantesQueryKey, []);
	const loading =
		actionLoading ||
		productosQuery.isLoading ||
		productosQuery.isFetching ||
		categoriasQuery.isLoading ||
		categoriasQuery.isFetching ||
		variantesQuery.isLoading ||
		variantesQuery.isFetching;

	const cargarProductos = async () => {
		try {
			const data = await queryClient.fetchQuery({
				queryKey: productosQueryKey,
				queryFn: async () => toArray(await productosService.list()).map(mapProductoFromApi),
			});
			setError(null);
			return data;
		} catch (err) {
			setError(getErrorMessage(err, "Error al cargar productos"));
			console.error("Error cargando productos:", err);
			return [];
		}
	};

	const cargarCategorias = async () => {
		try {
			return await queryClient.fetchQuery({
				queryKey: categoriasQueryKey,
				queryFn: async () => toArray(await categoriasService.list()),
			});
		} catch (err) {
			console.error("Error cargando categorias:", err);
			setCategorias([]);
			return [];
		}
	};

	const cargarVariantes = async () => {
		try {
			return await queryClient.fetchQuery({
				queryKey: variantesQueryKey,
				queryFn: async () => toArray(await variantesService.list()).map(mapVariantFromApi),
			});
		} catch (err) {
			console.error("Error cargando variantes:", err);
			setVariantes([]);
			return [];
		}
	};

	useEffect(() => {
		setSelectedId((prev) => {
			if (prev && productos.some((item) => item.Id_Prd === prev)) return prev;
			return productos[0]?.Id_Prd ?? null;
		});
	}, [productos]);

	const categoriasActivas = useMemo(() => categorias.filter((cat) => cat?.Est_Cat === "activo"), [categorias]);

	const productosFiltrados = useMemo(() => {
		return productos.filter((prod) => {
			const matchSearch =
				!searchTerm ||
				prod.Nom_Prd?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				prod.Cod_Prd?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				prod.Des_Cor_Prd?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchEstado = !estadoFilter || prod.Est_Prd === estadoFilter;

			return matchSearch && matchEstado;
		});
	}, [productos, searchTerm, estadoFilter]);

	const productoSeleccionado = useMemo(() => productos.find((p) => p.Id_Prd === selectedId) || null, [productos, selectedId]);

	const variantesPorProducto = useMemo(() => {
		return variantes.reduce((acc, variante) => {
			const idProducto = Number(variante?.Id_Prd);
			if (!idProducto) return acc;

			if (!acc[idProducto]) {
				acc[idProducto] = [];
			}

			acc[idProducto].push(variante);
			return acc;
		}, {});
	}, [variantes]);

	const formValido = isProductoFormValid(form);

	return {
		productos,
		setProductos,
		variantes,
		setVariantes,
		variantesPorProducto,
		productosFiltrados,
		productoSeleccionado,
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
		cargarProductos,
		formValido,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		setSheetMode,
		categorias,
		setCategorias,
		categoriasActivas,
		cargarCategorias,
		cargarVariantes,
	};
}
