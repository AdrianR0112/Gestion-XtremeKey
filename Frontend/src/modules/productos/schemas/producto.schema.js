import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const TIPOS_PRODUCTO = ["servicio", "producto", "suscripcion"];
export const ESTADOS_PRODUCTO = ["activo", "inactivo", "agotado"];
export const TIPOS_DURACION_PRODUCTO = ["dias", "meses", "anios"];

export const PRODUCTO_INICIAL = {
	Cod_Prd: "",
	Nom_Prd: "",
	Des_Prd: "",
	Des_Cor_Prd: "",
	Id_Cat: "",
	Tip_Prd: "producto",
	Ima_Prd: "",
	Imagen_Archivo: null,
	Eliminar_Ima_Prd: false,
	Est_Prd: "activo",
};

const productoFormSchema = z.object({
	Nom_Prd: z.string().trim().min(1, "El nombre del producto es obligatorio."),
	Tip_Prd: z.enum(TIPOS_PRODUCTO, { message: "Tipo de producto invalido." }).optional(),
	Est_Prd: z.enum(ESTADOS_PRODUCTO, { message: "Estado invalido." }).optional(),
}).passthrough();

export function validateProductoForm(form = {}) {
	return fieldErrorsFromResult(productoFormSchema.safeParse(form));
}

export function isProductoFormValid(form = {}) {
	return Object.keys(validateProductoForm(form)).length === 0;
}

export const productoSchema = {
	schema: productoFormSchema,
	validate: validateProductoForm,
};

export default productoSchema;
