import { useEffect, useMemo, useState } from "react";
import { mapProductoFromApi } from "../../productos/helpers/producto.mapper";
import { productosService } from "../../productos/services/productos.service";
import { mapVariantFromApi } from "../helpers/variant.mapper";
import { VARIANTE_INICIAL, isVariantFormValid } from "../schemas/variant.schema";
import { variantesService } from "../services/variantes.service";

export default function useVariantes() {
	const [variantes, setVariantes] = useState([]);
	const [productos, setProductos] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [form, setForm] = useState(VARIANTE_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");

	const cargarVariantes = async () => {
		try {
			setLoading(true);
			const response = await variantesService.list();
			const data = Array.isArray(response) ? response : [];
			setVariantes(data.map(mapVariantFromApi));
			setError(null);
		} catch (err) {
			setError(err?.message || "Error al cargar variantes");
			console.error("Error cargando variantes:", err);
		} finally {
			setLoading(false);
		}
	};

	const cargarProductos = async () => {
		try {
			const response = await productosService.list();
			const data = Array.isArray(response) ? response : [];
			setProductos(data.map(mapProductoFromApi));
		} catch (err) {
			console.error("Error cargando productos:", err);
			setProductos([]);
		}
	};

	useEffect(() => {
		cargarVariantes();
		cargarProductos();
	}, []);

	const productoPorId = useMemo(() => {
		return new Map(productos.map((producto) => [Number(producto.Id_Prd), producto]));
	}, [productos]);

	const getProductoNombre = (idProducto) => {
		if (!idProducto) return "Sin producto";
		const producto = productoPorId.get(Number(idProducto));
		if (!producto) return `Producto #${idProducto}`;
		return producto.Nom_Prd || `Producto #${idProducto}`;
	};

	const variantesFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return variantes.filter((item) => {
			const atrValue = typeof item.Atr_Var === "string" ? item.Atr_Var : JSON.stringify(item.Atr_Var || {});
			const producto = productoPorId.get(Number(item.Id_Prd));
			const productoNombre = !item.Id_Prd ? "Sin producto" : producto?.Nom_Prd || `Producto #${item.Id_Prd}`;
			const matchesSearch =
				!query ||
				`${item.Nom_Var} ${item.Des_Var} ${atrValue} ${productoNombre} ${item.Not_Ven_Cor_Var ? "correo activo" : "correo inactivo"} ${item.Not_Ven_Wsp_Var ? "whatsapp activo" : "whatsapp inactivo"}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = !estadoFilter || item.Est_Var === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [variantes, searchTerm, estadoFilter, productoPorId]);

	const varianteSeleccionada = useMemo(() => {
		return variantes.find((item) => item.Id_Var === selectedId) || null;
	}, [variantes, selectedId]);

	const formValido = isVariantFormValid(form);

	return {
		variantes,
		variantesFiltradas,
		productos,
		productoPorId,
		getProductoNombre,
		varianteSeleccionada,
		selectedId,
		setSelectedId,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		estadoFilter,
		setEstadoFilter,
		loading,
		setLoading,
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		cargarVariantes,
		formValido,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		setSheetMode,
	};
}
