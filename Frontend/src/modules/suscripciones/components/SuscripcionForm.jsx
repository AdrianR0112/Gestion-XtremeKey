import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { validateSuscripcionForm } from "../schemas/suscripcion.schema";

export default function SuscripcionForm({
	mode,
	form,
	setForm,
	formValido,
	clientes,
	revendedores,
	productosSuscripcion,
	variantesDelProducto,
	onSubmit,
	onCancel,
}) {
	const isEdit = mode === "edit";
	const esRevendedor = form.Tip_Tit === "revendedor";
	const formErrors = validateSuscripcionForm(form);
	const clienteActual = clientes.find((cliente) => Number(cliente.Id_Cli) === Number(form.Id_Cli)) || null;
	const revendedorActual = revendedores.find((revendedor) => Number(revendedor.Id_Rev) === Number(form.Id_Rev)) || null;
	const productoActual = productosSuscripcion.find((producto) => Number(producto.Id_Prd) === Number(form.Id_Prd)) || null;

	// El titular es excluyente: al cambiar de tipo se limpia el campo contrario.
	const cambiarTipoTitular = (tipo) =>
		setForm((prev) => ({ ...prev, Tip_Tit: tipo, Id_Cli: tipo === "cliente" ? prev.Id_Cli : "", Id_Rev: tipo === "revendedor" ? prev.Id_Rev : "" }));

	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			<FormSection
				title="Titular y plan"
				description={
					isEdit
						? "El plan de una suscripción existente no puede cambiarse."
						: "La suscripción pertenece a un cliente final o a un revendedor."
				}
			>
				{isEdit ? (
					<div className="grid sm:grid-cols-2 gap-3">
						<div className="rounded-md border p-3">
							<p className="text-xs text-zinc-500">{esRevendedor ? "Revendedor" : "Cliente"}</p>
							<p className="font-medium mt-1">
								{esRevendedor
									? revendedorActual
										? `${revendedorActual.Nom_Rev || ""} ${revendedorActual.Ape_Rev || ""}`.trim()
										: `#${form.Id_Rev}`
									: clienteActual
										? `${clienteActual.Nom_Cli || ""} ${clienteActual.Ape_Cli || ""}`.trim()
										: `#${form.Id_Cli}`}
							</p>
						</div>
						<div className="rounded-md border p-3">
							<p className="text-xs text-zinc-500">Producto</p>
							<p className="font-medium mt-1">{productoActual?.Nom_Prd || `#${form.Id_Prd}`}</p>
						</div>
					</div>
				) : (
					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2 sm:col-span-2">
							<Label>Tipo de titular</Label>
							<div className="inline-flex rounded-lg border bg-muted/30 p-1">
								<Button
									type="button"
									size="sm"
									variant={!esRevendedor ? "default" : "ghost"}
									className="h-8"
									onClick={() => cambiarTipoTitular("cliente")}
								>
									Cliente
								</Button>
								<Button
									type="button"
									size="sm"
									variant={esRevendedor ? "default" : "ghost"}
									className="h-8"
									onClick={() => cambiarTipoTitular("revendedor")}
								>
									Revendedor
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							<Label>{esRevendedor ? "Revendedor" : "Cliente"}</Label>
							{esRevendedor ? (
								<Select
									value={form.Id_Rev ? String(form.Id_Rev) : ""}
									onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Rev: value }))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar revendedor..." />
									</SelectTrigger>
									<SelectContent>
										{revendedores.map((revendedor) => (
											<SelectItem key={revendedor.Id_Rev} value={String(revendedor.Id_Rev)}>
												{`${revendedor.Nom_Rev || ""} ${revendedor.Ape_Rev || ""}`.trim() || `#${revendedor.Id_Rev}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<Select
									value={form.Id_Cli ? String(form.Id_Cli) : ""}
									onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Cli: value }))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar cliente..." />
									</SelectTrigger>
									<SelectContent>
										{clientes.map((cliente) => (
											<SelectItem key={cliente.Id_Cli} value={String(cliente.Id_Cli)}>
												{`${cliente.Nom_Cli || ""} ${cliente.Ape_Cli || ""}`.trim()}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>
						<div className="space-y-2">
							<Label>Producto</Label>
							<Select
								value={form.Id_Prd ? String(form.Id_Prd) : ""}
								onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Prd: value, Id_Var: "" }))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar producto..." />
								</SelectTrigger>
								<SelectContent>
									{productosSuscripcion.map((producto) => (
										<SelectItem key={producto.Id_Prd} value={String(producto.Id_Prd)}>
											{producto.Nom_Prd}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{variantesDelProducto.length > 0 ? (
							<div className="space-y-2 sm:col-span-2">
								<Label>Variante</Label>
								<Select
									value={form.Id_Var ? String(form.Id_Var) : ""}
									onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Var: value }))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar variante..." />
									</SelectTrigger>
									<SelectContent>
										{variantesDelProducto.map((variante) => (
											<SelectItem key={variante.Id_Var} value={String(variante.Id_Var)}>
												{variante.Nom_Var}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						) : null}
					</div>
				)}

				<div className="space-y-2">
					<Label>Cuenta del cliente final</Label>
					<Input
						type="email"
						value={form.Cor_Cue_Sus}
						placeholder="correo@dominio.com"
						onChange={(event) => setForm((prev) => ({ ...prev, Cor_Cue_Sus: event.target.value }))}
					/>
					<p className="text-xs text-zinc-500">
						{form.Tip_Tit === "revendedor"
							? "Correo del cliente del revendedor. Es lo que distingue esta suscripción de las demás del mismo revendedor."
							: "Correo donde se activó el servicio. Opcional."}
					</p>
					{formErrors?.Cor_Cue_Sus ? (
						<p className="text-xs text-red-600">{formErrors.Cor_Cue_Sus}</p>
					) : null}
				</div>
			</FormSection>

			<FormSection
				title="Vigencia"
				description="Si dejas la fecha de fin vacía, se calculará automáticamente según la duración de la variante."
			>
				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>Fecha de inicio</Label>
						<Input
							type="date"
							value={form.Fec_Ini_Sus || ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Fec_Ini_Sus: event.target.value }))}
						/>
					</div>
					<div className="space-y-2">
						<Label>Fecha de fin</Label>
						<Input
							type="date"
							value={form.Fec_Fin_Sus || ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Fec_Fin_Sus: event.target.value }))}
						/>
					</div>
				</div>
			</FormSection>

			<FormSection
				title="Estado y renovación"
				description="Controla el estado actual y si la suscripción se renueva automáticamente."
			>
				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>Estado</Label>
						<Select value={form.Est_Sus} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Sus: value }))}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="activa">Activa</SelectItem>
								<SelectItem value="suspendida">Suspendida</SelectItem>
								<SelectItem value="cancelada">Cancelada</SelectItem>
								<SelectItem value="expirada">Expirada</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Renovación automática</Label>
						<Select
							value={String(form.Ren_Auto)}
							onValueChange={(value) => setForm((prev) => ({ ...prev, Ren_Auto: value === "true" }))}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">Sí</SelectItem>
								<SelectItem value="false">No</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="space-y-2">
					<Label>Notas</Label>
					<Textarea
						value={form.Not_Sus}
						onChange={(event) => setForm((prev) => ({ ...prev, Not_Sus: event.target.value }))}
						placeholder="Observaciones internas sobre la suscripción"
					/>
				</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido}>
					{mode === "create" ? "Crear suscripción" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
