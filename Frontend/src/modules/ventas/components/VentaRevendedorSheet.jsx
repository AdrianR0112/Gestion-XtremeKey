import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { mapRevendedorPayload } from "../../revendedores/helpers/revendedor.mapper";
import { REVENDEDOR_INICIAL, isRevendedorFormValid } from "../../revendedores/schemas/revendedor.schema";
import revendedoresService from "../../revendedores/services/revendedores.service";

export default function VentaRevendedorSheet({ open, onOpenChange, onCreated }) {
	const [form, setForm] = useState(REVENDEDOR_INICIAL);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!isRevendedorFormValid(form)) return;

		setSaving(true);
		setError("");
		try {
			const payload = mapRevendedorPayload(form);
			const created = await revendedoresService.create(payload);
			const mapped = {
				Id_Rev: created?.Id_Rev ?? created?.id,
				Tel_Rev: created?.Tel_Rev ?? form.Tel_Rev,
				Nom_Rev: created?.Nom_Rev ?? form.Nom_Rev,
				Ape_Rev: created?.Ape_Rev ?? form.Ape_Rev,
				Ema_Rev: created?.Ema_Rev ?? form.Ema_Rev,
				Doc_Rev: created?.Doc_Rev ?? form.Doc_Rev,
				Not_Rev: created?.Not_Rev ?? form.Not_Rev,
				Est_Rev: created?.Est_Rev ?? form.Est_Rev,
			};
			onCreated(mapped);
			setForm(REVENDEDOR_INICIAL);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo crear el revendedor.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Nuevo revendedor</DialogTitle>
					<DialogDescription>Agrega un revendedor rapidamente para asociarlo a esta venta.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-3">
						<div className="space-y-2">
							<Label>Telefono *</Label>
							<Input
								value={form.Tel_Rev}
								onChange={(event) => setForm((prev) => ({ ...prev, Tel_Rev: event.target.value }))}
								placeholder="+593 99 999 9999"
							/>
						</div>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>Nombre</Label>
								<Input
									value={form.Nom_Rev}
									onChange={(event) => setForm((prev) => ({ ...prev, Nom_Rev: event.target.value }))}
								/>
							</div>
							<div className="space-y-2">
								<Label>Apellido</Label>
								<Input
									value={form.Ape_Rev}
									onChange={(event) => setForm((prev) => ({ ...prev, Ape_Rev: event.target.value }))}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Correo</Label>
							<Input
								type="email"
								value={form.Ema_Rev}
								onChange={(event) => setForm((prev) => ({ ...prev, Ema_Rev: event.target.value }))}
							/>
						</div>
						<div className="space-y-2">
							<Label>Documento (RUC / Cedula)</Label>
							<Input
								value={form.Doc_Rev}
								onChange={(event) => setForm((prev) => ({ ...prev, Doc_Rev: event.target.value }))}
							/>
						</div>
						<div className="space-y-2">
							<Label>Notas</Label>
							<Textarea
								value={form.Not_Rev}
								onChange={(event) => setForm((prev) => ({ ...prev, Not_Rev: event.target.value }))}
								rows={2}
							/>
						</div>
						{error ? <p className="text-sm text-red-600">{error}</p> : null}
					</div>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button type="submit" disabled={saving || !form.Tel_Rev.trim()}>
							{saving ? "Creando..." : "Crear revendedor"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
