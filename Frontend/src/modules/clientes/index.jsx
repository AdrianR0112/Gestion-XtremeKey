import { useState } from "react";
import { Plus, Upload } from "lucide-react";
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
	DialogFooter,
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
import ClienteCard from "./components/ClienteCard";
import ClienteForm from "./components/ClienteForm";
import ClienteTable from "./components/ClienteTable";
import useClienteActions from "./hooks/useClienteActions";
import useClientes from "./hooks/useClientes";
import clientesService from "./services/clientes.service";

function normalizeImportResult(result = {}) {
	const summary = result.summary || result.resumen || result;
	return {
		total: summary.total ?? summary.totalProcesados ?? summary.rows ?? 0,
		duplicados: summary.duplicados ?? summary.duplicates ?? 0,
		invalidos: summary.invalidos ?? summary.invalidRows ?? 0,
		insertados: summary.insertados ?? summary.inserted ?? 0,
		actualizados: summary.actualizados ?? summary.updated ?? 0,
	};
}

export default function ClientesPage() {
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [clienteAEliminar, setClienteAEliminar] = useState(null);
	const [importDialogOpen, setImportDialogOpen] = useState(false);
	const [importFile, setImportFile] = useState(null);
	const [importLoading, setImportLoading] = useState(false);
	const [importError, setImportError] = useState("");
	const [importResult, setImportResult] = useState(null);

	const state = useClientes();
	const actions = useClienteActions(state);
	const {
		clientesFiltrados,
		selectedClienteId,
		setSelectedClienteId,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		estadoFilter,
		setEstadoFilter,
		categoriaFilter,
		setCategoriaFilter,
		loading,
		saving,
		error,
		setError,
		success,
		clienteSeleccionado,
		formValido,
	} = state;
	const { abrirCrear, abrirEditar, guardarCliente, confirmarEliminacion } = actions;

	const verDetalle = (cliente) => {
		setSelectedClienteId(cliente.Id_Cli);
		setDetailSheetOpen(true);
	};

	const abrirConfirmacionEliminar = (cliente) => {
		setSelectedClienteId(cliente.Id_Cli);
		setClienteAEliminar(cliente);
		setDeleteDialogOpen(true);
	};

	const abrirImportacion = () => {
		setImportError("");
		setImportResult(null);
		setImportFile(null);
		setImportDialogOpen(true);
	};

	const confirmarImportacion = async (event) => {
		event.preventDefault();
		if (!importFile) {
			setImportError("Selecciona un archivo CSV o XLSX para importar.");
			return;
		}

		setImportLoading(true);
		setImportError("");
		try {
			const result = await clientesService.import(importFile);
			setImportResult(normalizeImportResult(result));
			setSuccess("Importación completada correctamente.");
			await state.cargarClientes();
		} catch (err) {
			setImportError(err?.data?.message || err?.message || "No se pudo importar el archivo.");
		} finally {
			setImportLoading(false);
		}
	};

	const confirmarBorrado = async () => {
		const eliminado = await confirmarEliminacion();
		if (eliminado) {
			setDeleteDialogOpen(false);
			setClienteAEliminar(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Clientes</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestion de cartera comercial</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={abrirImportacion}>
							<Upload className="size-4 mr-1" />
							Importar clientes
						</Button>
						<Button onClick={abrirCrear}>
							<Plus className="size-4 mr-1" />
							Nuevo cliente
						</Button>
					</div>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{loading ? (
						<p className="text-sm text-zinc-500">Cargando clientes...</p>
					) : (
						<ClienteTable
							clientes={clientesFiltrados}
							selectedClienteId={selectedClienteId}
							searchTerm={searchTerm}
							onSearchTermChange={setSearchTerm}
							estadoFilter={estadoFilter}
							onEstadoFilterChange={setEstadoFilter}
							categoriaFilter={categoriaFilter}
							onCategoriaFilterChange={setCategoriaFilter}
							onSelect={setSelectedClienteId}
							onViewDetail={verDetalle}
							onEdit={abrirEditar}
							onDelete={abrirConfirmacionEliminar}
						/>
					)}
				</div>
			</section>

			<Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Importar clientes</DialogTitle>
						<DialogDescription>
							Sube un archivo CSV o XLSX con cabeceras iguales a los nombres de campo. Los duplicados por Tel_Cli se omitirán.
						</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={confirmarImportacion}>
						<div className="space-y-2">
							<label className="text-sm font-medium" htmlFor="clientes-import-file">
								Archivo
							</label>
							<input
								id="clientes-import-file"
								type="file"
								accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
								onChange={(event) => setImportFile(event.target.files?.[0] || null)}
								className="block w-full rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-white dark:border-zinc-700 dark:file:bg-zinc-100 dark:file:text-zinc-900"
							/>
							<p className="text-xs text-zinc-500 dark:text-zinc-400">
								Campos esperados: Nom_Cli, Ape_Cli, Tel_Cli, Usu_Tel_Cli, Ema_Cli, Pai_Cli, Doc_Cli, Cat_Cli, Pre_Con_Cli, Ace_Not_Tel_Cli, Ace_Not_Cor_Cli, Not_Cli, Est_Cli.
							</p>
						</div>

						<FeedbackAlert message={importError} variant="error" />

						{importResult ? (
							<div className="grid grid-cols-2 gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
								<div>
									<p className="text-zinc-500">Procesados</p>
									<p className="font-semibold">{importResult.total}</p>
								</div>
								<div>
									<p className="text-zinc-500">Insertados</p>
									<p className="font-semibold">{importResult.insertados}</p>
								</div>
								<div>
									<p className="text-zinc-500">Duplicados</p>
									<p className="font-semibold">{importResult.duplicados}</p>
								</div>
								<div>
									<p className="text-zinc-500">Inválidos</p>
									<p className="font-semibold">{importResult.invalidos}</p>
								</div>
								{importResult.actualizados != null ? (
									<div className="col-span-2">
										<p className="text-zinc-500">Actualizados</p>
										<p className="font-semibold">{importResult.actualizados}</p>
									</div>
								) : null}
							</div>
						) : null}

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setImportDialogOpen(false)} disabled={importLoading}>
								Cancelar
							</Button>
							<Button type="submit" disabled={importLoading}>
								{importLoading ? "Importando..." : "Importar"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

		<Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
			<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
				<SheetHeader className="px-6 pt-6">
					<SheetTitle>Detalle de cliente</SheetTitle>
					<SheetDescription>Informacion completa del cliente seleccionado.</SheetDescription>
				</SheetHeader>
				{clienteSeleccionado ? (
					<div className="px-6 pb-6">
						<ClienteCard
							cliente={clienteSeleccionado}
							onEdit={abrirEditar}
							onDelete={abrirConfirmacionEliminar}
						/>
					</div>
				) : (
					<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona un cliente para ver su detalle.</p>
				)}
			</SheetContent>
		</Sheet>

		<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
					<AlertDialogDescription>
						Esta accion eliminara de forma permanente a {" "}
						<strong>
							{clienteAEliminar ? `${clienteAEliminar.Nom_Cli} ${clienteAEliminar.Ape_Cli}`.trim() : "el cliente seleccionado"}
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
					<DialogTitle>{sheetMode === "create" ? "Crear cliente" : "Editar cliente"}</DialogTitle>
					<DialogDescription>Completa la informacion del cliente por secciones.</DialogDescription>
				</DialogHeader>

				<ClienteForm
					mode={sheetMode}
					form={form}
					setForm={setForm}
					formValido={formValido}
					onSubmit={guardarCliente}
					onCancel={() => setSheetOpen(false)}
				/>
			</DialogContent>
		</Dialog>
		</div>
	);
}
