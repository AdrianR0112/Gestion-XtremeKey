import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";

export default function RevendedorForm({
	mode,
	form,
	setForm,
	formValido,
	onSubmit,
	onCancel,
}) {
	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			<FormSection title="Informacion del revendedor" description="Datos personales y de contacto del revendedor.">
				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>Nombre</Label>
						<Input
							value={form.Nom_Rev}
							onChange={(event) => setForm((prev) => ({ ...prev, Nom_Rev: event.target.value }))}
							placeholder="Nombre del revendedor"
						/>
					</div>
					<div className="space-y-2">
						<Label>Apellido</Label>
						<Input
							value={form.Ape_Rev}
							onChange={(event) => setForm((prev) => ({ ...prev, Ape_Rev: event.target.value }))}
							placeholder="Apellido del revendedor"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Telefono *</Label>
					<Input
						value={form.Tel_Rev}
						onChange={(event) => setForm((prev) => ({ ...prev, Tel_Rev: event.target.value }))}
						placeholder="+57 300 000 0000"
					/>
				</div>

				<div className="space-y-2">
					<Label>Correo</Label>
					<Input
						type="email"
						value={form.Ema_Rev}
						onChange={(event) => setForm((prev) => ({ ...prev, Ema_Rev: event.target.value }))}
						placeholder="correo@empresa.com"
					/>
				</div>

				<div className="grid sm:grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label>Documento</Label>
						<Input
							value={form.Doc_Rev}
							onChange={(event) => setForm((prev) => ({ ...prev, Doc_Rev: event.target.value }))}
							placeholder="Cedula o RUC"
						/>
					</div>
					<div className="space-y-2">
						<Label>Estado</Label>
						<Select value={form.Est_Rev} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Rev: value }))}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="activo">Activo</SelectItem>
								<SelectItem value="inactivo">Inactivo</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Notas</Label>
					<Textarea
						value={form.Not_Rev}
						onChange={(event) => setForm((prev) => ({ ...prev, Not_Rev: event.target.value }))}
						placeholder="Observaciones internas"
					/>
				</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido}>
					{mode === "create" ? "Crear revendedor" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
