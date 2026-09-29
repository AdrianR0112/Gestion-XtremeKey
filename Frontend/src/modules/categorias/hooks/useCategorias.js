import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapCategoriaFromApi } from "../helpers/categoria.mapper";
import { CATEGORIA_INICIAL, isCategoriaFormValid } from "../schemas/categoria.schema";
import categoriasService from "../services/categorias.service";

export default function useCategorias() {
	const queryClient = useQueryClient();
	const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(CATEGORIA_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const categoriasQueryKey = queryKeys.categorias.list();
	const categoriasQuery = useQuery({
		queryKey: categoriasQueryKey,
		queryFn: async () => toArray(await categoriasService.list()).map((item) => mapCategoriaFromApi(item)),
	});
	const categorias = categoriasQuery.data ?? [];
	const setCategorias = createQueryDataSetter(queryClient, categoriasQueryKey, []);
	const loading = categoriasQuery.isLoading || categoriasQuery.isFetching;

	const cargarCategorias = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: categoriasQueryKey,
				queryFn: async () => toArray(await categoriasService.list()).map((item) => mapCategoriaFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar categorias."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedCategoriaId((prev) => {
			if (prev && categorias.some((item) => item.Id_Cat === prev)) return prev;
			return categorias[0]?.Id_Cat ?? null;
		});
	}, [categorias]);

	const categoriaSeleccionada = useMemo(
		() => categorias.find((item) => item.Id_Cat === selectedCategoriaId) || null,
		[categorias, selectedCategoriaId]
	);

	const resetForm = () => setForm(CATEGORIA_INICIAL);

	const categoriasFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return categorias.filter((item) => {
			const matchesSearch =
				!query || `${item.Nom_Cat} ${item.Des_Cat} ${item.Ico_Cat}`.toLowerCase().includes(query);
			const matchesEstado = estadoFilter === "todos" || item.Est_Cat === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [categorias, searchTerm, estadoFilter]);

	const formValido = isCategoriaFormValid(form);

	return {
		categorias,
		setCategorias,
		categoriasFiltradas,
		selectedCategoriaId,
		setSelectedCategoriaId,
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
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		categoriaSeleccionada,
		formValido,
		resetForm,
		cargarCategorias,
	};
}
