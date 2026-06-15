import { useState } from "react";
import { Plus } from "lucide-react";
import FeedbackAlert from "../../components/feedback-alert";
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
import CategoriaCard from "./components/CategoriaCard";
import CategoriaForm from "./components/CategoriaForm";
import CategoriaTable from "./components/CategoriaTable";
import useCategorias from "./hooks/useCategorias";
import useCategoriasActions from "./hooks/useCategoriasActions";

export default function CategoriasPage() {
    const [detailSheetOpen, setDetailSheetOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

    const state = useCategorias();
    const actions = useCategoriasActions(state);

    const {
        categoriasFiltradas,
        selectedCategoriaId,
        setSelectedCategoriaId,
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
        success,
        categoriaSeleccionada,
        formValido,
    } = state;

    const { abrirCrear, abrirEditar, guardarCategoria, confirmarEliminacion } = actions;

    const verDetalle = (categoria) => {
        setSelectedCategoriaId(categoria.Id_Cat);
        setDetailSheetOpen(true);
    };

    const abrirConfirmacionEliminar = (categoria) => {
        setSelectedCategoriaId(categoria.Id_Cat);
        setCategoriaAEliminar(categoria);
        setDeleteDialogOpen(true);
    };

    const confirmarBorrado = async () => {
        const eliminado = await confirmarEliminacion();
        if (eliminado) {
            setDeleteDialogOpen(false);
            setCategoriaAEliminar(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
                <div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
                    <div>
                        <h1 className="text-2xl font-semibold">Categorias</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de categorias de productos y servicios</p>
                    </div>
                    <Button onClick={abrirCrear}>
                        <Plus className="size-4 mr-1" />
                        Nueva categoria
                    </Button>
                </div>

                <div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

                    {loading ? (
                        <p className="text-sm text-zinc-500">Cargando categorias...</p>
                    ) : (
                        <CategoriaTable
                            categorias={categoriasFiltradas}
                            selectedCategoriaId={selectedCategoriaId}
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                            estadoFilter={estadoFilter}
                            onEstadoFilterChange={setEstadoFilter}
                            onSelect={setSelectedCategoriaId}
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
                        <SheetTitle>Detalle de categoria</SheetTitle>
                        <SheetDescription>Informacion completa de la categoria seleccionada.</SheetDescription>
                    </SheetHeader>
                    {categoriaSeleccionada ? (
                        <div className="px-6 pb-6">
                            <CategoriaCard
                                categoria={categoriaSeleccionada}
                                onEdit={abrirEditar}
                                onDelete={abrirConfirmacionEliminar}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una categoria para ver su detalle.</p>
                    )}
                </SheetContent>
            </Sheet>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar categoria</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion eliminara de forma permanente a {" "}
                            <strong>{categoriaAEliminar?.Nom_Cat || "la categoria seleccionada"}</strong>
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
				<DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{sheetMode === "create" ? "Crear categoria" : "Editar categoria"}</DialogTitle>
						<DialogDescription>Completa la informacion de la categoria por secciones.</DialogDescription>
					</DialogHeader>

                    <CategoriaForm
                        mode={sheetMode}
                        form={form}
                        setForm={setForm}
                        formValido={formValido}
                        saving={saving}
                        onSubmit={guardarCategoria}
                        onCancel={() => setSheetOpen(false)}
                    />
				</DialogContent>
			</Dialog>
        </div>
    );
}
