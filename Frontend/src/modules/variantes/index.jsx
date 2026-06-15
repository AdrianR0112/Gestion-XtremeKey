import { useState } from "react";
import { Plus } from "lucide-react";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import useVariantes from "./hooks/useVariantes";
import useVariantesActions from "./hooks/useVariantesActions";
import VariantTable from "./components/VariantTable";
import VariantForm from "./components/VariantForm";
import VariantCard from "./components/VariantCard";

export default function VariantesPage() {
    const state = useVariantes();
    const actions = useVariantesActions(state);

    const [detailSheetOpen, setDetailSheetOpen] = useState(false);
    const [editSheetOpen, setEditSheetOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleViewVariante = (variante) => {
        state.setSelectedId(variante.Id_Var);
        setDetailSheetOpen(true);
    };

    const handleEditVariante = (variante) => {
        actions.abrirEditar(variante);
        setEditSheetOpen(true);
    };

    const handleDeleteVariante = (variante) => {
        state.setSelectedId(variante.Id_Var);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        const success = await actions.confirmarEliminacion(state.varianteSeleccionada);
        if (success) {
            setDeleteDialogOpen(false);
        }
    };

    const handleOpenCreate = () => {
        actions.abrirCrear();
        setEditSheetOpen(true);
    };

    const handleFormSubmit = async (event) => {
        await actions.guardarVariante(event);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
                <div className="flex items-center justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
                    <div>
                        <h1 className="text-2xl font-semibold">Variantes</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Gestiona las variantes de productos</p>
                    </div>
                    <Button onClick={handleOpenCreate}>
                        <Plus className="size-4 mr-1" />
                        Nueva variante
                    </Button>
                </div>

                <div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={state.error} variant="error" />
					<FeedbackAlert message={state.success} variant="success" />

                    {state.loading ? (
                        <p className="text-center py-8 text-muted-foreground">Cargando variantes...</p>
                    ) : (
                        <VariantTable
                            variantes={state.variantesFiltradas}
                            productos={state.productos}
                            searchTerm={state.searchTerm}
                            setSearchTerm={state.setSearchTerm}
                            estadoFilter={state.estadoFilter}
                            setEstadoFilter={state.setEstadoFilter}
                            onView={handleViewVariante}
                            onEdit={handleEditVariante}
                            onDelete={handleDeleteVariante}
                        />
                    )}
                </div>
            </section>

            <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                <SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
                    <SheetHeader className="px-6 pt-6">
                        <SheetTitle>Detalle de la Variante</SheetTitle>
                        <SheetDescription>Información completa de la variante seleccionada</SheetDescription>
                    </SheetHeader>
                    <div className="px-6 pb-6">
                        <VariantCard
                            variante={state.varianteSeleccionada}
                            productos={state.productos}
                            onEdit={(variante) => {
                                setDetailSheetOpen(false);
                                handleEditVariante(variante);
                            }}
                            onDelete={(variante) => {
                                setDetailSheetOpen(false);
                                handleDeleteVariante(variante);
                            }}
                        />
                    </div>
                </SheetContent>
            </Sheet>

			<Dialog open={editSheetOpen} onOpenChange={setEditSheetOpen}>
				<DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{state.form.Id_Var ? "Editar Variante" : "Crear Nueva Variante"}</DialogTitle>
						<DialogDescription>
							{state.form.Id_Var ? "Actualiza los datos de la variante" : "Completa los datos para crear una nueva variante"}
						</DialogDescription>
					</DialogHeader>
                    <VariantForm
                        form={state.form}
                        productos={state.productos}
                        onFormChange={state.setForm}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setEditSheetOpen(false)}
                        isValid={state.formValido}
                        isLoading={state.saving}
                    />
				</DialogContent>
			</Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La variante "{state.varianteSeleccionada?.Nom_Var}" será eliminada permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-2 justify-end">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
