export function mapRenovacionFromApi(value = {}) {
	return {
		...value,
		Id_Prd: value.Id_Prd ?? null,
		Id_Var: value.Id_Var ?? null,
	};
}

export function mapRenovacionPayload(form = {}) {
	const idProducto = form.Id_Prd === "" || form.Id_Prd === undefined ? null : form.Id_Prd;
	const idVariante = form.Id_Var === "" || form.Id_Var === undefined ? null : form.Id_Var;

	return {
		...form,
		Id_Prd: idProducto,
		Id_Var: idVariante,
	};
}

export const mapRenovacion = mapRenovacionFromApi;
export default mapRenovacion;
