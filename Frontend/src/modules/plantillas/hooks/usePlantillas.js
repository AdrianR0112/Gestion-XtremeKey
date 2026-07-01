import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapPlantillaFromApi } from "../helpers/plantilla.mapper";
import { PLANTILLA_INICIAL, isPlantillaFormValid } from "../schemas/plantilla.schema";
import plantillasService from "../services/plantillas.service";

export default function usePlantillas() {
  const queryClient = useQueryClient();
  const [selectedPlantillaId, setSelectedPlantillaId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("create");
  const [form, setForm] = useState(PLANTILLA_INICIAL);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [canalFilter, setCanalFilter] = useState("todos");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const plantillasQueryKey = queryKeys.plantillas.list();
  const plantillasQuery = useQuery({
    queryKey: plantillasQueryKey,
    queryFn: async () => toArray(await plantillasService.list()).map((item) => mapPlantillaFromApi(item)),
  });
  const plantillas = plantillasQuery.data ?? [];
  const setPlantillas = createQueryDataSetter(queryClient, plantillasQueryKey, []);
  const loading = plantillasQuery.isLoading || plantillasQuery.isFetching;

  const cargarPlantillas = async () => {
    setError("");
    try {
      return await queryClient.fetchQuery({
        queryKey: plantillasQueryKey,
        queryFn: async () => toArray(await plantillasService.list()).map((item) => mapPlantillaFromApi(item)),
      });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar las plantillas."));
      return [];
    }
  };

  useEffect(() => {
	    setSelectedPlantillaId((prev) => {
	      if (prev && plantillas.some((item) => item.Id_Pla === prev)) return prev;
	      return plantillas[0]?.Id_Pla ?? null;
	    });
	  }, [plantillas]);

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
