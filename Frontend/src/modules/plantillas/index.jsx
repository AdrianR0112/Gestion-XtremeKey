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
import PlantillaCard from "./components/PlantillaCard";
import PlantillaForm from "./components/PlantillaForm";
import PlantillaTable from "./components/PlantillaTable";
import usePlantillasActions from "./hooks/usePlantillasActions";
import usePlantillas from "./hooks/usePlantillas";

export default function PlantillasPage() {
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [plantillaAEliminar, setPlantillaAEliminar] = useState(null);

	const state = usePlantillas();
	const actions = usePlantillasActions(state);
	const {
		plantillasFiltradas,
		selectedPlantillaId,
		setSelectedPlantillaId,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		tipoFilter,
		setTipoFilter,
		canalFilter,
		setCanalFilter,
		estadoFilter,
		setEstadoFilter,
		loading,
		saving,
		error,
		setError,
		success,
		plantillaSeleccionada,
		formValido,
	} = state;
	const { abrirCrear, abrirEditar, guardarPlantilla, confirmarEliminacion } = actions;

	const verDetalle = (plantilla) => {
		setSelectedPlantillaId(plantilla.Id_Pla);
		setDetailSheetOpen(true);
	};

	const abrirConfirmacionEliminar = (plantilla) => {
		setSelectedPlantillaId(plantilla.Id_Pla);
		setPlantillaAEliminar(plantilla);
		setDeleteDialogOpen(true);
	};

	const confirmarBorrado = async () => {
		const eliminado = await confirmarEliminacion();
		if (eliminado) {
			setDeleteDialogOpen(false);
			setPlantillaAEliminar(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Plantillas</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Crea y gestiona plantillas de notificación para tus campañas</p>
					</div>
					<Button onClick={abrirCrear}>
						<Plus className="size-4 mr-1" />
						Nueva plantilla
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{loading ? (
						<p className="text-sm text-zinc-500">Cargando plantillas...</p>
					) : (
						<PlantillaTable
							plantillas={plantillasFiltradas}
							selectedPlantillaId={selectedPlantillaId}
							searchTerm={searchTerm}
							onSearchTermChange={setSearchTerm}
							tipoFilter={tipoFilter}
							onTipoFilterChange={setTipoFilter}
							canalFilter={canalFilter}
							onCanalFilterChange={setCanalFilter}
							estadoFilter={estadoFilter}
							onEstadoFilterChange={setEstadoFilter}
							onSelect={setSelectedPlantillaId}
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
						<SheetTitle>Detalle de plantilla</SheetTitle>
						<SheetDescription>Informacion completa de la plantilla seleccionada.</SheetDescription>
					</SheetHeader>
					{plantillaSeleccionada ? (
						<div className="px-6 pb-6">
							<PlantillaCard
								plantilla={plantillaSeleccionada}
								onEdit={abrirEditar}
								onDelete={abrirConfirmacionEliminar}
							/>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una plantilla para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
				<DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>
							{sheetMode === "create" ? "Nueva plantilla" : "Editar plantilla"}
						</DialogTitle>
						<DialogDescription>
							{sheetMode === "create"
								? "Crea una nueva plantilla completando los campos."
								: "Actualiza la informacion de la plantilla."}
						</DialogDescription>
					</DialogHeader>
					<div className="px-6 pb-6">
						<PlantillaForm
							form={form}
							setForm={setForm}
							onSubmit={guardarPlantilla}
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
						<AlertDialogTitle>Eliminar plantilla</AlertDialogTitle>
						<AlertDialogDescription>
							Esta accion eliminara de forma permanente la plantilla{" "}
							<strong>
								{plantillaAEliminar ? plantillaAEliminar.Nom_Pla : "seleccionada"}
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
