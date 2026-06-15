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
import FeedbackAlert from "../../components/feedback-alert";
import GastoTable from "./components/GastoTable";
import GastoForm from "./components/GastoForm";
import useGastos from "./hooks/useGastos";

export default function GastosPage() {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [gastoAEliminar, setGastoAEliminar] = useState(null);
	const [sheetMode, setSheetMode] = useState("create");
	const [editandoGastoId, setEditandoGastoId] = useState(null);

	const state = useGastos();
	const {
		gastosFiltrados,
		loading,
		error,
		success,
		searchTerm,
		setSearchTerm,
		categoriaFilter,
		setCategoriaFilter,
		proveedores,
		compras,
		gastoSheetOpen,
		setGastoSheetOpen,
		gastoForm,
		setGastoForm,
		abrirCrearGasto,
		guardarGasto,
		abrirEditarGasto,
		guardarEdicionGasto,
		cerrarGasto,
		eliminarGasto,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		setEditandoGastoId(null);
		abrirCrearGasto();
	};

	const abrirEditar = (gasto) => {
		setSheetMode("edit");
		setEditandoGastoId(gasto.Id_Gas);
		abrirEditarGasto(gasto);
	};

	const guardar = (event) => {
		event.preventDefault();
		if (sheetMode === "edit" && editandoGastoId != null) {
			return guardarEdicionGasto(event, editandoGastoId);
		}
		return guardarGasto(event);
	};

	const abrirConfirmacionEliminar = (gasto) => {
		setGastoAEliminar(gasto);
		setDeleteDialogOpen(true);
	};

	const confirmarBorrado = async () => {
		if (!gastoAEliminar) return;
		await eliminarGasto(gastoAEliminar.Id_Gas);
		setDeleteDialogOpen(false);
		setGastoAEliminar(null);
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Gastos</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Seguimiento financiero</p>
					</div>
					<div className="flex gap-2">
						<Button onClick={abrirCrear}>
							<Plus className="size-4 mr-1" />
							Nuevo gasto
						</Button>
					</div>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{loading ? (
						<p className="text-sm text-zinc-500">Cargando gastos...</p>
					) : (
						<GastoTable
							loading={loading}
							gastosFiltrados={gastosFiltrados}
							searchTerm={searchTerm}
							onSearchTermChange={setSearchTerm}
							categoriaFilter={categoriaFilter}
							onCategoriaFilterChange={setCategoriaFilter}
							onView={abrirEditar}
							onEdit={abrirEditar}
							onDelete={abrirConfirmacionEliminar}
						/>
					)}
				</div>
			</section>

			<Sheet open={gastoSheetOpen} onOpenChange={setGastoSheetOpen}>
				<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
					<SheetHeader>
						<SheetTitle>{sheetMode === "create" ? "Crear gasto" : "Editar gasto"}</SheetTitle>
						<SheetDescription>Completa los datos del gasto.</SheetDescription>
					</SheetHeader>

					<GastoForm
						form={gastoForm}
						onChange={setGastoForm}
						onSubmit={guardar}
						onCancel={cerrarGasto}
						proveedores={proveedores}
						compras={compras}
					/>
				</SheetContent>
			</Sheet>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción eliminará de forma permanente a{" "}
							<strong>
								{gastoAEliminar ? `"${gastoAEliminar.Nom_Gas}"` : "el gasto seleccionado"}
							</strong>
							. No podrás deshacer este cambio.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={confirmarBorrado}>Eliminar</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
