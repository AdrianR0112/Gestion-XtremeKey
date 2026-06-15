import { mapTareaPayload } from "../helpers/tarea.mapper";
import tareasService from "../services/tareas.service";

export default function useTareasActions(state) {
  const {
    selectedTareaId,
    setSelectedTareaId,
    setSheetOpen,
    setSheetMode,
    form,
    setForm,
    sheetMode,
    resetForm,
    setSaving,
    setError,
    setSuccess,
    cargarTareas,
  } = state;

  const abrirCrear = () => {
    setSheetMode("create");
    resetForm();
    setSelectedTareaId(null);
    setSheetOpen(true);
  };

  const abrirEditar = (tarea) => {
    setSheetMode("edit");
    setForm({
      Tit_Tar: tarea.Tit_Tar ?? "",
      Des_Tar: tarea.Des_Tar ?? "",
      Id_Cli: tarea.Id_Cli ?? "",
      Id_Ven: tarea.Id_Ven ?? "",
      Fec_Lim_Tar: tarea.Fec_Lim_Tar ?? "",
      Pri_Tar: tarea.Pri_Tar ?? "media",
      Pro_Tar: tarea.Pro_Tar ?? 0,
      Est_Tar: tarea.Est_Tar ?? "pendiente",
      Fec_Com_Tar: tarea.Fec_Com_Tar ?? "",
    });
    setSelectedTareaId(tarea.Id_Tar);
    setSheetOpen(true);
  };

  const guardarTarea = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = mapTareaPayload(form);
      if (sheetMode === "create") {
        const creada = await tareasService.create(payload);
        const tareasActualizadas = await cargarTareas();
        setSelectedTareaId(creada?.Id_Tar ?? tareasActualizadas[0]?.Id_Tar ?? null);
        setSuccess("Tarea creada correctamente.");
      } else {
        await tareasService.update(selectedTareaId, payload);
        await cargarTareas();
        setSuccess("Tarea actualizada correctamente.");
      }
      setSheetOpen(false);
    } catch (err) {
      setError(err?.data?.message || err?.message || "No se pudo guardar la tarea.");
    } finally {
      setSaving(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!selectedTareaId) return false;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await tareasService.remove(selectedTareaId);
      const tareasActualizadas = await cargarTareas();
      setSelectedTareaId(tareasActualizadas[0]?.Id_Tar ?? null);
      setSuccess("Tarea eliminada correctamente.");
      return true;
    } catch (err) {
      setError(err?.data?.message || err?.message || "No se pudo eliminar la tarea.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    abrirCrear,
    abrirEditar,
    guardarTarea,
    confirmarEliminacion,
  };
}
