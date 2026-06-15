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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "../../components/ui/sheet";
import FeedbackAlert from "../../components/feedback-alert";
import RevendedorCard from "./components/RevendedorCard";
import RevendedorForm from "./components/RevendedorForm";
import RevendedorTable from "./components/RevendedorTable";
import useRevendedorActions from "./hooks/useRevendedorActions";
import useRevendedores from "./hooks/useRevendedores";

export default function RevendedoresPage() {
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [revendedorAEliminar, setRevendedorAEliminar] = useState(null);

	const state = useRevendedores();
	const actions = useRevendedorActions(state);
	const {
		revendedoresFiltrados,
		selectedRevendedorId,
		setSelectedRevendedorId,
		sheetOpen,
		setSheetOpen,
		sheetMode,
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
		revendedorSeleccionado,
		formValido,
	} = state;
	const { abrirCrear, abrirEditar, guardarRevendedor, confirmarEliminar } = actions;

	const verDetalle = (revendedor) => {
		setSelectedRevendedorId(revendedor.Id_Rev);
		setDetailSheetOpen(true);
	};

	const abrirConfirmacionEliminar = (revendedor) => {
		setSelectedRevendedorId(revendedor.Id_Rev);
		setRevendedorAEliminar(revendedor);
		setDeleteDialogOpen(true);
	};

	const confirmarBorrado = async () => {
		const eliminado = await confirmarEliminar();
		if (eliminado) {
			setDeleteDialogOpen(false);
			setRevendedorAEliminar(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Revendedores</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de red de revendedores</p>
					</div>
					<div className="flex gap-2">
						<Button onClick={abrirCrear}>
							<Plus className="size-4 mr-1" />
							Nuevo revendedor
						</Button>
					</div>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					<RevendedorTable
						loading={loading}
						revendedores={revendedoresFiltrados}
						selectedRevendedorId={selectedRevendedorId}
						searchTerm={searchTerm}
						onSearchTermChange={setSearchTerm}
						estadoFilter={estadoFilter}
						onEstadoFilterChange={setEstadoFilter}
						onSelect={setSelectedRevendedorId}
						onViewDetail={verDetalle}
						onEdit={abrirEditar}
						onDelete={abrirConfirmacionEliminar}
					/>
				</div>
			</section>

			<Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
				<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de revendedor</SheetTitle>
						<SheetDescription>Informacion completa del revendedor seleccionado.</SheetDescription>
					</SheetHeader>
					{revendedorSeleccionado ? (
						<div className="px-6 pb-6">
							<RevendedorCard
								revendedor={revendedorSeleccionado}
								onEdit={abrirEditar}
								onDelete={abrirConfirmacionEliminar}
							/>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona un revendedor para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar revendedor</AlertDialogTitle>
						<AlertDialogDescription>
							Esta accion eliminara de forma permanente a{" "}
							<strong>
								{revendedorAEliminar ? `${revendedorAEliminar.Nom_Rev} ${revendedorAEliminar.Ape_Rev}`.trim() : "el revendedor seleccionado"}
							</strong>
							. No podras deshacer este cambio.
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
				<DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{sheetMode === "create" ? "Crear revendedor" : "Editar revendedor"}</DialogTitle>
						<DialogDescription>Completa la informacion del revendedor.</DialogDescription>
					</DialogHeader>

					<RevendedorForm
						mode={sheetMode}
						form={form}
						setForm={setForm}
						formValido={formValido}
						onSubmit={guardarRevendedor}
						onCancel={() => setSheetOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
