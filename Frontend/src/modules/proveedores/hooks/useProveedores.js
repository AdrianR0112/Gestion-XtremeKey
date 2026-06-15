import { useEffect, useMemo, useState } from "react";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import { mapProveedorFromApi } from "../helpers/proveedor.mapper";
import { PROVEEDOR_INICIAL, isProveedorFormValid } from "../schemas/proveedor.schema";
import proveedoresService from "../services/proveedores.service";

export default function useProveedores() {
	const [proveedores, setProveedores] = useState([]);
	const [selectedProveedorId, setSelectedProveedorId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(PROVEEDOR_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const cargarProveedores = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await proveedoresService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapProveedorFromApi(item)) : [];
			setProveedores(mapped);
			setSelectedProveedorId((prev) => {
				if (prev && mapped.some((item) => item.Id_Pro === prev)) return prev;
				return mapped[0]?.Id_Pro ?? null;
			});
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar proveedores.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarProveedores();
	}, []);

	const proveedorSeleccionado = useMemo(
		() => proveedores.find((item) => item.Id_Pro === selectedProveedorId) || null,
		[proveedores, selectedProveedorId]
	);

	const resetForm = () => setForm(PROVEEDOR_INICIAL);

	const proveedoresFiltrados = useMemo(() => {
		const query = normalizeSearchText(searchTerm);
		return proveedores.filter((item) => {
			const matchesSearch =
				!query ||
				matchesTextSearch([item.Nom_Pro, item.Con_Pri_Pro, item.Ema_Pro], query) ||
				matchesPhoneSearch(item.Tel_Pro, query) ||
				matchesPhoneSearch(item.Tel_Gram_Pro, query);
			const matchesEstado = estadoFilter === "todos" || item.Est_Pro === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [proveedores, searchTerm, estadoFilter]);

	const formValido = isProveedorFormValid(form);

	return {
		proveedores,
		setProveedores,
		proveedoresFiltrados,
		selectedProveedorId,
		setSelectedProveedorId,
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
		proveedorSeleccionado,
		formValido,
		resetForm,
		cargarProveedores,
	};
}
