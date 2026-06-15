import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import FeedbackAlert from "../../../components/feedback-alert";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Textarea } from "../../../components/ui/textarea";
import proveedoresService from "../../proveedores/services/proveedores.service";

export default function CompraProveedorSheet({ open, onOpenChange, onCreated }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		Nom_Pro: "",
		Dir_Pro: "",
		Tel_Pro: "",
		Ema_Pro: "",
		Con_Pro: "",
		NIT_Pro: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.Nom_Pro.trim()) {
			setError("El nombre es obligatorio.");
			return;
		}

		setLoading(true);
		setError("");
		try {
			const proveedor = await proveedoresService.create(form);
			onCreated(proveedor);
			setForm({
				Nom_Pro: "",
				Dir_Pro: "",
				Tel_Pro: "",
				Ema_Pro: "",
				Con_Pro: "",
				NIT_Pro: "",
			});
		} catch (err) {
			setError(err?.message || "Error al crear proveedor.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto">
				<SheetHeader className="px-6 pt-6">
					<SheetTitle>Crear proveedor</SheetTitle>
					<SheetDescription>Rápidamente crea un nuevo proveedor.</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
					<FeedbackAlert message={error} variant="error" />

					<div className="space-y-2">
						<Label>Nombre *</Label>
						<Input
							value={form.Nom_Pro}
							onChange={(e) => setForm((prev) => ({ ...prev, Nom_Pro: e.target.value }))}
							placeholder="Nombre del proveedor"
							disabled={loading}
						/>
					</div>

					<div className="space-y-2">
						<Label>NIT/Cédula</Label>
						<Input
							value={form.NIT_Pro}
							onChange={(e) => setForm((prev) => ({ ...prev, NIT_Pro: e.target.value }))}
							placeholder="Número de identificación"
							disabled={loading}
						/>
					</div>

					<div className="space-y-2">
						<Label>Teléfono</Label>
						<Input
							value={form.Tel_Pro}
							onChange={(e) => setForm((prev) => ({ ...prev, Tel_Pro: e.target.value }))}
							placeholder="Número de teléfono"
							disabled={loading}
						/>
					</div>

					<div className="space-y-2">
						<Label>Email</Label>
						<Input
							type="email"
							value={form.Ema_Pro}
							onChange={(e) => setForm((prev) => ({ ...prev, Ema_Pro: e.target.value }))}
							placeholder="Email del proveedor"
							disabled={loading}
						/>
					</div>

					<div className="space-y-2">
						<Label>Dirección</Label>
						<Input
							value={form.Dir_Pro}
							onChange={(e) => setForm((prev) => ({ ...prev, Dir_Pro: e.target.value }))}
							placeholder="Dirección"
							disabled={loading}
						/>
					</div>

					<div className="space-y-2">
						<Label>Contacto</Label>
						<Input
							value={form.Con_Pro}
							onChange={(e) => setForm((prev) => ({ ...prev, Con_Pro: e.target.value }))}
							placeholder="Persona de contacto"
							disabled={loading}
						/>
					</div>

					<Button type="submit" disabled={loading} className="w-full">
						{loading ? "Creando..." : "Crear proveedor"}
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
}
