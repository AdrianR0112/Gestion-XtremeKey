import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import { mapProveedorFromApi } from "../helpers/proveedor.mapper";
import { PROVEEDOR_INICIAL, isProveedorFormValid } from "../schemas/proveedor.schema";
import proveedoresService from "../services/proveedores.service";

export default function useProveedores() {
	const queryClient = useQueryClient();
	const [selectedProveedorId, setSelectedProveedorId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(PROVEEDOR_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const proveedoresQueryKey = queryKeys.proveedores.list();
	const proveedoresQuery = useQuery({
		queryKey: proveedoresQueryKey,
		queryFn: async () => toArray(await proveedoresService.list()).map((item) => mapProveedorFromApi(item)),
	});
	const proveedores = proveedoresQuery.data ?? [];
	const setProveedores = createQueryDataSetter(queryClient, proveedoresQueryKey, []);
	const loading = proveedoresQuery.isLoading || proveedoresQuery.isFetching;

	const cargarProveedores = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: proveedoresQueryKey,
				queryFn: async () => toArray(await proveedoresService.list()).map((item) => mapProveedorFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar proveedores."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedProveedorId((prev) => {
			if (prev && proveedores.some((item) => item.Id_Pro === prev)) return prev;
			return proveedores[0]?.Id_Pro ?? null;
		});
	}, [proveedores]);

	const proveedorSeleccionado = useMemo(
		() => proveedores.find((item) => item.Id_Pro === selectedProveedorId) || null,
		[proveedores, selectedProveedorId]
	);

	const resetForm = () => setForm(PROVEEDOR_INICIAL);

	const proveedoresFiltrados = useMemo(() => {
		const query = normalizeSearchText(searchTerm);
		return proveedores.filter((item) => {
			const matchesSearch =
				!query ||
				matchesTextSearch([item.Nom_Pro, item.Con_Pri_Pro, item.Ema_Pro], query) ||
				matchesPhoneSearch(item.Tel_Pro, query) ||
				matchesPhoneSearch(item.Tel_Gram_Pro, query);
			const matchesEstado = estadoFilter === "todos" || item.Est_Pro === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [proveedores, searchTerm, estadoFilter]);

	const formValido = isProveedorFormValid(form);

	return {
		proveedores,
		setProveedores,
		proveedoresFiltrados,
		selectedProveedorId,
		setSelectedProveedorId,
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
		proveedorSeleccionado,
		formValido,
		resetForm,
		cargarProveedores,
	};
}
