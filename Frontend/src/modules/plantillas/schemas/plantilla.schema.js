import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

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

const plantillaFormSchema = z.object({
	Nom_Pla: z.string().trim().min(1, "El nombre de la plantilla es obligatorio.").max(150, "El nombre no puede exceder 150 caracteres."),
	Tip_Pla: z.enum(TIPOS_PLANTILLA, { message: "Tipo de plantilla inválido." }).optional(),
	Can_Pla: z.enum(CANALES_PLANTILLA, { message: "Canal inválido." }).optional(),
	Asu_Pla: z.string().max(200, "El asunto no puede exceder 200 caracteres.").optional(),
	Cue_Pla: z.string().trim().min(1, "El contenido de la plantilla es obligatorio."),
	Est_Pla: z.enum(ESTADOS_PLANTILLA, { message: "Estado inválido." }).optional(),
	Var_Pla: z.any().optional(),
}).passthrough().superRefine((form, ctx) => {
	if (!form.Var_Pla) return;

	try {
		const vars = typeof form.Var_Pla === "string" ? JSON.parse(form.Var_Pla) : form.Var_Pla;
		if (typeof vars !== "object" || vars === null) {
			ctx.addIssue({ code: "custom", path: ["Var_Pla"], message: "Las variables deben ser un objeto JSON válido." });
		}
	} catch {
		ctx.addIssue({ code: "custom", path: ["Var_Pla"], message: "Las variables deben ser un JSON válido." });
	}
});

export function validatePlantillaForm(form = {}) {
	return fieldErrorsFromResult(plantillaFormSchema.safeParse(form));
}

export function isPlantillaFormValid(form = {}) {
  return Object.keys(validatePlantillaForm(form)).length === 0;
}

export const plantillaSchema = {
	schema: plantillaFormSchema,
	validate: validatePlantillaForm,
};

export default plantillaSchema;
