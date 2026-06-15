import { useEffect, useMemo, useState } from "react";
import { mapTareaFromApi } from "../helpers/tarea.mapper";
import { TAREA_INICIAL, isTareaFormValid } from "../schemas/tarea.schema";
import tareasService from "../services/tareas.service";

export default function useTareas() {
  const [tareas, setTareas] = useState([]);
  const [selectedTareaId, setSelectedTareaId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("create");
  const [form, setForm] = useState(TAREA_INICIAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [prioridadFilter, setPrioridadFilter] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargarTareas = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await tareasService.list();
      const mapped = Array.isArray(list) ? list.map((item) => mapTareaFromApi(item)) : [];
      setTareas(mapped);
      setSelectedTareaId((prev) => {
        if (prev && mapped.some((item) => item.Id_Tar === prev)) return prev;
        return mapped[0]?.Id_Tar ?? null;
      });
      return mapped;
    } catch (err) {
      setError(err?.data?.message || err?.message || "No se pudieron cargar las tareas.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

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
