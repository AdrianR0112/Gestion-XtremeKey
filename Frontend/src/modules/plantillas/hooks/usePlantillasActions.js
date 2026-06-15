import { mapPlantillaPayload } from "../helpers/plantilla.mapper";
import plantillasService from "../services/plantillas.service";

export default function usePlantillasActions(state) {
  const {
    selectedPlantillaId,
    setSelectedPlantillaId,
    setSheetOpen,
    setSheetMode,
    form,
    setForm,
    sheetMode,
    resetForm,
    setSaving,
    setError,
    setSuccess,
    cargarPlantillas,
  } = state;

  const abrirCrear = () => {
    setSheetMode("create");
    resetForm();
    setSelectedPlantillaId(null);
    setSheetOpen(true);
  };

  const abrirEditar = (plantilla) => {
    setSheetMode("edit");
    setForm({
      Nom_Pla: plantilla.Nom_Pla ?? "",
      Tip_Pla: plantilla.Tip_Pla ?? "personalizado",
      Can_Pla: plantilla.Can_Pla ?? "email",
      Asu_Pla: plantilla.Asu_Pla ?? "",
      Cue_Pla: plantilla.Cue_Pla ?? "",
      Var_Pla: plantilla.Var_Pla ?? {},
      Est_Pla: plantilla.Est_Pla ?? "activo",
    });
    setSelectedPlantillaId(plantilla.Id_Pla);
    setSheetOpen(true);
  };

  const guardarPlantilla = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = mapPlantillaPayload(form);
      if (sheetMode === "create") {
        const creada = await plantillasService.create(payload);
        const plantillasActualizadas = await cargarPlantillas();
        setSelectedPlantillaId(creada?.Id_Pla ?? plantillasActualizadas[0]?.Id_Pla ?? null);
        setSuccess("Plantilla creada correctamente.");
      } else {
        await plantillasService.update(selectedPlantillaId, payload);
        await cargarPlantillas();
        setSuccess("Plantilla actualizada correctamente.");
      }
      setSheetOpen(false);
    } catch (err) {
      setError(err?.data?.message || err?.message || "No se pudo guardar la plantilla.");
    } finally {
      setSaving(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!selectedPlantillaId) return false;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await plantillasService.remove(selectedPlantillaId);
      const plantillasActualizadas = await cargarPlantillas();
      setSelectedPlantillaId(plantillasActualizadas[0]?.Id_Pla ?? null);
      setSuccess("Plantilla eliminada correctamente.");
      return true;
    } catch (err) {
      setError(err?.data?.message || err?.message || "No se pudo eliminar la plantilla.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    abrirCrear,
    abrirEditar,
    guardarPlantilla,
    confirmarEliminacion,
  };
}
