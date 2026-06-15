export const TIPOS_PRODUCTO = ["servicio", "producto", "suscripcion"];
export const ESTADOS_PRODUCTO = ["activo", "inactivo", "agotado"];
export const TIPOS_DURACION_PRODUCTO = ["dias", "meses", "anios"];

export const PRODUCTO_INICIAL = {
	Cod_Prd: "",
	Nom_Prd: "",
	Des_Prd: "",
	Des_Cor_Prd: "",
	Id_Cat: "",
	Tip_Prd: "producto",
	Ima_Prd: "",
	Est_Prd: "activo",
};

function isValidNumber(value) {
	if (!value && value !== 0) return true;
	const num = Number(value);
	return !isNaN(num) && isFinite(num);
}

export function validateProductoForm(form = {}) {
	const errors = {};

	if (!form.Nom_Prd?.trim()) {
		errors.Nom_Prd = "El nombre del producto es obligatorio.";
	}

	if (form.Tip_Prd && !TIPOS_PRODUCTO.includes(form.Tip_Prd)) {
		errors.Tip_Prd = "Tipo de producto invalido.";
	}

	if (form.Est_Prd && !ESTADOS_PRODUCTO.includes(form.Est_Prd)) {
		errors.Est_Prd = "Estado invalido.";
	}

	return errors;
}

export function isProductoFormValid(form = {}) {
	return Object.keys(validateProductoForm(form)).length === 0;
}

export const productoSchema = {
	validate: validateProductoForm,
};

export default productoSchema;
