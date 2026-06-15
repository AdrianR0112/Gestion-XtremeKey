import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Textarea } from "../../../components/ui/textarea";
import { formatCurrency } from "../../../utils/currency";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import DetalleVentasManager from "../../detalle-ventas/components/DetalleVentasManager";

export default function VentaForm({
	open,
	onOpenChange,
	mode,
	saving,
	ventaForm,
	onVentaFormChange,
	clientes,
	revendedores = [],
	detallesTemporales,
	detalleFormOpen,
	detalleForm,
	detalleEditandoIdx,
	detalleSubtotal,
	productos,
	variantes,
	cuentas,
	keysData,
	productoMap,
	varianteMap,
	onDetallesChange,
	onFormChange,
	onFormClose,
	onAddClick,
	onEditClick,
	onDeleteClick,
	ventaTotals,
	impuestoHabilitado,
	onSubmit,
	onDiscardDraftClick,
}) {
	const [activeTab, setActiveTab] = useState("venta");
	const [clienteQuery, setClienteQuery] = useState("");
	const [revendedorQuery, setRevendedorQuery] = useState("");
	const [tipoPersona, setTipoPersona] = useState(ventaForm.Id_Rev ? "revendedor" : "cliente");
	const isEditMode = mode === "edit";
	const selectedClienteId = ventaForm.Id_Cli ? Number(ventaForm.Id_Cli) : null;
	const selectedCliente = useMemo(
		() => clientes.find((cliente) => Number(cliente.Id_Cli) === selectedClienteId) || null,
		[clientes, selectedClienteId]
	);
	const selectedRevendedorId = ventaForm.Id_Rev ? Number(ventaForm.Id_Rev) : null;
	const selectedRevendedor = useMemo(
		() => revendedores.find((rev) => Number(rev.Id_Rev) === selectedRevendedorId) || null,
		[revendedores, selectedRevendedorId]
	);
	const filteredClientes = useMemo(() => {
		const query = normalizeSearchText(clienteQuery);
		if (!query) return [];

		return clientes
			.filter((cliente) => {
				return (
					matchesTextSearch([cliente.Nom_Cli, cliente.Ape_Cli, cliente.Ema_Cli, cliente.Doc_Cli], query) ||
					matchesPhoneSearch(cliente.Tel_Cli, query) ||
					matchesPhoneSearch(cliente.Tel_Alt_Cli, query)
				);
			})
			.slice(0, 12);
	}, [clienteQuery, clientes]);

	const filteredRevendedores = useMemo(() => {
		const query = normalizeSearchText(revendedorQuery);
		if (!query) return [];

		return revendedores
			.filter((rev) => {
				return (
					matchesTextSearch([rev.Nom_Rev, rev.Ape_Rev, rev.Ema_Rev, rev.Doc_Rev], query) ||
					matchesPhoneSearch(rev.Tel_Rev, query)
				);
			})
			.slice(0, 12);
	}, [revendedorQuery, revendedores]);

	const handleClienteSelect = (clienteId) => {
		onVentaFormChange((prev) => ({ ...prev, Id_Cli: String(clienteId) }));
		setClienteQuery("");
	};

	const renderClienteSubtitle = (cliente) => {
		if (!cliente) return "Sin contacto adicional";
		return [cliente.Tel_Cli || "Sin teléfono", cliente.Ema_Cli || "", cliente.Doc_Cli || ""]
			.filter(Boolean)
			.join(" | ");
	};

	const formContent = (
		<>
			{/* Tabs */}
			<div className="inline-flex rounded-lg border bg-muted/30 p-1">
				<Button
					type="button"
					size="sm"
					variant={activeTab === "venta" ? "default" : "ghost"}
					className="h-8"
					onClick={() => setActiveTab("venta")}
				>
					Datos de venta
				</Button>
				<Button
					type="button"
					size="sm"
					variant={activeTab === "productos" ? "default" : "ghost"}
					className="h-8"
					onClick={() => setActiveTab("productos")}
				>
					Productos
				</Button>
			</div>

			{activeTab === "venta" ? (
				<>
					<FormSection title="Cliente / Revendedor y estado" description="Selecciona si la venta es para un cliente o revendedor." className="rounded-2xl">
						<div className="inline-flex rounded-lg border bg-muted/30 p-1 mb-4">
							<Button type="button" size="sm" variant={tipoPersona === "cliente" ? "default" : "ghost"} className="h-8" onClick={() => setTipoPersona("cliente")}>
								Cliente
							</Button>
							<Button type="button" size="sm" variant={tipoPersona === "revendedor" ? "default" : "ghost"} className="h-8" onClick={() => setTipoPersona("revendedor")}>
								Revendedor
							</Button>
						</div>

						<div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
							<div className="space-y-4">
								{tipoPersona === "cliente" ? (
									<>
										<div className="rounded-2xl border bg-background p-4">
											<p className="text-xs uppercase tracking-wide text-zinc-500">Cliente seleccionado</p>
											{selectedCliente ? (
												<>
													<p className="text-lg font-semibold mt-1">{`${selectedCliente.Nom_Cli || ""} ${selectedCliente.Ape_Cli || ""}`.trim()}</p>
													<p className="text-sm text-zinc-500 mt-0.5">{renderClienteSubtitle(selectedCliente)}</p>
												</>
											) : (
												<p className="text-sm text-zinc-400 mt-1">Ningun cliente seleccionado.</p>
											)}
										</div>

										<div className="space-y-2">
											<Input value={clienteQuery} onChange={(event) => setClienteQuery(event.target.value)} placeholder="Buscar por nombre, telefono, correo o documento..." />
											{clienteQuery.trim() && (
												<p className="mt-1 text-xs text-zinc-500">
													{filteredClientes.length > 0
														? `${filteredClientes.length} coincidencia(s) visibles`
														: "Escribe para buscar un cliente"}
												</p>
											)}
											{clienteQuery.trim() && filteredClientes.length > 0 ? (
												<div className="max-h-64 overflow-y-auto rounded-xl border">
													{filteredClientes.map((cliente) => (
														<button key={cliente.Id_Cli} type="button" className="flex w-full items-start justify-between gap-3 border-b p-3 text-left transition hover:bg-zinc-100 last:border-0" onClick={() => handleClienteSelect(cliente.Id_Cli)}>
															<div>
																<p className="font-medium">{`${cliente.Nom_Cli || ""} ${cliente.Ape_Cli || ""}`.trim()}</p>
																<p className="mt-1 text-sm text-zinc-500">{renderClienteSubtitle(cliente)}</p>
															</div>
															<span className="text-sm text-zinc-500">Seleccionar</span>
														</button>
													))}
												</div>
											) : clienteQuery.trim() ? (
												<p className="text-sm text-zinc-500">No se encontraron clientes con ese criterio.</p>
											) : null}
										</div>
									</>
								) : (
									<>
										<div className="rounded-2xl border bg-background p-4">
											<p className="text-xs uppercase tracking-wide text-zinc-500">Revendedor seleccionado</p>
											{selectedRevendedor ? (
												<>
													<p className="text-lg font-semibold mt-1">{`${selectedRevendedor.Nom_Rev || ""} ${selectedRevendedor.Ape_Rev || ""}`.trim()}</p>
													<p className="text-sm text-zinc-500 mt-0.5">{[selectedRevendedor.Tel_Rev, selectedRevendedor.Doc_Rev].filter(Boolean).join(" | ")}</p>
												</>
											) : (
												<p className="text-sm text-zinc-400 mt-1">Ningun revendedor seleccionado.</p>
											)}
										</div>

										<div className="space-y-2">
											<Input value={revendedorQuery} onChange={(event) => setRevendedorQuery(event.target.value)} placeholder="Buscar por nombre, telefono, correo o documento..." />
											{revendedorQuery.trim() && filteredRevendedores.length > 0 ? (
												<div className="max-h-64 overflow-y-auto rounded-xl border">
													{filteredRevendedores.map((rev) => (
														<button key={rev.Id_Rev} type="button" className="flex w-full items-start justify-between gap-3 border-b p-3 text-left transition hover:bg-zinc-100 last:border-0" onClick={() => { onVentaFormChange((prev) => ({ ...prev, Id_Rev: String(rev.Id_Rev), Id_Cli: "" })); setRevendedorQuery(""); }}>
															<div>
																<p className="font-medium">{`${rev.Nom_Rev || ""} ${rev.Ape_Rev || ""}`.trim()}</p>
																<p className="mt-1 text-sm text-zinc-500">{[rev.Tel_Rev, rev.Doc_Rev].filter(Boolean).join(" | ")}</p>
															</div>
															<span className="text-sm text-zinc-500">Seleccionar</span>
														</button>
													))}
												</div>
											) : revendedorQuery.trim() ? (
												<p className="text-sm text-zinc-500">No se encontraron revendedores.</p>
											) : null}
										</div>
									</>
								)}
							</div>

							<div className="space-y-2">
								<Label>Estado de la venta</Label>
								<Select value={ventaForm.Est_Ven} onValueChange={(value) => onVentaFormChange((prev) => ({ ...prev, Est_Ven: value }))}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent>
										<SelectItem value="pendiente">Pendiente</SelectItem>
										<SelectItem value="completada">Completada</SelectItem>
										<SelectItem value="cancelada">Cancelada</SelectItem>
										<SelectItem value="reembolsada">Reembolsada</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</FormSection>

				<FormSection title="Detalles de la operación" description="Fecha, método de pago y observaciones de la venta." className="rounded-2xl">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label>Fecha de venta</Label>
							<Input
								type="datetime-local"
								value={ventaForm.Fec_Ven || ""}
								onChange={(event) => onVentaFormChange((prev) => ({ ...prev, Fec_Ven: event.target.value }))}
							/>
						</div>
						<div className="space-y-2">
							<Label>Metodo de pago</Label>
							<Select value={ventaForm.Met_Pag_Ven || ""} onValueChange={(value) => onVentaFormChange((prev) => ({ ...prev, Met_Pag_Ven: value }))}>
								<SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
								<SelectContent>
									<SelectItem value="Transferencia">Transferencia</SelectItem>
									<SelectItem value="Efectivo">Efectivo</SelectItem>
									<SelectItem value="Tarjeta">Tarjeta</SelectItem>
									<SelectItem value="PayPal">PayPal</SelectItem>
									<SelectItem value="Otro">Otro</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2 mt-4">
						<Label>Notas adicionales</Label>
						<Textarea
							value={ventaForm.Not_Ven}
							onChange={(event) => onVentaFormChange((prev) => ({ ...prev, Not_Ven: event.target.value }))}
							placeholder="Observaciones, comentarios especiales..."
							className="min-h-24"
						/>
					</div>
				</FormSection>

					<FormSection title="Totales" description="Ajusta los importes finales y revisa el total calculado." className="rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900">
						<div className={`grid grid-cols-1 gap-4 ${impuestoHabilitado ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
							<div className="space-y-2">
								<Label>Subtotal final</Label>
								<p className="text-lg font-semibold">{formatCurrency(ventaTotals.sub)}</p>
								<p className="text-xs text-zinc-500">Calculado automaticamente de los productos.</p>
							</div>
							<div className="space-y-2">
								<Label>Descuento</Label>
								<Input
									type="number"
									min="0"
									step="0.01"
									value={ventaForm.Des_Tot_Ven}
									onChange={(event) => onVentaFormChange((prev) => ({ ...prev, Des_Tot_Ven: event.target.value }))}
								/>
							</div>
							{impuestoHabilitado ? (
								<div className="space-y-2">
									<Label>Impuesto</Label>
									<Input
										type="number"
										min="0"
										step="0.01"
										value={ventaForm.Imp_Tot_Ven}
										onChange={(event) => onVentaFormChange((prev) => ({ ...prev, Imp_Tot_Ven: event.target.value }))}
									/>
								</div>
							) : null}
						</div>
						<div className="rounded-md bg-white dark:bg-zinc-800 p-4 border-2 border-blue-200 dark:border-blue-800">
							<p className="text-zinc-500 text-xs uppercase tracking-wide">Total calculado</p>
							<p className="text-3xl font-bold mt-2">{formatCurrency(ventaTotals.total)}</p>
						</div>
					</FormSection>
				</>
			) : (
				<DetalleVentasManager
					detallesTemporales={detallesTemporales}
					detalleFormOpen={detalleFormOpen}
					detalleForm={detalleForm}
					detalleEditandoIdx={detalleEditandoIdx}
					detalleSubtotal={detalleSubtotal}
					productos={productos}
					variantes={variantes}
					cuentas={cuentas}
					keysData={keysData}
					productoMap={productoMap}
					varianteMap={varianteMap}
					clienteId={selectedClienteId}
					revendedorId={selectedRevendedorId}
					licenciasCliente={[]}
					onDetallesChange={onDetallesChange}
					onFormChange={onFormChange}
					onFormClose={onFormClose}
					onAddClick={onAddClick}
					onEditClick={onEditClick}
					onDeleteClick={onDeleteClick}
				/>
			)}

		</>
	);

	return (
		isEditMode ? (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-6xl h-[90vh] p-0 overflow-hidden flex flex-col">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{mode === "create" ? "Crear venta" : "Editar venta"}</DialogTitle>
						<DialogDescription>Agrega los datos de la venta y los productos a vender.</DialogDescription>
					</DialogHeader>
					<form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
						<div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
							<div className="space-y-6">{formContent}</div>
						</div>
						<div className="border-t bg-background px-6 py-4 shrink-0">
							<div className="flex items-center justify-end gap-2">
								{mode === "create" ? (
									<Button type="button" variant="destructive" onClick={onDiscardDraftClick}>
										Eliminar borrador
									</Button>
								) : null}
								<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
									Cancelar
								</Button>
								<Button type="submit" disabled={saving}>
									{saving ? "Guardando..." : mode === "create" ? "Crear venta" : "Guardar cambios"}
								</Button>
							</div>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		) : (
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="right" className="sm:max-w-3xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>{mode === "create" ? "Crear venta" : "Editar venta"}</SheetTitle>
						<SheetDescription>Agrega los datos de la venta y los productos a vender.</SheetDescription>
					</SheetHeader>
					<form className="px-6 pb-6 space-y-6" onSubmit={onSubmit}>
						{formContent}
					</form>
				</SheetContent>
			</Sheet>
		)
	);
}
