import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const ESTADOS_VARIANTE = ["activo", "inactivo"];
export const TIPOS_DURACION_VARIANTE = ["dias", "meses", "anios"];

export const VARIANTE_INICIAL = {
	Id_Prd: "",
	Nom_Var: "",
	Des_Var: "",
	Pre_Cos_Var: "",
	Pre_Ven_Var: "",
	Pre_Rev_Var: "",
	Dur_Tip_Var: "",
	Dur_Val_Var: "",
	Max_Usu_Var: "",
	Not_Ven_Cor_Var: true,
	Not_Ven_Wsp_Var: true,
	Atr_Var: "",
	Est_Var: "activo",
};

const isValidNumber = (value) => {
	if (value === "" || value === null || value === undefined) return true;
	const num = Number(value);
	return !Number.isNaN(num) && Number.isFinite(num);
};

const isValidJson = (value) => {
	if (value === "" || value === null || value === undefined) return true;
	if (typeof value === "object") return true;
	try {
		JSON.parse(value);
		return true;
	} catch {
		return false;
	}
};

const variantFormSchema = z.object({
	Id_Prd: z.any().refine((value) => Boolean(value), { message: "El producto es obligatorio." }),
	Nom_Var: z.string().trim().min(1, "El nombre de la variante es obligatorio."),
	Pre_Cos_Var: z.union([z.string(), z.number()]),
	Pre_Ven_Var: z.union([z.string(), z.number()]),
	Pre_Rev_Var: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
	Dur_Tip_Var: z.enum(TIPOS_DURACION_VARIANTE, { message: "El tipo de duración es invalido." }).optional().or(z.literal("")),
	Dur_Val_Var: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
	Max_Usu_Var: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
	Est_Var: z.enum(ESTADOS_VARIANTE, { message: "Estado invalido." }).optional(),
	Atr_Var: z.any().optional(),
}).passthrough().superRefine((form, ctx) => {
	if (form.Pre_Cos_Var === "" || form.Pre_Cos_Var === null || form.Pre_Cos_Var === undefined) {
		ctx.addIssue({ code: "custom", path: ["Pre_Cos_Var"], message: "El precio de costo es obligatorio." });
	} else if (!isValidNumber(form.Pre_Cos_Var)) {
		ctx.addIssue({ code: "custom", path: ["Pre_Cos_Var"], message: "El precio de costo debe ser numerico." });
	} else if (Number(form.Pre_Cos_Var) < 0) {
		ctx.addIssue({ code: "custom", path: ["Pre_Cos_Var"], message: "El precio de costo debe ser mayor o igual a 0." });
	}

	if (form.Pre_Ven_Var === "" || form.Pre_Ven_Var === null || form.Pre_Ven_Var === undefined) {
		ctx.addIssue({ code: "custom", path: ["Pre_Ven_Var"], message: "El precio de venta es obligatorio." });
	} else if (!isValidNumber(form.Pre_Ven_Var)) {
		ctx.addIssue({ code: "custom", path: ["Pre_Ven_Var"], message: "El precio de venta debe ser numerico." });
	} else if (Number(form.Pre_Ven_Var) < 0) {
		ctx.addIssue({ code: "custom", path: ["Pre_Ven_Var"], message: "El precio de venta debe ser mayor o igual a 0." });
	}

	if (form.Pre_Rev_Var !== "" && form.Pre_Rev_Var !== null && form.Pre_Rev_Var !== undefined && !isValidNumber(form.Pre_Rev_Var)) {
		ctx.addIssue({ code: "custom", path: ["Pre_Rev_Var"], message: "El precio para revendedor debe ser numerico." });
	} else if (form.Pre_Rev_Var !== "" && form.Pre_Rev_Var !== null && form.Pre_Rev_Var !== undefined && Number(form.Pre_Rev_Var) < 0) {
		ctx.addIssue({ code: "custom", path: ["Pre_Rev_Var"], message: "El precio para revendedor debe ser mayor o igual a 0." });
	}

	if (isValidNumber(form.Pre_Cos_Var) && isValidNumber(form.Pre_Ven_Var) && form.Pre_Cos_Var !== "" && form.Pre_Ven_Var !== "" && Number(form.Pre_Cos_Var) > Number(form.Pre_Ven_Var)) {
		ctx.addIssue({ code: "custom", path: ["Pre_Cos_Var"], message: "El precio de costo no puede ser mayor que el precio de venta." });
	}

	if (form.Dur_Val_Var !== "" && form.Dur_Val_Var !== null && form.Dur_Val_Var !== undefined && (!Number.isInteger(Number(form.Dur_Val_Var)) || Number(form.Dur_Val_Var) < 1)) {
		ctx.addIssue({ code: "custom", path: ["Dur_Val_Var"], message: "La duración debe ser un entero mayor o igual a 1." });
	}

	if (form.Max_Usu_Var !== "" && form.Max_Usu_Var !== null && form.Max_Usu_Var !== undefined && (!Number.isInteger(Number(form.Max_Usu_Var)) || Number(form.Max_Usu_Var) < 1)) {
		ctx.addIssue({ code: "custom", path: ["Max_Usu_Var"], message: "El maximo de usuarios debe ser un entero mayor o igual a 1." });
	}

	if (!isValidJson(form.Atr_Var)) {
		ctx.addIssue({ code: "custom", path: ["Atr_Var"], message: "Los atributos deben ser un JSON valido." });
	}
	});

export function validateVariantForm(form = {}) {
	return fieldErrorsFromResult(variantFormSchema.safeParse(form));
}

export function isVariantFormValid(form = {}) {
	return Object.keys(validateVariantForm(form)).length === 0;
}

export const variantSchema = {
	schema: variantFormSchema,
	validate: validateVariantForm,
};

export default variantSchema;
