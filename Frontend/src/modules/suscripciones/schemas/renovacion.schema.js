import { z } from "zod";
import { fieldErrorsFromResult } from "@/lib/zod";

export const RENOVACION_INICIAL = {
	Dur_Tip: "meses",
	Dur_Val: "1",
	// Vacia en lote: cada suscripcion encadena desde su propio vencimiento en
	// el servidor. En modo individual la precarga useSuscripcionRenovacion.
	Fec_Ini: "",
	Id_Var: "",
	Cor_Cue: "",
	Pre_Uni: "",
	Des_Uni: "0",
	generarVenta: true,
	Est_Ven: "completada",
	Met_Pag: "",
	Not_Ven: "",
};

const duraciones = ["dias", "meses", "anios"];
const estadosVenta = ["pendiente", "completada", "cancelada", "reembolsada"];

const renovacionFormSchema = z
	.object({
		Dur_Tip: z.enum(duraciones, { message: "Duración inválida." }),
		Dur_Val: z.coerce.number({ message: "Indica cuántas unidades dura." }).int().positive("La duración debe ser mayor que cero."),
		Est_Ven: z.enum(estadosVenta, { message: "Estado de venta inválido." }).optional(),
	})
	.passthrough()
	.superRefine((form, ctx) => {
		if (form.Fec_Ini) {
			if (!/^\d{4}-\d{2}-\d{2}$/.test(String(form.Fec_Ini))) {
				ctx.addIssue({ code: "custom", path: ["Fec_Ini"], message: "Fecha de inicio inválida." });
			} else if (Number.isNaN(new Date(`${form.Fec_Ini}T12:00:00`).getTime())) {
				ctx.addIssue({ code: "custom", path: ["Fec_Ini"], message: "Fecha de inicio inválida." });
			}
		}

		if (form.Pre_Uni !== "" && form.Pre_Uni !== undefined && form.Pre_Uni !== null && Number(form.Pre_Uni) < 0) {
			ctx.addIssue({ code: "custom", path: ["Pre_Uni"], message: "El precio no puede ser negativo." });
		}

		const descuento = Number(form.Des_Uni || 0);
		if (descuento < 0) {
			ctx.addIssue({ code: "custom", path: ["Des_Uni"], message: "El descuento no puede ser negativo." });
		}
		if (form.Pre_Uni !== "" && descuento > Number(form.Pre_Uni || 0)) {
			ctx.addIssue({ code: "custom", path: ["Des_Uni"], message: "El descuento no puede superar al precio." });
		}

		// Misma regla que aplica el backend al crear la venta.
		if (form.generarVenta !== false && form.Est_Ven === "completada" && !String(form.Met_Pag || "").trim()) {
			ctx.addIssue({
				code: "custom",
				path: ["Met_Pag"],
				message: "Indica el método de pago para una venta completada.",
			});
		}
	});

export function validateRenovacionForm(form = {}) {
	return fieldErrorsFromResult(renovacionFormSchema.safeParse(form));
}

export function isRenovacionFormValid(form = {}) {
	return Object.keys(validateRenovacionForm(form)).length === 0;
}

export default { RENOVACION_INICIAL, validateRenovacionForm, isRenovacionFormValid };
