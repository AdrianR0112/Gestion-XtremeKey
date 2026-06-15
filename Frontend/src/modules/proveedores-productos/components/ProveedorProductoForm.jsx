import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";

export default function ProveedorProductoForm({
	form,
	setForm,
	productos = [],
	variantes = [],
	providerName = "",
	isEdit = false,
	saving = false,
	onSubmit = () => {},
	onCancel = () => {},
}) {
	const relacionValida = Boolean(form.Id_Prd) || Boolean(form.Id_Var);

	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			<FormSection title="Vinculación" description="Selecciona el proveedor y la referencia comercial a enlazar.">
			<div className="space-y-2">
				<Label>Proveedor</Label>
				<Input value={providerName || "Proveedor seleccionado"} disabled />
			</div>

			<div className="space-y-2">
				<Label>Producto (opcional)</Label>
				<Select value={form.Id_Prd || "placeholder"} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Prd: value === "placeholder" ? "" : value }))}>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona un producto" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="placeholder">
							Selecciona un producto
						</SelectItem>
						{productos.map((producto) => (
							<SelectItem key={producto.Id_Prd} value={String(producto.Id_Prd)}>
								{producto.Nom_Prd}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label>Variante (opcional)</Label>
				<Select value={form.Id_Var || "placeholder"} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Var: value === "placeholder" ? "" : value }))}>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona una variante" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="placeholder">Selecciona una variante</SelectItem>
						{variantes.map((variante) => (
							<SelectItem key={variante.Id_Var} value={String(variante.Id_Var)}>
								{variante.Nom_Var}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			</FormSection>

			{!relacionValida && (
				<p className="text-xs text-red-600">Debes seleccionar al menos un producto o una variante.</p>
			)}

			<FormSection title="Condiciones" description="Precio acordado y notas de la relación proveedor-producto.">
			<div className="space-y-2">
				<Label>Precio de compra</Label>
				<Input
					type="number"
					min="0"
					step="0.01"
					value={form.Pre_Com_Pro_Prd}
					onChange={(event) => setForm((prev) => ({ ...prev, Pre_Com_Pro_Prd: event.target.value }))}
					placeholder="0.00"
				/>
			</div>

			<div className="flex items-center gap-2">
				<input
					id="es-principal"
					type="checkbox"
					checked={!!form.Es_Pri_Pro_Prd}
					onChange={(event) => setForm((prev) => ({ ...prev, Es_Pri_Pro_Prd: event.target.checked }))}
				/>
				<Label htmlFor="es-principal">Marcar como proveedor principal de este producto</Label>
			</div>

			<div className="space-y-2">
				<Label>Notas</Label>
				<Textarea
					value={form.Not_Pro_Prd}
					onChange={(event) => setForm((prev) => ({ ...prev, Not_Pro_Prd: event.target.value }))}
					placeholder="Notas sobre la relación proveedor-producto"
				/>
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
					Cancelar
				</Button>
				<Button type="submit" disabled={saving || !relacionValida || !form.Id_Pro}>
					{saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear relación"}
				</Button>
			</div>
		</form>
	);
}
