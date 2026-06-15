import { useEffect, useMemo, useState } from "react";
import { productosService } from "../../productos/services/productos.service";
import { proveedoresService } from "../../proveedores/services/proveedores.service";
import { variantesService } from "../../variantes/services/variantes.service";
import { mapKeyFromApi } from "../helpers/key.mapper";
import { isKeyFormValid, KEY_INICIAL } from "../schemas/key.schema";
import keysService from "../services/keys.service";

export default function useKeys() {
	const [keys, setKeys] = useState([]);
	const [productos, setProductos] = useState([]);
	const [variantes, setVariantes] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const [selectedKeyId, setSelectedKeyId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(KEY_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const cargarCatalogos = async () => {
		try {
			const [productosData, variantesData, proveedoresData] = await Promise.all([
				productosService.list(),
				variantesService.list(),
				proveedoresService.list(),
			]);

			setProductos(Array.isArray(productosData) ? productosData : []);
			setVariantes(Array.isArray(variantesData) ? variantesData : []);
			setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
		} catch {
			// Los catalogos son apoyo para labels; la grilla principal sigue funcionando.
		}
	};

	const cargarKeys = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await keysService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapKeyFromApi(item)) : [];
			setKeys(mapped);
			setSelectedKeyId((prev) => {
				if (prev && mapped.some((item) => Number(item.Id_Key) === Number(prev))) return prev;
				return mapped[0]?.Id_Key ?? null;
			});
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar keys.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarCatalogos();
		cargarKeys();
	}, []);

	const productoMap = useMemo(
		() => new Map(productos.map((item) => [Number(item.Id_Prd), item.Nom_Prd || `#${item.Id_Prd}`])),
		[productos]
	);
	const varianteMap = useMemo(
		() => new Map(variantes.map((item) => [Number(item.Id_Var), item.Nom_Var || `#${item.Id_Var}`])),
		[variantes]
	);
	const proveedorMap = useMemo(
		() => new Map(proveedores.map((item) => [Number(item.Id_Pro), item.Nom_Pro || `#${item.Id_Pro}`])),
		[proveedores]
	);

	const keySeleccionada = useMemo(
		() => keys.find((key) => Number(key.Id_Key) === Number(selectedKeyId)) || null,
		[keys, selectedKeyId]
	);

	const keysFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return keys.filter((key) => {
			const productoNombre = key.Id_Prd ? productoMap.get(Number(key.Id_Prd)) || "" : "";
			const varianteNombre = key.Id_Var ? varianteMap.get(Number(key.Id_Var)) || "" : "";
			const proveedorNombre = key.Id_Pro ? proveedorMap.get(Number(key.Id_Pro)) || "" : "";

			const matchesSearch =
				!query ||
				`${key.Cla_Key || ""} ${key.Des_Key || ""} ${productoNombre} ${varianteNombre} ${proveedorNombre} ${key.Es_Per_Vid_Key ? "por vida" : "temporal"}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = estadoFilter === "todos" || key.Est_Key === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [estadoFilter, keys, productoMap, proveedorMap, searchTerm, varianteMap]);

	const resetForm = () => setForm(KEY_INICIAL);
	const formValido = isKeyFormValid(form);

	return {
		keys,
		setKeys,
		keysFiltradas,
		productos,
		variantes,
		proveedores,
		productoMap,
		varianteMap,
		proveedorMap,
		selectedKeyId,
		setSelectedKeyId,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		setSheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		estadoFilter,
		setEstadoFilter,
		loading,
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		keySeleccionada,
		formValido,
		resetForm,
		cargarCatalogos,
		cargarKeys,
	};
}
