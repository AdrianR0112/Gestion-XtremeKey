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
import FeedbackAlert from "../../components/feedback-alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import KeyCard from "./components/KeyCard";
import KeyForm from "./components/KeyForm";
import KeyTable from "./components/KeyTable";
import useKeys from "./hooks/useKeys";
import useKeysActions from "./hooks/useKeysActions";

export default function KeysPage() {
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [keyAEliminar, setKeyAEliminar] = useState(null);

	const state = useKeys();
	const actions = useKeysActions(state);
	const {
		keysFiltradas,
		selectedKeyId,
		setSelectedKeyId,
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
		keySeleccionada,
		formValido,
		productos,
		variantes,
		proveedores,
		productoMap,
		varianteMap,
		proveedorMap,
	} = state;

	const { abrirCrear, abrirEditar, guardarKey, confirmarEliminacion } = actions;

	const verDetalle = (keyItem) => {
		setSelectedKeyId(keyItem.Id_Key);
		setDetailSheetOpen(true);
	};

	const abrirConfirmacionEliminar = (keyItem) => {
		setSelectedKeyId(keyItem.Id_Key);
		setKeyAEliminar(keyItem);
		setDeleteDialogOpen(true);
	};

	const confirmarBorrado = async () => {
		const eliminado = await confirmarEliminacion();
		if (eliminado) {
			setDeleteDialogOpen(false);
			setKeyAEliminar(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Keys</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de claves y licencias para inventario digital</p>
					</div>
					<Button onClick={abrirCrear}>
						<Plus className="size-4 mr-1" />
						Nueva key
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{loading ? (
						<p className="text-sm text-zinc-500">Cargando keys...</p>
					) : (
						<KeyTable
							keysData={keysFiltradas}
							selectedKeyId={selectedKeyId}
							searchTerm={searchTerm}
							onSearchTermChange={setSearchTerm}
							estadoFilter={estadoFilter}
							onEstadoFilterChange={setEstadoFilter}
							onSelect={setSelectedKeyId}
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
						<SheetTitle>Detalle de key</SheetTitle>
						<SheetDescription>Informacion completa de la key seleccionada.</SheetDescription>
					</SheetHeader>
					{keySeleccionada ? (
						<div className="px-6 pb-6">
							<KeyCard
								keyItem={keySeleccionada}
								productoNombre={keySeleccionada.Id_Prd ? productoMap.get(Number(keySeleccionada.Id_Prd)) : null}
								varianteNombre={keySeleccionada.Id_Var ? varianteMap.get(Number(keySeleccionada.Id_Var)) : null}
								proveedorNombre={keySeleccionada.Id_Pro ? proveedorMap.get(Number(keySeleccionada.Id_Pro)) : null}
								onEdit={abrirEditar}
								onDelete={abrirConfirmacionEliminar}
							/>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una key para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar key</AlertDialogTitle>
						<AlertDialogDescription>
							Esta accion eliminara de forma permanente a {" "}
							<strong>{keyAEliminar?.Cla_Key || "la key seleccionada"}</strong>.
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
						<DialogTitle>{sheetMode === "create" ? "Crear key" : "Editar key"}</DialogTitle>
						<DialogDescription>Completa la informacion de la key por secciones.</DialogDescription>
					</DialogHeader>

					<KeyForm
						mode={sheetMode}
						form={form}
						setForm={setForm}
						formValido={formValido}
						productos={productos}
						variantes={variantes}
						proveedores={proveedores}
						onSubmit={guardarKey}
						onCancel={() => setSheetOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
