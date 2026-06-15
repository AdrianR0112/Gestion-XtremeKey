import { useEffect, useMemo, useState } from "react";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import { mapUsuarioFromApi } from "../helpers/usuario.mapper";
import { USUARIO_INICIAL, validateUsuarioForm } from "../schemas/usuario.schema";
import usuariosService from "../services/usuarios.service";

export default function useUsuarios() {
	const [usuarios, setUsuarios] = useState([]);
	const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(USUARIO_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [estadoFilter, setEstadoFilter] = useState("todos");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const resetForm = () => setForm(USUARIO_INICIAL);

	const cargarUsuarios = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await usuariosService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapUsuarioFromApi(item)) : [];
			setUsuarios(mapped);
			setSelectedUsuarioId((prev) => {
				if (prev && mapped.some((item) => item.Id_Usu === prev)) return prev;
				return mapped[0]?.Id_Usu ?? null;
			});
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar usuarios.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarUsuarios();
	}, []);

	const usuariosFiltrados = useMemo(() => {
		const query = normalizeSearchText(searchTerm);
		return usuarios.filter((item) => {
			const matchSearch =
				!query ||
				matchesTextSearch([item.Nom_Usu, item.Ape_Usu, item.Ema_Usu], query) ||
				matchesPhoneSearch(item.Tel_Usu, query);
			const matchEstado = estadoFilter === "todos" || item.Est_Usu === estadoFilter;
			return matchSearch && matchEstado;
		});
	}, [usuarios, searchTerm, estadoFilter]);

	const usuarioSeleccionado = useMemo(
		() => usuarios.find((item) => item.Id_Usu === selectedUsuarioId) || null,
		[usuarios, selectedUsuarioId]
	);

	const tituloSheet =
		sheetMode === "create" ? "Nuevo usuario" : sheetMode === "edit" ? "Editar usuario" : "Eliminar usuario";

	const descripcionSheet =
		sheetMode === "delete"
			? "Esta accion eliminara el usuario de forma permanente."
			: "Completa los campos requeridos del usuario.";

	const formErrors = validateUsuarioForm(form, { mode: sheetMode === "edit" ? "edit" : "create" });
	const formValido = Object.keys(formErrors).length === 0;

	return {
		usuarios,
		setUsuarios,
		usuariosFiltrados,
		selectedUsuarioId,
		setSelectedUsuarioId,
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
		usuarioSeleccionado,
		tituloSheet,
		descripcionSheet,
		formErrors,
		formValido,
		resetForm,
		cargarUsuarios,
	};
}
