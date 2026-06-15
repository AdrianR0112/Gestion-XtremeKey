import { useEffect, useMemo, useState } from "react";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import { mapRevendedorFromApi } from "../helpers/revendedor.mapper";
import { REVENDEDOR_INICIAL, isRevendedorFormValid } from "../schemas/revendedor.schema";
import revendedoresService from "../services/revendedores.service";

export default function useRevendedores() {
	const [revendedores, setRevendedores] = useState([]);
	const [selectedRevendedorId, setSelectedRevendedorId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(REVENDEDOR_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const cargarRevendedores = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await revendedoresService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapRevendedorFromApi(item)) : [];
			setRevendedores(mapped);
			setSelectedRevendedorId((prev) => {
				if (prev && mapped.some((item) => item.Id_Rev === prev)) return prev;
				return mapped[0]?.Id_Rev ?? null;
			});
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar revendedores.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarRevendedores();
	}, []);

	const revendedorSeleccionado = useMemo(
		() => revendedores.find((revendedor) => revendedor.Id_Rev === selectedRevendedorId) || null,
		[revendedores, selectedRevendedorId]
	);

	const resetForm = () => setForm(REVENDEDOR_INICIAL);

	const revendedoresFiltrados = useMemo(() => {
		const query = normalizeSearchText(searchTerm);
		return revendedores.filter((revendedor) => {
			const matchesSearch =
				!query ||
				matchesTextSearch([revendedor.Nom_Rev, revendedor.Ape_Rev, revendedor.Ema_Rev], query) ||
				matchesPhoneSearch(revendedor.Tel_Rev, query);
			const matchesEstado = estadoFilter === "todos" || revendedor.Est_Rev === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [revendedores, searchTerm, estadoFilter]);

	const formValido = isRevendedorFormValid(form);

	return {
		revendedores,
		setRevendedores,
		revendedoresFiltrados,
		selectedRevendedorId,
		setSelectedRevendedorId,
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
		revendedorSeleccionado,
		formValido,
		resetForm,
		cargarRevendedores,
	};
}
