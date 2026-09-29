import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const ROLES_USUARIO = ["admin"];
export const ESTADOS_USUARIO = ["activo", "inactivo", "bloqueado"];

export const USUARIO_INICIAL = {
	Nom_Usu: "",
	Ape_Usu: "",
	Ema_Usu: "",
	Pas_Usu: "",
	Tel_Usu: "",
	Rol_Usu: "admin",
	Est_Usu: "activo",
};

function getUsuarioFormSchema(mode = "create") {
	return z.object({
		Nom_Usu: z.string().trim().min(1, "El nombre es obligatorio."),
		Ape_Usu: z.string().trim().min(1, "El apellido es obligatorio."),
		Ema_Usu: z.string().trim().min(1, "Ingresa un correo valido.").refine((value) => z.email().safeParse(value).success, {
			message: "Ingresa un correo valido.",
		}),
		Pas_Usu: z.string().optional(),
		Rol_Usu: z.enum(ROLES_USUARIO, { message: "Rol invalido." }).optional(),
		Est_Usu: z.enum(ESTADOS_USUARIO, { message: "Estado invalido." }).optional(),
	}).passthrough().superRefine((form, ctx) => {
		const mustValidatePassword = mode === "create" || Boolean(form.Pas_Usu);
		if (mustValidatePassword && String(form.Pas_Usu || "").length < 6) {
			ctx.addIssue({ code: "custom", path: ["Pas_Usu"], message: "La contrasena debe tener minimo 6 caracteres." });
		}
	});
}

export function validateUsuarioForm(form = {}, { mode = "create" } = {}) {
	return fieldErrorsFromResult(getUsuarioFormSchema(mode).safeParse(form));
}

export const usuarioSchema = {
	getFormSchema: getUsuarioFormSchema,
	validate: validateUsuarioForm,
};

export default usuarioSchema;
