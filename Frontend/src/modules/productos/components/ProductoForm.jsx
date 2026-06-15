import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { TIPOS_PRODUCTO, ESTADOS_PRODUCTO, validateProductoForm } from "../schemas/producto.schema";

export default function ProductoForm({ form = {}, onFormChange = () => {}, categoriasActivas = [], onSubmit = () => {}, onCancel = () => {}, isValid = false, isLoading = false }) {
	const handleChange = (field, value) => {
		onFormChange({ ...form, [field]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isValid) {
			onSubmit(e);
		}
	};

	const fieldErrors = validateProductoForm(form);

	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={handleSubmit}>
			<FormSection title="Identificación" description="Define nombre, código y clasificación del producto.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Cod_Prd">Código (Opcional)</Label>
					<Input
						id="Cod_Prd"
						type="text"
						value={form.Cod_Prd || ""}
						onChange={(e) => handleChange("Cod_Prd", e.target.value)}
						placeholder="Código único"
						className={fieldErrors.Cod_Prd ? "border-red-500" : ""}
					/>
					{fieldErrors.Cod_Prd && <p className="text-xs text-red-500 mt-1">{fieldErrors.Cod_Prd}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="Nom_Prd">Nombre *</Label>
					<Input
						id="Nom_Prd"
						type="text"
						value={form.Nom_Prd || ""}
						onChange={(e) => handleChange("Nom_Prd", e.target.value)}
						placeholder="Nombre del producto"
						className={fieldErrors.Nom_Prd ? "border-red-500" : ""}
					/>
					{fieldErrors.Nom_Prd && <p className="text-xs text-red-500 mt-1">{fieldErrors.Nom_Prd}</p>}
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Tip_Prd">Tipo (Opcional)</Label>
					<Select value={form.Tip_Prd || "producto"} onValueChange={(value) => handleChange("Tip_Prd", value)}>
						<SelectTrigger id="Tip_Prd">
							<SelectValue placeholder="Selecciona tipo..." />
						</SelectTrigger>
						<SelectContent>
							{TIPOS_PRODUCTO.map((tipo) => (
								<SelectItem key={tipo} value={tipo}>
									{tipo}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{fieldErrors.Tip_Prd && <p className="text-xs text-red-500 mt-1">{fieldErrors.Tip_Prd}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="Est_Prd">Estado (Opcional)</Label>
					<Select value={form.Est_Prd || "activo"} onValueChange={(value) => handleChange("Est_Prd", value)}>
						<SelectTrigger id="Est_Prd">
							<SelectValue placeholder="Selecciona estado..." />
						</SelectTrigger>
						<SelectContent>
							{ESTADOS_PRODUCTO.map((estado) => (
								<SelectItem key={estado} value={estado}>
									{estado}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{fieldErrors.Est_Prd && <p className="text-xs text-red-500 mt-1">{fieldErrors.Est_Prd}</p>}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="Id_Cat">Categoría (Opcional)</Label>
				<Select
					value={form.Id_Cat === null || form.Id_Cat === "" ? "none" : String(form.Id_Cat)}
					onValueChange={(value) => handleChange("Id_Cat", value === "none" ? "" : value)}
				>
					<SelectTrigger id="Id_Cat" className={fieldErrors.Id_Cat ? "border-red-500" : ""}>
						<SelectValue placeholder="Selecciona categoría" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">Sin categoría</SelectItem>
						{categoriasActivas.map((categoria) => (
							<SelectItem key={categoria.Id_Cat} value={String(categoria.Id_Cat)}>
								{categoria.Nom_Cat}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{fieldErrors.Id_Cat && <p className="text-xs text-red-500 mt-1">{fieldErrors.Id_Cat}</p>}
			</div>
			</FormSection>

			<FormSection title="Presentación" description="Recursos visuales y resumen comercial del producto.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="Ima_Prd">Imagen (Opcional)</Label>
					<Input
						id="Ima_Prd"
						type="text"
						value={form.Ima_Prd || ""}
						onChange={(e) => handleChange("Ima_Prd", e.target.value)}
						placeholder="Ruta o URL de imagen"
					/>
				</div>
				<div />
			</div>

			<div className="space-y-2">
				<Label htmlFor="Des_Cor_Prd">Descripción Corta (Opcional)</Label>
				<Input
					id="Des_Cor_Prd"
					type="text"
					value={form.Des_Cor_Prd || ""}
					onChange={(e) => handleChange("Des_Cor_Prd", e.target.value)}
					placeholder="Resumen del producto"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="Des_Prd">Descripción Detallada (Opcional)</Label>
				<Textarea
					id="Des_Prd"
					value={form.Des_Prd || ""}
					onChange={(e) => handleChange("Des_Prd", e.target.value)}
					placeholder="Descripción completa del producto"
					rows={4}
				/>
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
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
