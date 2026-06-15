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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import FeedbackAlert from "../../components/feedback-alert";
import { CompraCard, CompraFilters, CompraForm, CompraTable } from "./components";
import { useCompras } from "./hooks";
import { formatCurrency } from "../../utils/currency";

export default function ComprasPage() {
	const compras = useCompras();
	const navigate = useNavigate();

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Compras</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestión completa de compras con detalles integrados</p>
					</div>
					<Button onClick={() => navigate("/compras/nueva")}>
						<Plus className="size-4 mr-1" />
						Nueva compra
					</Button>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={compras.error} variant="error" />
					<FeedbackAlert message={compras.success} variant="success" />

					<CompraFilters
						searchTerm={compras.searchTerm}
						onSearchTermChange={compras.setSearchTerm}
						estadoFilter={compras.estadoFilter}
						onEstadoFilterChange={compras.setEstadoFilter}
					/>

					<CompraTable
						loading={compras.loading}
						comprasFiltradas={compras.comprasFiltradas}
						proveedorMap={compras.proveedorMap}
						onView={compras.abrirDetalleCompra}
						onEdit={compras.abrirEditarCompra}
						onDelete={compras.abrirEliminarCompra}
					/>
				</div>
			</section>

			<Sheet open={compras.detalleViewOpen} onOpenChange={compras.setDetalleViewOpen}>
				<SheetContent side="right" className="sm:max-w-3xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de compra</SheetTitle>
						<SheetDescription>Items asociados a la compra seleccionada.</SheetDescription>
					</SheetHeader>

					{compras.compraSeleccionada ? (
						<div className="px-6 pb-6 space-y-5">
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
								<div>
									<p className="text-zinc-600 dark:text-zinc-400">ID</p>
									<p className="font-semibold">{compras.compraSeleccionada.Id_Com}</p>
								</div>
								<div>
									<p className="text-zinc-600 dark:text-zinc-400">Proveedor</p>
									<p className="font-semibold">{compras.proveedorMap[compras.compraSeleccionada.Id_Pro]?.Nom_Pro || "N/A"}</p>
								</div>
								<div>
									<p className="text-zinc-600 dark:text-zinc-400">Subtotal</p>
									<p className="font-semibold">{formatCurrency(compras.compraSeleccionada.Sub_Tot_Com)}</p>
								</div>
								<div>
									<p className="text-zinc-600 dark:text-zinc-400">Impuesto</p>
									<p className="font-semibold">{formatCurrency(compras.compraSeleccionada.Imp_Tot_Com)}</p>
								</div>
								<div>
									<p className="text-zinc-600 dark:text-zinc-400">Total</p>
									<p className="font-semibold">{formatCurrency(compras.compraSeleccionada.Tot_Com)}</p>
								</div>
								<div>
									<p className="text-zinc-600 dark:text-zinc-400">Estado</p>
									<p className="font-semibold capitalize">{compras.compraSeleccionada.Est_Com}</p>
								</div>
								<div className="sm:col-span-2 lg:col-span-3">
									<p className="text-zinc-600 dark:text-zinc-400">Método de Pago</p>
									<p className="font-semibold">{compras.compraSeleccionada.Met_Pag_Com || "N/A"}</p>
								</div>
								<div className="sm:col-span-2 lg:col-span-3">
									<p className="text-zinc-600 dark:text-zinc-400">Notas</p>
									<p className="font-semibold">{compras.compraSeleccionada.Not_Com || "Sin notas"}</p>
								</div>
							</div>

							<div className="border-t pt-5">
								<h3 className="font-semibold mb-3">Items</h3>
								{compras.detallesDeCompra && compras.detallesDeCompra.length > 0 ? (
									<div className="space-y-2">
										{compras.detallesDeCompra.map((detalle, idx) => (
											<div key={idx} className="p-3 rounded-lg border bg-background/50 text-sm">
												<div className="flex justify-between">
													<span>{compras.productoMap[detalle.Id_Prd]?.Nom_Prd || "Producto"}</span>
													<span className="font-semibold">{formatCurrency(detalle.Sub_Tot_Dco)}</span>
												</div>
												<p className="text-zinc-600 dark:text-zinc-400 text-xs">
													{detalle.Can_Dco} × {formatCurrency(detalle.Pre_Uni_Dco)}
												</p>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-zinc-500">Sin items.</p>
								)}
							</div>

							<div className="border-t pt-5 flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="flex-1"
									onClick={() => compras.abrirEditarCompra(compras.compraSeleccionada)}
								>
									Editar
								</Button>
								<Button
									variant="destructive"
									size="sm"
									className="flex-1"
									onClick={() => compras.abrirEliminarCompra(compras.compraSeleccionada)}
								>
									Eliminar
								</Button>
							</div>
						</div>
					) : (
						<p className="text-sm text-zinc-500 px-6 pb-6">Selecciona una compra para ver su detalle.</p>
					)}
				</SheetContent>
			</Sheet>

			<Dialog open={compras.compraSheetOpen} onOpenChange={compras.setCompraSheetOpen}>
				<DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{compras.compraSheetMode === "create" ? "Crear compra" : "Editar compra"}</DialogTitle>
						<DialogDescription>Completa la información de la compra.</DialogDescription>
					</DialogHeader>
					<CompraForm
						mode={compras.compraSheetMode}
						form={compras.compraForm}
						setForm={compras.setCompraForm}
						formValido={Boolean(compras.compraForm.Id_Pro)}
						onSubmit={compras.guardarCompra}
						onCancel={() => compras.setCompraSheetOpen(false)}
						proveedores={compras.proveedores}
					/>
				</DialogContent>
			</Dialog>

			<AlertDialog open={compras.compraDeleteDialogOpen} onOpenChange={compras.setCompraDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Eliminar compra</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción eliminará de forma permanente la compra{" "}
							<strong>{compras.compraAEliminar ? `#${compras.compraAEliminar.Id_Com}` : "seleccionada"}</strong>. No podrás
							deshacer este cambio.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={compras.saving}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={compras.confirmarEliminarCompra} disabled={compras.saving}>
							{compras.saving ? "Eliminando..." : "Eliminar"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
