import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const ESTADOS_CATEGORIA = ["activo", "inactivo"];

export const CATEGORIA_INICIAL = {
	Nom_Cat: "",
	Des_Cat: "",
	Id_Cat_Pad: "",
	Ico_Cat: "",
	Ord_Cat: "",
	Est_Cat: "activo",
};

const categoriaFormSchema = z.object({
	Nom_Cat: z.string().trim().min(1, "El nombre de la categoria es obligatorio."),
	Est_Cat: z.enum(ESTADOS_CATEGORIA, { message: "Estado invalido." }).optional(),
	Ord_Cat: z.union([z.string(), z.number(), z.null()]).optional().refine((value) => value === "" || value === null || Number.isFinite(Number(value)), {
		message: "El orden debe ser numerico.",
	}),
	Id_Cat_Pad: z.union([z.string(), z.number(), z.null()]).optional().refine((value) => value === "" || value === null || (Number.isInteger(Number(value)) && Number(value) > 0), {
		message: "La categoria padre debe ser un id valido.",
	}),
}).passthrough();

export function validateCategoriaForm(form = {}) {
	return fieldErrorsFromResult(categoriaFormSchema.safeParse(form));
}

export function isCategoriaFormValid(form = {}) {
	return Object.keys(validateCategoriaForm(form)).length === 0;
}

export const categoriaSchema = {
	schema: categoriaFormSchema,
	validate: validateCategoriaForm,
};

export default categoriaSchema;
