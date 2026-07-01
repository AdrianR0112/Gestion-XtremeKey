import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const REVENDEDOR_INICIAL = {
	Id_Rev: "",
	Tel_Rev: "",
	Nom_Rev: "",
	Ape_Rev: "",
	Ema_Rev: "",
	Doc_Rev: "",
	Not_Rev: "",
	Est_Rev: "activo",
};

const estados = ["activo", "inactivo"];

const revendedorFormSchema = z.object({
	Tel_Rev: z.string().trim().min(1, "El telefono es obligatorio."),
	Ema_Rev: z.string().trim().refine((value) => value === "" || z.email().safeParse(value).success, {
		message: "El correo no tiene un formato valido.",
	}),
	Est_Rev: z.enum(estados, { message: "Estado invalido." }).optional(),
}).passthrough();

export function validateRevendedorForm(form = {}) {
	return fieldErrorsFromResult(revendedorFormSchema.safeParse(form));
}

export function isRevendedorFormValid(form = {}) {
	return Object.keys(validateRevendedorForm(form)).length === 0;
}

export const revendedorSchema = {
	schema: revendedorFormSchema,
	validate: validateRevendedorForm,
};

export default revendedorSchema;
