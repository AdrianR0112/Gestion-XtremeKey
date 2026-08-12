import { z } from "zod";
import { fieldErrorsFromResult, toPositiveIntegerString } from "@/lib/zod";

export const SUSCRIPCION_INICIAL = {
	Tip_Tit: "cliente",
	Id_Cli: "",
	Id_Rev: "",
	Id_Prd: "",
	Id_Var: "",
	Cor_Cue_Sus: "",
	Fec_Ini_Sus: "",
	Fec_Fin_Sus: "",
	Est_Sus: "activa",
	Ren_Auto: true,
	Not_Sus: "",
};

const estados = ["activa", "suspendida", "cancelada", "expirada"];

const suscripcionFormSchema = z
	.object({
		Id_Prd: toPositiveIntegerString("Selecciona un producto."),
		Fec_Ini_Sus: z.string().trim().min(1, "La fecha de inicio es obligatoria."),
		Est_Sus: z.enum(estados, { message: "Estado invalido." }).optional(),
	})
	.passthrough()
	.superRefine((form, ctx) => {
		// El titular es excluyente: o cliente o revendedor, nunca los dos.
		const esRevendedor = form.Tip_Tit === "revendedor";
		const valor = esRevendedor ? form.Id_Rev : form.Id_Cli;

		if (!valor || Number(valor) <= 0) {
			ctx.addIssue({
				code: "custom",
				path: [esRevendedor ? "Id_Rev" : "Id_Cli"],
				message: esRevendedor ? "Selecciona un revendedor." : "Selecciona un cliente.",
			});
		}

		// Formato laxo: es el correo que dicta el revendedor, no se rechaza por
		// forma, solo se avisa si claramente no es un correo.
		const cuenta = String(form.Cor_Cue_Sus || "").trim();
		if (cuenta && !cuenta.includes("@")) {
			ctx.addIssue({
				code: "custom",
				path: ["Cor_Cue_Sus"],
				message: "La cuenta debe ser un correo válido.",
			});
		}
	});

export function validateSuscripcionForm(form = {}) {
	return fieldErrorsFromResult(suscripcionFormSchema.safeParse(form));
}

export function isSuscripcionFormValid(form = {}) {
	return Object.keys(validateSuscripcionForm(form)).length === 0;
}

export const suscripcionSchema = {
	schema: suscripcionFormSchema,
	validate: validateSuscripcionForm,
};

export default suscripcionSchema;
