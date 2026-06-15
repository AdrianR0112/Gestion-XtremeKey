import { mapGastoPayload, mapGastoToForm } from "../helpers/gasto.mapper";
import { createGastoForm, validateGastoForm } from "../schemas/gasto.schema";
import gastosService from "../services/gastos.service";

export default function useGastosActions({
	setGastos,
	setGastoForm,
	setGastoSheetOpen,
	setError,
	setSuccess,
	gastoForm,
}) {
const abrirCrearGasto = () => {
setGastoForm(createGastoForm());
setGastoSheetOpen(true);
};

const guardarGasto = async (event) => {
event.preventDefault();

const errors = validateGastoForm(gastoForm);
if (Object.keys(errors).length > 0) {
setError("Por favor completa los campos requeridos");
return;
}

try {
const payload = mapGastoPayload(gastoForm);
const gasto = await gastosService.create(payload);

setGastos((prev) => [...prev, gasto]);
setGastoForm(createGastoForm());
setGastoSheetOpen(false);
setSuccess("Gasto creado exitosamente");
setError("");
} catch (err) {
setError(err?.message || "Error al guardar gasto");
}
};

const abrirEditarGasto = (gasto) => {
setGastoForm(mapGastoToForm(gasto));
setGastoSheetOpen(true);
};

const guardarEdicionGasto = async (event, gastoId) => {
event.preventDefault();

const errors = validateGastoForm(gastoForm);
if (Object.keys(errors).length > 0) {
setError("Por favor completa los campos requeridos");
return;
}

try {
const payload = mapGastoPayload(gastoForm);
const updated = await gastosService.update(gastoId, payload);

setGastos((prev) => prev.map((g) => (g.Id_Gas === gastoId ? updated : g)));
setGastoForm(createGastoForm());
setGastoSheetOpen(false);
setSuccess("Gasto actualizado exitosamente");
setError("");
} catch (err) {
setError(err?.message || "Error al actualizar gasto");
}
};

const cerrarGasto = () => {
setGastoForm(createGastoForm());
setGastoSheetOpen(false);
setError("");
};

const eliminarGasto = async (gastoId) => {
try {
await gastosService.remove(gastoId);
setGastos((prev) => prev.filter((g) => g.Id_Gas !== gastoId));
setSuccess("Gasto eliminado exitosamente");
setError("");
} catch (err) {
setError(err?.message || "Error al eliminar gasto");
}
};

return {
abrirCrearGasto,
guardarGasto,
abrirEditarGasto,
guardarEdicionGasto,
cerrarGasto,
eliminarGasto,
};
}
