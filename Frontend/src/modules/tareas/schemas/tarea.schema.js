export const PRIORIDADES_TAREA = ["baja", "media", "alta", "urgente"];
export const ESTADOS_TAREA = ["pendiente", "en_progreso", "completada", "cancelada"];

export const TAREA_INICIAL = {
  Tit_Tar: "",
  Des_Tar: "",
  Id_Cli: "",
  Id_Ven: "",
  Fec_Lim_Tar: "",
  Pri_Tar: "media",
  Pro_Tar: 0,
  Est_Tar: "pendiente",
  Fec_Com_Tar: "",
};

export function validateTareaForm(form = {}) {
  const errors = {};

  // Validación del título
  if (!form.Tit_Tar?.trim()) {
    errors.Tit_Tar = "El título de la tarea es obligatorio.";
  } else if (form.Tit_Tar.length > 200) {
    errors.Tit_Tar = "El título no puede exceder 200 caracteres.";
  }

  // Validación de prioridad
  if (form.Pri_Tar && !PRIORIDADES_TAREA.includes(form.Pri_Tar)) {
    errors.Pri_Tar = "Prioridad inválida.";
  }

  // Validación de estado
  if (form.Est_Tar && !ESTADOS_TAREA.includes(form.Est_Tar)) {
    errors.Est_Tar = "Estado inválido.";
  }

  // Validación de progreso
  if (form.Pro_Tar !== "" && form.Pro_Tar !== null) {
    const value = Number(form.Pro_Tar);
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      errors.Pro_Tar = "El progreso debe ser un número entre 0 y 100.";
    }

    // Regla: Si Pro_Tar = 100, Est_Tar debe ser completada
    if (value === 100 && form.Est_Tar !== "completada") {
      errors.Pro_Tar = "Si el progreso es 100%, el estado debe ser completada.";
    }
  }

  // Validación del estado completada con progreso
  if (form.Est_Tar === "completada") {
    const progress = Number(form.Pro_Tar);
    if (!Number.isInteger(progress) || progress !== 100) {
      errors.Est_Tar = "Si la tarea está completada, el progreso debe ser 100%.";
    }

    // Fec_Com_Tar solo se acepta cuando está completada
    if (form.Fec_Com_Tar && !isValidDate(form.Fec_Com_Tar)) {
      errors.Fec_Com_Tar = "La fecha de completación debe ser válida.";
    }
  } else if (form.Fec_Com_Tar) {
    // Fec_Com_Tar solo debe aceptarse si está completada
    errors.Fec_Com_Tar = "La fecha de completación solo se acepta cuando la tarea está completada.";
  }

  // Validación de fechas
  if (form.Fec_Lim_Tar && !isValidDate(form.Fec_Lim_Tar)) {
    errors.Fec_Lim_Tar = "La fecha límite debe ser válida.";
  }

  // Validación de IDs
  if (form.Id_Cli !== "" && form.Id_Cli !== null) {
    const clienteId = Number(form.Id_Cli);
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      errors.Id_Cli = "El ID del cliente debe ser válido.";
    }
  }

  if (form.Id_Ven !== "" && form.Id_Ven !== null) {
    const ventaId = Number(form.Id_Ven);
    if (!Number.isInteger(ventaId) || ventaId <= 0) {
      errors.Id_Ven = "El ID de la venta debe ser válido.";
    }
  }

  return errors;
}

export function isTareaFormValid(form = {}) {
  return Object.keys(validateTareaForm(form)).length === 0;
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export const tareaSchema = {
  validate: validateTareaForm,
};

export default tareaSchema;
