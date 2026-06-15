import { ArrowLeft, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import FeedbackAlert from "../../../components/feedback-alert";
import { formatCurrency } from "../../../utils/currency";
import { matchesPhoneSearch, matchesTextSearch, normalizeSearchText } from "../../../utils/search";
import DetalleVentasManager from "../../detalle-ventas/components/DetalleVentasManager";

function findClientes(clientes, query) {
	const normalized = normalizeSearchText(query);
	if (!normalized) return [];
	return clientes.filter((cliente) => {
		return (
			matchesTextSearch([cliente.Nom_Cli, cliente.Ape_Cli, cliente.Doc_Cli], normalized) ||
			matchesPhoneSearch(cliente.Tel_Cli, normalized) ||
			matchesPhoneSearch(cliente.Tel_Alt_Cli, normalized)
		);
	});
}

function buildClienteSubtitle(cliente) {
	if (!cliente) return "Sin telefono";
	return [cliente.Tel_Cli || "Sin telefono", cliente.Doc_Cli || ""].filter(Boolean).join(" - ");
}

function findRevendedores(revendedores, query) {
	const normalized = normalizeSearchText(query);
	if (!normalized) return [];
	return revendedores.filter((rev) => {
		return (
			matchesTextSearch([rev.Nom_Rev, rev.Ape_Rev, rev.Doc_Rev], normalized) ||
			matchesPhoneSearch(rev.Tel_Rev, normalized)
		);
	});
}

function buildRevendedorSubtitle(revendedor) {
	if (!revendedor) return "Sin telefono";
	return [revendedor.Tel_Rev || "Sin telefono", revendedor.Doc_Rev || ""].filter(Boolean).join(" - ");
}

export default function VentaCreateView({
	ventaForm,
	onVentaFormChange,
	clientes,
	revendedores = [],
	ventas = [],
	detalleVentas = [],
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
	totalesDetalles,
	saving,
	error,
	success,
	onSubmit,
	onCancel,
	onCreateClientClick,
	onCreateRevendedorClick,
	onClearDraftClick,
}) {
	const [clienteQuery, setClienteQuery] = useState("");
	const [revendedorQuery, setRevendedorQuery] = useState("");
	const [tipoPersona, setTipoPersona] = useState(ventaForm.Id_Rev ? "revendedor" : "cliente");
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

	const ventaClienteMap = useMemo(() => {
		const map = new Map();
		for (const v of ventas) {
			if (v.Id_Ven && v.Id_Cli) {
				map.set(Number(v.Id_Ven), Number(v.Id_Cli));
			}
		}
		return map;
	}, [ventas]);

	const licenciasCliente = useMemo(() => {
		if (!selectedClienteId) return [];
		return detalleVentas.filter((d) => ventaClienteMap.get(Number(d.Id_Ven)) === selectedClienteId);
	}, [selectedClienteId, detalleVentas, ventaClienteMap]);

	const renovacionesCount = detallesTemporales.filter((d) => d.tipoOperacion === "renovacion").length;
	const nuevasCount = detallesTemporales.filter((d) => !d.tipoOperacion || d.tipoOperacion === "nueva").length;
	const suggestedClientes = useMemo(() => findClientes(clientes, clienteQuery).slice(0, 6), [clientes, clienteQuery]);
	const suggestedRevendedores = useMemo(() => findRevendedores(revendedores, revendedorQuery).slice(0, 6), [revendedores, revendedorQuery]);
	const requiereMetodoPago = ventaForm.Est_Ven === "completada";
	const canSubmit = Boolean(
		(ventaForm.Id_Cli || ventaForm.Id_Rev) &&
		detallesTemporales.length > 0 &&
		(!requiereMetodoPago || String(ventaForm.Met_Pag_Ven || "").trim())
	);
	const validationMessages = useMemo(() => {
		const messages = [];
		if (!ventaForm.Id_Cli && !ventaForm.Id_Rev) messages.push("Falta seleccionar cliente o revendedor.");
		if (detallesTemporales.length === 0) messages.push("Falta agregar al menos un producto.");
		if (requiereMetodoPago && !String(ventaForm.Met_Pag_Ven || "").trim()) {
			messages.push("Falta seleccionar el metodo de pago para una venta pagada.");
		}
		return messages;
	}, [detallesTemporales.length, requiereMetodoPago, ventaForm.Id_Cli, ventaForm.Id_Rev, ventaForm.Met_Pag_Ven]);

	return (
		<div className="mx-auto max-w-7xl space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex flex-col gap-4 border-b border-zinc-200/80 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-3xl font-semibold">Nueva venta</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
							Registra una venta agregando cliente, productos y condiciones de pago.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button
							type="button"
							variant="outline"
							className="bg-transparent dark:bg-transparent"
							onClick={onCancel}
						>
							<ArrowLeft className="mr-1 size-4" />
							Volver
						</Button>
						<Button type="button" variant="ghost" onClick={onClearDraftClick}>
							Eliminar borrador
						</Button>
					</div>
				</div>

				<div className="space-y-4 px-4 py-4 sm:px-5">
					<FeedbackAlert message={error} variant="error" />
					<FeedbackAlert message={success} variant="success" />

					<form className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" onSubmit={onSubmit}>
				<div className="space-y-6">
					<section className="rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/95">
						<div className="mb-4">
							<h2 className="font-semibold">Cliente y datos de venta</h2>
							<p className="text-sm text-zinc-500">Define para quien es la venta y bajo que condicion se registra.</p>
						</div>

						<div className="space-y-5">
							<div className="space-y-2">
								<div className="inline-flex rounded-lg border bg-muted/30 p-1">
									<Button
										type="button"
										size="sm"
										variant={tipoPersona === "cliente" ? "default" : "ghost"}
										className="h-8"
										onClick={() => setTipoPersona("cliente")}
									>
										Cliente
									</Button>
									<Button
										type="button"
										size="sm"
										variant={tipoPersona === "revendedor" ? "default" : "ghost"}
										className="h-8"
										onClick={() => setTipoPersona("revendedor")}
									>
										Revendedor
									</Button>
								</div>

								{tipoPersona === "cliente" ? (
									<>
										<Label>Cliente *</Label>
										<div className="flex flex-col gap-2 md:flex-row">
											<Input
												value={clienteQuery}
												onChange={(event) => setClienteQuery(event.target.value)}
												placeholder="Buscar por nombre, telefono o identificacion..."
												className="md:flex-1"
											/>
											<Button type="button" variant="outline" onClick={onCreateClientClick}>
												<Plus className="mr-1 size-4" />
												Nuevo cliente
											</Button>
										</div>
										{selectedCliente ? (
											<div className="rounded-xl border bg-emerald-50 p-3">
												<p className="font-medium">
													{`${selectedCliente.Nom_Cli || ""} ${selectedCliente.Ape_Cli || ""}`.trim()}
												</p>
												<p className="mt-1 text-sm text-zinc-600">{buildClienteSubtitle(selectedCliente)}</p>
												<Button type="button" variant="ghost" size="sm" className="mt-2 px-0"
													onClick={() => onVentaFormChange((prev) => ({ ...prev, Id_Cli: "" }))}>
													Cambiar cliente
												</Button>
											</div>
										) : clienteQuery.trim() ? (
											<div className="rounded-xl border bg-zinc-50">
												{suggestedClientes.length > 0 ? (
													<div className="divide-y">
														{suggestedClientes.map((cliente) => (
															<button key={cliente.Id_Cli} type="button"
																className="flex w-full items-start justify-between gap-3 p-3 text-left transition hover:bg-zinc-100"
																onClick={() => {
																	onVentaFormChange((prev) => ({ ...prev, Id_Cli: String(cliente.Id_Cli), Id_Rev: "" }));
																	setClienteQuery("");
																}}>
																<div>
																	<p className="font-medium">{`${cliente.Nom_Cli || ""} ${cliente.Ape_Cli || ""}`.trim()}</p>
																	<p className="mt-1 text-sm text-zinc-500">{buildClienteSubtitle(cliente)}</p>
																</div>
																<span className="text-sm text-zinc-500">Seleccionar</span>
															</button>
														))}
													</div>
												) : (
													<div className="p-3 text-sm text-zinc-500">No se encontraron clientes con ese criterio.</div>
												)}
											</div>
										) : null}
									</>
								) : (
									<>
										<Label>Revendedor *</Label>
										<div className="flex flex-col gap-2 md:flex-row">
											<Input
												value={revendedorQuery}
												onChange={(event) => setRevendedorQuery(event.target.value)}
												placeholder="Buscar por nombre, telefono o documento..."
												className="md:flex-1"
											/>
											{onCreateRevendedorClick ? (
												<Button type="button" variant="outline" onClick={onCreateRevendedorClick}>
													<Plus className="mr-1 size-4" />
													Nuevo revendedor
												</Button>
											) : null}
										</div>
										{selectedRevendedor ? (
											<div className="rounded-xl border bg-emerald-50 p-3">
												<p className="font-medium">
													{`${selectedRevendedor.Nom_Rev || ""} ${selectedRevendedor.Ape_Rev || ""}`.trim()}
												</p>
												<p className="mt-1 text-sm text-zinc-600">{buildRevendedorSubtitle(selectedRevendedor)}</p>
												<Button type="button" variant="ghost" size="sm" className="mt-2 px-0"
													onClick={() => onVentaFormChange((prev) => ({ ...prev, Id_Rev: "" }))}>
													Cambiar revendedor
												</Button>
											</div>
										) : revendedorQuery.trim() ? (
											<div className="rounded-xl border bg-zinc-50">
												{suggestedRevendedores.length > 0 ? (
													<div className="divide-y">
														{suggestedRevendedores.map((rev) => (
															<button key={rev.Id_Rev} type="button"
																className="flex w-full items-start justify-between gap-3 p-3 text-left transition hover:bg-zinc-100"
																onClick={() => {
																	onVentaFormChange((prev) => ({ ...prev, Id_Rev: String(rev.Id_Rev), Id_Cli: "" }));
																	setRevendedorQuery("");
																}}>
																<div>
																	<p className="font-medium">{`${rev.Nom_Rev || ""} ${rev.Ape_Rev || ""}`.trim()}</p>
																	<p className="mt-1 text-sm text-zinc-500">{buildRevendedorSubtitle(rev)}</p>
																</div>
																<span className="text-sm text-zinc-500">Seleccionar</span>
															</button>
														))}
													</div>
												) : (
													<div className="p-3 text-sm text-zinc-500">No se encontraron revendedores con ese criterio.</div>
												)}
											</div>
										) : null}
									</>
								)}
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Fecha de venta</Label>
									<Input
										type="datetime-local"
										value={ventaForm.Fec_Ven}
										onChange={(event) => onVentaFormChange((prev) => ({ ...prev, Fec_Ven: event.target.value }))}
									/>
								</div>
								<div className="space-y-2">
									<Label>Estado de la venta</Label>
									<Select
										value={ventaForm.Est_Ven}
										onValueChange={(value) => onVentaFormChange((prev) => ({ ...prev, Est_Ven: value }))}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pendiente">Pendiente</SelectItem>
											<SelectItem value="completada">Completada</SelectItem>
											<SelectItem value="cancelada">Cancelada</SelectItem>
											<SelectItem value="reembolsada">Reembolsada</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Metodo de pago</Label>
								<Select
									value={ventaForm.Met_Pag_Ven || ""}
									onValueChange={(value) => onVentaFormChange((prev) => ({ ...prev, Met_Pag_Ven: value }))}
									disabled={!requiereMetodoPago}
								>
									<SelectTrigger>
										<SelectValue placeholder={requiereMetodoPago ? "Seleccionar metodo de pago" : "Opcional mientras este pendiente"} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Transferencia">Transferencia</SelectItem>
										<SelectItem value="tarjeta">Tarjeta</SelectItem>
										<SelectItem value="paypal">PayPal</SelectItem>
										<SelectItem value="Binance/Crypto">Binance/Crypto</SelectItem>
									</SelectContent>
								</Select>
								<p className="text-xs text-zinc-500">
									{requiereMetodoPago
										? "Obligatorio cuando la venta esta pagada."
										: "Opcional mientras la venta siga pendiente."}
								</p>
							</div>
						</div>
					</section>

					<section className="rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/95">
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
							licenciasCliente={licenciasCliente}
							onDetallesChange={onDetallesChange}
							onFormChange={onFormChange}
							onFormClose={onFormClose}
							onAddClick={onAddClick}
							onEditClick={onEditClick}
							onDeleteClick={onDeleteClick}
						/>
					</section>

					<section className="rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/95">
						<div className="mb-4">
							<h2 className="font-semibold">Notas adicionales</h2>
							<p className="text-sm text-zinc-500">Observaciones internas de la venta.</p>
						</div>
						<Textarea
							value={ventaForm.Not_Ven}
							onChange={(event) => onVentaFormChange((prev) => ({ ...prev, Not_Ven: event.target.value }))}
							placeholder="Observaciones internas de la venta..."
							className="min-h-28"
						/>
					</section>
				</div>

				<aside className="rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/95 lg:sticky lg:top-6">
					<div className="space-y-4">
						<div>
							<h2 className="font-semibold">Resumen de venta</h2>
							<p className="mt-1 text-sm text-zinc-500">Estado general y validaciones antes de crear la venta.</p>
						</div>

						<div className="space-y-3 text-sm">
							<div className="rounded-xl border p-3">
								<p className="text-xs text-zinc-500">Cliente / Revendedor</p>
								<p className="mt-1 font-medium">
									{selectedCliente
										? `${selectedCliente.Nom_Cli || ""} ${selectedCliente.Ape_Cli || ""}`.trim()
										: selectedRevendedor
											? `${selectedRevendedor.Nom_Rev || ""} ${selectedRevendedor.Ape_Rev || ""}`.trim()
											: "Sin seleccionar"}
								</p>
							</div>
							<div className="rounded-xl border p-3">
								<p className="text-xs text-zinc-500">Productos</p>
								<p className="mt-1 font-medium">{detallesTemporales.length} producto{detallesTemporales.length === 1 ? "" : "s"}</p>
								{detallesTemporales.length > 0 ? (
									<p className="mt-0.5 text-xs text-zinc-500">
										{renovacionesCount > 0 ? `${renovacionesCount} renovacion${renovacionesCount === 1 ? "" : "es"}` : null}
										{renovacionesCount > 0 && nuevasCount > 0 ? ", " : ""}
										{nuevasCount > 0 ? `${nuevasCount} nueva${nuevasCount === 1 ? "" : "s"}` : null}
									</p>
								) : null}
							</div>
						</div>

						<div className="rounded-xl border p-4 text-sm">
							<div className="mb-3 grid gap-3">
								<div className="space-y-2">
									<Label>Descuento total</Label>
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
										<Label>Impuesto total</Label>
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
							<div className="flex items-center justify-between py-1">
								<span className="text-zinc-500">Subtotal</span>
								<span>{formatCurrency(ventaTotals.sub)}</span>
							</div>
							<div className="flex items-center justify-between py-1">
								<span className="text-zinc-500">Descuento total</span>
								<span>{formatCurrency(ventaTotals.des)}</span>
							</div>
							{impuestoHabilitado ? (
								<div className="flex items-center justify-between py-1">
									<span className="text-zinc-500">Impuesto total</span>
									<span>{formatCurrency(ventaTotals.imp)}</span>
								</div>
							) : null}
							<div className="mt-2 flex items-center justify-between border-t pt-3 text-base font-semibold">
								<span>Total</span>
								<span>{formatCurrency(ventaTotals.total)}</span>
							</div>
						</div>

						<div className="rounded-xl border p-3 text-sm">
							<p className="text-xs text-zinc-500">Estado</p>
							<p className="mt-1 font-medium">
								{ventaForm.Est_Ven === "completada"
									? "Completada"
									: ventaForm.Est_Ven === "cancelada"
										? "Cancelada"
										: ventaForm.Est_Ven === "reembolsada"
											? "Reembolsada"
										: "Pendiente"}
							</p>
						</div>

						<div className="space-y-2">
							<Button type="submit" className="w-full" disabled={!canSubmit || saving}>
								{saving ? "Guardando..." : "Crear venta"}
							</Button>
							<Button type="button" variant="outline" className="w-full" onClick={onClearDraftClick}>
								Eliminar borrador
							</Button>
						</div>

						{validationMessages.length > 0 ? (
							<div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
								{validationMessages.map((message) => (
									<p key={message}>{message}</p>
								))}
							</div>
						) : (
							<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
								La venta esta lista para crearse.
							</div>
						)}
					</div>
				</aside>
					</form>
				</div>
			</section>
		</div>
	);
}
