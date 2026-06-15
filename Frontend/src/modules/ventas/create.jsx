import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVentas } from "./hooks";
import VentaCreateView from "./components/VentaCreateView";
import VentaClienteSheet from "./components/VentaClienteSheet";
import VentaRevendedorSheet from "./components/VentaRevendedorSheet";

export default function VentasCreatePage() {
	const ventas = useVentas();
	const navigate = useNavigate();
	const [clienteSheetOpen, setClienteSheetOpen] = useState(false);
	const [revendedorSheetOpen, setRevendedorSheetOpen] = useState(false);

	const handleSubmit = async (event) => {
		const saved = await ventas.guardarVenta(event);
		if (saved) {
			navigate("/ventas");
		}
	};

	const handleClienteCreated = (cliente) => {
		ventas.setClientes((prev) => [...prev, cliente]);
		ventas.setVentaForm((prev) => ({ ...prev, Id_Cli: String(cliente.Id_Cli) }));
		setClienteSheetOpen(false);
	};

	const handleRevendedorCreated = (revendedor) => {
		ventas.setRevendedores((prev) => [...prev, revendedor]);
		ventas.setVentaForm((prev) => ({ ...prev, Id_Rev: String(revendedor.Id_Rev), Id_Cli: "" }));
		setRevendedorSheetOpen(false);
	};

	return (
		<>
			<VentaCreateView
				ventaForm={ventas.ventaForm}
				onVentaFormChange={ventas.setVentaForm}
				clientes={ventas.clientes}
				revendedores={ventas.revendedores}
				ventas={ventas.ventas}
				detalleVentas={ventas.detalleVentas}
				detallesTemporales={ventas.detallesTemporales}
				detalleFormOpen={ventas.detalleFormOpen}
				detalleForm={ventas.detalleForm}
				detalleEditandoIdx={ventas.detalleEditandoIdx}
				detalleSubtotal={ventas.detalleSubtotal}
				productos={ventas.productos}
				variantes={ventas.variantes}
				cuentas={ventas.cuentas}
				keysData={ventas.keysData}
				productoMap={ventas.productoMap}
				varianteMap={ventas.varianteMap}
				onDetallesChange={ventas.setDetallesTemporales}
				onFormChange={ventas.setDetalleForm}
				onFormClose={ventas.cerrarDetalleForm}
				onAddClick={ventas.abrirCrearDetalle}
				onEditClick={ventas.abrirEditarDetalle}
				onDeleteClick={ventas.eliminarDetalle}
				ventaTotals={ventas.ventaTotals}
				impuestoHabilitado={ventas.impuestoHabilitado}
				totalesDetalles={ventas.totalesDetalles}
				saving={ventas.saving}
				error={ventas.error}
				success={ventas.success}
				onSubmit={handleSubmit}
				onCancel={() => navigate("/ventas")}
				onCreateClientClick={() => setClienteSheetOpen(true)}
				onCreateRevendedorClick={() => setRevendedorSheetOpen(true)}
				onClearDraftClick={ventas.descartarBorradorVenta}
			/>

			<VentaClienteSheet
				open={clienteSheetOpen}
				onOpenChange={setClienteSheetOpen}
				onCreated={handleClienteCreated}
			/>

			<VentaRevendedorSheet
				open={revendedorSheetOpen}
				onOpenChange={setRevendedorSheetOpen}
				onCreated={handleRevendedorCreated}
			/>
		</>
	);
}
