import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import FormSection from "../../../components/form-section";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { TIPOS_RENOVACION, ESTADOS_RENOVACION } from "../schemas/renovacion.schema";

export default function RenovacionForm({
	open,
	onOpenChange,
	mode,
	saving,
	form,
	onFormChange,
	onSubmit,
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader className="px-6 pt-6 shrink-0">
					<DialogTitle>{mode === "create" ? "Nueva renovacion" : "Editar renovacion"}</DialogTitle>
					<DialogDescription>
						{mode === "create" ? "Registra una renovacion de licencia." : "Modifica los datos de la renovacion."}
					</DialogDescription>
				</DialogHeader>

				<form className="min-h-0 flex-1 flex flex-col" onSubmit={onSubmit}>
					<div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
						<div className="space-y-5">

							<FormSection title="Licencias" description="Licencia original y nueva licencia asociada.">
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label>ID Licencia original</Label>
										<Input
											type="number"
											value={form.Id_Dve_Ori}
											onChange={(event) => onFormChange({ ...form, Id_Dve_Ori: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>ID Licencia nueva</Label>
										<Input
											type="number"
											value={form.Id_Dve_Nue}
											onChange={(event) => onFormChange({ ...form, Id_Dve_Nue: event.target.value })}
										/>
									</div>
								</div>
							</FormSection>

							<FormSection title="Referencias" description="Cliente, producto y variante asociados.">
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="space-y-2">
										<Label>ID Cliente</Label>
										<Input
											type="number"
											value={form.Id_Cli}
											onChange={(event) => onFormChange({ ...form, Id_Cli: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>ID Producto</Label>
										<Input
											type="number"
											value={form.Id_Prd}
											onChange={(event) => onFormChange({ ...form, Id_Prd: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>ID Variante</Label>
										<Input
											type="number"
											value={form.Id_Var}
											onChange={(event) => onFormChange({ ...form, Id_Var: event.target.value })}
										/>
									</div>
								</div>
							</FormSection>

							<FormSection title="Fechas" description="Periodo de la licencia anterior y de la nueva.">
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="space-y-2">
										<Label>Vence anterior</Label>
										<Input
											type="date"
											value={form.Fec_Ven_Ant_Ren}
											onChange={(event) => onFormChange({ ...form, Fec_Ven_Ant_Ren: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>Inicio nueva</Label>
										<Input
											type="date"
											value={form.Fec_Ini_Nue_Ren}
											onChange={(event) => onFormChange({ ...form, Fec_Ini_Nue_Ren: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>Fin nueva</Label>
										<Input
											type="date"
											value={form.Fec_Fin_Nue_Ren}
											onChange={(event) => onFormChange({ ...form, Fec_Fin_Nue_Ren: event.target.value })}
										/>
									</div>
								</div>
							</FormSection>

							<FormSection title="Precios" description="Precio original, precio renovado y descuento aplicado.">
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="space-y-2">
										<Label>Precio original</Label>
										<Input
											type="number"
											min="0"
											step="0.01"
											value={form.Pre_Ori_Ren}
											onChange={(event) => onFormChange({ ...form, Pre_Ori_Ren: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>Precio nuevo</Label>
										<Input
											type="number"
											min="0"
											step="0.01"
											value={form.Pre_Ren}
											onChange={(event) => onFormChange({ ...form, Pre_Ren: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>Descuento</Label>
										<Input
											type="number"
											min="0"
											step="0.01"
											value={form.Des_Ren}
											onChange={(event) => onFormChange({ ...form, Des_Ren: event.target.value })}
										/>
									</div>
								</div>
							</FormSection>

							<FormSection title="Clasificacion" description="Tipo y estado de la renovacion.">
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label>Tipo</Label>
										<Select value={form.Tip_Ren || "manual"} onValueChange={(value) => onFormChange({ ...form, Tip_Ren: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{TIPOS_RENOVACION.map((tipo) => (
													<SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Estado</Label>
										<Select value={form.Est_Ren || "pendiente"} onValueChange={(value) => onFormChange({ ...form, Est_Ren: value })}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{ESTADOS_RENOVACION.map((est) => (
													<SelectItem key={est} value={est}>{est}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</FormSection>

							<FormSection title="Notas" description="Observaciones internas de la renovacion.">
								<Textarea
									value={form.Not_Ren}
									onChange={(event) => onFormChange({ ...form, Not_Ren: event.target.value })}
									placeholder="Observaciones..."
									className="min-h-24"
								/>
							</FormSection>

						</div>
					</div>

					<div className="border-t bg-background px-6 py-4 shrink-0">
						<div className="flex items-center justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancelar
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? "Guardando..." : mode === "create" ? "Crear renovacion" : "Guardar cambios"}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
