import { useSelector } from "react-redux";
import { useState } from "react";
import { Plus } from "lucide-react";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../../components/ui/sheet";
import UsuarioCard from "./components/UsuarioCard";
import UsuarioForm from "./components/UsuarioForm";
import UsuarioTable from "./components/UsuarioTable";
import useUsuarios from "./hooks/useUsuarios";
import useUsuariosActions from "./hooks/useUsuariosActions";

export default function UsuariosPage() {
    const authUser = useSelector((state) => state?.auth?.user);
    const role = authUser?.Rol_Usu || authUser?.role || "";
    const [detailSheetOpen, setDetailSheetOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    const state = useUsuarios();
    const actions = useUsuariosActions(state);

    const {
        usuariosFiltrados,
        selectedUsuarioId,
        setSelectedUsuarioId,
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
        usuarioSeleccionado,
        tituloSheet,
        descripcionSheet,
        formErrors,
        formValido,
    } = state;

    const { abrirCrear, abrirEditar, abrirEliminar, guardarUsuario, confirmarEliminacion, cambiarEstado } = actions;

    const verDetalle = (usuario) => {
        setSelectedUsuarioId(usuario.Id_Usu);
        setDetailSheetOpen(true);
    };

    const abrirConfirmacionEliminar = (usuario) => {
        setSelectedUsuarioId(usuario.Id_Usu);
        setUsuarioAEliminar(usuario);
        setDeleteDialogOpen(true);
    };

    const confirmarBorrado = async () => {
        const eliminado = await confirmarEliminacion();
        if (eliminado) {
            setDeleteDialogOpen(false);
            setUsuarioAEliminar(null);
        }
    };

    if (role !== "admin") {
        return (
            <div className="max-w-7xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Acceso restringido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                            Solo el staff admin puede gestionar cuentas internas.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
                <div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
                    <div>
                        <h1 className="text-2xl font-semibold">Staff</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de accesos internos del sistema</p>
                    </div>
                    <Button onClick={abrirCrear}>
                        <Plus className="size-4 mr-1" />
                        Nuevo staff
                    </Button>
                </div>

                <div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

                    {loading ? (
                        <p className="text-sm text-zinc-500">Cargando staff...</p>
                    ) : (
                        <UsuarioTable
                            usuarios={usuariosFiltrados}
                            selectedUsuarioId={selectedUsuarioId}
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                            estadoFilter={estadoFilter}
                            onEstadoFilterChange={setEstadoFilter}
                            onSelect={setSelectedUsuarioId}
                            onViewDetail={verDetalle}
                            onEdit={abrirEditar}
                            onDelete={abrirConfirmacionEliminar}
                            onChangeEstado={cambiarEstado}
                            saving={saving}
                        />
                    )}
                </div>
            </section>

            <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                <SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
                    <SheetHeader className="px-6 pt-6">
                        <SheetTitle>Detalle de staff</SheetTitle>
						<SheetDescription>Informacion completa y acciones de la cuenta seleccionada.</SheetDescription>
                    </SheetHeader>
                    {usuarioSeleccionado ? (
                        <div className="px-6 pb-6">
                            <UsuarioCard
                                usuario={usuarioSeleccionado}
                                onEdit={abrirEditar}
                                onDelete={abrirConfirmacionEliminar}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una cuenta staff para ver su detalle.</p>
                    )}
                </SheetContent>
            </Sheet>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar staff</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion eliminara de forma permanente a {" "}
                            <strong>
                                {usuarioAEliminar
                                    ? `${usuarioAEliminar.Nom_Usu} ${usuarioAEliminar.Ape_Usu}`.trim()
                                    : "la cuenta seleccionada"}
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
				<DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{tituloSheet}</DialogTitle>
						<DialogDescription>{descripcionSheet}</DialogDescription>
					</DialogHeader>

                    <UsuarioForm
                        mode={sheetMode}
                        form={form}
                        setForm={setForm}
                        formErrors={formErrors}
                        formValido={formValido}
                        usuarioSeleccionado={usuarioSeleccionado}
                        saving={saving}
                        onSubmit={guardarUsuario}
                        onCancel={() => setSheetOpen(false)}
                        onConfirmDelete={confirmarEliminacion}
                    />
				</DialogContent>
			</Dialog>
        </div>
    );
}
