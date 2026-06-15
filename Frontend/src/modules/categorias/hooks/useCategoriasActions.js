import { mapCategoriaPayload } from "../helpers/categoria.mapper";
import categoriasService from "../services/categorias.service";

export default function useCategoriasActions(state) {
	const {
		selectedCategoriaId,
		setSelectedCategoriaId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarCategorias,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedCategoriaId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (categoria) => {
		setSheetMode("edit");
		setForm({
			Nom_Cat: categoria.Nom_Cat ?? "",
			Des_Cat: categoria.Des_Cat ?? "",
			Id_Cat_Pad: categoria.Id_Cat_Pad ?? "",
			Ico_Cat: categoria.Ico_Cat ?? "",
			Ord_Cat: categoria.Ord_Cat ?? "",
			Est_Cat: categoria.Est_Cat ?? "activo",
		});
		setSelectedCategoriaId(categoria.Id_Cat);
		setSheetOpen(true);
	};

	const guardarCategoria = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapCategoriaPayload(form);
			if (sheetMode === "create") {
				const creada = await categoriasService.create(payload);
				const categoriasActualizadas = await cargarCategorias();
				setSelectedCategoriaId(creada?.Id_Cat ?? categoriasActualizadas[0]?.Id_Cat ?? null);
				setSuccess("Categoria creada correctamente.");
			} else {
				await categoriasService.update(selectedCategoriaId, payload);
				await cargarCategorias();
				setSuccess("Categoria actualizada correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar la categoria.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedCategoriaId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await categoriasService.remove(selectedCategoriaId);
			const categoriasActualizadas = await cargarCategorias();
			setSelectedCategoriaId(categoriasActualizadas[0]?.Id_Cat ?? null);
			setSuccess("Categoria eliminada correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar la categoria.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarCategoria,
		confirmarEliminacion,
	};
}
