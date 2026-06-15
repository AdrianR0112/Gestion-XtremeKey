export const COMPRA_INICIAL = {
	Id_Pro: null,
	Fec_Com: "",
	Sub_Tot_Com: 0,
	Imp_Tot_Com: 0,
	Tot_Com: 0,
	Met_Pag_Com: "",
	Not_Com: "",
	Est_Com: "pendiente",
};

export const DETALLE_COMPRA_INICIAL = {
	Id_Com: null,
	Id_Prd: null,
	Id_Var: null,
	Can_Dco: 1,
	Pre_Uni_Dco: 0,
	Sub_Tot_Dco: 0,
	Not_Dco: "",
};

const estados = ["pendiente", "completada", "cancelada"];

export function createCompraForm() {
	return { ...COMPRA_INICIAL };
}

export function createDetalleCompraForm() {
	return { ...DETALLE_COMPRA_INICIAL };
}

export function validateCompraForm(form = {}) {
	const errors = {};

	if (!form.Id_Pro) errors.Id_Pro = "El proveedor es obligatorio.";
	if (form.Sub_Tot_Com === null || form.Sub_Tot_Com === undefined || form.Sub_Tot_Com === "") {
		errors.Sub_Tot_Com = "El subtotal es obligatorio.";
	} else if (Number(form.Sub_Tot_Com) < 0) {
		errors.Sub_Tot_Com = "El subtotal no puede ser negativo.";
	}
	if (form.Imp_Tot_Com !== null && form.Imp_Tot_Com !== undefined && form.Imp_Tot_Com !== "" && Number(form.Imp_Tot_Com) < 0) {
		errors.Imp_Tot_Com = "El impuesto no puede ser negativo.";
	}
	if (form.Tot_Com === null || form.Tot_Com === undefined || form.Tot_Com === "") {
		errors.Tot_Com = "El total es obligatorio.";
	} else if (Number(form.Tot_Com) < 0) {
		errors.Tot_Com = "El total no puede ser negativo.";
	}
	if (form.Est_Com && !estados.includes(form.Est_Com)) {
		errors.Est_Com = "Estado inválido.";
	}

	return errors;
}

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
		errors.Pre_Uni_Dco = "El precio unitario no puede ser negativo.";
	}
	if (form.Sub_Tot_Dco === null || form.Sub_Tot_Dco === undefined || form.Sub_Tot_Dco === "") {
		errors.Sub_Tot_Dco = "El subtotal es obligatorio.";
	} else if (Number(form.Sub_Tot_Dco) < 0) {
		errors.Sub_Tot_Dco = "El subtotal no puede ser negativo.";
	}

	return errors;
}

export function isCompraFormValid(form = {}) {
	return Object.keys(validateCompraForm(form)).length === 0;
}

export function isDetalleCompraFormValid(form = {}) {
	return Object.keys(validateDetalleCompraForm(form)).length === 0;
}

export const compraSchema = {
	validate: validateCompraForm,
};

export default compraSchema;
