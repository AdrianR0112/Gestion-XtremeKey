export const CLIENTE_INICIAL = {
	Nom_Cli: "",
	Ape_Cli: "",
	Tel_Cli: "",
	Usu_Tel_Cli: "",
	Ema_Cli: "",
	Pai_Cli: "Ecuador",
	Doc_Cli: "",
	Cat_Cli: "nuevo",
	Pre_Con_Cli: "whatsapp",
	Ace_Not_Tel_Cli: true,
	Ace_Not_Cor_Cli: true,
	Not_Cli: "",
	Est_Cli: "activo",
};

const categorias = ["nuevo", "ocasional", "frecuente", "vip"];
const preferencias = ["whatsapp", "email", "instagram", "messenger", "telegram"];
const estados = ["activo", "inactivo", "suspendido"];

function isValidEmail(value) {
	if (!value) return true;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function validateClienteForm(form = {}) {
	const errors = {};

	if (!form.Tel_Cli?.trim()) errors.Tel_Cli = "El telefono es obligatorio.";

	if (!isValidEmail(form.Ema_Cli?.trim())) errors.Ema_Cli = "El correo no tiene un formato valido.";
	if (form.Cat_Cli && !categorias.includes(form.Cat_Cli)) errors.Cat_Cli = "Categoria invalida.";
	if (form.Pre_Con_Cli && !preferencias.includes(form.Pre_Con_Cli)) errors.Pre_Con_Cli = "Preferencia invalida.";
	if (form.Est_Cli && !estados.includes(form.Est_Cli)) errors.Est_Cli = "Estado invalido.";

	return errors;
}

export function isClienteFormValid(form = {}) {
	return Object.keys(validateClienteForm(form)).length === 0;
}

export const clienteSchema = {
	validate: validateClienteForm,
};

export default clienteSchema;
