import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
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

export default function CompraForm({
	mode,
	form,
	setForm,
	formValido,
	onSubmit,
	onCancel,
	proveedores = [],
}) {
	const [formularioAvanzado, setFormularioAvanzado] = useState(mode === "edit");

	useEffect(() => {
		if (form.Tot_Com === 0 && form.Sub_Tot_Com > 0 && form.Imp_Tot_Com >= 0) {
			setForm((prev) => ({
				...prev,
				Tot_Com: prev.Sub_Tot_Com + (prev.Imp_Tot_Com || 0),
			}));
		}
	}, [form.Sub_Tot_Com, form.Imp_Tot_Com, form.Tot_Com, setForm]);

	return (
		<form className="space-y-4 px-6 pb-6" onSubmit={onSubmit}>
			{!formularioAvanzado && (
				<>
					<div className="space-y-2">
						<Label>Proveedor</Label>
						<Select value={form.Id_Pro?.toString() || ""} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Pro: parseInt(value) }))}>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar proveedor" />
							</SelectTrigger>
							<SelectContent>
								{proveedores.map((p) => (
									<SelectItem key={p.Id_Pro} value={p.Id_Pro?.toString()}>
										{p.Nom_Pro}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Subtotal</Label>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={form.Sub_Tot_Com}
								onChange={(e) => setForm((prev) => ({ ...prev, Sub_Tot_Com: e.target.value }))}
								placeholder="0.00"
							/>
						</div>
						<div className="space-y-2">
							<Label>Total</Label>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={form.Tot_Com}
								onChange={(e) => setForm((prev) => ({ ...prev, Tot_Com: e.target.value }))}
								placeholder="0.00"
							/>
						</div>
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
				</>
			)}

			{formularioAvanzado && (
				<>
					<div className="space-y-2">
						<Label>Proveedor</Label>
						<Select value={form.Id_Pro?.toString() || ""} onValueChange={(value) => setForm((prev) => ({ ...prev, Id_Pro: parseInt(value) }))}>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar proveedor" />
							</SelectTrigger>
							<SelectContent>
								{proveedores.map((p) => (
									<SelectItem key={p.Id_Pro} value={p.Id_Pro?.toString()}>
										{p.Nom_Pro}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid sm:grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Fecha de compra</Label>
							<Input
								type="datetime-local"
								value={form.Fec_Com}
								onChange={(e) => setForm((prev) => ({ ...prev, Fec_Com: e.target.value }))}
							/>
						</div>
						<div className="space-y-2">
							<Label>Método de pago</Label>
							<Input
								value={form.Met_Pag_Com}
								onChange={(e) => setForm((prev) => ({ ...prev, Met_Pag_Com: e.target.value }))}
								placeholder="Ej: Transferencia bancaria"
							/>
						</div>
					</div>

					<div className="grid sm:grid-cols-3 gap-3">
						<div className="space-y-2">
							<Label>Subtotal</Label>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={form.Sub_Tot_Com}
								onChange={(e) => setForm((prev) => ({ ...prev, Sub_Tot_Com: e.target.value }))}
								placeholder="0.00"
							/>
						</div>
						<div className="space-y-2">
							<Label>Impuesto</Label>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={form.Imp_Tot_Com}
								onChange={(e) => setForm((prev) => ({ ...prev, Imp_Tot_Com: e.target.value }))}
								placeholder="0.00"
							/>
						</div>
						<div className="space-y-2">
							<Label>Total</Label>
							<Input
								type="number"
								step="0.01"
								min="0"
								value={form.Tot_Com}
								onChange={(e) => setForm((prev) => ({ ...prev, Tot_Com: e.target.value }))}
								placeholder="0.00"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Estado</Label>
						<Select value={form.Est_Com} onValueChange={(value) => setForm((prev) => ({ ...prev, Est_Com: value }))}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pendiente">Pendiente</SelectItem>
								<SelectItem value="completada">Completada</SelectItem>
								<SelectItem value="cancelada">Cancelada</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Notas</Label>
						<Textarea
							value={form.Not_Com}
							onChange={(e) => setForm((prev) => ({ ...prev, Not_Com: e.target.value }))}
							placeholder="Notas adicionales sobre la compra..."
							rows={3}
						/>
					</div>
				</>
			)}

			<div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-4 flex gap-2 border-t bg-background px-6 py-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!formValido}>
					{mode === "create" ? "Crear compra" : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
