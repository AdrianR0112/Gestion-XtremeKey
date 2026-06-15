import { useEffect, useMemo, useState } from "react";
import { mapRenovacionFromApi } from "../helpers/renovacion.mapper";
import { RENOVACION_INICIAL, isRenovacionFormValid } from "../schemas/renovacion.schema";
import renovacionesService from "../services/renovaciones.service";
import useRenovacionesActions from "./useRenovacionesActions";

export default function useRenovaciones() {
	const [renovaciones, setRenovaciones] = useState([]);
	const [selectedRenovacionId, setSelectedRenovacionId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(RENOVACION_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [renovacionDeleteDialogOpen, setRenovacionDeleteDialogOpen] = useState(false);
	const [renovacionAEliminar, setRenovacionAEliminar] = useState(null);

	const cargarRenovaciones = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await renovacionesService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapRenovacionFromApi(item)) : [];
			setRenovaciones(mapped);
			setSelectedRenovacionId((prev) => {
				if (prev && mapped.some((item) => item.Id_Ren === prev)) return prev;
				return mapped[0]?.Id_Ren ?? null;
			});
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar renovaciones.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarRenovaciones();
	}, []);

	const renovacionSeleccionada = useMemo(
		() => renovaciones.find((item) => item.Id_Ren === selectedRenovacionId) || null,
		[renovaciones, selectedRenovacionId]
	);

	const renovacionesFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return renovaciones.filter((item) => {
			const matchesSearch =
				!query ||
				`${item.Id_Ren || ""} ${item.Nom_Cli || ""} ${item.Nom_Prd || ""} ${item.Nom_Var || ""} ${item.Tip_Ren || ""}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = estadoFilter === "todos" || item.Est_Ren === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [renovaciones, searchTerm, estadoFilter]);

	const resetForm = () => setForm(RENOVACION_INICIAL);

	const formValido = isRenovacionFormValid(form);

	const acciones = useRenovacionesActions({
		renovacionesService,
		selectedRenovacionId,
		sheetMode,
		form,
		renovacionAEliminar,
		setLoading,
		setSaving,
		setError,
		setSuccess,
		setSelectedRenovacionId,
		setSheetMode,
		setForm,
		setSheetOpen,
		setRenovacionAEliminar,
		setRenovacionDeleteDialogOpen,
		resetForm,
		cargarRenovaciones,
	});

	return {
		renovaciones,
		renovacionesFiltradas,
		selectedRenovacionId,
		setSelectedRenovacionId,
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
		error,
		setError,
		success,
		setSuccess,
		renovacionSeleccionada,
		formValido,
		resetForm,
		cargarRenovaciones,
		renovacionDeleteDialogOpen,
		setRenovacionDeleteDialogOpen,
		renovacionAEliminar,
		setRenovacionAEliminar,
		...acciones,
	};
}
