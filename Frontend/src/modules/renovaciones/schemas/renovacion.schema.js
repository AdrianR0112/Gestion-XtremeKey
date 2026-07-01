import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

const TIPOS_RENOVACION = ["automatica", "manual", "anticipada"];
const ESTADOS_RENOVACION = ["pendiente", "completada", "rechazada", "expirada"];

export const RENOVACION_INICIAL = {
	Id_Dve_Ori: "",
	Id_Dve_Nue: "",
	Id_Cli: "",
	Id_Prd: "",
	Id_Var: "",
	Fec_Ven_Ant_Ren: "",
	Fec_Ini_Nue_Ren: "",
	Fec_Fin_Nue_Ren: "",
	Pre_Ori_Ren: "",
	Pre_Ren: "",
	Des_Ren: "0",
	Tip_Ren: "manual",
	Est_Ren: "pendiente",
	Not_Ren: "",
};

function getRenovacionFormSchema(mode = "create") {
	return z.object({
		Id_Dve_Ori: z.union([z.string(), z.number()]).optional(),
		Id_Cli: z.union([z.string(), z.number()]).optional(),
		Id_Prd: z.union([z.string(), z.number()]).optional(),
		Id_Var: z.union([z.string(), z.number()]).optional(),
		Fec_Ven_Ant_Ren: z.string().optional(),
		Fec_Ini_Nue_Ren: z.string().optional(),
		Tip_Ren: z.enum(TIPOS_RENOVACION).optional(),
		Est_Ren: z.enum(ESTADOS_RENOVACION).optional(),
	}).passthrough().superRefine((form, ctx) => {
		if (mode === "create") {
			if (!form.Id_Dve_Ori) ctx.addIssue({ code: "custom", path: ["Id_Dve_Ori"], message: "La licencia original es obligatoria." });
			if (!form.Id_Cli) ctx.addIssue({ code: "custom", path: ["Id_Cli"], message: "El cliente es obligatorio." });
			if (!form.Id_Prd && !form.Id_Var) ctx.addIssue({ code: "custom", path: ["Id_Prd"], message: "Debe especificar producto o variante." });
		}

		if (form.Fec_Ven_Ant_Ren && form.Fec_Ini_Nue_Ren) {
			const ant = new Date(form.Fec_Ven_Ant_Ren);
			const nue = new Date(form.Fec_Ini_Nue_Ren);
			if (nue < ant) {
				ctx.addIssue({ code: "custom", path: ["Fec_Ini_Nue_Ren"], message: "La fecha de inicio no puede ser anterior a la fecha de vencimiento de la licencia anterior." });
			}
		}
	});
}

export function validateRenovacionForm(form, { mode = "create" } = {}) {
	return fieldErrorsFromResult(getRenovacionFormSchema(mode).safeParse(form));
}

export function isRenovacionFormValid(form) {
	return Object.keys(validateRenovacionForm(form)).length === 0;
}

export { TIPOS_RENOVACION, ESTADOS_RENOVACION };
export const renovacionSchema = { getFormSchema: getRenovacionFormSchema, validate: validateRenovacionForm };
export default { RENOVACION_INICIAL, TIPOS_RENOVACION, ESTADOS_RENOVACION, renovacionSchema };
