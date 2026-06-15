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

export function validateRenovacionForm(form, { mode = "create" } = {}) {
	const errors = {};

	if (mode === "create") {
		if (!form.Id_Dve_Ori) errors.Id_Dve_Ori = "La licencia original es obligatoria.";
		if (!form.Id_Cli) errors.Id_Cli = "El cliente es obligatorio.";
		if (!form.Id_Prd && !form.Id_Var) errors.Id_Prd = "Debe especificar producto o variante.";
	}

	if (form.Fec_Ven_Ant_Ren && form.Fec_Ini_Nue_Ren) {
		const ant = new Date(form.Fec_Ven_Ant_Ren);
		const nue = new Date(form.Fec_Ini_Nue_Ren);
		if (nue < ant) errors.Fec_Ini_Nue_Ren = "La fecha de inicio no puede ser anterior a la fecha de vencimiento de la licencia anterior.";
	}

	return errors;
}

export function isRenovacionFormValid(form) {
	return Object.keys(validateRenovacionForm(form)).length === 0;
}

export { TIPOS_RENOVACION, ESTADOS_RENOVACION };
export default { RENOVACION_INICIAL, TIPOS_RENOVACION, ESTADOS_RENOVACION };
