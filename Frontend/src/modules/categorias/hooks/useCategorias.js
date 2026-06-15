import { useEffect, useMemo, useState } from "react";
import { mapCategoriaFromApi } from "../helpers/categoria.mapper";
import { CATEGORIA_INICIAL, isCategoriaFormValid } from "../schemas/categoria.schema";
import categoriasService from "../services/categorias.service";

export default function useCategorias() {
	const [categorias, setCategorias] = useState([]);
	const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(CATEGORIA_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const cargarCategorias = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await categoriasService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapCategoriaFromApi(item)) : [];
			setCategorias(mapped);
			setSelectedCategoriaId((prev) => {
				if (prev && mapped.some((item) => item.Id_Cat === prev)) return prev;
				return mapped[0]?.Id_Cat ?? null;
			});
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar categorias.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarCategorias();
	}, []);

	const categoriaSeleccionada = useMemo(
		() => categorias.find((item) => item.Id_Cat === selectedCategoriaId) || null,
		[categorias, selectedCategoriaId]
	);

	const resetForm = () => setForm(CATEGORIA_INICIAL);

	const categoriasFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return categorias.filter((item) => {
			const matchesSearch =
				!query || `${item.Nom_Cat} ${item.Des_Cat} ${item.Ico_Cat}`.toLowerCase().includes(query);
			const matchesEstado = estadoFilter === "todos" || item.Est_Cat === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [categorias, searchTerm, estadoFilter]);

	const formValido = isCategoriaFormValid(form);

	return {
		categorias,
		setCategorias,
		categoriasFiltradas,
		selectedCategoriaId,
		setSelectedCategoriaId,
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
		categoriaSeleccionada,
		formValido,
		resetForm,
		cargarCategorias,
	};
}
