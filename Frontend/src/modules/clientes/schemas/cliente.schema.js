import { z } from "zod";
import { fieldErrorsFromResult, optionalEmailString } from "@/lib/zod";

export const CLIENTE_INICIAL = {
	Nom_Cli: "",
	Ape_Cli: "",
	Tel_Cli: "",
	Usu_Tel_Cli: "",
	Ema_Cli: "",
	Pai_Cli: "Ecuador",
	Doc_Cli: "",
	Cat_Cli: "nuevo",
	Pre_Con_Cli: "whatsapp",
	Ace_Not_Tel_Cli: true,
	Ace_Not_Cor_Cli: true,
	Not_Cli: "",
	Est_Cli: "activo",
};

const categorias = ["nuevo", "ocasional", "frecuente", "vip"];
const preferencias = ["whatsapp", "email", "instagram", "messenger", "telegram"];
const estados = ["activo", "inactivo", "suspendido"];

const clienteFormSchema = z.object({
	Tel_Cli: z.string().trim().min(1, "El telefono es obligatorio."),
	Ema_Cli: optionalEmailString.refine((value) => value === "" || z.email().safeParse(value).success, {
		message: "El correo no tiene un formato valido.",
	}),
	Cat_Cli: z.enum(categorias, { message: "Categoria invalida." }).optional(),
	Pre_Con_Cli: z.enum(preferencias, { message: "Preferencia invalida." }).optional(),
	Est_Cli: z.enum(estados, { message: "Estado invalido." }).optional(),
}).passthrough();

export function validateClienteForm(form = {}) {
	return fieldErrorsFromResult(clienteFormSchema.safeParse(form));
}

export function isClienteFormValid(form = {}) {
	return Object.keys(validateClienteForm(form)).length === 0;
}

export const clienteSchema = {
	schema: clienteFormSchema,
	validate: validateClienteForm,
};

export default clienteSchema;
