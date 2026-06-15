import { DETALLE_INICIAL, VENTA_INICIAL, getCurrentDateTimeInputValue, getTodayDateInputValue } from "../utils/constants";

export const ventaSchema = {
	initialValues: VENTA_INICIAL,
	validate(form) {
		return Boolean(form.Id_Cli) || Boolean(form.Id_Rev);
	},
};

export const detalleVentaSchema = {
	initialValues: DETALLE_INICIAL,
	validate(form) {
		return Boolean(form.Pre_Uni_Dve !== "" && form.Can_Dve !== "");
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
