import { mapClientePayload } from "../helpers/cliente.mapper";
import clientesService from "../services/clientes.service";

export default function useClienteActions(state) {
	const {
		clientes,
		setClientes,
		selectedClienteId,
		setSelectedClienteId,
		setSheetOpen,
		setSheetMode,
		form,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarClientes,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedClienteId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (cliente) => {
		setSheetMode("edit");
		setForm({
			Nom_Cli: cliente.Nom_Cli ?? "",
			Ape_Cli: cliente.Ape_Cli ?? "",
			Tel_Cli: cliente.Tel_Cli ?? "",
			Usu_Tel_Cli: cliente.Usu_Tel_Cli ?? "",
			Ema_Cli: cliente.Ema_Cli ?? "",
			Pai_Cli: cliente.Pai_Cli ?? "Ecuador",
			Doc_Cli: cliente.Doc_Cli ?? "",
			Cat_Cli: cliente.Cat_Cli ?? "nuevo",
			Pre_Con_Cli: cliente.Pre_Con_Cli ?? "",
			Ace_Not_Tel_Cli: Boolean(cliente.Ace_Not_Tel_Cli),
			Ace_Not_Cor_Cli: Boolean(cliente.Ace_Not_Cor_Cli),
			Not_Cli: cliente.Not_Cli ?? "",
			Est_Cli: cliente.Est_Cli ?? "activo",
		});
		setSelectedClienteId(cliente.Id_Cli);
		setSheetOpen(true);
	};

	const guardarCliente = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapClientePayload(form);
			if (sheetMode === "create") {
				const creado = await clientesService.create(payload);
				const clientesActualizados = await cargarClientes();
				setSelectedClienteId(creado?.Id_Cli ?? clientesActualizados[0]?.Id_Cli ?? null);
				setSuccess("Cliente creado correctamente.");
			} else {
				await clientesService.update(selectedClienteId, payload);
				await cargarClientes();
				setSuccess("Cliente actualizado correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar el cliente.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedClienteId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await clientesService.remove(selectedClienteId);
			const clientesActualizados = await cargarClientes();
			setSelectedClienteId(clientesActualizados[0]?.Id_Cli ?? null);
			setSuccess("Cliente eliminado correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar el cliente.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarCliente,
		confirmarEliminacion,
	};
}
