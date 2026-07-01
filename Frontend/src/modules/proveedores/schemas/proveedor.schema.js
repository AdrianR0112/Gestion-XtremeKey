import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const TIPOS_PROVEEDOR = ["persona", "empresa", "plataforma", "tienda_web", "otro"];
export const MEDIOS_CONTACTO = ["whatsapp", "telegram", "web", "email", "telefono"];
export const ESTADOS_PROVEEDOR = ["activo", "inactivo", "suspendido"];

export const PROVEEDOR_INICIAL = {
	Nom_Pro: "",
	Tip_Pro: "empresa",
	Con_Pri_Pro: "",
	Tel_Pro: "",
	Wha_Pro: "",
	Ema_Pro: "",
	Tel_Gram_Pro: "",
	Web_Pro: "",
	Pai_Pro: "",
	Med_Con_Pro: "whatsapp",
	Con_Com_Pro: "",
	Cal_Pro: 5,
	Not_Pro: "",
	Est_Pro: "activo",
};

const proveedorFormSchema = z.object({
	Nom_Pro: z.string().trim().min(1, "El nombre del proveedor es obligatorio."),
	Tip_Pro: z.enum(TIPOS_PROVEEDOR, { message: "Tipo de proveedor invalido." }).optional(),
	Ema_Pro: z.string().trim().refine((value) => value === "" || z.email().safeParse(value).success, {
		message: "Correo invalido.",
	}),
	Med_Con_Pro: z.enum(MEDIOS_CONTACTO, { message: "Medio de contacto invalido." }).optional(),
	Est_Pro: z.enum(ESTADOS_PROVEEDOR, { message: "Estado invalido." }).optional(),
	Cal_Pro: z.union([z.string(), z.number(), z.null(), z.undefined()]).refine((value) => value === "" || value === null || value === undefined || (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 5), {
		message: "La calificacion debe ser un entero entre 1 y 5.",
	}),
}).passthrough();

export function validateProveedorForm(form = {}) {
	return fieldErrorsFromResult(proveedorFormSchema.safeParse(form));
}

export function isProveedorFormValid(form = {}) {
	return Object.keys(validateProveedorForm(form)).length === 0;
}

export const proveedorSchema = {
	schema: proveedorFormSchema,
	validate: validateProveedorForm,
};

export default proveedorSchema;
