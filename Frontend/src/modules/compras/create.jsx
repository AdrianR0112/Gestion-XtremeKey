import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompras } from "./hooks";
import CompraCreateView from "./components/CompraCreateView";
import CompraProveedorSheet from "./components/CompraProveedorSheet";

export default function ComprasCreatePage() {
	const compras = useCompras();
	const navigate = useNavigate();
	const [proveedorSheetOpen, setProveedorSheetOpen] = useState(false);

	const handleSubmit = async (event) => {
		const saved = await compras.guardarCompra(event);
		if (saved) {
			navigate("/compras");
		}
	};

	const handleProveedorCreated = (proveedor) => {
		compras.setProveedores((prev) => [...prev, proveedor]);
		compras.setCompraForm((prev) => ({ ...prev, Id_Pro: String(proveedor.Id_Pro) }));
		setProveedorSheetOpen(false);
	};

	return (
		<>
			<CompraCreateView
				compraForm={compras.compraForm}
				onCompraFormChange={compras.setCompraForm}
				proveedores={compras.proveedores}
				detallesTemporales={compras.detallesTemporales}
				detalleFormOpen={compras.detalleFormOpen}
				detalleForm={compras.detalleForm}
				detalleEditandoIdx={compras.detalleEditandoIdx}
				detalleSubtotal={compras.detalleSubtotal}
				productos={compras.productos}
				variantes={compras.variantes}
				productoMap={compras.productoMap}
				varianteMap={compras.varianteMap}
				onDetallesChange={compras.setDetallesTemporales}
				onFormChange={compras.setDetalleForm}
				onFormClose={compras.cerrarDetalleForm}
				onAddClick={compras.abrirCrearDetalle}
				onEditClick={compras.abrirEditarDetalle}
				onDeleteClick={compras.eliminarDetalle}
				compraTotals={compras.compraTotals}
				totalesDetalles={compras.totalesDetalles}
				saving={compras.saving}
				error={compras.error}
				success={compras.success}
				onSubmit={handleSubmit}
				onCancel={() => navigate("/compras")}
				onCreateProveedorClick={() => setProveedorSheetOpen(true)}
				onClearDraftClick={compras.descartarBorradorCompra}
			/>

			<CompraProveedorSheet
				open={proveedorSheetOpen}
				onOpenChange={setProveedorSheetOpen}
				onCreated={handleProveedorCreated}
			/>
		</>
	);
}
