import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import FeedbackAlert from "../../../components/feedback-alert";
import ClienteForm from "../../clientes/components/ClienteForm";
import { mapClienteFromApi, mapClientePayload } from "../../clientes/helpers/cliente.mapper";
import clientesService from "../../clientes/services/clientes.service";
import { CLIENTE_INICIAL, isClienteFormValid } from "../../clientes/schemas/cliente.schema";
import { useState } from "react";

export default function VentaClienteSheet({ open, onOpenChange, onCreated }) {
	const [clienteForm, setClienteForm] = useState(CLIENTE_INICIAL);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const close = () => {
		onOpenChange(false);
		setClienteForm(CLIENTE_INICIAL);
		setSaving(false);
		setError("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!isClienteFormValid(clienteForm)) {
			setError("Completa los campos obligatorios del cliente.");
			return;
		}

		setSaving(true);
		setError("");
		try {
			const created = await clientesService.create(mapClientePayload(clienteForm));
			const mapped = mapClienteFromApi(created);
			onCreated(mapped);
			close();
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar el cliente.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(value) => (value ? onOpenChange(true) : close())}>
			<DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle>Crear cliente</DialogTitle>
					<DialogDescription>Registra un cliente nuevo sin salir de la venta.</DialogDescription>
				</DialogHeader>
				<FeedbackAlert message={error} variant="error" className="mx-6 mt-4" />
				<ClienteForm
					mode="create"
					form={clienteForm}
					setForm={setClienteForm}
					formValido={isClienteFormValid(clienteForm)}
					onSubmit={handleSubmit}
					onCancel={close}
				/>
			</DialogContent>
		</Dialog>
	);
}
