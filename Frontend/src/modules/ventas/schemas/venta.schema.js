import { z } from "zod";
import { DETALLE_INICIAL, VENTA_INICIAL, getCurrentDateTimeInputValue, getTodayDateInputValue } from "../utils/constants";

const ventaFormSchema = z.object({
	Id_Cli: z.any().optional(),
	Id_Rev: z.any().optional(),
}).passthrough().refine((form) => Boolean(form.Id_Cli) || Boolean(form.Id_Rev), {
	message: "Debe seleccionar un cliente o un revendedor.",
});

const detalleFormSchema = z.object({
	Pre_Uni_Dve: z.any(),
	Can_Dve: z.any(),
}).passthrough().refine((form) => form.Pre_Uni_Dve !== "" && form.Can_Dve !== "", {
	message: "El detalle debe incluir precio unitario y cantidad.",
});

export const ventaSchema = {
	initialValues: VENTA_INICIAL,
	schema: ventaFormSchema,
	validate(form) {
		return ventaFormSchema.safeParse(form).success;
	},
};

export const detalleVentaSchema = {
	initialValues: DETALLE_INICIAL,
	schema: detalleFormSchema,
	validate(form) {
		return detalleFormSchema.safeParse(form).success;
	},
};

export function createVentaForm() {
	return {
		...VENTA_INICIAL,
		Fec_Ven: getCurrentDateTimeInputValue(),
	};
}

export function createDetalleForm() {
	const today = getTodayDateInputValue();
	return {
		...DETALLE_INICIAL,
		Fec_Ini_Dve: today,
		Fec_Fin_Dve: today,
	};
}

export default ventaSchema;
