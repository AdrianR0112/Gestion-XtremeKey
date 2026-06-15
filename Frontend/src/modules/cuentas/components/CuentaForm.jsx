import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";

const NONE_VALUE = "__none__";

function toSelectValue(value) {
	if (value === null || value === undefined || value === "") return NONE_VALUE;
	return String(value);
}

function fromSelectValue(value) {
	return value === NONE_VALUE ? "" : value;
}

export default function CuentaForm({
	mode,
	form,
	setForm,
	formValido,
	productos,
	variantes,
	proveedores,
	onSubmit,
	onCancel,
}) {
	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			<FormSection title="Resumen de la cuenta" description="Estado general y relación principal de la cuenta.">
				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>Nombre de cuenta</Label>
						<Input
							value={form.Nom_Cue}
							onChange={(event) => setForm((prev) => ({ ...prev, Nom_Cue: event.target.value }))}
							placeholder="Netflix familiar"
						/>
					</div>
					<div className="space-y-2">
						<Label>Estado</Label>
						<Select value={form.Est_Cue || "disponible"} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Cue: value }))}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="disponible">Disponible</SelectItem>
								<SelectItem value="ocupada">Ocupada</SelectItem>
								<SelectItem value="parcial">Parcial</SelectItem>
								<SelectItem value="vencida">Vencida</SelectItem>
								<SelectItem value="suspendida">Suspendida</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid sm:grid-cols-3 gap-3">
					<div className="space-y-2">
						<Label>Producto</Label>
						<Select value={toSelectValue(form.Id_Prd)} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Prd: fromSelectValue(value) }))}>
							<SelectTrigger>
								<SelectValue placeholder="Opcional" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE_VALUE}>Sin producto</SelectItem>
								{productos.map((producto) => (
									<SelectItem key={producto.Id_Prd} value={String(producto.Id_Prd)}>
										{producto.Nom_Prd || `Producto #${producto.Id_Prd}`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Variante</Label>
						<Select value={toSelectValue(form.Id_Var)} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Var: fromSelectValue(value) }))}>
							<SelectTrigger>
								<SelectValue placeholder="Opcional" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE_VALUE}>Sin variante</SelectItem>
								{variantes.map((variante) => (
									<SelectItem key={variante.Id_Var} value={String(variante.Id_Var)}>
										{variante.Nom_Var || `Variante #${variante.Id_Var}`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Proveedor</Label>
						<Select value={toSelectValue(form.Id_Pro)} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Pro: fromSelectValue(value) }))}>
							<SelectTrigger>
								<SelectValue placeholder="Opcional" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE_VALUE}>Sin proveedor</SelectItem>
								{proveedores.map((proveedor) => (
									<SelectItem key={proveedor.Id_Pro} value={String(proveedor.Id_Pro)}>
										{proveedor.Nom_Pro || `Proveedor #${proveedor.Id_Pro}`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</FormSection>

			<FormSection title="Credenciales" description="Accesos y perfiles asociados a la cuenta.">
				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>Usuario</Label>
						<Input
							value={form.Usu_Cue || ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Usu_Cue: event.target.value }))}
							placeholder="correo@dominio.com"
						/>
					</div>
					<div className="space-y-2">
						<Label>Contrasena</Label>
						<Input
							value={form.Pas_Cue || ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Pas_Cue: event.target.value }))}
							placeholder="Opcional"
						/>
					</div>
				</div>

				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>PIN</Label>
						<Input
							value={form.Pin_Cue || ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Pin_Cue: event.target.value }))}
							placeholder="Opcional"
						/>
					</div>
					<div className="space-y-2">
						<Label>Perfil</Label>
						<Input
							value={form.Per_Cue || ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Per_Cue: event.target.value }))}
							placeholder="Perfil principal"
						/>
					</div>
				</div>
			</FormSection>

			<FormSection title="Capacidad y costos" description="Controla disponibilidad y valores de la cuenta.">
				<div className="grid sm:grid-cols-3 gap-3">
					<div className="space-y-2">
						<Label>Total perfiles</Label>
						<Input
							type="number"
							min="0"
							value={form.Tot_Per_Cue ?? ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Tot_Per_Cue: event.target.value }))}
							placeholder="0"
						/>
					</div>
					<div className="space-y-2">
						<Label>Perfiles disponibles</Label>
						<Input
							type="number"
							min="0"
							value={form.Per_Dis_Cue ?? ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Per_Dis_Cue: event.target.value }))}
							placeholder="0"
						/>
					</div>
					<div className="space-y-2">
						<Label>Costo</Label>
						<Input
							type="number"
							min="0"
							step="0.01"
							value={form.Cos_Cue ?? ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Cos_Cue: event.target.value }))}
							placeholder="0.00"
						/>
					</div>
				</div>
			</FormSection>

			<FormSection title="Vigencia y notas" description="Fechas relevantes y observaciones internas.">
				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>Fecha de compra</Label>
						<Input
							type="date"
							value={form.Fec_Com_Cue ? String(form.Fec_Com_Cue).slice(0, 10) : ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Fec_Com_Cue: event.target.value }))}
						/>
					</div>
					<div className="space-y-2">
						<Label>Fecha de vencimiento</Label>
						<Input
							type="date"
							value={form.Fec_Ven_Cue ? String(form.Fec_Ven_Cue).slice(0, 10) : ""}
							onChange={(event) => setForm((prev) => ({ ...prev, Fec_Ven_Cue: event.target.value }))}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Notas</Label>
					<Textarea
						value={form.Not_Cue || ""}
						onChange={(event) => setForm((prev) => ({ ...prev, Not_Cue: event.target.value }))}
						placeholder="Observaciones de la cuenta"
					/>
				</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido}>
					{mode === "create" ? "Crear cuenta" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
