import { z } from "zod";
import { getTimezone } from "../../../utils/timezone";
import { fieldErrorsFromResult } from "@/lib/zod";

function getTodayDateInputValue() {
	const tz = getTimezone();
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(new Date());
	const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${values.year}-${values.month}-${values.day}`;
}

export const GASTO_INICIAL = {
	Nom_Gas: "",
	Des_Gas: "",
	Cat_Gas: "operativo",
	Mon_Gas: 0,
	Fec_Gas: getTodayDateInputValue(),
	Id_Pro: null,
	Id_Com: null,
	Com_Gas: "",
	Est_Gas: "registrado",
};

export function createGastoForm() {
	return { ...GASTO_INICIAL, Fec_Gas: getTodayDateInputValue() };
}

const validCategorias = ["operativo", "administrativo", "marketing", "proveedor", "impuesto", "otro"];
const validEstados = ["registrado", "pagado", "cancelado"];

const gastoFormSchema = z.object({
	Nom_Gas: z.string().trim().min(1, "El nombre es requerido").max(150, "El nombre no puede exceder 150 caracteres"),
	Mon_Gas: z.union([z.string(), z.number()]).refine((value) => value !== "" && value !== null && !Number.isNaN(Number(value)), {
		message: "El monto es requerido",
	}).refine((value) => Number(value) >= 0, {
		message: "El monto no puede ser negativo",
	}),
	Fec_Gas: z.string().trim().min(1, "La fecha es requerida"),
	Cat_Gas: z.enum(validCategorias, { message: "Categoría inválida" }).optional(),
	Est_Gas: z.enum(validEstados, { message: "Estado inválido" }).optional(),
}).passthrough();

export function validateGastoForm(form) {
	return fieldErrorsFromResult(gastoFormSchema.safeParse(form));
}

export function isGastoFormValid(form) {
	return Object.keys(validateGastoForm(form)).length === 0;
}
