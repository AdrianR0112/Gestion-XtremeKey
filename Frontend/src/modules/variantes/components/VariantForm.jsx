import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { ESTADOS_VARIANTE, TIPOS_DURACION_VARIANTE, validateVariantForm } from "../schemas/variant.schema";

export default function VariantForm({ form = {}, productos = [], onFormChange = () => {}, onSubmit = () => {}, onCancel = () => {}, isValid = false, isLoading = false }) {
	const handleChange = (field, value) => {
		onFormChange({ ...form, [field]: value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (isValid) {
			onSubmit(event);
		}
	};

	const fieldErrors = validateVariantForm(form);

	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={handleSubmit}>
			<FormSection title="Identificación" description="Producto base, nombre y estado de la variante.">
			<div className="space-y-2">
				<Label htmlFor="Id_Prd">Producto *</Label>
				<Select value={form.Id_Prd ? String(form.Id_Prd) : "placeholder"} onValueChange={(value) => handleChange("Id_Prd", value)}>
					<SelectTrigger id="Id_Prd" className={fieldErrors.Id_Prd ? "border-red-500" : ""}>
						<SelectValue placeholder="Selecciona un producto" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="placeholder" disabled>
							Selecciona un producto
						</SelectItem>
						{productos.map((producto) => (
							<SelectItem key={producto.Id_Prd} value={String(producto.Id_Prd)}>
								{producto.Nom_Prd}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{fieldErrors.Id_Prd && <p className="text-xs text-red-500 mt-1">{fieldErrors.Id_Prd}</p>}
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Nom_Var">Nombre *</Label>
					<Input id="Nom_Var" value={form.Nom_Var || ""} onChange={(event) => handleChange("Nom_Var", event.target.value)} placeholder="Nombre de la variante" className={fieldErrors.Nom_Var ? "border-red-500" : ""} />
					{fieldErrors.Nom_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Nom_Var}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor="Est_Var">Estado</Label>
					<Select value={form.Est_Var || "activo"} onValueChange={(value) => handleChange("Est_Var", value)}>
						<SelectTrigger id="Est_Var" className={fieldErrors.Est_Var ? "border-red-500" : ""}>
							<SelectValue placeholder="Selecciona estado" />
						</SelectTrigger>
						<SelectContent>
							{ESTADOS_VARIANTE.map((estado) => (
								<SelectItem key={estado} value={estado}>
									{estado}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{fieldErrors.Est_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Est_Var}</p>}
				</div>
			</div>
			</FormSection>

			<FormSection title="Precios" description="Valores comerciales y de reventa de la variante.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Pre_Cos_Var">Precio Costo *</Label>
					<Input id="Pre_Cos_Var" type="number" min="0" step="0.01" value={form.Pre_Cos_Var || ""} onChange={(event) => handleChange("Pre_Cos_Var", event.target.value)} placeholder="0.00" className={fieldErrors.Pre_Cos_Var ? "border-red-500" : ""} />
					{fieldErrors.Pre_Cos_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Pre_Cos_Var}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor="Pre_Ven_Var">Precio Venta *</Label>
					<Input id="Pre_Ven_Var" type="number" min="0" step="0.01" value={form.Pre_Ven_Var || ""} onChange={(event) => handleChange("Pre_Ven_Var", event.target.value)} placeholder="0.00" className={fieldErrors.Pre_Ven_Var ? "border-red-500" : ""} />
					{fieldErrors.Pre_Ven_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Pre_Ven_Var}</p>}
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Pre_Rev_Var">Precio Revendedor (Opcional)</Label>
					<Input id="Pre_Rev_Var" type="number" min="0" step="0.01" value={form.Pre_Rev_Var || ""} onChange={(event) => handleChange("Pre_Rev_Var", event.target.value)} placeholder="0.00" className={fieldErrors.Pre_Rev_Var ? "border-red-500" : ""} />
					{fieldErrors.Pre_Rev_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Pre_Rev_Var}</p>}
				</div>
				<div />
			</div>
			</FormSection>

			<FormSection title="Capacidad y duración" description="Configura vigencia y límites de uso.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Dur_Tip_Var">Duración tipo (Opcional)</Label>
					<Select value={form.Dur_Tip_Var || "placeholder"} onValueChange={(value) => handleChange("Dur_Tip_Var", value === "placeholder" ? "" : value)}>
						<SelectTrigger id="Dur_Tip_Var" className={fieldErrors.Dur_Tip_Var ? "border-red-500" : ""}>
							<SelectValue placeholder="Sin duración" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="placeholder">Sin duración</SelectItem>
							{TIPOS_DURACION_VARIANTE.map((tipo) => (
								<SelectItem key={tipo} value={tipo}>
									{tipo}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{fieldErrors.Dur_Tip_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Dur_Tip_Var}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor="Dur_Val_Var">Duración valor (Opcional)</Label>
					<Input id="Dur_Val_Var" type="number" min="1" value={form.Dur_Val_Var || ""} onChange={(event) => handleChange("Dur_Val_Var", event.target.value)} placeholder="Valor" className={fieldErrors.Dur_Val_Var ? "border-red-500" : ""} />
					{fieldErrors.Dur_Val_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Dur_Val_Var}</p>}
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Max_Usu_Var">Máx. Usuarios (Opcional)</Label>
					<Input id="Max_Usu_Var" type="number" min="1" value={form.Max_Usu_Var || ""} onChange={(event) => handleChange("Max_Usu_Var", event.target.value)} placeholder="Número de usuarios" className={fieldErrors.Max_Usu_Var ? "border-red-500" : ""} />
					{fieldErrors.Max_Usu_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Max_Usu_Var}</p>}
				</div>
				<div />
			</div>
			</FormSection>

			<FormSection title="Notificaciones de vencimiento" description="Define si esta variante debe disparar avisos automáticos al cliente.">
				<div className="space-y-3">
					<label className="flex items-start gap-3 rounded-lg border p-3">
						<input
							id="Not_Ven_Cor_Var"
							type="checkbox"
							checked={!!form.Not_Ven_Cor_Var}
							onChange={(event) => handleChange("Not_Ven_Cor_Var", event.target.checked)}
							className="mt-1"
						/>
						<div>
							<Label htmlFor="Not_Ven_Cor_Var">Enviar mensajes de vencimiento por correo</Label>
							<p className="text-xs text-muted-foreground mt-1">Desactívalo cuando el correo entregado sea uno administrado por ustedes y no por el cliente final.</p>
						</div>
					</label>

					<label className="flex items-start gap-3 rounded-lg border p-3">
						<input
							id="Not_Ven_Wsp_Var"
							type="checkbox"
							checked={!!form.Not_Ven_Wsp_Var}
							onChange={(event) => handleChange("Not_Ven_Wsp_Var", event.target.checked)}
							className="mt-1"
						/>
						<div>
							<Label htmlFor="Not_Ven_Wsp_Var">Enviar mensajes de vencimiento por WhatsApp</Label>
							<p className="text-xs text-muted-foreground mt-1">Úsalo para controlar si esta variante participa en recordatorios automáticos por WhatsApp.</p>
						</div>
					</label>
				</div>
			</FormSection>

			<FormSection title="Descripción técnica" description="Detalles visibles y atributos estructurados.">
			<div className="space-y-2">
				<Label htmlFor="Des_Var">Descripción (Opcional)</Label>
				<Textarea id="Des_Var" value={form.Des_Var || ""} onChange={(event) => handleChange("Des_Var", event.target.value)} placeholder="Descripción de la variante" rows={4} />
			</div>

			<div className="space-y-2">
				<Label htmlFor="Atr_Var">Atributos (JSON opcional)</Label>
				<Textarea id="Atr_Var" value={form.Atr_Var || ""} onChange={(event) => handleChange("Atr_Var", event.target.value)} placeholder='{"color":"rojo","talla":"M"}' rows={5} className={fieldErrors.Atr_Var ? "border-red-500" : ""} />
				{fieldErrors.Atr_Var && <p className="text-xs text-red-500 mt-1">{fieldErrors.Atr_Var}</p>}
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex flex-col-reverse gap-2 border-t bg-background px-6 py-4 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!isValid || isLoading}>
					{isLoading ? "Guardando..." : "Guardar"}
				</Button>
			</div>
		</form>
	);
}
