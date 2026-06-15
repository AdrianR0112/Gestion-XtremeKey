export const TIPOS_PLANTILLA = ["bienvenida", "venta", "renovacion", "vencimiento", "recordatorio", "personalizado"];
export const CANALES_PLANTILLA = ["whatsapp", "email", "sms", "push"];
export const ESTADOS_PLANTILLA = ["activo", "inactivo"];

export const PLANTILLA_INICIAL = {
  Nom_Pla: "",
  Tip_Pla: "personalizado",
  Can_Pla: "email",
  Asu_Pla: "",
  Cue_Pla: "",
  Var_Pla: {},
  Est_Pla: "activo",
};

export function validatePlantillaForm(form = {}) {
  const errors = {};

  // Validación del nombre
  if (!form.Nom_Pla?.trim()) {
    errors.Nom_Pla = "El nombre de la plantilla es obligatorio.";
  } else if (form.Nom_Pla.length > 150) {
    errors.Nom_Pla = "El nombre no puede exceder 150 caracteres.";
  }

  // Validación del contenido
  if (!form.Cue_Pla?.trim()) {
    errors.Cue_Pla = "El contenido de la plantilla es obligatorio.";
  }

  // Validación del tipo
  if (form.Tip_Pla && !TIPOS_PLANTILLA.includes(form.Tip_Pla)) {
    errors.Tip_Pla = "Tipo de plantilla inválido.";
  }

  // Validación del canal
  if (form.Can_Pla && !CANALES_PLANTILLA.includes(form.Can_Pla)) {
    errors.Can_Pla = "Canal inválido.";
  }

  // Validación del asunto
  if (form.Asu_Pla && form.Asu_Pla.length > 200) {
    errors.Asu_Pla = "El asunto no puede exceder 200 caracteres.";
  }

  // Validación del estado
  if (form.Est_Pla && !ESTADOS_PLANTILLA.includes(form.Est_Pla)) {
    errors.Est_Pla = "Estado inválido.";
  }

  // Validación de variables
  if (form.Var_Pla) {
    try {
      const vars = typeof form.Var_Pla === "string" ? JSON.parse(form.Var_Pla) : form.Var_Pla;
      if (typeof vars !== "object" || vars === null) {
        errors.Var_Pla = "Las variables deben ser un objeto JSON válido.";
      }
    } catch (e) {
      errors.Var_Pla = "Las variables deben ser un JSON válido.";
    }
  }

  return errors;
}

export function isPlantillaFormValid(form = {}) {
  return Object.keys(validatePlantillaForm(form)).length === 0;
}

export const plantillaSchema = {
  validate: validatePlantillaForm,
};

export default plantillaSchema;
