import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const ESTADOS_CUENTA = ["disponible", "ocupada", "parcial", "vencida", "suspendida"];

export const CUENTA_INICIAL = {
	Id_Prd: "",
	Id_Var: "",
	Id_Pro: "",
	Nom_Cue: "",
	Usu_Cue: "",
	Pas_Cue: "",
	Pin_Cue: "",
	Per_Cue: "",
	Tot_Per_Cue: "",
	Per_Dis_Cue: "",
	Fec_Com_Cue: "",
	Fec_Ven_Cue: "",
	Cos_Cue: "",
	Not_Cue: "",
	Est_Cue: "disponible",
};

const cuentaFormSchema = z.object({
	Nom_Cue: z.string().trim().min(1, "El nombre de la cuenta es obligatorio."),
	Tot_Per_Cue: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => value === "" || value === null || value === undefined || (Number.isFinite(Number(value)) && Number(value) >= 0), {
		message: "Total de perfiles debe ser un numero positivo.",
	}),
	Per_Dis_Cue: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => value === "" || value === null || value === undefined || (Number.isFinite(Number(value)) && Number(value) >= 0), {
		message: "Perfiles disponibles debe ser un numero positivo.",
	}),
	Cos_Cue: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => value === "" || value === null || value === undefined || (Number.isFinite(Number(value)) && Number(value) >= 0), {
		message: "El costo debe ser un numero positivo.",
	}),
	Est_Cue: z.enum(ESTADOS_CUENTA, { message: "Estado de cuenta invalido." }).optional(),
}).passthrough();

export function validateCuentaForm(form = {}) {
	return fieldErrorsFromResult(cuentaFormSchema.safeParse(form));
}

export function isCuentaFormValid(form = {}) {
	return Object.keys(validateCuentaForm(form)).length === 0;
}

export const cuentaSchema = {
	schema: cuentaFormSchema,
	validate: validateCuentaForm,
};

export default cuentaSchema;
