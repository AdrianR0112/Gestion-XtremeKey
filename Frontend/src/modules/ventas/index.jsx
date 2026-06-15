import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { VentaCard, VentaFilters, VentaForm, VentaTable } from "./components";
import { useVentas } from "./hooks";
import { formatCurrency } from "../../utils/currency";

export default function VentasPage() {
	const ventas = useVentas();
	const navigate = useNavigate();

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Ventas</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestión completa de ventas con detalles integrados</p>
					</div>
					<Button onClick={() => navigate("/ventas/nueva")}>
						<Plus className="size-4 mr-1" />
						Nueva venta
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={ventas.error} variant="error" />
					<FeedbackAlert message={ventas.success} variant="success" />

					<VentaFilters
						searchTerm={ventas.searchTerm}
						onSearchTermChange={ventas.setSearchTerm}
						estadoFilter={ventas.estadoFilter}
						onEstadoFilterChange={ventas.setEstadoFilter}
					/>

				<VentaTable
					loading={ventas.loading}
					ventasFiltradas={ventas.ventasFiltradas}
					clienteMap={ventas.clienteMap}
					revendedorMap={ventas.revendedorMap}
					onView={ventas.abrirDetalleVenta}
					onEdit={ventas.abrirEditarVenta}
					onDelete={ventas.abrirEliminarVenta}
				/>
				</div>
			</section>

			<VentaForm
				open={ventas.ventaSheetOpen}
				onOpenChange={ventas.setVentaSheetOpen}
				mode={ventas.ventaSheetMode}
				saving={ventas.saving}
				ventaForm={ventas.ventaForm}
				onVentaFormChange={ventas.setVentaForm}
				clientes={ventas.clientes}
				revendedores={ventas.revendedores}
				detallesTemporales={ventas.detallesTemporales}
				detalleFormOpen={ventas.detalleFormOpen}
				detalleForm={ventas.detalleForm}
				detalleEditandoIdx={ventas.detalleEditandoIdx}
				detalleSubtotal={ventas.detalleSubtotal}
				productos={ventas.productos}
				variantes={ventas.variantes}
				cuentas={ventas.cuentas}
				keysData={ventas.keysData}
				productoMap={ventas.productoMap}
				varianteMap={ventas.varianteMap}
				onDetallesChange={ventas.setDetallesTemporales}
				onFormChange={ventas.setDetalleForm}
				onFormClose={ventas.cerrarDetalleForm}
				onAddClick={ventas.abrirCrearDetalle}
				onEditClick={ventas.abrirEditarDetalle}
				onDeleteClick={ventas.eliminarDetalle}
				ventaTotals={ventas.ventaTotals}
				impuestoHabilitado={ventas.impuestoHabilitado}
				totalesDetalles={ventas.totalesDetalles}
				onSubmit={ventas.guardarVenta}
				onDiscardDraftClick={ventas.descartarBorradorVenta}
			/>

			<Sheet open={ventas.detalleViewOpen} onOpenChange={ventas.setDetalleViewOpen}>
				<SheetContent side="right" className="sm:max-w-3xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de venta</SheetTitle>
						<SheetDescription>Items asociados a la venta seleccionada.</SheetDescription>
					</SheetHeader>

					{ventas.ventaSeleccionada ? (
						<div className="px-6 pb-6 space-y-5">
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
								<VentaCard label="ID venta" value={`#${ventas.ventaSeleccionada.Id_Ven}`} />
							<VentaCard
								label="Cliente / Revendedor"
								value={
									ventas.ventaSeleccionada.Id_Cli
										? ventas.ventaSeleccionada.Nom_Cli
											? `${ventas.ventaSeleccionada.Nom_Cli} ${ventas.ventaSeleccionada.Ape_Cli}`
											: ventas.clienteMap.get(Number(ventas.ventaSeleccionada.Id_Cli)) || "-"
										: ventas.ventaSeleccionada.Nom_Rev
											? `${ventas.ventaSeleccionada.Nom_Rev} ${ventas.ventaSeleccionada.Ape_Rev}`
											: ventas.revendedorMap.get(Number(ventas.ventaSeleccionada.Id_Rev)) || "-"
								}
							/>
								<VentaCard label="Total" value={formatCurrency(ventas.ventaSeleccionada.Tot_Ven || 0)} />
							</div>

							<div className="overflow-x-auto rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Producto</TableHead>
											<TableHead>Cantidad</TableHead>
											<TableHead>Subtotal</TableHead>
											<TableHead>Estado</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{ventas.detallesDeVenta.length ? (
											ventas.detallesDeVenta.map((detalle) => (
												<TableRow key={detalle.Id_Dve}>
													<TableCell>{detalle.Id_Dve}</TableCell>
													<TableCell>
														<p>{detalle.Nom_Prd || ventas.productoMap.get(Number(detalle.Id_Prd)) || "-"}</p>
														<p className="text-xs text-zinc-500">
															{detalle.Nom_Var || ventas.varianteMap.get(Number(detalle.Id_Var)) || ""}
														</p>
													</TableCell>
													<TableCell>{detalle.Can_Dve ?? 1}</TableCell>
													<TableCell>{formatCurrency(detalle.Sub_Tot_Dve || 0)}</TableCell>
													<TableCell>{detalle.Est_Dve || "-"}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={5} className="h-20 text-center">
													Esta venta no tiene detalles.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una venta para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<AlertDialog open={ventas.ventaDeleteDialogOpen} onOpenChange={ventas.setVentaDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar venta</AlertDialogTitle>
						<AlertDialogDescription>Esta acción eliminará la venta #{ventas.ventaAEliminar?.Id_Ven || ""}.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={ventas.saving}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={ventas.confirmarEliminarVenta} disabled={ventas.saving}>
							{ventas.saving ? "Eliminando..." : "Eliminar"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
