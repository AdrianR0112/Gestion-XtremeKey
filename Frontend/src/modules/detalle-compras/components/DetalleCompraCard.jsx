import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function DetalleCompraCard({ detalle, onEdit, onDelete }) {
	return (
		<Card className="shadow-none">
			<CardContent className="p-4">
				<div className="space-y-3">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm font-medium text-zinc-500">ID Detalle</p>
							<p className="text-lg font-semibold">{detalle.Id_Dco}</p>
						</div>
					</div>

					<div className="grid sm:grid-cols-2 gap-3 py-2 border-y border-zinc-200 dark:border-zinc-800">
						<div>
							<p className="text-sm text-zinc-500">Compra</p>
							<p className="font-medium">{detalle.Id_Com}</p>
						</div>
						<div>
							<p className="text-sm text-zinc-500">Producto</p>
							<p className="font-medium">{detalle.Id_Prd || "-"}</p>
						</div>
					</div>

					<div className="grid sm:grid-cols-3 gap-3">
						<div>
							<p className="text-sm text-zinc-500">Cantidad</p>
							<p className="font-semibold">{detalle.Can_Dco}</p>
						</div>
						<div>
							<p className="text-sm text-zinc-500">Precio Unitario</p>
							<p className="font-semibold">${Number(detalle.Pre_Uni_Dco).toFixed(2)}</p>
						</div>
						<div>
							<p className="text-sm text-zinc-500">Subtotal</p>
							<p className="text-lg font-bold text-emerald-600">${Number(detalle.Sub_Tot_Dco).toFixed(2)}</p>
						</div>
					</div>

					{detalle.Not_Dco && (
						<div>
							<p className="text-sm text-zinc-500">Notas</p>
							<p className="text-sm">{detalle.Not_Dco}</p>
						</div>
					)}

					<div className="flex gap-2 pt-2">
						<Button size="sm" variant="outline" onClick={() => onEdit(detalle)}>
							<Pencil className="size-4 mr-1" />
							Editar
						</Button>
						<Button size="sm" variant="outline" className="text-red-600" onClick={() => onDelete(detalle)}>
							<Trash2 className="size-4 mr-1" />
							Eliminar
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
