import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeedbackAlert from "../../../components/feedback-alert";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { Textarea } from "../../../components/ui/textarea";
import { formatCurrency } from "../../../utils/currency";
import DetalleComprasManager from "../../detalle-compras/components/DetalleComprasManager";
import { NONE_VALUE, fromSelectValue, toSelectValue } from "../utils/constants";

export default function CompraCreateView({
	compraForm,
	onCompraFormChange,
	proveedores,
	detallesTemporales,
	detalleFormOpen,
	detalleForm,
	detalleEditandoIdx,
	detalleSubtotal,
	productos,
	variantes,
	productoMap,
	varianteMap,
	onDetallesChange,
	onFormChange,
	onFormClose,
	onAddClick,
	onEditClick,
	onDeleteClick,
	compraTotals,
	saving,
	error,
	success,
	onSubmit,
	onCancel,
	onCreateProveedorClick,
	onClearDraftClick,
}) {
	const navigate = useNavigate();

	return (
		<div className="max-w-5xl mx-auto space-y-5">
			<button
				onClick={onCancel}
				className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
			>
				<ArrowLeft className="size-4" />
				Volver a compras
			</button>

			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<h1 className="text-2xl font-semibold">Nueva compra</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Crea una nueva orden de compra</p>
				</div>

				<form onSubmit={onSubmit} className="space-y-6 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					{/* Información general */}
					<div className="rounded-lg border p-4 bg-background space-y-4">
						<h3 className="font-semibold text-sm">Información general</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Proveedor *</Label>
								<Select
									value={String(compraForm.Id_Pro ?? "")}
									onValueChange={(value) =>
										onCompraFormChange((prev) => ({
											...prev,
											Id_Pro: fromSelectValue(value),
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona proveedor" />
									</SelectTrigger>
									<SelectContent>
										{proveedores.map((proveedor) => (
											<SelectItem key={proveedor.Id_Pro} value={String(proveedor.Id_Pro)}>
												{proveedor.Nom_Pro}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={onCreateProveedorClick}
									className="w-full"
								>
									<Plus className="size-4 mr-1" />
									Crear proveedor
								</Button>
							</div>

							<div className="space-y-2">
								<Label>Estado</Label>
								<Select
									value={compraForm.Est_Com}
									onValueChange={(value) =>
										onCompraFormChange((prev) => ({
											...prev,
											Est_Com: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pendiente">Pendiente</SelectItem>
										<SelectItem value="completada">Completada</SelectItem>
										<SelectItem value="cancelada">Cancelada</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Fecha</Label>
								<Input
									type="datetime-local"
									value={compraForm.Fec_Com}
									onChange={(e) =>
										onCompraFormChange((prev) => ({
											...prev,
											Fec_Com: e.target.value,
										}))
									}
								/>
							</div>

							<div className="space-y-2">
								<Label>Método de pago</Label>
								<Input
									type="text"
									value={compraForm.Met_Pag_Com}
									onChange={(e) =>
										onCompraFormChange((prev) => ({
											...prev,
											Met_Pag_Com: e.target.value,
										}))
									}
									placeholder="Ej: Transferencia, Efectivo"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Notas</Label>
							<Textarea
								value={compraForm.Not_Com}
								onChange={(e) =>
									onCompraFormChange((prev) => ({
										...prev,
										Not_Com: e.target.value,
									}))
								}
								placeholder="Detalles adicionales..."
								className="min-h-20"
							/>
						</div>
					</div>

					<Separator />

					{/* Items de compra */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-sm">Items de compra *</h3>
							<Button
								type="button"
								size="sm"
								onClick={() => onAddClick()}
							>
								<Plus className="size-4 mr-1" />
								Agregar item
							</Button>
						</div>

						<DetalleComprasManager
							detallesTemporales={detallesTemporales}
							detalleFormOpen={detalleFormOpen}
							detalleForm={detalleForm}
							detalleEditandoIdx={detalleEditandoIdx}
							detalleSubtotal={detalleSubtotal}
							productos={productos}
							variantes={variantes}
							productoMap={productoMap}
							varianteMap={varianteMap}
							onDetallesChange={onDetallesChange}
							onFormChange={onFormChange}
							onFormClose={onFormClose}
							onAddClick={onAddClick}
							onEditClick={onEditClick}
							onDeleteClick={onDeleteClick}
						/>
					</div>

					{/* Totales */}
					<div className="rounded-lg bg-background border p-4 space-y-2">
						<div className="flex justify-between text-sm">
							<span>Subtotal:</span>
							<span className="font-semibold">{formatCurrency(compraTotals.sub)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Impuesto:</span>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={compraForm.Imp_Tot_Com}
								onChange={(e) =>
									onCompraFormChange((prev) => ({
										...prev,
										Imp_Tot_Com: e.target.value,
									}))
								}
								className="w-32 h-8"
							/>
						</div>
						<div className="border-t pt-2 flex justify-between text-base font-semibold">
							<span>Total:</span>
							<span>{formatCurrency(compraTotals.total)}</span>
						</div>
					</div>

					<Separator />

					{/* Actions */}
					<div className="flex gap-2 justify-end">
						<Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
							Cancelar
						</Button>
						<Button type="button" variant="ghost" onClick={onClearDraftClick} disabled={saving}>
							Descartar borrador
						</Button>
						<Button type="submit" disabled={saving || !compraForm.Id_Pro || detallesTemporales.length === 0}>
							{saving ? "Guardando..." : "Guardar compra"}
						</Button>
					</div>
				</form>
			</section>
		</div>
	);
}
