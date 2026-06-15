import { useState } from "react";
import { Plus } from "lucide-react";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../../components/ui/drawer";
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
import ProveedorCard from "./components/ProveedorCard";
import ProveedorForm from "./components/ProveedorForm";
import ProveedorTable from "./components/ProveedorTable";
import { ProveedorProductoForm, ProveedorProductosTable, useProveedoresProductos } from "../proveedores-productos";
import { mapProveedorProductoToForm } from "../proveedores-productos/helpers/proveedorProducto.mapper";
import useProveedores from "./hooks/useProveedores";
import useProveedoresActions from "./hooks/useProveedoresActions";

const RELACION_INICIAL = {
    Id_Pro: "",
    Id_Prd: "",
    Id_Var: "",
    Pre_Com_Pro_Prd: "",
    Es_Pri_Pro_Prd: false,
    Not_Pro_Prd: "",
};

export default function ProveedoresPage() {
    const [detailSheetOpen, setDetailSheetOpen] = useState(false);
    const [productosDrawerOpen, setProductosDrawerOpen] = useState(false);
    const [proveedorProductosTarget, setProveedorProductosTarget] = useState(null);
    const [searchProductosProveedor, setSearchProductosProveedor] = useState("");
    const [relacionSheetOpen, setRelacionSheetOpen] = useState(false);
    const [relacionSheetMode, setRelacionSheetMode] = useState("create");
    const [relacionForm, setRelacionForm] = useState(RELACION_INICIAL);
    const [relacionEditando, setRelacionEditando] = useState(null);
    const [relacionAEliminar, setRelacionAEliminar] = useState(null);
    const [deleteRelacionDialogOpen, setDeleteRelacionDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

    const state = useProveedores();
    const actions = useProveedoresActions(state);
    const proveedoresProductos = useProveedoresProductos();
    const {
        proveedoresFiltrados,
        selectedProveedorId,
        setSelectedProveedorId,
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
        proveedorSeleccionado,
        formValido,
    } = state;

    const {
        relacionesPorProveedor,
        loading: loadingRelaciones,
        saving: savingRelaciones,
        error: errorRelaciones,
        productos: productosDisponibles,
        variantes: variantesDisponibles,
        createRelacion,
        updateRelacion,
        cargarRelaciones,
        removeRelacion,
    } = proveedoresProductos;

    const { abrirCrear, abrirEditar, guardarProveedor, confirmarEliminacion } = actions;

    const verDetalle = (proveedor) => {
        setSelectedProveedorId(proveedor.Id_Pro);
        setDetailSheetOpen(true);
    };

    const verProductosProveedor = async (proveedor) => {
        setSelectedProveedorId(proveedor.Id_Pro);
        setProveedorProductosTarget(proveedor);
        setSearchProductosProveedor("");
        setProductosDrawerOpen(true);
        await cargarRelaciones();
    };

    const abrirConfirmacionEliminar = (proveedor) => {
        setSelectedProveedorId(proveedor.Id_Pro);
        setProveedorAEliminar(proveedor);
        setDeleteDialogOpen(true);
    };

    const confirmarBorrado = async () => {
        const eliminado = await confirmarEliminacion();
        if (eliminado) {
            setDeleteDialogOpen(false);
            setProveedorAEliminar(null);
        }
    };

    const abrirConfirmacionEliminarRelacion = (relacion) => {
        setRelacionAEliminar(relacion);
        setDeleteRelacionDialogOpen(true);
    };

    const abrirCrearRelacion = () => {
        if (!proveedorProductosTarget?.Id_Pro) return;
        setRelacionSheetMode("create");
        setRelacionEditando(null);
        setRelacionForm({
            ...RELACION_INICIAL,
            Id_Pro: String(proveedorProductosTarget.Id_Pro),
        });
        setRelacionSheetOpen(true);
    };

    const abrirEditarRelacion = (relacion) => {
        setRelacionSheetMode("edit");
        setRelacionEditando(relacion);
        setRelacionForm(mapProveedorProductoToForm(relacion));
        setRelacionSheetOpen(true);
    };

    const guardarRelacionProveedorProducto = async (event) => {
        event.preventDefault();

        if (!relacionForm.Id_Pro || (!relacionForm.Id_Prd && !relacionForm.Id_Var)) {
            return;
        }

        const result =
            relacionSheetMode === "create"
                ? await createRelacion(relacionForm)
                : await updateRelacion(relacionEditando?.Id_Pro_Prd, relacionForm);

        if (result.ok) {
            setRelacionSheetOpen(false);
            setRelacionEditando(null);
            setRelacionForm(RELACION_INICIAL);
        }
    };

    const confirmarEliminarRelacion = async () => {
        if (!relacionAEliminar?.Id_Pro_Prd) return;
        const eliminado = await removeRelacion(relacionAEliminar.Id_Pro_Prd);
        if (eliminado) {
            setDeleteRelacionDialogOpen(false);
            setRelacionAEliminar(null);
        }
    };

    const relacionesProveedor = proveedorProductosTarget
        ? relacionesPorProveedor[Number(proveedorProductosTarget.Id_Pro)] || []
        : [];

    const relacionesProveedorFiltradas = relacionesProveedor.filter((item) => {
        const query = searchProductosProveedor.trim().toLowerCase();
        if (!query) return true;
        return `${item.Nom_Prd || ""} ${item.Nom_Var || ""} ${item.Not_Pro_Prd || ""}`.toLowerCase().includes(query);
    });

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
                <div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
                    <div>
                        <h1 className="text-2xl font-semibold">Proveedores</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de proveedores y contactos comerciales</p>
                    </div>
                    <Button onClick={abrirCrear}>
                        <Plus className="size-4 mr-1" />
                        Nuevo proveedor
                    </Button>
                </div>

                <div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

                    {loading ? (
                        <p className="text-sm text-zinc-500">Cargando proveedores...</p>
                    ) : (
                        <ProveedorTable
                            proveedores={proveedoresFiltrados}
                            selectedProveedorId={selectedProveedorId}
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                            estadoFilter={estadoFilter}
                            onEstadoFilterChange={setEstadoFilter}
                            onSelect={setSelectedProveedorId}
                            onViewDetail={verDetalle}
                            onViewProducts={verProductosProveedor}
                            onEdit={abrirEditar}
                            onDelete={abrirConfirmacionEliminar}
                        />
                    )}
                </div>
            </section>

            <Drawer open={productosDrawerOpen} onOpenChange={setProductosDrawerOpen}>
                <DrawerContent className="max-w-6xl mx-auto">
                    <DrawerHeader>
                        <DrawerTitle>Ítems del proveedor</DrawerTitle>
                        <DrawerDescription>
                            {proveedorProductosTarget
                                ? `${proveedorProductosTarget.Nom_Pro} (${relacionesProveedorFiltradas.length} relaciones)`
                                : "Selecciona un proveedor para ver sus relaciones"}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 overflow-y-auto">
                        <div className="flex justify-end mb-3">
                            <Button onClick={abrirCrearRelacion} disabled={!proveedorProductosTarget}>
                                + Nueva relación
                            </Button>
                        </div>
                        {loadingRelaciones ? (
                            <p className="text-sm text-zinc-500">Cargando relaciones del proveedor...</p>
                        ) : (
                            <ProveedorProductosTable
                                relaciones={relacionesProveedorFiltradas}
                                searchTerm={searchProductosProveedor}
                                onSearchTermChange={setSearchProductosProveedor}
                                onEdit={abrirEditarRelacion}
                                onDelete={abrirConfirmacionEliminarRelacion}
                                deletingId={savingRelaciones ? relacionAEliminar?.Id_Pro_Prd : null}
                            />
                        )}
						<FeedbackAlert message={errorRelaciones} variant="error" className="mt-2" />
                    </div>
                </DrawerContent>
            </Drawer>

			<Dialog open={relacionSheetOpen} onOpenChange={setRelacionSheetOpen}>
				<DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{relacionSheetMode === "create" ? "Nueva relación proveedor-producto" : "Editar relación proveedor-producto"}</DialogTitle>
						<DialogDescription>
                            {relacionSheetMode === "create"
                                ? "Asocia un producto al proveedor seleccionado."
                                : "Actualiza los datos de la relación proveedor-producto."}
						</DialogDescription>
					</DialogHeader>
                    <ProveedorProductoForm
                        form={relacionForm}
                        setForm={setRelacionForm}
                        productos={productosDisponibles}
                        variantes={variantesDisponibles}
                        providerName={proveedorProductosTarget?.Nom_Pro || ""}
                        isEdit={relacionSheetMode === "edit"}
                        saving={savingRelaciones}
                        onSubmit={guardarRelacionProveedorProducto}
                        onCancel={() => setRelacionSheetOpen(false)}
                    />
				</DialogContent>
			</Dialog>

            <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                <SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
                    <SheetHeader className="px-6 pt-6">
                        <SheetTitle>Detalle de proveedor</SheetTitle>
                        <SheetDescription>Informacion completa del proveedor seleccionado.</SheetDescription>
                    </SheetHeader>
                    {proveedorSeleccionado ? (
                        <div className="px-6 pb-6">
                            <ProveedorCard
                                proveedor={proveedorSeleccionado}
                                onEdit={abrirEditar}
                                onDelete={abrirConfirmacionEliminar}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500 px-6 pb-6">Selecciona un proveedor para ver su detalle.</p>
                    )}
                </SheetContent>
            </Sheet>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar proveedor</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion eliminara de forma permanente a {" "}
                            <strong>{proveedorAEliminar?.Nom_Pro || "el proveedor seleccionado"}</strong>
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

            <AlertDialog open={deleteRelacionDialogOpen} onOpenChange={setDeleteRelacionDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar relación proveedor-producto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la relación entre el proveedor y el ítem {" "}
                            <strong>{relacionAEliminar?.Nom_Var || relacionAEliminar?.Nom_Prd || "seleccionado"}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={savingRelaciones}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarEliminarRelacion} disabled={savingRelaciones}>
                            {savingRelaciones ? "Eliminando..." : "Eliminar relación"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

			<Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
				<DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{sheetMode === "create" ? "Crear proveedor" : "Editar proveedor"}</DialogTitle>
						<DialogDescription>Completa la informacion del proveedor por secciones.</DialogDescription>
					</DialogHeader>

                    <ProveedorForm
                        mode={sheetMode}
                        form={form}
                        setForm={setForm}
                        formValido={formValido}
                        saving={saving}
                        onSubmit={guardarProveedor}
                        onCancel={() => setSheetOpen(false)}
                    />
				</DialogContent>
			</Dialog>
        </div>
    );
}
