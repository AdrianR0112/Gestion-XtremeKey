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

export default function KeyForm({
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
			<FormSection title="Clave y estado" description="Información principal de la key y su disponibilidad.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Clave</Label>
					<Input
						value={form.Cla_Key || ""}
						onChange={(event) => setForm((prev) => ({ ...prev, Cla_Key: event.target.value }))}
						placeholder="XXXXX-XXXXX-XXXXX"
					/>
				</div>
				<div className="space-y-2">
					<Label>Por vida</Label>
					<Select
						value={String(Boolean(form.Es_Per_Vid_Key))}
						onValueChange={(value) => setForm((prev) => ({ ...prev, Es_Per_Vid_Key: value === "true" }))}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="false">No</SelectItem>
							<SelectItem value="true">Si</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Estado</Label>
					<Select value={form.Est_Key || "disponible"} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Key: value }))}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="disponible">Disponible</SelectItem>
							<SelectItem value="vendida">Vendida</SelectItem>
							<SelectItem value="reservada">Reservada</SelectItem>
							<SelectItem value="vencida">Vencida</SelectItem>
							<SelectItem value="cancelada">Cancelada</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>Descripcion</Label>
					<Input
						value={form.Des_Key || ""}
						onChange={(event) => setForm((prev) => ({ ...prev, Des_Key: event.target.value }))}
						placeholder="Resumen rapido de la key"
					/>
				</div>
			</div>
			</FormSection>

			<FormSection title="Relaciones" description="Asocia la key con producto, variante y proveedor si aplica.">
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

			<FormSection title="Fechas y valores" description="Controla vigencia y márgenes comerciales.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Fecha de compra</Label>
					<Input
						type="date"
						value={form.Fec_Com_Key ? String(form.Fec_Com_Key).slice(0, 10) : ""}
						onChange={(event) => setForm((prev) => ({ ...prev, Fec_Com_Key: event.target.value }))}
					/>
				</div>
				<div className="space-y-2">
					<Label>Fecha de vencimiento</Label>
					<Input
						type="date"
						value={form.Fec_Ven_Key ? String(form.Fec_Ven_Key).slice(0, 10) : ""}
						onChange={(event) => setForm((prev) => ({ ...prev, Fec_Ven_Key: event.target.value }))}
					/>
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Costo</Label>
					<Input
						type="number"
						min="0"
						step="0.01"
						value={form.Cos_Key ?? ""}
						onChange={(event) => setForm((prev) => ({ ...prev, Cos_Key: event.target.value }))}
						placeholder="0.00"
					/>
				</div>
				<div className="space-y-2">
					<Label>Precio de venta</Label>
					<Input
						type="number"
						min="0"
						step="0.01"
						value={form.Pre_Ven_Key ?? ""}
						onChange={(event) => setForm((prev) => ({ ...prev, Pre_Ven_Key: event.target.value }))}
						placeholder="0.00"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label>Notas</Label>
				<Textarea
					value={form.Not_Key || ""}
					onChange={(event) => setForm((prev) => ({ ...prev, Not_Key: event.target.value }))}
					placeholder="Observaciones adicionales"
				/>
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido}>
					{mode === "create" ? "Crear key" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
