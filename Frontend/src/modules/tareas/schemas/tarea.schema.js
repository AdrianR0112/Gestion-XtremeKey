import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

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

const isValidDate = (dateString) => {
	const date = new Date(dateString);
	return !Number.isNaN(date.getTime());
};

const tareaFormSchema = z.object({
	Tit_Tar: z.string().trim().min(1, "El título de la tarea es obligatorio.").max(200, "El título no puede exceder 200 caracteres."),
	Pri_Tar: z.enum(PRIORIDADES_TAREA, { message: "Prioridad inválida." }).optional(),
	Est_Tar: z.enum(ESTADOS_TAREA, { message: "Estado inválido." }).optional(),
	Pro_Tar: z.union([z.string(), z.number(), z.null()]).optional(),
	Fec_Com_Tar: z.string().optional(),
	Fec_Lim_Tar: z.string().optional(),
	Id_Cli: z.union([z.string(), z.number(), z.null()]).optional(),
	Id_Ven: z.union([z.string(), z.number(), z.null()]).optional(),
}).passthrough().superRefine((form, ctx) => {
	if (form.Pro_Tar !== "" && form.Pro_Tar !== null && form.Pro_Tar !== undefined) {
		const value = Number(form.Pro_Tar);
		if (!Number.isInteger(value) || value < 0 || value > 100) {
			ctx.addIssue({ code: "custom", path: ["Pro_Tar"], message: "El progreso debe ser un número entre 0 y 100." });
		}
		if (value === 100 && form.Est_Tar !== "completada") {
			ctx.addIssue({ code: "custom", path: ["Pro_Tar"], message: "Si el progreso es 100%, el estado debe ser completada." });
		}
	}

	if (form.Est_Tar === "completada") {
		const progress = Number(form.Pro_Tar);
		if (!Number.isInteger(progress) || progress !== 100) {
			ctx.addIssue({ code: "custom", path: ["Est_Tar"], message: "Si la tarea está completada, el progreso debe ser 100%." });
		}
		if (form.Fec_Com_Tar && !isValidDate(form.Fec_Com_Tar)) {
			ctx.addIssue({ code: "custom", path: ["Fec_Com_Tar"], message: "La fecha de completación debe ser válida." });
		}
	} else if (form.Fec_Com_Tar) {
		ctx.addIssue({ code: "custom", path: ["Fec_Com_Tar"], message: "La fecha de completación solo se acepta cuando la tarea está completada." });
	}

	if (form.Fec_Lim_Tar && !isValidDate(form.Fec_Lim_Tar)) {
		ctx.addIssue({ code: "custom", path: ["Fec_Lim_Tar"], message: "La fecha límite debe ser válida." });
	}

	if (form.Id_Cli !== "" && form.Id_Cli !== null && form.Id_Cli !== undefined && (!Number.isInteger(Number(form.Id_Cli)) || Number(form.Id_Cli) <= 0)) {
		ctx.addIssue({ code: "custom", path: ["Id_Cli"], message: "El ID del cliente debe ser válido." });
	}

	if (form.Id_Ven !== "" && form.Id_Ven !== null && form.Id_Ven !== undefined && (!Number.isInteger(Number(form.Id_Ven)) || Number(form.Id_Ven) <= 0)) {
		ctx.addIssue({ code: "custom", path: ["Id_Ven"], message: "El ID de la venta debe ser válido." });
		}
	});

export function validateTareaForm(form = {}) {
	return fieldErrorsFromResult(tareaFormSchema.safeParse(form));
}

export function isTareaFormValid(form = {}) {
  return Object.keys(validateTareaForm(form)).length === 0;
}

export const tareaSchema = {
	schema: tareaFormSchema,
	validate: validateTareaForm,
};

export default tareaSchema;
