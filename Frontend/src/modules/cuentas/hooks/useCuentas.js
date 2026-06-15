import { useEffect, useMemo, useState } from "react";
import { productosService } from "../../productos/services/productos.service";
import { proveedoresService } from "../../proveedores/services/proveedores.service";
import { variantesService } from "../../variantes/services/variantes.service";
import { mapCuentaFromApi } from "../helpers/cuenta.mapper";
import { CUENTA_INICIAL, isCuentaFormValid } from "../schemas/cuenta.schema";
import cuentasService from "../services/cuentas.service";

export default function useCuentas() {
	const [cuentas, setCuentas] = useState([]);
	const [productos, setProductos] = useState([]);
	const [variantes, setVariantes] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const [selectedCuentaId, setSelectedCuentaId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(CUENTA_INICIAL);
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
			// Los catalogos son complementarios; la pantalla sigue operativa aunque falle alguno.
		}
	};

	const cargarCuentas = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await cuentasService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapCuentaFromApi(item)) : [];
			setCuentas(mapped);
			setSelectedCuentaId((prev) => {
				if (prev && mapped.some((item) => Number(item.Id_Cue) === Number(prev))) return prev;
				return mapped[0]?.Id_Cue ?? null;
			});
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar cuentas.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarCatalogos();
		cargarCuentas();
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

	const cuentaSeleccionada = useMemo(
		() => cuentas.find((cuenta) => Number(cuenta.Id_Cue) === Number(selectedCuentaId)) || null,
		[cuentas, selectedCuentaId]
	);

	const cuentasFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return cuentas.filter((cuenta) => {
			const productoNombre = cuenta.Id_Prd ? productoMap.get(Number(cuenta.Id_Prd)) || "" : "";
			const varianteNombre = cuenta.Id_Var ? varianteMap.get(Number(cuenta.Id_Var)) || "" : "";
			const proveedorNombre = cuenta.Id_Pro ? proveedorMap.get(Number(cuenta.Id_Pro)) || "" : "";

			const matchesSearch =
				!query ||
				`${cuenta.Nom_Cue || ""} ${cuenta.Usu_Cue || ""} ${cuenta.Per_Cue || ""} ${productoNombre} ${varianteNombre} ${proveedorNombre}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = estadoFilter === "todos" || cuenta.Est_Cue === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [cuentas, estadoFilter, productoMap, proveedorMap, searchTerm, varianteMap]);

	const resetForm = () => setForm(CUENTA_INICIAL);
	const formValido = isCuentaFormValid(form);

	return {
		cuentas,
		setCuentas,
		cuentasFiltradas,
		productos,
		variantes,
		proveedores,
		productoMap,
		varianteMap,
		proveedorMap,
		selectedCuentaId,
		setSelectedCuentaId,
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
		cuentaSeleccionada,
		formValido,
		resetForm,
		cargarCatalogos,
		cargarCuentas,
	};
}
