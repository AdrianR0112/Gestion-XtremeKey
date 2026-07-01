import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function UsuarioForm({
	mode,
	form,
	setForm,
	formErrors,
	formValido,
	usuarioSeleccionado,
	saving,
	onSubmit,
	onCancel,
	onConfirmDelete,
}) {
	if (mode === "delete") {
		return (
			<div className="space-y-4 px-6 pb-6">
				<p className="text-sm text-zinc-600 dark:text-zinc-300">
					Se eliminara la cuenta staff <strong>{`${usuarioSeleccionado?.Nom_Usu || ""} ${usuarioSeleccionado?.Ape_Usu || ""}`.trim() || "-"}</strong>.
				</p>
				<div className="flex items-center justify-end gap-2">
					<Button variant="outline" onClick={onCancel} disabled={saving}>
						Cancelar
					</Button>
					<Button variant="destructive" onClick={onConfirmDelete} disabled={saving}>
						{saving ? "Eliminando..." : "Eliminar"}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} className="space-y-5 px-6 pb-6">
			<FormSection title="Identidad" description="Datos basicos de la cuenta staff dentro del sistema.">
			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label htmlFor="Nom_Usu">Nombre</Label>
					<Input
						id="Nom_Usu"
						value={form.Nom_Usu}
						onChange={(event) => setForm((prev) => ({ ...prev, Nom_Usu: event.target.value }))}
					/>
					{formErrors.Nom_Usu ? <p className="text-xs text-red-600">{formErrors.Nom_Usu}</p> : null}
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="Ape_Usu">Apellido</Label>
					<Input
						id="Ape_Usu"
						value={form.Ape_Usu}
						onChange={(event) => setForm((prev) => ({ ...prev, Ape_Usu: event.target.value }))}
					/>
					{formErrors.Ape_Usu ? <p className="text-xs text-red-600">{formErrors.Ape_Usu}</p> : null}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="Ema_Usu">Correo</Label>
				<Input
					id="Ema_Usu"
					type="email"
					value={form.Ema_Usu}
					onChange={(event) => setForm((prev) => ({ ...prev, Ema_Usu: event.target.value }))}
				/>
				{formErrors.Ema_Usu ? <p className="text-xs text-red-600">{formErrors.Ema_Usu}</p> : null}
			</div>
			</FormSection>

			<FormSection title="Acceso y permisos" description="Controla credenciales y estado del staff.">
			<div className="space-y-1.5">
				<Label htmlFor="Pas_Usu">Contrasena {mode === "edit" ? "(opcional)" : ""}</Label>
				<Input
					id="Pas_Usu"
					type="password"
					value={form.Pas_Usu}
					onChange={(event) => setForm((prev) => ({ ...prev, Pas_Usu: event.target.value }))}
					placeholder={mode === "edit" ? "Dejar en blanco para no cambiar" : "Minimo 6 caracteres"}
				/>
				{formErrors.Pas_Usu ? <p className="text-xs text-red-600">{formErrors.Pas_Usu}</p> : null}
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label htmlFor="Tel_Usu">Telefono</Label>
					<Input
						id="Tel_Usu"
						value={form.Tel_Usu}
						onChange={(event) => setForm((prev) => ({ ...prev, Tel_Usu: event.target.value }))}
					/>
				</div>
				<div className="space-y-1.5">
					<Label>Rol</Label>
					<Select
						value={form.Rol_Usu}
						onValueChange={(value) => setForm((prev) => ({ ...prev, Rol_Usu: value }))}
					>
						<SelectTrigger>
							<SelectValue placeholder="Rol" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="admin">admin</SelectItem>
							<SelectItem value="vendedor">vendedor</SelectItem>
						</SelectContent>
					</Select>
					{formErrors.Rol_Usu ? <p className="text-xs text-red-600">{formErrors.Rol_Usu}</p> : null}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label>Estado</Label>
				<Select
					value={form.Est_Usu}
					onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Usu: value }))}
				>
					<SelectTrigger>
						<SelectValue placeholder="Estado" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="activo">activo</SelectItem>
						<SelectItem value="inactivo">inactivo</SelectItem>
						<SelectItem value="bloqueado">bloqueado</SelectItem>
					</SelectContent>
				</Select>
				{formErrors.Est_Usu ? <p className="text-xs text-red-600">{formErrors.Est_Usu}</p> : null}
			</div>
			</FormSection>

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido || saving}>
					{saving ? "Guardando..." : mode === "create" ? "Crear" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
