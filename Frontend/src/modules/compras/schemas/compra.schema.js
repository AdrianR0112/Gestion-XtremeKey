import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const COMPRA_INICIAL = {
	Id_Pro: null,
	Fec_Com: "",
	Sub_Tot_Com: 0,
	Imp_Tot_Com: 0,
	Tot_Com: 0,
	Met_Pag_Com: "",
	Not_Com: "",
	Est_Com: "pendiente",
};

export const DETALLE_COMPRA_INICIAL = {
	Id_Com: null,
	Id_Prd: null,
	Id_Var: null,
	Can_Dco: 1,
	Pre_Uni_Dco: 0,
	Sub_Tot_Dco: 0,
	Not_Dco: "",
};

const estados = ["pendiente", "completada", "cancelada"];

const compraFormSchema = z.object({
	Id_Pro: z.any().refine((value) => Boolean(value), { message: "El proveedor es obligatorio." }),
	Sub_Tot_Com: z.union([z.string(), z.number()]).refine((value) => value !== null && value !== undefined && value !== "", {
		message: "El subtotal es obligatorio.",
	}).refine((value) => Number(value) >= 0, {
		message: "El subtotal no puede ser negativo.",
	}),
	Imp_Tot_Com: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => value === null || value === undefined || value === "" || Number(value) >= 0, {
		message: "El impuesto no puede ser negativo.",
	}),
	Tot_Com: z.union([z.string(), z.number()]).refine((value) => value !== null && value !== undefined && value !== "", {
		message: "El total es obligatorio.",
	}).refine((value) => Number(value) >= 0, {
		message: "El total no puede ser negativo.",
	}),
	Est_Com: z.enum(estados, { message: "Estado inválido." }).optional(),
}).passthrough();

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
		message: "El precio unitario no puede ser negativo.",
	}),
	Sub_Tot_Dco: z.union([z.string(), z.number()]).refine((value) => value !== null && value !== undefined && value !== "", {
		message: "El subtotal es obligatorio.",
	}).refine((value) => Number(value) >= 0, {
		message: "El subtotal no puede ser negativo.",
	}),
}).passthrough();

export function createCompraForm() {
	return { ...COMPRA_INICIAL };
}

export function createDetalleCompraForm() {
	return { ...DETALLE_COMPRA_INICIAL };
}

export function validateCompraForm(form = {}) {
	return fieldErrorsFromResult(compraFormSchema.safeParse(form));
}

export function validateDetalleCompraForm(form = {}) {
	return fieldErrorsFromResult(detalleCompraFormSchema.safeParse(form));
}

export function isCompraFormValid(form = {}) {
	return Object.keys(validateCompraForm(form)).length === 0;
}

export function isDetalleCompraFormValid(form = {}) {
	return Object.keys(validateDetalleCompraForm(form)).length === 0;
}

export const compraSchema = {
	schema: compraFormSchema,
	detalleSchema: detalleCompraFormSchema,
	validate: validateCompraForm,
};

export default compraSchema;
