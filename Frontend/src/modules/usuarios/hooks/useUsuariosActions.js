import { mapUsuarioFromApi, mapUsuarioPayload } from "../helpers/usuario.mapper";
import { validateUsuarioForm } from "../schemas/usuario.schema";
import usuariosService from "../services/usuarios.service";

export default function useUsuariosActions(state) {
	const {
		usuarios,
		setUsuarios,
		selectedUsuarioId,
		setSelectedUsuarioId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarUsuarios,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setError("");
		setSuccess("");
		setSheetOpen(true);
	};

	const abrirEditar = (usuario) => {
		setSheetMode("edit");
		setSelectedUsuarioId(usuario.Id_Usu);
		setForm({
			Nom_Usu: usuario.Nom_Usu || "",
			Ape_Usu: usuario.Ape_Usu || "",
			Ema_Usu: usuario.Ema_Usu || "",
			Pas_Usu: "",
			Tel_Usu: usuario.Tel_Usu || "",
			Rol_Usu: usuario.Rol_Usu || "admin",
			Est_Usu: usuario.Est_Usu || "activo",
		});
		setError("");
		setSuccess("");
		setSheetOpen(true);
	};

	const abrirEliminar = (usuario) => {
		setSheetMode("delete");
		setSelectedUsuarioId(usuario.Id_Usu);
		setError("");
		setSuccess("");
		setSheetOpen(true);
	};

	const guardarUsuario = async (event) => {
		event.preventDefault();
		const mode = sheetMode === "edit" ? "edit" : "create";
		const errors = validateUsuarioForm(form, { mode });
		if (Object.keys(errors).length > 0) {
			setError(Object.values(errors)[0]);
			return;
		}

		setSaving(true);
		setError("");
		setSuccess("");

		try {
			if (sheetMode === "create") {
				const payload = mapUsuarioPayload(form, { includePassword: true });
				const created = mapUsuarioFromApi(await usuariosService.create(payload));
				setUsuarios((prev) => [created, ...prev]);
				setSelectedUsuarioId(created.Id_Usu);
				setSuccess("Usuario creado correctamente.");
			}

			if (sheetMode === "edit" && selectedUsuarioId) {
				const payload = mapUsuarioPayload(form, { includePassword: Boolean(form.Pas_Usu) });
				const updated = mapUsuarioFromApi(await usuariosService.update(selectedUsuarioId, payload));
				setUsuarios((prev) => prev.map((item) => (item.Id_Usu === selectedUsuarioId ? updated : item)));
				setSelectedUsuarioId(updated.Id_Usu);
				setSuccess("Usuario actualizado correctamente.");
			}

			setSheetOpen(false);
			await cargarUsuarios();
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar el usuario.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedUsuarioId) return;

		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await usuariosService.remove(selectedUsuarioId);
			const restantes = usuarios.filter((item) => item.Id_Usu !== selectedUsuarioId);
			setUsuarios(restantes);
			setSelectedUsuarioId(restantes[0]?.Id_Usu ?? null);
			setSuccess("Usuario eliminado correctamente.");
			await cargarUsuarios();
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar el usuario.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	const cambiarEstado = async (usuario, nuevoEstado) => {
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const updated = mapUsuarioFromApi(
				await usuariosService.updateEstado(usuario.Id_Usu, { Est_Usu: nuevoEstado })
			);
			setUsuarios((prev) => prev.map((item) => (item.Id_Usu === usuario.Id_Usu ? updated : item)));
			setSuccess("Estado actualizado correctamente.");
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo actualizar el estado.");
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		abrirEliminar,
		guardarUsuario,
		confirmarEliminacion,
		cambiarEstado,
	};
}
