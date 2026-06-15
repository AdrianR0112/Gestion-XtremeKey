import { useEffect } from "react";
import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";

export default function DetalleCompraForm({
	mode,
	form,
	setForm,
	formValido,
	onSubmit,
	onCancel,
	compras = [],
	productos = [],
	variantes = [],
}) {
	useEffect(() => {
		if (form.Can_Dco > 0 && form.Pre_Uni_Dco > 0 && form.Sub_Tot_Dco === 0) {
			setForm((prev) => ({
				...prev,
				Sub_Tot_Dco: prev.Can_Dco * prev.Pre_Uni_Dco,
			}));
		}
	}, [form.Can_Dco, form.Pre_Uni_Dco, form.Sub_Tot_Dco, setForm]);

	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			<FormSection title="Relación de compra" description="Vincula el detalle con la compra y el producto correspondiente.">
			<div className="space-y-2">
				<Label>Compra</Label>
				<Select value={form.Id_Com?.toString() || ""} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Com: parseInt(value) }))}>
					<SelectTrigger>
						<SelectValue placeholder="Seleccionar compra" />
					</SelectTrigger>
					<SelectContent>
						{compras.map((c) => (
							<SelectItem key={c.Id_Com} value={c.Id_Com?.toString()}>
								{c.Id_Com}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Producto (Opcional)</Label>
					<Select value={form.Id_Prd?.toString() || ""} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Prd: value ? parseInt(value) : null }))}>
						<SelectTrigger>
							<SelectValue placeholder="Seleccionar producto" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Sin producto</SelectItem>
							{productos.map((p) => (
								<SelectItem key={p.Id_Prd} value={p.Id_Prd?.toString()}>
									{p.Nom_Prd}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Variante (Opcional)</Label>
					<Select value={form.Id_Var?.toString() || ""} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Var: value ? parseInt(value) : null }))}>
						<SelectTrigger>
							<SelectValue placeholder="Seleccionar variante" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Sin variante</SelectItem>
							{variantes.map((v) => (
								<SelectItem key={v.Id_Var} value={v.Id_Var?.toString()}>
									{v.Nom_Var}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			</FormSection>

			<FormSection title="Valores" description="Define cantidad, precio unitario y subtotal del detalle.">
			<div className="grid sm:grid-cols-3 gap-3">
				<div className="space-y-2">
					<Label>Cantidad</Label>
					<Input
						type="number"
						step="1"
						min="1"
						value={form.Can_Dco}
						onChange={(e) => setForm((prev) => ({ ...prev, Can_Dco: e.target.value }))}
						placeholder="1"
					/>
				</div>

				<div className="space-y-2">
					<Label>Precio Unitario</Label>
					<Input
						type="number"
						step="0.01"
						min="0"
						value={form.Pre_Uni_Dco}
						onChange={(e) => setForm((prev) => ({ ...prev, Pre_Uni_Dco: e.target.value }))}
						placeholder="0.00"
					/>
				</div>

				<div className="space-y-2">
					<Label>Subtotal</Label>
					<Input
						type="number"
						step="0.01"
						min="0"
						value={form.Sub_Tot_Dco}
						onChange={(e) => setForm((prev) => ({ ...prev, Sub_Tot_Dco: e.target.value }))}
						placeholder="0.00"
					/>
				</div>
			</div>
			</FormSection>

			<FormSection title="Notas" description="Agrega contexto adicional si es necesario.">
			<div className="space-y-2">
				<Label>Notas (Opcional)</Label>
				<Textarea
					value={form.Not_Dco}
					onChange={(e) => setForm((prev) => ({ ...prev, Not_Dco: e.target.value }))}
					placeholder="Notas adicionales sobre el detalle..."
					rows={3}
				/>
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex gap-2 border-t bg-background px-6 py-4">
				<Button type="submit" disabled={!formValido}>
					{mode === "create" ? "Crear detalle" : "Guardar cambios"}
				</Button>
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
