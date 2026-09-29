import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Pencil, Trash, Package, Tag } from "lucide-react";
import ProductoEstadoBadge from "./ProductoEstadoBadge";
import { resolveProductoImageUrl } from "../helpers/producto-image";

export default function ProductoCard({ producto = null, categorias = [], onEdit = () => {}, onDelete = () => {} }) {
	if (!producto) return null;

	const categoria = categorias.find((item) => Number(item.Id_Cat) === Number(producto.Id_Cat));
	const categoriaNombre = producto.Id_Cat ? categoria?.Nom_Cat || `Categoría #${producto.Id_Cat}` : "Sin categoría";
	const imageUrl = resolveProductoImageUrl(producto.Ima_Prd);

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-2xl">{producto.Nom_Prd}</CardTitle>
						<CardDescription className="space-y-1">
							<span className="block">{categoriaNombre}</span>
							<span className="block">{producto.Cod_Prd || "Sin código"}</span>
						</CardDescription>
					</div>
					<ProductoEstadoBadge estado={producto.Est_Prd} />
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{imageUrl && (
					<>
						<div className="overflow-hidden rounded-xl border bg-muted/20">
							<img src={imageUrl} alt={producto.Nom_Prd || "Imagen del producto"} className="h-56 w-full object-contain" />
						</div>
						<Separator />
					</>
				)}

				{/* Descripción */}
				{producto.Des_Prd && (
					<div>
						<h4 className="text-sm font-medium text-muted-foreground mb-2">Descripción</h4>
						<p className="text-sm">{producto.Des_Prd}</p>
					</div>
				)}

				{producto.Des_Prd && <Separator />}

				{/* Tipo y Categoría */}
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-start gap-2">
						<Tag className="h-4 w-4 text-muted-foreground mt-1" />
						<div>
							<p className="text-xs text-muted-foreground">Tipo</p>
							<p className="font-semibold text-sm">{producto.Tip_Prd || "—"}</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<Package className="h-4 w-4 text-muted-foreground mt-1" />
						<div>
							<p className="text-xs text-muted-foreground">Categoría</p>
							<p className="font-semibold text-sm">{categoriaNombre}</p>
						</div>
					</div>
				</div>

				<Separator />

				<div className="flex gap-2 justify-end">
					<Button variant="default" onClick={() => onEdit(producto)} className="gap-2">
						<Pencil className="h-4 w-4" />
						Editar
					</Button>
					<Button variant="destructive" onClick={() => onDelete(producto)} className="gap-2">
						<Trash className="h-4 w-4" />
						Eliminar
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
