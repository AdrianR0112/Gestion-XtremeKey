export const DETALLE_COMPRA_INICIAL = {
	Id_Com: null,
	Id_Prd: null,
	Id_Var: null,
	Can_Dco: 1,
	Pre_Uni_Dco: 0,
	Sub_Tot_Dco: 0,
	Not_Dco: "",
};

export function validateDetalleCompraForm(form = {}) {
	const errors = {};

	if (!form.Id_Com) errors.Id_Com = "La compra es obligatoria.";
	if (form.Can_Dco === null || form.Can_Dco === undefined || form.Can_Dco === "") {
		errors.Can_Dco = "La cantidad es obligatoria.";
	} else if (Number(form.Can_Dco) < 1) {
		errors.Can_Dco = "La cantidad debe ser mayor a 0.";
	}
	if (form.Pre_Uni_Dco === null || form.Pre_Uni_Dco === undefined || form.Pre_Uni_Dco === "") {
		errors.Pre_Uni_Dco = "El precio unitario es obligatorio.";
	} else if (Number(form.Pre_Uni_Dco) < 0) {
		errors.Pre_Uni_Dco = "El precio no puede ser negativo.";
	}
	if (form.Sub_Tot_Dco === null || form.Sub_Tot_Dco === undefined || form.Sub_Tot_Dco === "") {
		errors.Sub_Tot_Dco = "El subtotal es obligatorio.";
	} else if (Number(form.Sub_Tot_Dco) < 0) {
		errors.Sub_Tot_Dco = "El subtotal no puede ser negativo.";
	}

	return errors;
}

export function isDetalleCompraFormValid(form = {}) {
	return Object.keys(validateDetalleCompraForm(form)).length === 0;
}

export const detalleCompraSchema = {
	validate: validateDetalleCompraForm,
};

export default detalleCompraSchema;
