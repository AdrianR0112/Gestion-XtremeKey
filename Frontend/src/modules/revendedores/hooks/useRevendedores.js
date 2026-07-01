import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import { mapRevendedorFromApi } from "../helpers/revendedor.mapper";
import { REVENDEDOR_INICIAL, isRevendedorFormValid } from "../schemas/revendedor.schema";
import revendedoresService from "../services/revendedores.service";

export default function useRevendedores() {
	const queryClient = useQueryClient();
	const [selectedRevendedorId, setSelectedRevendedorId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(REVENDEDOR_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const revendedoresQueryKey = queryKeys.revendedores.list();
	const revendedoresQuery = useQuery({
		queryKey: revendedoresQueryKey,
		queryFn: async () => toArray(await revendedoresService.list()).map((item) => mapRevendedorFromApi(item)),
	});
	const revendedores = revendedoresQuery.data ?? [];
	const setRevendedores = createQueryDataSetter(queryClient, revendedoresQueryKey, []);
	const loading = revendedoresQuery.isLoading || revendedoresQuery.isFetching;

	const cargarRevendedores = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: revendedoresQueryKey,
				queryFn: async () => toArray(await revendedoresService.list()).map((item) => mapRevendedorFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar revendedores."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedRevendedorId((prev) => {
			if (prev && revendedores.some((item) => item.Id_Rev === prev)) return prev;
			return revendedores[0]?.Id_Rev ?? null;
		});
	}, [revendedores]);

	const revendedorSeleccionado = useMemo(
		() => revendedores.find((revendedor) => revendedor.Id_Rev === selectedRevendedorId) || null,
		[revendedores, selectedRevendedorId]
	);

	const resetForm = () => setForm(REVENDEDOR_INICIAL);

	const revendedoresFiltrados = useMemo(() => {
		const query = normalizeSearchText(searchTerm);
		return revendedores.filter((revendedor) => {
			const matchesSearch =
				!query ||
				matchesTextSearch([revendedor.Nom_Rev, revendedor.Ape_Rev, revendedor.Ema_Rev], query) ||
				matchesPhoneSearch(revendedor.Tel_Rev, query);
			const matchesEstado = estadoFilter === "todos" || revendedor.Est_Rev === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [revendedores, searchTerm, estadoFilter]);

	const formValido = isRevendedorFormValid(form);

	return {
		revendedores,
		setRevendedores,
		revendedoresFiltrados,
		selectedRevendedorId,
		setSelectedRevendedorId,
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
		revendedorSeleccionado,
		formValido,
		resetForm,
		cargarRevendedores,
	};
}
