import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const ESTADOS_KEY = ["disponible", "vendida", "reservada", "vencida", "cancelada"];

export const KEY_INICIAL = {
	Id_Prd: "",
	Id_Var: "",
	Id_Pro: "",
	Cla_Key: "",
	Es_Per_Vid_Key: false,
	Des_Key: "",
	Fec_Com_Key: "",
	Fec_Ven_Key: "",
	Cos_Key: "",
	Pre_Ven_Key: "",
	Est_Key: "disponible",
	Not_Key: "",
};

const keyFormSchema = z.object({
	Cla_Key: z.string().trim().min(1, "La clave es obligatoria."),
	Cos_Key: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => value === "" || value === null || value === undefined || (Number.isFinite(Number(value)) && Number(value) >= 0), {
		message: "Costo invalido.",
	}),
	Pre_Ven_Key: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => value === "" || value === null || value === undefined || (Number.isFinite(Number(value)) && Number(value) >= 0), {
		message: "Precio de venta invalido.",
	}),
	Es_Per_Vid_Key: z.boolean({ message: "El campo por vida debe ser booleano." }),
	Est_Key: z.enum(ESTADOS_KEY, { message: "Estado de key invalido." }).optional(),
}).passthrough();

export function validateKeyForm(form = {}) {
	return fieldErrorsFromResult(keyFormSchema.safeParse(form));
}

export function isKeyFormValid(form = {}) {
	return Object.keys(validateKeyForm(form)).length === 0;
}

export const keySchema = {
	schema: keyFormSchema,
	validate: validateKeyForm,
};

export default keySchema;
