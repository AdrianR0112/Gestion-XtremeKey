export const ESTADOS_CATEGORIA = ["activo", "inactivo"];

export const CATEGORIA_INICIAL = {
	Nom_Cat: "",
	Des_Cat: "",
	Id_Cat_Pad: "",
	Ico_Cat: "",
	Ord_Cat: "",
	Est_Cat: "activo",
};

export function validateCategoriaForm(form = {}) {
	const errors = {};

	if (!form.Nom_Cat?.trim()) {
		errors.Nom_Cat = "El nombre de la categoria es obligatorio.";
	}

	if (form.Est_Cat && !ESTADOS_CATEGORIA.includes(form.Est_Cat)) {
		errors.Est_Cat = "Estado invalido.";
	}

	if (form.Ord_Cat !== "" && form.Ord_Cat !== null) {
		const value = Number(form.Ord_Cat);
		if (!Number.isFinite(value)) {
			errors.Ord_Cat = "El orden debe ser numerico.";
		}
	}

	if (form.Id_Cat_Pad !== "" && form.Id_Cat_Pad !== null) {
		const parentValue = Number(form.Id_Cat_Pad);
		if (!Number.isInteger(parentValue) || parentValue <= 0) {
			errors.Id_Cat_Pad = "La categoria padre debe ser un id valido.";
		}
	}

	return errors;
}

export function isCategoriaFormValid(form = {}) {
	return Object.keys(validateCategoriaForm(form)).length === 0;
}

export const categoriaSchema = {
	validate: validateCategoriaForm,
};

export default categoriaSchema;
