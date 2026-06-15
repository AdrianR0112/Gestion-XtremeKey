import { Plus } from "lucide-react";
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
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import FeedbackAlert from "../../components/feedback-alert";
import { formatCurrency } from "../../utils/currency";
import formatDate from "../../utils/formatDate";
import RenovacionCard from "./components/RenovacionCard";
import RenovacionEstadoBadge from "./components/RenovacionEstadoBadge";
import RenovacionFilters from "./components/RenovacionFilters";
import RenovacionForm from "./components/RenovacionForm";
import RenovacionTable from "./components/RenovacionTable";
import useRenovaciones from "./hooks/useRenovaciones";

export default function RenovacionesPage() {
	const renovaciones = useRenovaciones();

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Renovaciones</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							Historial de renovaciones de licencias con detalle de precios y fechas.
						</p>
					</div>
					<Button onClick={renovaciones.abrirCrear}>
						<Plus className="size-4 mr-1" />
						Nueva renovacion
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={renovaciones.error} variant="error" />
					<FeedbackAlert message={renovaciones.success} variant="success" />

					<RenovacionFilters
						searchTerm={renovaciones.searchTerm}
						onSearchTermChange={renovaciones.setSearchTerm}
						estadoFilter={renovaciones.estadoFilter}
						onEstadoFilterChange={renovaciones.setEstadoFilter}
					/>

					<RenovacionTable
						loading={renovaciones.loading}
						renovacionesFiltradas={renovaciones.renovacionesFiltradas}
						onEdit={renovaciones.abrirEditar}
						onDelete={renovaciones.abrirEliminar}
					/>
				</div>
			</section>

			<RenovacionForm
				open={renovaciones.sheetOpen}
				onOpenChange={renovaciones.setSheetOpen}
				mode={renovaciones.sheetMode}
				saving={renovaciones.saving}
				form={renovaciones.form}
				onFormChange={renovaciones.setForm}
				onSubmit={renovaciones.guardarRenovacion}
			/>

			<Sheet open={!!renovaciones.renovacionSeleccionada} onOpenChange={() => renovaciones.setSelectedRenovacionId(null)}>
				<SheetContent side="right" className="sm:max-w-3xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de renovacion</SheetTitle>
						<SheetDescription>Informacion completa de la renovacion seleccionada.</SheetDescription>
					</SheetHeader>

					{renovaciones.renovacionSeleccionada ? (
						<div className="px-6 pb-6 space-y-5">
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
								<RenovacionCard label="ID renovacion" value={`#${renovaciones.renovacionSeleccionada.Id_Ren}`} />
								<RenovacionCard
									label="Cliente"
									value={renovaciones.renovacionSeleccionada.Nom_Cli || "-"}
								/>
								<RenovacionCard
									label="Producto"
									value={renovaciones.renovacionSeleccionada.Nom_Prd || "-"}
								/>
								{renovaciones.renovacionSeleccionada.Nom_Var ? (
									<RenovacionCard
										label="Variante"
										value={renovaciones.renovacionSeleccionada.Nom_Var}
									/>
								) : null}
								<RenovacionCard
									label="Tipo"
									value={<span className="uppercase">{renovaciones.renovacionSeleccionada.Tip_Ren || "-"}</span>}
								/>
								<RenovacionCard
									label="Estado"
									value={<RenovacionEstadoBadge estado={renovaciones.renovacionSeleccionada.Est_Ren} />}
								/>
							</div>

							<div className="grid sm:grid-cols-2 gap-3 text-sm">
								<RenovacionCard
									label="Vence anterior"
									value={renovaciones.renovacionSeleccionada.Fec_Ven_Ant_Ren ? formatDate(renovaciones.renovacionSeleccionada.Fec_Ven_Ant_Ren) : "-"}
								/>
								<RenovacionCard
									label="Inicio nueva"
									value={renovaciones.renovacionSeleccionada.Fec_Ini_Nue_Ren ? formatDate(renovaciones.renovacionSeleccionada.Fec_Ini_Nue_Ren) : "-"}
								/>
								<RenovacionCard
									label="Fin nueva"
									value={renovaciones.renovacionSeleccionada.Fec_Fin_Nue_Ren ? formatDate(renovaciones.renovacionSeleccionada.Fec_Fin_Nue_Ren) : "-"}
								/>
								<RenovacionCard
									label="Precio original"
									value={formatCurrency(renovaciones.renovacionSeleccionada.Pre_Ori_Ren || 0)}
								/>
								<RenovacionCard
									label="Precio renovado"
									value={renovaciones.renovacionSeleccionada.Pre_Ren != null ? formatCurrency(renovaciones.renovacionSeleccionada.Pre_Ren) : "-"}
								/>
								<RenovacionCard
									label="Descuento"
									value={formatCurrency(renovaciones.renovacionSeleccionada.Des_Ren || 0)}
								/>
							</div>

							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Campo</TableHead>
											<TableHead>Licencia original</TableHead>
											<TableHead>Licencia nueva</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className="font-medium">ID Detalle</TableCell>
											<TableCell>#{renovaciones.renovacionSeleccionada.Id_Dve_Ori || "-"}</TableCell>
											<TableCell>#{renovaciones.renovacionSeleccionada.Id_Dve_Nue || "-"}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">ID Venta</TableCell>
											<TableCell>#{renovaciones.renovacionSeleccionada.Id_Ven_Ori || "-"}</TableCell>
											<TableCell>#{renovaciones.renovacionSeleccionada.Id_Ven_Nue || "-"}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">Cantidad</TableCell>
											<TableCell>{renovaciones.renovacionSeleccionada.Can_Dve_Ori ?? "-"}</TableCell>
											<TableCell>{renovaciones.renovacionSeleccionada.Can_Dve_Nue ?? "-"}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>

							{renovaciones.renovacionSeleccionada.Not_Ren ? (
								<div className="rounded-md border p-3">
									<p className="text-xs text-zinc-500 mb-1">Notas</p>
									<p className="text-sm">{renovaciones.renovacionSeleccionada.Not_Ren}</p>
								</div>
							) : null}
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una renovacion para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<AlertDialog open={renovaciones.renovacionDeleteDialogOpen} onOpenChange={renovaciones.setRenovacionDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar renovacion</AlertDialogTitle>
						<AlertDialogDescription>
							Esta accion eliminara la renovacion #{renovaciones.renovacionAEliminar?.Id_Ren || ""}.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={renovaciones.saving}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={renovaciones.confirmarEliminar} disabled={renovaciones.saving}>
							{renovaciones.saving ? "Eliminando..." : "Eliminar"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
