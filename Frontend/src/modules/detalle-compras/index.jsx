import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "../../components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import FeedbackAlert from "../../components/feedback-alert";
import DetalleCompraCard from "./components/DetalleCompraCard";
import DetalleCompraForm from "./components/DetalleCompraForm";
import DetalleCompraTable from "./components/DetalleCompraTable";
import useDetalleComprasActions from "./hooks/useDetalleComprasActions";
import useDetalleCompras from "./hooks/useDetalleCompras";

export default function DetalleComprasPage() {
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [detalleAEliminar, setDetalleAEliminar] = useState(null);

	const state = useDetalleCompras();
	const actions = useDetalleComprasActions(state);
	const {
		detallesFiltrados,
		selectedDetalleId,
		setSelectedDetalleId,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		loading,
		saving,
		error,
		setError,
		success,
		detalleSeleccionado,
		formValido,
	} = state;
	const { abrirCrear, abrirEditar, guardarDetalle, confirmarEliminacion } = actions;

	const verDetalle = (detalle) => {
		setSelectedDetalleId(detalle.Id_Dco);
		setDetailSheetOpen(true);
	};

	const abrirConfirmacionEliminar = (detalle) => {
		setSelectedDetalleId(detalle.Id_Dco);
		setDetalleAEliminar(detalle);
		setDeleteDialogOpen(true);
	};

	const confirmarBorrado = async () => {
		const eliminado = await confirmarEliminacion();
		if (eliminado) {
			setDeleteDialogOpen(false);
			setDetalleAEliminar(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Detalles de Compras</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestión de items en compras</p>
					</div>
					<Button onClick={abrirCrear}>
						<Plus className="size-4 mr-1" />
						Nuevo detalle
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{loading ? (
						<p className="text-sm text-zinc-500">Cargando detalles de compras...</p>
					) : (
						<DetalleCompraTable
							detalles={detallesFiltrados}
							selectedDetalleId={selectedDetalleId}
							searchTerm={searchTerm}
							onSearchTermChange={setSearchTerm}
							onSelect={setSelectedDetalleId}
							onViewDetail={verDetalle}
							onEdit={abrirEditar}
							onDelete={abrirConfirmacionEliminar}
						/>
					)}
				</div>
			</section>

			<Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
				<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de compra</SheetTitle>
						<SheetDescription>Información completa del detalle seleccionado.</SheetDescription>
					</SheetHeader>
					{detalleSeleccionado ? (
						<div className="px-6 pb-6">
							<DetalleCompraCard
								detalle={detalleSeleccionado}
								onEdit={abrirEditar}
								onDelete={abrirConfirmacionEliminar}
							/>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona un detalle para ver su información.</p>
					)}
				</SheetContent>
			</Sheet>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar detalle de compra</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción eliminará de forma permanente el detalle{" "}
							<strong>
								{detalleAEliminar ? `#${detalleAEliminar.Id_Dco}` : "seleccionado"}
							</strong>
							. No podrás deshacer este cambio.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={confirmarBorrado} disabled={saving}>
							{saving ? "Eliminando..." : "Eliminar"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
				<DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{sheetMode === "create" ? "Crear detalle de compra" : "Editar detalle de compra"}</DialogTitle>
						<DialogDescription>Completa la información del detalle por secciones.</DialogDescription>
					</DialogHeader>

					<DetalleCompraForm
						mode={sheetMode}
						form={form}
						setForm={setForm}
						formValido={formValido}
						onSubmit={guardarDetalle}
						onCancel={() => setSheetOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
