export function mapDetalleCompraFromApi(value = {}) {
	return {
		Id_Dco: value.Id_Dco ?? null,
		Id_Com: value.Id_Com ?? null,
		Id_Prd: value.Id_Prd ?? null,
		Id_Var: value.Id_Var ?? null,
		Can_Dco: Number(value.Can_Dco) ?? 1,
		Pre_Uni_Dco: Number(value.Pre_Uni_Dco) ?? 0,
		Sub_Tot_Dco: Number(value.Sub_Tot_Dco) ?? 0,
		Not_Dco: value.Not_Dco ?? "",
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

export function mapDetalleCompraPayload(form = {}) {
	return {
		Id_Com: form.Id_Com || null,
		Id_Prd: form.Id_Prd || null,
		Id_Var: form.Id_Var || null,
		Can_Dco: Number(form.Can_Dco) || 1,
		Pre_Uni_Dco: Number(form.Pre_Uni_Dco) || 0,
		Sub_Tot_Dco: Number(form.Sub_Tot_Dco) || 0,
		Not_Dco: form.Not_Dco?.trim() || null,
	};
}

export default mapDetalleCompraPayload;
