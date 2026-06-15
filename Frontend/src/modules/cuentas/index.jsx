import { useState } from "react";
import { Plus } from "lucide-react";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import CuentaCard from "./components/CuentaCard";
import CuentaForm from "./components/CuentaForm";
import CuentaTable from "./components/CuentaTable";
import useCuentas from "./hooks/useCuentas";
import useCuentasActions from "./hooks/useCuentasActions";

export default function CuentasPage() {
    const [detailSheetOpen, setDetailSheetOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cuentaAEliminar, setCuentaAEliminar] = useState(null);

    const state = useCuentas();
    const actions = useCuentasActions(state);
    const {
        cuentasFiltradas,
        selectedCuentaId,
        setSelectedCuentaId,
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
        cuentaSeleccionada,
        formValido,
        productos,
        variantes,
        proveedores,
        productoMap,
        varianteMap,
        proveedorMap,
    } = state;

    const { abrirCrear, abrirEditar, guardarCuenta, confirmarEliminacion } = actions;

    const verDetalle = (cuenta) => {
        setSelectedCuentaId(cuenta.Id_Cue);
        setDetailSheetOpen(true);
    };

    const abrirConfirmacionEliminar = (cuenta) => {
        setSelectedCuentaId(cuenta.Id_Cue);
        setCuentaAEliminar(cuenta);
        setDeleteDialogOpen(true);
    };

    const confirmarBorrado = async () => {
        const eliminado = await confirmarEliminacion();
        if (eliminado) {
            setDeleteDialogOpen(false);
            setCuentaAEliminar(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
                <div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
                    <div>
                        <h1 className="text-2xl font-semibold">Cuentas</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de cuentas digitales para asignaciones y ventas</p>
                    </div>
                    <Button onClick={abrirCrear}>
                        <Plus className="size-4 mr-1" />
                        Nueva cuenta
                    </Button>
                </div>

                <div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

                    {loading ? (
                        <p className="text-sm text-zinc-500">Cargando cuentas...</p>
                    ) : (
                        <CuentaTable
                            cuentas={cuentasFiltradas}
                            selectedCuentaId={selectedCuentaId}
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                            estadoFilter={estadoFilter}
                            onEstadoFilterChange={setEstadoFilter}
                            onSelect={setSelectedCuentaId}
                            onViewDetail={verDetalle}
                            onEdit={abrirEditar}
                            onDelete={abrirConfirmacionEliminar}
                            productoMap={productoMap}
                            varianteMap={varianteMap}
                            proveedorMap={proveedorMap}
                        />
                    )}
                </div>
            </section>

            <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                <SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
                    <SheetHeader className="px-6 pt-6">
                        <SheetTitle>Detalle de cuenta</SheetTitle>
                        <SheetDescription>Informacion completa de la cuenta seleccionada.</SheetDescription>
                    </SheetHeader>
                    {cuentaSeleccionada ? (
                        <div className="px-6 pb-6">
                            <CuentaCard
                                cuenta={cuentaSeleccionada}
                                productoNombre={cuentaSeleccionada.Id_Prd ? productoMap.get(Number(cuentaSeleccionada.Id_Prd)) : null}
                                varianteNombre={cuentaSeleccionada.Id_Var ? varianteMap.get(Number(cuentaSeleccionada.Id_Var)) : null}
                                proveedorNombre={cuentaSeleccionada.Id_Pro ? proveedorMap.get(Number(cuentaSeleccionada.Id_Pro)) : null}
                                onEdit={abrirEditar}
                                onDelete={abrirConfirmacionEliminar}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una cuenta para ver su detalle.</p>
                    )}
                </SheetContent>
            </Sheet>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar cuenta</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion eliminara de forma permanente a {" "}
                            <strong>{cuentaAEliminar?.Nom_Cue || "la cuenta seleccionada"}</strong>.
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
						<DialogTitle>{sheetMode === "create" ? "Crear cuenta" : "Editar cuenta"}</DialogTitle>
						<DialogDescription>Completa la informacion de la cuenta por secciones.</DialogDescription>
					</DialogHeader>

                    <CuentaForm
                        mode={sheetMode}
                        form={form}
                        setForm={setForm}
                        formValido={formValido}
                        productos={productos}
                        variantes={variantes}
                        proveedores={proveedores}
                        onSubmit={guardarCuenta}
                        onCancel={() => setSheetOpen(false)}
                    />
				</DialogContent>
			</Dialog>
        </div>
    );
}
