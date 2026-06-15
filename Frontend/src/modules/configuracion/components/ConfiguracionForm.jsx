import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

function readFileAsBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result || "");
			const base64 = result.includes(",") ? result.split(",")[1] : result;
			resolve(base64);
		};
		reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
		reader.readAsDataURL(file);
	});
}

export default function ConfiguracionForm({
	form,
	setForm,
	formErrors,
	formValido,
	saving,
	onSubmit,
	onCancel,
	setError,
}) {
	const handleLogoChange = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const logoBase64 = await readFileAsBase64(file);
			setForm((prev) => ({ ...prev, Log_Con: logoBase64 }));
		} catch (error) {
			setError?.(error.message);
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4 px-6 pb-6">
			<div className="space-y-1.5">
				<Label htmlFor="Nom_Emp_Con">Nombre de empresa</Label>
				<Input
					id="Nom_Emp_Con"
					value={form.Nom_Emp_Con}
					onChange={(event) => setForm((prev) => ({ ...prev, Nom_Emp_Con: event.target.value }))}
				/>
				{formErrors.Nom_Emp_Con ? <p className="text-xs text-red-600">{formErrors.Nom_Emp_Con}</p> : null}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="Dir_Con">Direccion</Label>
				<Input
					id="Dir_Con"
					value={form.Dir_Con}
					onChange={(event) => setForm((prev) => ({ ...prev, Dir_Con: event.target.value }))}
				/>
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label htmlFor="Tel_Con">Telefono</Label>
					<Input
						id="Tel_Con"
						value={form.Tel_Con}
						onChange={(event) => setForm((prev) => ({ ...prev, Tel_Con: event.target.value }))}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="Ema_Con">Correo</Label>
					<Input
						id="Ema_Con"
						type="email"
						value={form.Ema_Con}
						onChange={(event) => setForm((prev) => ({ ...prev, Ema_Con: event.target.value }))}
					/>
					{formErrors.Ema_Con ? <p className="text-xs text-red-600">{formErrors.Ema_Con}</p> : null}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="Log_Con">Logo (base64)</Label>
				<Input id="Log_Con" type="file" accept="image/*" onChange={handleLogoChange} />
				{form.Log_Con ? (
					<div className="rounded-md border p-2">
						<img src={`data:image/*;base64,${form.Log_Con}`} alt="Preview logo" className="h-20 w-full object-contain" />
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="mt-2"
							onClick={() => setForm((prev) => ({ ...prev, Log_Con: "" }))}
						>
							Quitar logo
						</Button>
					</div>
				) : null}
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label htmlFor="Mon_Con">Moneda (Mon_Con)</Label>
					<Input
						id="Mon_Con"
						placeholder="USD"
						value={form.Mon_Con}
						onChange={(event) => setForm((prev) => ({ ...prev, Mon_Con: event.target.value }))}
					/>
					{formErrors.Mon_Con ? <p className="text-xs text-red-600">{formErrors.Mon_Con}</p> : null}
				</div>
				<div className="space-y-1.5">
					<Label>Impuesto habilitado</Label>
					<Select
						value={form.Hab_Imp_Con ? "1" : "0"}
						onValueChange={(value) => setForm((prev) => ({ ...prev, Hab_Imp_Con: value === "1" }))}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">Activo</SelectItem>
							<SelectItem value="0">Inactivo</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{form.Hab_Imp_Con ? (
				<div className="space-y-1.5">
					<Label htmlFor="Imp_Con">Impuesto % (Imp_Con)</Label>
					<Input
						id="Imp_Con"
						type="number"
						min="0"
						max="100"
						step="0.01"
						placeholder="15"
						value={form.Imp_Con}
						onChange={(event) => setForm((prev) => ({ ...prev, Imp_Con: event.target.value }))}
					/>
					{formErrors.Imp_Con ? <p className="text-xs text-red-600">{formErrors.Imp_Con}</p> : null}
				</div>
			) : null}

			<div className="space-y-1.5">
				<Label htmlFor="Zon_Hor_Con">Zona horaria</Label>
				<Input
					id="Zon_Hor_Con"
					placeholder="America/Guayaquil"
					value={form.Zon_Hor_Con}
					onChange={(event) => setForm((prev) => ({ ...prev, Zon_Hor_Con: event.target.value }))}
				/>
			</div>

			<div className="flex items-center justify-end gap-2">
				<Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
					Restablecer
				</Button>
				<Button type="submit" disabled={!formValido || saving}>
					{saving ? "Guardando..." : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
