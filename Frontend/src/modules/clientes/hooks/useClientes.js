import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import { mapClienteFromApi } from "../helpers/cliente.mapper";
import { CLIENTE_INICIAL, isClienteFormValid } from "../schemas/cliente.schema";
import clientesService from "../services/clientes.service";

export default function useClientes() {
	const queryClient = useQueryClient();
	const [selectedClienteId, setSelectedClienteId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(CLIENTE_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [categoriaFilter, setCategoriaFilter] = useState("todas");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const clientesQueryKey = queryKeys.clientes.list();
	const clientesQuery = useQuery({
		queryKey: clientesQueryKey,
		queryFn: async () => toArray(await clientesService.list()).map((item) => mapClienteFromApi(item)),
	});
	const clientes = clientesQuery.data ?? [];
	const setClientes = createQueryDataSetter(queryClient, clientesQueryKey, []);
	const loading = clientesQuery.isLoading || clientesQuery.isFetching;

	const cargarClientes = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: clientesQueryKey,
				queryFn: async () => toArray(await clientesService.list()).map((item) => mapClienteFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar clientes."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedClienteId((prev) => {
			if (prev && clientes.some((item) => item.Id_Cli === prev)) return prev;
			return clientes[0]?.Id_Cli ?? null;
		});
	}, [clientes]);

	const clienteSeleccionado = useMemo(
		() => clientes.find((cliente) => cliente.Id_Cli === selectedClienteId) || null,
		[clientes, selectedClienteId]
	);

	const resetForm = () => setForm(CLIENTE_INICIAL);

	const clientesFiltrados = useMemo(() => {
		const query = normalizeSearchText(searchTerm);
		return clientes.filter((cliente) => {
			const matchesSearch =
				!query ||
				matchesTextSearch([cliente.Nom_Cli, cliente.Ape_Cli, cliente.Ema_Cli], query) ||
				matchesPhoneSearch(cliente.Tel_Cli, query) ||
				matchesPhoneSearch(cliente.Usu_Tel_Cli, query);
			const matchesEstado = estadoFilter === "todos" || cliente.Est_Cli === estadoFilter;
			const matchesCategoria = categoriaFilter === "todas" || cliente.Cat_Cli === categoriaFilter;
			return matchesSearch && matchesEstado && matchesCategoria;
		});
	}, [clientes, searchTerm, estadoFilter, categoriaFilter]);

	const formValido = isClienteFormValid(form);

	return {
		clientes,
		setClientes,
		clientesFiltrados,
		selectedClienteId,
		setSelectedClienteId,
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
		categoriaFilter,
		setCategoriaFilter,
		loading,
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		clienteSeleccionado,
		formValido,
		resetForm,
		cargarClientes,
	};
}
