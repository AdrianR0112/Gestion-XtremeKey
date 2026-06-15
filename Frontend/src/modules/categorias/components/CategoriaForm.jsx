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

export default function CategoriaForm({ mode, form, setForm, formValido, saving, onSubmit, onCancel }) {
	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			<FormSection title="Datos generales" description="Define la identidad y descripción de la categoría.">
				<div className="space-y-2">
					<Label>Nombre de categoria</Label>
					<Input
						value={form.Nom_Cat}
						onChange={(event) => setForm((prev) => ({ ...prev, Nom_Cat: event.target.value }))}
						placeholder="Nombre de la categoria"
					/>
				</div>

				<div className="space-y-2">
					<Label>Descripcion</Label>
					<Textarea
						value={form.Des_Cat}
						onChange={(event) => setForm((prev) => ({ ...prev, Des_Cat: event.target.value }))}
						placeholder="Descripcion de la categoria"
					/>
				</div>
			</FormSection>

			<FormSection title="Configuración" description="Ajusta jerarquía, orden visual y estado.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>ID categoria padre</Label>
					<Input
						type="number"
						min={1}
						value={form.Id_Cat_Pad}
						onChange={(event) => setForm((prev) => ({ ...prev, Id_Cat_Pad: event.target.value }))}
						placeholder="Opcional"
					/>
				</div>
				<div className="space-y-2">
					<Label>Orden</Label>
					<Input
						type="number"
						value={form.Ord_Cat}
						onChange={(event) => setForm((prev) => ({ ...prev, Ord_Cat: event.target.value }))}
						placeholder="Orden de visualizacion"
					/>
				</div>
			</div>
			</FormSection>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Icono</Label>
					<Input
						value={form.Ico_Cat}
						onChange={(event) => setForm((prev) => ({ ...prev, Ico_Cat: event.target.value }))}
						placeholder="Nombre o codigo del icono"
					/>
				</div>
				<div className="space-y-2">
					<Label>Estado</Label>
					<Select value={form.Est_Cat} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Cat: value }))}>
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

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido || saving}>
					{saving ? "Guardando..." : mode === "create" ? "Crear categoria" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
