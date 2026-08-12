import { useState } from "react";
import { Archive, Plus, RefreshCw, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import FeedbackAlert from "../../components/feedback-alert";
import SuscripcionCard from "./components/SuscripcionCard";
import SuscripcionForm from "./components/SuscripcionForm";
import SuscripcionKpiCards from "./components/SuscripcionKpiCards";
import SuscripcionMensajeDialog from "./components/SuscripcionMensajeDialog";
import SuscripcionRenovarDialog from "./components/SuscripcionRenovarDialog";
import SuscripcionRenovarResultado from "./components/SuscripcionRenovarResultado";
import SuscripcionTable from "./components/SuscripcionTable";
import SuscripcionVencimientoTabs from "./components/SuscripcionVencimientoTabs";
import useSuscripcionActions from "./hooks/useSuscripcionActions";
import useSuscripcionMensaje from "./hooks/useSuscripcionMensaje";
import useSuscripcionRenovacion from "./hooks/useSuscripcionRenovacion";
import useSuscripciones from "./hooks/useSuscripciones";

export default function SuscripcionesPage() {
	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [suscripcionAEliminar, setSuscripcionAEliminar] = useState(null);

	const state = useSuscripciones();
	const actions = useSuscripcionActions(state);
	const renovacion = useSuscripcionRenovacion();
	const mensaje = useSuscripcionMensaje();
	const {
		suscripcionesFiltradas,
		resumen,
		clientes,
		revendedores,
		productosSuscripcion,
		variantesDelProducto,
		variantesPorProducto,
		graciaDias,
		diasArchivo,
		setSelectedId,
		selectedIds,
		toggleSelected,
		selectAllFiltradas,
		clearSelection,
		suscripcionesSeleccionadas,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		estadoFilter,
		setEstadoFilter,
		vencimientoFilter,
		setVencimientoFilter,
		titularFilter,
		setTitularFilter,
		diasPorVencer,
		loading,
		saving,
		error,
		success,
		suscripcionSeleccionada,
		formValido,
	} = state;
	const { abrirCrear, abrirEditar, guardarSuscripcion, confirmarEliminacion, renovarSuscripcion, renovarLote } = actions;

	const verDetalle = (suscripcion) => {
		setSelectedId(suscripcion.Id_Sus);
		setDetailSheetOpen(true);
	};

	// La gracia decide desde cuando arranca el periodo nuevo, asi que el modal
	// la necesita entre desde donde se abra.
	const abrirRenovacion = (suscripciones) => renovacion.abrir(suscripciones, { graciaDias });

	const abrirConfirmacionEliminar = (suscripcion) => {
		setSelectedId(suscripcion.Id_Sus);
		setSuscripcionAEliminar(suscripcion);
		setDeleteDialogOpen(true);
	};

	const confirmarBorrado = async () => {
		const eliminado = await confirmarEliminacion();
		if (eliminado) {
			setDeleteDialogOpen(false);
			setSuscripcionAEliminar(null);
		}
	};

	// Las tarjetas KPI son atajos a los filtros del servidor.
	const aplicarFiltros = (filtros) => {
		setEstadoFilter(filtros.estado);
		setVencimientoFilter(filtros.vencimiento);
		setTitularFilter(filtros.titular);
	};

	const confirmarRenovacion = async () => {
		if (renovacion.esLote) {
			const reporte = await renovarLote(renovacion.objetivo, renovacion.form);
			if (reporte) {
				renovacion.setReporte(reporte);
				renovacion.cerrar();
			}
			return;
		}

		const resultado = await renovarSuscripcion(renovacion.objetivo[0], renovacion.form);
		if (resultado) renovacion.cerrar();
	};

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<SuscripcionKpiCards
				resumen={resumen}
				diasPorVencer={diasPorVencer}
				estadoFilter={estadoFilter}
				vencimientoFilter={vencimientoFilter}
				titularFilter={titularFilter}
				onSelect={aplicarFiltros}
			/>

			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Suscripciones</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							Gestión de suscripciones de clientes y revendedores, y su renovación
						</p>
					</div>
					<Button onClick={abrirCrear}>
						<Plus className="size-4 mr-1" />
						Nueva suscripción
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{renovacion.reporte ? (
						<SuscripcionRenovarResultado
							reporte={renovacion.reporte}
							onClose={() => renovacion.setReporte(null)}
						/>
					) : null}

					<SuscripcionVencimientoTabs
						value={vencimientoFilter}
						onChange={setVencimientoFilter}
						archivadas={resumen?.archivadas ?? 0}
					/>

					{vencimientoFilter === "archivadas" ? (
						<p className="flex items-start gap-1.5 rounded-md border border-zinc-200 bg-muted/40 p-2.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
							<Archive className="mt-0.5 size-3.5 shrink-0" />
							Suscripciones ya expiradas o vencidas hace más de {diasArchivo} día(s). No aparecen en el
							resto de pestañas para no tapar las que aún puedes cobrar. Se pueden renovar igual desde
							aquí.
						</p>
					) : null}

					{selectedIds.size > 0 ? (
						<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-900/20 bg-muted/40 px-4 py-3 dark:border-zinc-100/20">
							<p className="text-sm font-medium">{selectedIds.size} suscripción(es) seleccionada(s)</p>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="sm" onClick={clearSelection}>
									<X className="size-4 mr-1" />
									Quitar selección
								</Button>
								<Button size="sm" onClick={() => abrirRenovacion(suscripcionesSeleccionadas)}>
									<RefreshCw className="size-4 mr-1" />
									Renovar {selectedIds.size}
								</Button>
							</div>
						</div>
					) : null}

					{loading ? (
						<p className="text-sm text-zinc-500">Cargando suscripciones...</p>
					) : (
						<SuscripcionTable
							suscripciones={suscripcionesFiltradas}
							searchTerm={searchTerm}
							onSearchTermChange={setSearchTerm}
							estadoFilter={estadoFilter}
							onEstadoFilterChange={setEstadoFilter}
							titularFilter={titularFilter}
							onTitularFilterChange={setTitularFilter}
							selectedIds={selectedIds}
							onToggleSelected={toggleSelected}
							onSelectAll={selectAllFiltradas}
							onClearSelection={clearSelection}
							onView={verDetalle}
							onEdit={abrirEditar}
							onDelete={abrirConfirmacionEliminar}
							onRenovar={abrirRenovacion}
							onEnviarMensaje={mensaje.abrir}
						/>
					)}
				</div>
			</section>

			<Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
				<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de suscripción</SheetTitle>
						<SheetDescription>Información completa de la suscripción seleccionada.</SheetDescription>
					</SheetHeader>
					{suscripcionSeleccionada ? (
						<div className="px-6 pb-6">
							<SuscripcionCard
								suscripcion={suscripcionSeleccionada}
								onEdit={abrirEditar}
								onDelete={abrirConfirmacionEliminar}
								onRenovar={abrirRenovacion}
								onEnviarMensaje={mensaje.abrir}
							/>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una suscripción para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<SuscripcionRenovarDialog
				open={renovacion.dialogOpen}
				onOpenChange={renovacion.setDialogOpen}
				suscripciones={renovacion.objetivo}
				form={renovacion.form}
				setForm={renovacion.setForm}
				graciaDias={renovacion.graciaDias}
				variantesPorProducto={variantesPorProducto}
				saving={saving}
				onConfirm={confirmarRenovacion}
			/>

			<SuscripcionMensajeDialog
				open={mensaje.dialogOpen}
				onOpenChange={mensaje.setDialogOpen}
				datos={mensaje.datos}
				mensaje={mensaje.mensaje}
				setMensaje={mensaje.setMensaje}
				cargando={mensaje.cargando}
				error={mensaje.error}
			/>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar suscripción</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción eliminará de forma permanente la suscripción de{" "}
							<strong>
								{suscripcionAEliminar
									? suscripcionAEliminar.Nom_Tit_Sus || `#${suscripcionAEliminar.Id_Sus}`
									: "la suscripción seleccionada"}
							</strong>
							. No podrás deshacer este cambio.
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
				<DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{sheetMode === "create" ? "Crear suscripción" : "Editar suscripción"}</DialogTitle>
						<DialogDescription>Completa la información de la suscripción.</DialogDescription>
					</DialogHeader>

					<SuscripcionForm
						mode={sheetMode}
						form={form}
						setForm={setForm}
						formValido={formValido}
						clientes={clientes}
						revendedores={revendedores}
						productosSuscripcion={productosSuscripcion}
						variantesDelProducto={variantesDelProducto}
						onSubmit={guardarSuscripcion}
						onCancel={() => setSheetOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
