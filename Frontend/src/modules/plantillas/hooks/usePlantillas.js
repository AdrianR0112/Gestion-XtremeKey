import { useEffect, useMemo, useState } from "react";
import { mapPlantillaFromApi } from "../helpers/plantilla.mapper";
import { PLANTILLA_INICIAL, isPlantillaFormValid } from "../schemas/plantilla.schema";
import plantillasService from "../services/plantillas.service";

export default function usePlantillas() {
  const [plantillas, setPlantillas] = useState([]);
  const [selectedPlantillaId, setSelectedPlantillaId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("create");
  const [form, setForm] = useState(PLANTILLA_INICIAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [canalFilter, setCanalFilter] = useState("todos");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargarPlantillas = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await plantillasService.list();
      const mapped = Array.isArray(list) ? list.map((item) => mapPlantillaFromApi(item)) : [];
      setPlantillas(mapped);
      setSelectedPlantillaId((prev) => {
        if (prev && mapped.some((item) => item.Id_Pla === prev)) return prev;
        return mapped[0]?.Id_Pla ?? null;
      });
      return mapped;
    } catch (err) {
      setError(err?.data?.message || err?.message || "No se pudieron cargar las plantillas.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const plantillaSeleccionada = useMemo(
    () => plantillas.find((item) => item.Id_Pla === selectedPlantillaId) || null,
    [plantillas, selectedPlantillaId]
  );

  const resetForm = () => setForm(PLANTILLA_INICIAL);

  const plantillasFiltradas = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return plantillas.filter((item) => {
      const matchesSearch =
        !query || `${item.Nom_Pla} ${item.Cue_Pla}`.toLowerCase().includes(query);
      const matchesTipo = tipoFilter === "todos" || item.Tip_Pla === tipoFilter;
      const matchesCanal = canalFilter === "todos" || item.Can_Pla === canalFilter;
      const matchesEstado = estadoFilter === "todos" || item.Est_Pla === estadoFilter;
      return matchesSearch && matchesTipo && matchesCanal && matchesEstado;
    });
  }, [plantillas, searchTerm, tipoFilter, canalFilter, estadoFilter]);

  const formValido = isPlantillaFormValid(form);

  return {
    plantillas,
    setPlantillas,
    plantillasFiltradas,
    selectedPlantillaId,
    setSelectedPlantillaId,
    sheetOpen,
    setSheetOpen,
    sheetMode,
    setSheetMode,
    form,
    setForm,
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    canalFilter,
    setCanalFilter,
    estadoFilter,
    setEstadoFilter,
    loading,
    saving,
    setSaving,
    error,
    setError,
    success,
    setSuccess,
    plantillaSeleccionada,
    formValido,
    resetForm,
    cargarPlantillas,
  };
}
