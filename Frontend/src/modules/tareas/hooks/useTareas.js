import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapTareaFromApi } from "../helpers/tarea.mapper";
import { TAREA_INICIAL, isTareaFormValid } from "../schemas/tarea.schema";
import tareasService from "../services/tareas.service";

export default function useTareas() {
  const queryClient = useQueryClient();
  const [selectedTareaId, setSelectedTareaId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("create");
  const [form, setForm] = useState(TAREA_INICIAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [prioridadFilter, setPrioridadFilter] = useState("todos");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const tareasQueryKey = queryKeys.tareas.list();
  const tareasQuery = useQuery({
    queryKey: tareasQueryKey,
    queryFn: async () => toArray(await tareasService.list()).map((item) => mapTareaFromApi(item)),
  });
  const tareas = tareasQuery.data ?? [];
  const setTareas = createQueryDataSetter(queryClient, tareasQueryKey, []);
  const loading = tareasQuery.isLoading || tareasQuery.isFetching;

  const cargarTareas = async () => {
    setError("");
    try {
      return await queryClient.fetchQuery({
        queryKey: tareasQueryKey,
        queryFn: async () => toArray(await tareasService.list()).map((item) => mapTareaFromApi(item)),
      });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar las tareas."));
      return [];
    }
  };

  useEffect(() => {
	    setSelectedTareaId((prev) => {
	      if (prev && tareas.some((item) => item.Id_Tar === prev)) return prev;
	      return tareas[0]?.Id_Tar ?? null;
	    });
	  }, [tareas]);

  const tareaSeleccionada = useMemo(
    () => tareas.find((item) => item.Id_Tar === selectedTareaId) || null,
    [tareas, selectedTareaId]
  );

  const resetForm = () => setForm(TAREA_INICIAL);

  const tareasFiltradas = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return tareas.filter((item) => {
      const matchesSearch =
        !query || `${item.Tit_Tar} ${item.Des_Tar}`.toLowerCase().includes(query);
      const matchesEstado = estadoFilter === "todos" || item.Est_Tar === estadoFilter;
      const matchesPrioridad = prioridadFilter === "todos" || item.Pri_Tar === prioridadFilter;
      return matchesSearch && matchesEstado && matchesPrioridad;
    });
  }, [tareas, searchTerm, estadoFilter, prioridadFilter]);

  const formValido = isTareaFormValid(form);

  return {
    tareas,
    setTareas,
    tareasFiltradas,
    selectedTareaId,
    setSelectedTareaId,
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
    prioridadFilter,
    setPrioridadFilter,
    loading,
    saving,
    setSaving,
    error,
    setError,
    success,
    setSuccess,
    tareaSeleccionada,
    formValido,
    resetForm,
    cargarTareas,
  };
}
