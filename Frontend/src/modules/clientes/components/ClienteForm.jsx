import { useState } from "react";
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

export default function ClienteForm({
	mode,
	form,
	setForm,
	formValido,
	onSubmit,
	onCancel,
}) {
	const [formularioAvanzado, setFormularioAvanzado] = useState(mode === "edit");

	return (
		<form className="space-y-5 px-6 pb-6" onSubmit={onSubmit}>
			{/* Modo Básico: Solo teléfono y correo */}
			{!formularioAvanzado && (
				<FormSection title="Contacto rápido" description="Captura lo mínimo para registrar o editar el cliente rápidamente.">
					<div className="space-y-2">
						<Label>Teléfono</Label>
						<Input
							value={form.Tel_Cli}
							onChange={(event) => setForm((prev) => ({ ...prev, Tel_Cli: event.target.value }))}
							placeholder="+57 300 000 0000"
						/>
					</div>

					<div className="space-y-2">
						<Label>Correo</Label>
						<Input
							type="email"
							value={form.Ema_Cli}
							onChange={(event) => setForm((prev) => ({ ...prev, Ema_Cli: event.target.value }))}
							placeholder="correo@empresa.com"
						/>
					</div>

					<div className="flex items-center justify-between gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setFormularioAvanzado(true)}
						>
							Agregar más información
						</Button>
					</div>
				</FormSection>
			)}

			{/* Modo Avanzado: Todos los campos */}
			{formularioAvanzado && (
				<>
					<FormSection title="Identidad y contacto" description="Datos personales y canales principales de comunicación.">
					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Nombre</Label>
							<Input
								value={form.Nom_Cli}
								onChange={(event) => setForm((prev) => ({ ...prev, Nom_Cli: event.target.value }))}
								placeholder="Nombre del cliente"
							/>
						</div>
						<div className="space-y-2">
							<Label>Apellido</Label>
							<Input
								value={form.Ape_Cli}
								onChange={(event) => setForm((prev) => ({ ...prev, Ape_Cli: event.target.value }))}
								placeholder="Apellido del cliente"
							/>
						</div>
					</div>
					</FormSection>

					<FormSection title="Perfil comercial" description="Segmentación, preferencias y estado del cliente.">
					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Teléfono</Label>
							<Input
								value={form.Tel_Cli}
								onChange={(event) => setForm((prev) => ({ ...prev, Tel_Cli: event.target.value }))}
								placeholder="+57 300 000 0000"
							/>
						</div>
						<div className="space-y-2">
							<Label>Usuario Telegram</Label>
							<Input
								value={form.Usu_Tel_Cli}
								onChange={(event) => setForm((prev) => ({ ...prev, Usu_Tel_Cli: event.target.value }))}
								placeholder="@usuario_telegram"
							/>
						</div>
					</div>
					</FormSection>

					<FormSection title="Notificaciones y notas" description="Consentimientos de aviso y observaciones internas.">
					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Correo</Label>
							<Input
								type="email"
								value={form.Ema_Cli}
								onChange={(event) => setForm((prev) => ({ ...prev, Ema_Cli: event.target.value }))}
								placeholder="correo@empresa.com"
							/>
						</div>
						<div className="space-y-2">
							<Label>País</Label>
							<Input
								value={form.Pai_Cli}
								onChange={(event) => setForm((prev) => ({ ...prev, Pai_Cli: event.target.value }))}
								placeholder="Ecuador"
							/>
						</div>
					</div>

					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Documento</Label>
							<Input
								value={form.Doc_Cli}
								onChange={(event) => setForm((prev) => ({ ...prev, Doc_Cli: event.target.value }))}
								placeholder="Cédula o RUC"
							/>
						</div>
						<div className="space-y-2">
							<Label>Categoría</Label>
							<Select value={form.Cat_Cli} onValueChange={(value) => setForm((prev) => ({ ...prev, Cat_Cli: value }))}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="nuevo">Nuevo</SelectItem>
									<SelectItem value="ocasional">Ocasional</SelectItem>
									<SelectItem value="frecuente">Frecuente</SelectItem>
									<SelectItem value="vip">VIP</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Preferencia de contacto</Label>
							<Select value={form.Pre_Con_Cli} onValueChange={(value) => setForm((prev) => ({ ...prev, Pre_Con_Cli: value }))}>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="whatsapp">WhatsApp</SelectItem>
									<SelectItem value="email">Email</SelectItem>
									<SelectItem value="instagram">Instagram</SelectItem>
									<SelectItem value="messenger">Messenger</SelectItem>
									<SelectItem value="telegram">Telegram</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Estado</Label>
							<Select value={form.Est_Cli} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Cli: value }))}>
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

					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Notificaciones por Telegram</Label>
							<Select
								value={String(form.Ace_Not_Tel_Cli)}
								onValueChange={(value) => setForm((prev) => ({ ...prev, Ace_Not_Tel_Cli: value === "true" }))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">Sí</SelectItem>
									<SelectItem value="false">No</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Notificaciones por Correo</Label>
							<Select
								value={String(form.Ace_Not_Cor_Cli)}
								onValueChange={(value) => setForm((prev) => ({ ...prev, Ace_Not_Cor_Cli: value === "true" }))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">Sí</SelectItem>
									<SelectItem value="false">No</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Notas</Label>
						<Textarea
							value={form.Not_Cli}
							onChange={(event) => setForm((prev) => ({ ...prev, Not_Cli: event.target.value }))}
							placeholder="Detalles comerciales o acuerdos"
						/>
					</div>
					</FormSection>
				</>
			)}

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido}>
					{mode === "create" ? "Crear cliente" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
