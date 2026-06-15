export function mapCompraFromApi(value = {}) {
	return {
		Id_Com: value.Id_Com ?? null,
		Id_Pro: value.Id_Pro ?? null,
		Fec_Com: value.Fec_Com ?? null,
		Sub_Tot_Com: Number(value.Sub_Tot_Com) ?? 0,
		Imp_Tot_Com: Number(value.Imp_Tot_Com) ?? 0,
		Tot_Com: Number(value.Tot_Com) ?? 0,
		Met_Pag_Com: value.Met_Pag_Com ?? "",
		Not_Com: value.Not_Com ?? "",
		Est_Com: value.Est_Com ?? "pendiente",
		Fec_Cre: value.Fec_Cre ?? null,
		Fec_Mod: value.Fec_Mod ?? null,
	};
}

export function mapCompraPayload(form = {}, totals = {}) {
	return {
		Id_Pro: form.Id_Pro || null,
		Fec_Com: form.Fec_Com?.trim() || null,
		Sub_Tot_Com: Number(totals?.sub ?? form.Sub_Tot_Com) || 0,
		Imp_Tot_Com: Number(form.Imp_Tot_Com) || 0,
		Tot_Com: Number(totals?.total ?? form.Tot_Com) || 0,
		Met_Pag_Com: form.Met_Pag_Com?.trim() || null,
		Not_Com: form.Not_Com?.trim() || null,
		Est_Com: form.Est_Com || "pendiente",
	};
}

export function mapCompraToForm(compra = {}) {
	return {
		Id_Pro: compra.Id_Pro || null,
		Fec_Com: compra.Fec_Com || "",
		Sub_Tot_Com: String(compra.Sub_Tot_Com || 0),
		Imp_Tot_Com: String(compra.Imp_Tot_Com || 0),
		Tot_Com: String(compra.Tot_Com || 0),
		Met_Pag_Com: compra.Met_Pag_Com || "",
		Not_Com: compra.Not_Com || "",
		Est_Com: compra.Est_Com || "pendiente",
	};
}

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

export function mapDetalleCompraToForm(detalle = {}) {
	return {
		Id_Com: detalle.Id_Com || null,
		Id_Prd: detalle.Id_Prd || null,
		Id_Var: detalle.Id_Var || null,
		Can_Dco: String(detalle.Can_Dco || 1),
		Pre_Uni_Dco: String(detalle.Pre_Uni_Dco || 0),
		Sub_Tot_Dco: String(detalle.Sub_Tot_Dco || 0),
		Not_Dco: detalle.Not_Dco || "",
	};
}

export function buildDetalleCompraPayload(form = {}, subtotal = 0) {
	return {
		Id_Com: form.Id_Com || null,
		Id_Prd: form.Id_Prd || null,
		Id_Var: form.Id_Var || null,
		Can_Dco: Number(form.Can_Dco) || 1,
		Pre_Uni_Dco: Number(form.Pre_Uni_Dco) || 0,
		Sub_Tot_Dco: Number(subtotal) || 0,
		Not_Dco: form.Not_Dco?.trim() || null,
	};
}

export function buildProveedorMap(proveedores = []) {
	return proveedores.reduce((map, proveedor) => {
		map[proveedor.Id_Pro] = proveedor;
		return map;
	}, {});
}

export function buildProductoMap(productos = []) {
	return productos.reduce((map, producto) => {
		map[producto.Id_Prd] = producto;
		return map;
	}, {});
}

export function buildVarianteMap(variantes = []) {
	return variantes.reduce((map, variante) => {
		map[variante.Id_Var] = variante;
		return map;
	}, {});
}

export function filterCompras(compras = [], searchTerm = "", estadoFilter = "todos", proveedorMap = {}) {
	const query = searchTerm.trim().toLowerCase();
	return compras.filter((compra) => {
		const proveedor = proveedorMap[compra.Id_Pro] || {};
		const matchesSearch =
			!query ||
			`${compra.Id_Com} ${proveedor.Nom_Pro} ${compra.Met_Pag_Com}`
				.toLowerCase()
				.includes(query);
		const matchesEstado = estadoFilter === "todos" || compra.Est_Com === estadoFilter;
		return matchesSearch && matchesEstado;
	});
}

export default mapCompraPayload;
