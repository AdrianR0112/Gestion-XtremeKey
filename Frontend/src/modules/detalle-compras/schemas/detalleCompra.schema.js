import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const DETALLE_COMPRA_INICIAL = {
	Id_Com: null,
	Id_Prd: null,
	Id_Var: null,
	Can_Dco: 1,
	Pre_Uni_Dco: 0,
	Sub_Tot_Dco: 0,
	Not_Dco: "",
};

const detalleCompraFormSchema = z.object({
	Id_Com: z.any().refine((value) => Boolean(value), { message: "La compra es obligatoria." }),
	Can_Dco: z.union([z.string(), z.number()]).refine((value) => value !== null && value !== undefined && value !== "", {
		message: "La cantidad es obligatoria.",
	}).refine((value) => Number(value) >= 1, {
		message: "La cantidad debe ser mayor a 0.",
	}),
	Pre_Uni_Dco: z.union([z.string(), z.number()]).refine((value) => value !== null && value !== undefined && value !== "", {
		message: "El precio unitario es obligatorio.",
	}).refine((value) => Number(value) >= 0, {
		message: "El precio no puede ser negativo.",
	}),
	Sub_Tot_Dco: z.union([z.string(), z.number()]).refine((value) => value !== null && value !== undefined && value !== "", {
		message: "El subtotal es obligatorio.",
	}).refine((value) => Number(value) >= 0, {
		message: "El subtotal no puede ser negativo.",
	}),
}).passthrough();

export function validateDetalleCompraForm(form = {}) {
	return fieldErrorsFromResult(detalleCompraFormSchema.safeParse(form));
}

export function isDetalleCompraFormValid(form = {}) {
	return Object.keys(validateDetalleCompraForm(form)).length === 0;
}

export const detalleCompraSchema = {
	schema: detalleCompraFormSchema,
	validate: validateDetalleCompraForm,
};

export default detalleCompraSchema;
