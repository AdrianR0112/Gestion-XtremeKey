import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapRenovacionFromApi } from "../helpers/renovacion.mapper";
import { RENOVACION_INICIAL, isRenovacionFormValid } from "../schemas/renovacion.schema";
import renovacionesService from "../services/renovaciones.service";
import useRenovacionesActions from "./useRenovacionesActions";

export default function useRenovaciones() {
	const queryClient = useQueryClient();
	const [selectedRenovacionId, setSelectedRenovacionId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(RENOVACION_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [actionLoading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [renovacionDeleteDialogOpen, setRenovacionDeleteDialogOpen] = useState(false);
	const [renovacionAEliminar, setRenovacionAEliminar] = useState(null);
	const renovacionesQueryKey = queryKeys.renovaciones.list();
	const renovacionesQuery = useQuery({
		queryKey: renovacionesQueryKey,
		queryFn: async () => toArray(await renovacionesService.list()).map((item) => mapRenovacionFromApi(item)),
	});
	const renovaciones = renovacionesQuery.data ?? [];
	const setRenovaciones = createQueryDataSetter(queryClient, renovacionesQueryKey, []);
	const loading = actionLoading || renovacionesQuery.isLoading || renovacionesQuery.isFetching;

	const cargarRenovaciones = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: renovacionesQueryKey,
				queryFn: async () => toArray(await renovacionesService.list()).map((item) => mapRenovacionFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar renovaciones."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedRenovacionId((prev) => {
			if (prev && renovaciones.some((item) => item.Id_Ren === prev)) return prev;
			return renovaciones[0]?.Id_Ren ?? null;
		});
	}, [renovaciones]);

	const renovacionSeleccionada = useMemo(
		() => renovaciones.find((item) => item.Id_Ren === selectedRenovacionId) || null,
		[renovaciones, selectedRenovacionId]
	);

	const renovacionesFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return renovaciones.filter((item) => {
			const matchesSearch =
				!query ||
				`${item.Id_Ren || ""} ${item.Nom_Cli || ""} ${item.Nom_Prd || ""} ${item.Nom_Var || ""} ${item.Tip_Ren || ""}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = estadoFilter === "todos" || item.Est_Ren === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [renovaciones, searchTerm, estadoFilter]);

	const resetForm = () => setForm(RENOVACION_INICIAL);

	const formValido = isRenovacionFormValid(form);

	const acciones = useRenovacionesActions({
		renovacionesService,
		selectedRenovacionId,
		sheetMode,
		form,
		renovacionAEliminar,
		setLoading,
		setSaving,
		setError,
		setSuccess,
		setSelectedRenovacionId,
		setSheetMode,
		setForm,
		setSheetOpen,
		setRenovacionAEliminar,
		setRenovacionDeleteDialogOpen,
		setRenovaciones,
		resetForm,
		cargarRenovaciones,
	});

	return {
		renovaciones,
		renovacionesFiltradas,
		selectedRenovacionId,
		setSelectedRenovacionId,
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
		error,
		setError,
		success,
		setSuccess,
		renovacionSeleccionada,
		formValido,
		resetForm,
		cargarRenovaciones,
		renovacionDeleteDialogOpen,
		setRenovacionDeleteDialogOpen,
		renovacionAEliminar,
		setRenovacionAEliminar,
		...acciones,
	};
}
