import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const CONFIGURACION_INICIAL = {
	Nom_Emp_Con: "",
	Dir_Con: "",
	Tel_Con: "",
	Ema_Con: "",
	Log_Con: "",
	Mon_Con: "",
	Zon_Hor_Con: "",
	Imp_Con: "",
	Hab_Imp_Con: true,
};

const configuracionFormSchema = z.object({
	Nom_Emp_Con: z.string().trim().min(1, "El nombre de empresa es obligatorio."),
	Ema_Con: z.string().trim().refine((value) => value === "" || z.email().safeParse(value).success, {
		message: "El correo no tiene un formato valido.",
	}),
	Mon_Con: z.string().trim().refine((value) => value === "" || /^[A-Za-z]{3,6}$/.test(value), {
		message: "La moneda debe ser un codigo valido (ej. USD).",
	}),
	Hab_Imp_Con: z.any().optional(),
	Imp_Con: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => {
		if (value === "" || value === null || value === undefined) return true;
		const parsed = Number(value);
		return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100;
	}, {
		message: "El impuesto debe ser un porcentaje entre 0 y 100.",
	}),
}).passthrough().superRefine((form, ctx) => {
	if (form.Hab_Imp_Con && (form.Imp_Con === "" || form.Imp_Con === null || form.Imp_Con === undefined || Number(form.Imp_Con) < 0 || Number(form.Imp_Con) > 100)) {
		ctx.addIssue({ code: "custom", path: ["Imp_Con"], message: "El impuesto debe ser un porcentaje entre 0 y 100." });
	}
});

export function validateConfiguracionForm(form = {}) {
	return fieldErrorsFromResult(configuracionFormSchema.safeParse(form));
}

export function isConfiguracionFormValid(form = {}) {
	return Object.keys(validateConfiguracionForm(form)).length === 0;
}

export const configuracionSchema = {
	schema: configuracionFormSchema,
	validate: validateConfiguracionForm,
};

export default configuracionSchema;
