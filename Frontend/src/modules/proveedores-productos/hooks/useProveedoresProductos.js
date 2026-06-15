import { useEffect, useMemo, useState } from "react";
import { mapProductoFromApi } from "../../productos/helpers/producto.mapper";
import { productosService } from "../../productos/services/productos.service";
import { mapVariantFromApi } from "../../variantes/helpers/variant.mapper";
import { variantesService } from "../../variantes/services/variantes.service";
import { mapProveedorProductoFromApi, mapProveedorProductoPayload } from "../helpers/proveedorProducto.mapper";
import proveedoresProductosService from "../services/proveedoresProductos.service";

export default function useProveedoresProductos() {
	const [relaciones, setRelaciones] = useState([]);
	const [productos, setProductos] = useState([]);
	const [variantes, setVariantes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const cargarRelaciones = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await proveedoresProductosService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapProveedorProductoFromApi(item)) : [];
			setRelaciones(mapped);
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudieron cargar las relaciones proveedor-producto.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarRelaciones();
		cargarProductos();
		cargarVariantes();
	}, []);

	const cargarProductos = async () => {
		try {
			const list = await productosService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapProductoFromApi(item)) : [];
			setProductos(mapped);
			return mapped;
		} catch (_err) {
			setProductos([]);
			return [];
		}
	};

	const cargarVariantes = async () => {
		try {
			const list = await variantesService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapVariantFromApi(item)) : [];
			setVariantes(mapped);
			return mapped;
		} catch (_err) {
			setVariantes([]);
			return [];
		}
	};

	const createRelacion = async (form) => {
		setSaving(true);
		setError("");
		try {
			const payload = mapProveedorProductoPayload(form);
			const created = await proveedoresProductosService.create(payload);
			await cargarRelaciones();
			return { ok: true, data: created };
		} catch (err) {
			const message = err?.data?.message || err?.message || "No se pudo crear la relación.";
			setError(message);
			return { ok: false, message };
		} finally {
			setSaving(false);
		}
	};

	const updateRelacion = async (idRelacion, form) => {
		if (!idRelacion) return { ok: false, message: "Relación inválida." };
		setSaving(true);
		setError("");
		try {
			const payload = mapProveedorProductoPayload(form);
			const updated = await proveedoresProductosService.update(idRelacion, payload);
			await cargarRelaciones();
			return { ok: true, data: updated };
		} catch (err) {
			const message = err?.data?.message || err?.message || "No se pudo actualizar la relación.";
			setError(message);
			return { ok: false, message };
		} finally {
			setSaving(false);
		}
	};

	const removeRelacion = async (idRelacion) => {
		if (!idRelacion) return false;
		setSaving(true);
		setError("");
		try {
			await proveedoresProductosService.remove(idRelacion);
			await cargarRelaciones();
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar la relación.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	const relacionesPorProveedor = useMemo(() => {
		const grouped = {};
		for (const item of relaciones) {
			const idProveedor = Number(item.Id_Pro);
			if (!idProveedor) continue;
			if (!grouped[idProveedor]) grouped[idProveedor] = [];
			grouped[idProveedor].push(item);
		}
		return grouped;
	}, [relaciones]);

	return {
		relaciones,
		relacionesPorProveedor,
		productos,
		variantes,
		loading,
		saving,
		error,
		setError,
		cargarRelaciones,
		cargarProductos,
		cargarVariantes,
		createRelacion,
		updateRelacion,
		removeRelacion,
	};
}
