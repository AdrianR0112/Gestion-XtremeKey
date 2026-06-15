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

export default function ProveedorForm({
	mode,
	form,
	setForm,
	formValido,
	saving,
	onSubmit,
	onCancel,
}) {
	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			<FormSection title="Perfil del proveedor" description="Información comercial base del proveedor.">
			<div className="space-y-2">
				<Label>Nombre del proveedor</Label>
				<Input
					value={form.Nom_Pro}
					onChange={(event) => setForm((prev) => ({ ...prev, Nom_Pro: event.target.value }))}
					placeholder="Nombre comercial"
				/>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Tipo</Label>
					<Select value={form.Tip_Pro} onValueChange={(value) => setForm((prev) => ({ ...prev, Tip_Pro: value }))}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="persona">Persona</SelectItem>
							<SelectItem value="empresa">Empresa</SelectItem>
							<SelectItem value="plataforma">Plataforma</SelectItem>
							<SelectItem value="tienda_web">Tienda web</SelectItem>
							<SelectItem value="otro">Otro</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>Estado</Label>
					<Select value={form.Est_Pro} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Pro: value }))}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="activo">Activo</SelectItem>
							<SelectItem value="inactivo">Inactivo</SelectItem>
							<SelectItem value="suspendido">Suspendido</SelectItem>
						</SelectContent>
				</Select>
			</div>
		</div>
			</FormSection>

			<FormSection title="Contacto" description="Canales para comunicarte con el proveedor.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Contacto principal</Label>
					<Input
						value={form.Con_Pri_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Con_Pri_Pro: event.target.value }))}
						placeholder="Nombre del contacto"
					/>
				</div>
				<div className="space-y-2">
					<Label>Telefono</Label>
					<Input
						value={form.Tel_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Tel_Pro: event.target.value }))}
						placeholder="Numero principal"
					/>
				</div>
			</div>
			</FormSection>

			<FormSection title="Condiciones y notas" description="Preferencias comerciales y observaciones internas.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>WhatsApp</Label>
					<Input
						value={form.Wha_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Wha_Pro: event.target.value }))}
						placeholder="Contacto WhatsApp"
					/>
				</div>
				<div className="space-y-2">
					<Label>Telegram</Label>
					<Input
						value={form.Tel_Gram_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Tel_Gram_Pro: event.target.value }))}
						placeholder="Usuario Telegram"
					/>
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Correo</Label>
					<Input
						type="email"
						value={form.Ema_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Ema_Pro: event.target.value }))}
						placeholder="contacto@proveedor.com"
					/>
				</div>
				<div className="space-y-2">
					<Label>Web</Label>
					<Input
						value={form.Web_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Web_Pro: event.target.value }))}
						placeholder="https://"
					/>
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Pais</Label>
					<Input
						value={form.Pai_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Pai_Pro: event.target.value }))}
						placeholder="Pais"
					/>
				</div>
				<div className="space-y-2">
					<Label>Medio de contacto preferido</Label>
					<Select
						value={form.Med_Con_Pro}
						onValueChange={(value) => setForm((prev) => ({ ...prev, Med_Con_Pro: value }))}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="whatsapp">WhatsApp</SelectItem>
							<SelectItem value="telegram">Telegram</SelectItem>
							<SelectItem value="web">Web</SelectItem>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="telefono">Telefono</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label>Condicion comercial</Label>
					<Input
						value={form.Con_Com_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Con_Com_Pro: event.target.value }))}
					placeholder="Terminos"
				/>
			</div>
				<div className="space-y-2">
					<Label>Calificacion (1-5)</Label>
					<Input
						type="number"
						min={1}
						max={5}
						step={1}
						value={form.Cal_Pro}
						onChange={(event) => setForm((prev) => ({ ...prev, Cal_Pro: event.target.value }))}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label>Notas</Label>
				<Textarea
					value={form.Not_Pro}
					onChange={(event) => setForm((prev) => ({ ...prev, Not_Pro: event.target.value }))}
					placeholder="Notas internas del proveedor"
				/>
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido || saving}>
					{saving ? "Guardando..." : mode === "create" ? "Crear proveedor" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
