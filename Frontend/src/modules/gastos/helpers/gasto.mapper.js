export function mapGastoFromApi(value) {
	return {
		Id_Gas: value?.Id_Gas ? Number(value.Id_Gas) : null,
		Nom_Gas: String(value?.Nom_Gas || ""),
		Des_Gas: String(value?.Des_Gas || ""),
		Cat_Gas: String(value?.Cat_Gas || "operativo"),
		Mon_Gas: Number(value?.Mon_Gas || 0),
		Fec_Gas: String(value?.Fec_Gas || ""),
		Id_Pro: value?.Id_Pro ? Number(value.Id_Pro) : null,
		Id_Com: value?.Id_Com ? Number(value.Id_Com) : null,
		Com_Gas: String(value?.Com_Gas || ""),
		Est_Gas: String(value?.Est_Gas || "registrado"),
	};
}

export function mapGastoToForm(gasto) {
	return {
		Nom_Gas: String(gasto?.Nom_Gas || ""),
		Des_Gas: String(gasto?.Des_Gas || ""),
		Cat_Gas: String(gasto?.Cat_Gas || "operativo"),
		Mon_Gas: String(gasto?.Mon_Gas || ""),
		Fec_Gas: String(gasto?.Fec_Gas || ""),
		Id_Pro: gasto?.Id_Pro ? String(gasto.Id_Pro) : "",
		Id_Com: gasto?.Id_Com ? String(gasto.Id_Com) : "",
		Com_Gas: String(gasto?.Com_Gas || ""),
		Est_Gas: String(gasto?.Est_Gas || "registrado"),
	};
}

export function mapGastoPayload(form) {
	return {
		Nom_Gas: String(form.Nom_Gas || ""),
		Des_Gas: String(form.Des_Gas || ""),
		Cat_Gas: String(form.Cat_Gas || "operativo"),
		Mon_Gas: Number(form.Mon_Gas) || 0,
		Fec_Gas: String(form.Fec_Gas || ""),
		Id_Pro: form.Id_Pro ? Number(form.Id_Pro) : null,
		Id_Com: form.Id_Com ? Number(form.Id_Com) : null,
		Com_Gas: String(form.Com_Gas || ""),
		Est_Gas: String(form.Est_Gas || "registrado"),
	};
}

export function buildProveedorMap(proveedores) {
	return (proveedores || []).reduce((acc, prov) => {
		acc[Number(prov.Id_Pro)] = prov;
		return acc;
	}, {});
}

export function buildCompraMap(compras) {
	return (compras || []).reduce((acc, comp) => {
		acc[Number(comp.Id_Com)] = comp;
		return acc;
	}, {});
}

export function filterGastos(gastos, searchTerm, categoriaFilter, proveedorMap) {
	if (!searchTerm && !categoriaFilter) return gastos;

	return (gastos || []).filter((gasto) => {
		const matchesSearch = !searchTerm || 
			String(gasto.Nom_Gas || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
			(proveedorMap[Number(gasto.Id_Pro)]?.Nom_Pro || "").toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategoria = !categoriaFilter || gasto.Cat_Gas === categoriaFilter;

		return matchesSearch && matchesCategoria;
	});
}
