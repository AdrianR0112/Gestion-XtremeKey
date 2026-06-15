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
import TareaCard from "./components/TareaCard";
import TareaForm from "./components/TareaForm";
import TareaTable from "./components/TareaTable";
import useTareasActions from "./hooks/useTareasActions";
import useTareas from "./hooks/useTareas";

export default function TareasPage() {
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [tareaAEliminar, setTareaAEliminar] = useState(null);

	const state = useTareas();
	const actions = useTareasActions(state);
	const {
		tareasFiltradas,
		selectedTareaId,
		setSelectedTareaId,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		estadoFilter,
		setEstadoFilter,
		prioridadFilter,
		setPrioridadFilter,
		loading,
		saving,
		error,
		setError,
		success,
		tareaSeleccionada,
		formValido,
	} = state;
	const { abrirCrear, abrirEditar, guardarTarea, confirmarEliminacion } = actions;

	const verDetalle = (tarea) => {
		setSelectedTareaId(tarea.Id_Tar);
		setDetailSheetOpen(true);
	};

	const abrirConfirmacionEliminar = (tarea) => {
		setSelectedTareaId(tarea.Id_Tar);
		setTareaAEliminar(tarea);
		setDeleteDialogOpen(true);
	};

	const confirmarBorrado = async () => {
		const eliminado = await confirmarEliminacion();
		if (eliminado) {
			setDeleteDialogOpen(false);
			setTareaAEliminar(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Tareas</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestiona y realiza seguimiento de tus tareas</p>
					</div>
					<Button onClick={abrirCrear}>
						<Plus className="size-4 mr-1" />
						Nueva tarea
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{loading ? (
						<p className="text-sm text-zinc-500">Cargando tareas...</p>
					) : (
						<TareaTable
							tareas={tareasFiltradas}
							selectedTareaId={selectedTareaId}
							searchTerm={searchTerm}
							onSearchTermChange={setSearchTerm}
							estadoFilter={estadoFilter}
							onEstadoFilterChange={setEstadoFilter}
							prioridadFilter={prioridadFilter}
							onPrioridadFilterChange={setPrioridadFilter}
							onSelect={setSelectedTareaId}
							onViewDetail={verDetalle}
							onEdit={abrirEditar}
							onDelete={abrirConfirmacionEliminar}
							loading={loading}
						/>
					)}
				</div>
			</section>

			<Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
				<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de tarea</SheetTitle>
						<SheetDescription>Informacion completa de la tarea seleccionada.</SheetDescription>
					</SheetHeader>
					{tareaSeleccionada ? (
						<div className="px-6 pb-6">
							<TareaCard
								tarea={tareaSeleccionada}
								onEdit={abrirEditar}
								onDelete={abrirConfirmacionEliminar}
							/>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una tarea para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
				<DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>
							{sheetMode === "create" ? "Nueva tarea" : "Editar tarea"}
						</DialogTitle>
						<DialogDescription>
							{sheetMode === "create"
								? "Crea una nueva tarea completando los campos."
								: "Actualiza la informacion de la tarea."}
						</DialogDescription>
					</DialogHeader>
					<div className="px-6 pb-6">
						<TareaForm
							form={form}
							setForm={setForm}
							onSubmit={guardarTarea}
							onCancel={() => setSheetOpen(false)}
							loading={saving}
							sheetMode={sheetMode}
						/>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
						<AlertDialogDescription>
							Esta accion eliminara de forma permanente la tarea{" "}
							<strong>
								{tareaAEliminar ? tareaAEliminar.Tit_Tar : "seleccionada"}
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
		</div>
	);
}
