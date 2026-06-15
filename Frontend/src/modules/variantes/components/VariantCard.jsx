import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Clock3, DollarSign, Pencil, Package, Tags, Trash2, Users } from "lucide-react";
import VariantEstadoBadge from "./VariantEstadoBadge";

function formatDuration(tipo, valor) {
	if (valor === "" || valor === null || valor === undefined) return null;
	const value = Number(valor);
	if (!Number.isFinite(value)) return null;
	return `${value} ${tipo || "dias"}`;
}

function parseAttributes(value) {
	if (!value) return null;
	if (typeof value === "object") return value;
	if (typeof value === "string") {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}

export default function VariantCard({ variante = null, productos = [], onEdit = () => {}, onDelete = () => {} }) {
	if (!variante) return null;

	const producto = productos.find((item) => Number(item.Id_Prd) === Number(variante.Id_Prd));
	const productoNombre = producto?.Nom_Prd || `Producto #${variante.Id_Prd}`;
	const attributes = parseAttributes(variante.Atr_Var);
	const correoVencimiento = variante.Not_Ven_Cor_Var ? "Activo" : "Inactivo";
	const whatsappVencimiento = variante.Not_Ven_Wsp_Var ? "Activo" : "Inactivo";

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-2xl">{variante.Nom_Var}</CardTitle>
						<CardDescription className="space-y-1">
							<span className="block">{productoNombre}</span>
						</CardDescription>
					</div>
					<VariantEstadoBadge estado={variante.Est_Var} />
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{variante.Des_Var && (
					<div>
						<h4 className="text-sm font-medium text-muted-foreground mb-2">Descripción</h4>
						<p className="text-sm whitespace-pre-wrap">{variante.Des_Var}</p>
					</div>
				)}

				{variante.Des_Var && <Separator />}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex items-start gap-2">
						<DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
						<div>
							<p className="text-xs text-muted-foreground">Precio Costo</p>
							<p className="font-semibold">{variante.Pre_Cos_Var === "" || variante.Pre_Cos_Var === null || variante.Pre_Cos_Var === undefined ? "—" : `$${Number(variante.Pre_Cos_Var).toFixed(2)}`}</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
						<div>
							<p className="text-xs text-muted-foreground">Precio Venta</p>
							<p className="font-semibold">{variante.Pre_Ven_Var === "" || variante.Pre_Ven_Var === null || variante.Pre_Ven_Var === undefined ? "—" : `$${Number(variante.Pre_Ven_Var).toFixed(2)}`}</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
						<div>
							<p className="text-xs text-muted-foreground">Precio Revendedor</p>
							<p className="font-semibold">{variante.Pre_Rev_Var === "" || variante.Pre_Rev_Var === null || variante.Pre_Rev_Var === undefined ? "—" : `$${Number(variante.Pre_Rev_Var).toFixed(2)}`}</p>
						</div>
					</div>
				</div>

				<Separator />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<p className="text-xs text-muted-foreground">Avisos por correo</p>
						<p className="font-semibold text-sm">{correoVencimiento}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Avisos por WhatsApp</p>
						<p className="font-semibold text-sm">{whatsappVencimiento}</p>
					</div>
				</div>

				<Separator />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex items-start gap-2">
						<Package className="h-4 w-4 text-muted-foreground mt-1" />
						<div>
							<p className="text-xs text-muted-foreground">Producto</p>
							<p className="font-semibold text-sm">{productoNombre}</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<Tags className="h-4 w-4 text-muted-foreground mt-1" />
						<div>
							<p className="text-xs text-muted-foreground">Atributos</p>
							<p className="font-semibold text-sm">{attributes && typeof attributes === "object" ? `${Object.keys(attributes).length} definidos` : attributes || "—"}</p>
						</div>
					</div>
				</div>

				{(variante.Dur_Val_Var || variante.Max_Usu_Var) && <Separator />}

				{(variante.Dur_Val_Var || variante.Max_Usu_Var) && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{formatDuration(variante.Dur_Tip_Var, variante.Dur_Val_Var) && (
							<div className="flex items-start gap-2">
								<Clock3 className="h-4 w-4 text-muted-foreground mt-1" />
								<div>
									<p className="text-xs text-muted-foreground">Duración</p>
									<p className="font-semibold text-sm">{formatDuration(variante.Dur_Tip_Var, variante.Dur_Val_Var)}</p>
								</div>
							</div>
						)}
						{variante.Max_Usu_Var && (
							<div className="flex items-start gap-2">
								<Users className="h-4 w-4 text-muted-foreground mt-1" />
								<div>
									<p className="text-xs text-muted-foreground">Máx. Usuarios</p>
									<p className="font-semibold text-sm">{variante.Max_Usu_Var}</p>
								</div>
							</div>
						)}
					</div>
				)}

				<Separator />

				<div className="flex flex-col sm:flex-row gap-2 justify-end">
					<Button variant="outline" onClick={() => onEdit(variante)} className="gap-2">
						<Pencil className="h-4 w-4" />
						Editar
					</Button>
					<Button variant="destructive" onClick={() => onDelete(variante)} className="gap-2">
						<Trash2 className="h-4 w-4" />
						Eliminar
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
