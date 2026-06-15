import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import CompraEstadoBadge from "./CompraEstadoBadge";

export default function CompraCard({ compra, onEdit, onDelete }) {
	return (
		<Card className="shadow-none">
			<CardContent className="p-4">
				<div className="space-y-3">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm font-medium text-zinc-500">ID Compra</p>
							<p className="text-lg font-semibold">{compra.Id_Com}</p>
						</div>
						<CompraEstadoBadge estado={compra.Est_Com} />
					</div>

					<div className="grid sm:grid-cols-2 gap-3 py-2 border-y border-zinc-200 dark:border-zinc-800">
						<div>
							<p className="text-sm text-zinc-500">Proveedor</p>
							<p className="font-medium">{compra.Id_Pro}</p>
						</div>
						<div>
							<p className="text-sm text-zinc-500">Método de pago</p>
							<p className="font-medium">{compra.Met_Pag_Com || "-"}</p>
						</div>
					</div>

					<div className="grid sm:grid-cols-3 gap-3">
						<div>
							<p className="text-sm text-zinc-500">Subtotal</p>
							<p className="font-semibold">${Number(compra.Sub_Tot_Com).toFixed(2)}</p>
						</div>
						<div>
							<p className="text-sm text-zinc-500">Impuesto</p>
							<p className="font-semibold">${Number(compra.Imp_Tot_Com).toFixed(2)}</p>
						</div>
						<div>
							<p className="text-sm text-zinc-500">Total</p>
							<p className="text-lg font-bold text-emerald-600">${Number(compra.Tot_Com).toFixed(2)}</p>
						</div>
					</div>

					{compra.Not_Com && (
						<div>
							<p className="text-sm text-zinc-500">Notas</p>
							<p className="text-sm">{compra.Not_Com}</p>
						</div>
					)}

					<div className="flex gap-2 pt-2">
						<Button size="sm" variant="outline" onClick={() => onEdit(compra)}>
							<Pencil className="size-4 mr-1" />
							Editar
						</Button>
						<Button size="sm" variant="outline" className="text-red-600" onClick={() => onDelete(compra)}>
							<Trash2 className="size-4 mr-1" />
							Eliminar
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
