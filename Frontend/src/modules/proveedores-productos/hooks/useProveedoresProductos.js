import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapProductoFromApi } from "../../productos/helpers/producto.mapper";
import { productosService } from "../../productos/services/productos.service";
import { mapVariantFromApi } from "../../variantes/helpers/variant.mapper";
import { variantesService } from "../../variantes/services/variantes.service";
import { mapProveedorProductoFromApi, mapProveedorProductoPayload } from "../helpers/proveedorProducto.mapper";
import proveedoresProductosService from "../services/proveedoresProductos.service";

export default function useProveedoresProductos() {
	const queryClient = useQueryClient();
	const [actionLoading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const relacionesQueryKey = queryKeys.proveedoresProductos.list();
	const productosQueryKey = queryKeys.productos.list();
	const variantesQueryKey = queryKeys.variantes.list();

	const relacionesQuery = useQuery({
		queryKey: relacionesQueryKey,
		queryFn: async () => toArray(await proveedoresProductosService.list()).map((item) => mapProveedorProductoFromApi(item)),
	});
	const productosQuery = useQuery({
		queryKey: productosQueryKey,
		queryFn: async () => toArray(await productosService.list()).map((item) => mapProductoFromApi(item)),
	});
	const variantesQuery = useQuery({
		queryKey: variantesQueryKey,
		queryFn: async () => toArray(await variantesService.list()).map((item) => mapVariantFromApi(item)),
	});

	const relaciones = relacionesQuery.data ?? [];
	const productos = productosQuery.data ?? [];
	const variantes = variantesQuery.data ?? [];
	const setRelaciones = createQueryDataSetter(queryClient, relacionesQueryKey, []);
	const setProductos = createQueryDataSetter(queryClient, productosQueryKey, []);
	const setVariantes = createQueryDataSetter(queryClient, variantesQueryKey, []);
	const loading =
		actionLoading ||
		relacionesQuery.isLoading ||
		relacionesQuery.isFetching ||
		productosQuery.isLoading ||
		productosQuery.isFetching ||
		variantesQuery.isLoading ||
		variantesQuery.isFetching;

	const cargarRelaciones = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: relacionesQueryKey,
				queryFn: async () => toArray(await proveedoresProductosService.list()).map((item) => mapProveedorProductoFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudieron cargar las relaciones proveedor-producto."));
			return [];
		}
	};

	const cargarProductos = async () => {
		try {
			return await queryClient.fetchQuery({
				queryKey: productosQueryKey,
				queryFn: async () => toArray(await productosService.list()).map((item) => mapProductoFromApi(item)),
			});
		} catch {
			setProductos([]);
			return [];
		}
	};

	const cargarVariantes = async () => {
		try {
			return await queryClient.fetchQuery({
				queryKey: variantesQueryKey,
				queryFn: async () => toArray(await variantesService.list()).map((item) => mapVariantFromApi(item)),
			});
		} catch {
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
			const message = getErrorMessage(err, "No se pudo crear la relación.");
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
			const message = getErrorMessage(err, "No se pudo actualizar la relación.");
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
			setError(getErrorMessage(err, "No se pudo eliminar la relación."));
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
		setRelaciones,
		relacionesPorProveedor,
		productos,
		setProductos,
		variantes,
		setVariantes,
		loading,
		setLoading,
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
