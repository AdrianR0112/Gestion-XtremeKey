export function mapProveedorProductoFromApi(value = {}) {
	return {
		Id_Pro_Prd: value.Id_Pro_Prd ?? null,
		Id_Pro: value.Id_Pro ?? null,
		Id_Prd: value.Id_Prd ?? null,
		Id_Var: value.Id_Var ?? null,
		Pre_Com_Pro_Prd: value.Pre_Com_Pro_Prd ?? "",
		Es_Pri_Pro_Prd: Number(value.Es_Pri_Pro_Prd ?? 0),
		Not_Pro_Prd: value.Not_Pro_Prd ?? "",
		Nom_Pro: value.Nom_Pro ?? "",
		Nom_Prd: value.Nom_Prd ?? "",
		Nom_Var: value.Nom_Var ?? "",
	};
}

export function mapProveedorProductoToForm(value = {}) {
	return {
		Id_Pro: value.Id_Pro ? String(value.Id_Pro) : "",
		Id_Prd: value.Id_Prd ? String(value.Id_Prd) : "",
		Id_Var: value.Id_Var ? String(value.Id_Var) : "",
		Pre_Com_Pro_Prd: value.Pre_Com_Pro_Prd === null || value.Pre_Com_Pro_Prd === undefined ? "" : String(value.Pre_Com_Pro_Prd),
		Es_Pri_Pro_Prd: Number(value.Es_Pri_Pro_Prd) === 1,
		Not_Pro_Prd: value.Not_Pro_Prd ?? "",
	};
}

export function mapProveedorProductoPayload(form = {}) {
	const idProducto = form.Id_Prd === "" || form.Id_Prd === null || form.Id_Prd === undefined ? null : Number(form.Id_Prd);
	const idVariante = form.Id_Var === "" || form.Id_Var === null || form.Id_Var === undefined ? null : Number(form.Id_Var);

	return {
		Id_Pro: Number(form.Id_Pro),
		Id_Prd: idProducto,
		Id_Var: idVariante,
		Pre_Com_Pro_Prd: form.Pre_Com_Pro_Prd === "" ? null : Number(form.Pre_Com_Pro_Prd),
		Es_Pri_Pro_Prd: form.Es_Pri_Pro_Prd ? 1 : 0,
		Not_Pro_Prd: form.Not_Pro_Prd?.trim() || null,
	};
}
