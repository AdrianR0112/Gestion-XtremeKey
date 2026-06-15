import { KeySquare, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";
import KeyEstadoBadge from "./KeyEstadoBadge";

export default function KeyCard({
	keyItem,
	productoNombre,
	varianteNombre,
	proveedorNombre,
	onEdit,
	onDelete,
}) {
	if (!keyItem) return null;

	return (
		<div data-key-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{keyItem.Cla_Key || "Key"}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{keyItem.Id_Key}</p>
					</div>
					<KeyEstadoBadge estado={keyItem.Est_Key} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(keyItem)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(keyItem)}>
						<Trash2 className="size-4 mr-2 text-red-600" />
						Eliminar
					</Button>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Producto</p>
					<p className="font-medium mt-1">{productoNombre || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Variante</p>
					<p className="font-medium mt-1">{varianteNombre || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Proveedor</p>
					<p className="font-medium mt-1">{proveedorNombre || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Descripcion</p>
					<p className="font-medium mt-1">{keyItem.Des_Key || "-"}</p>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Costo</p>
					<p className="font-medium mt-1">{keyItem.Cos_Key === "" || keyItem.Cos_Key === null ? "-" : formatCurrency(keyItem.Cos_Key)}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Precio de venta</p>
					<p className="font-medium mt-1">{keyItem.Pre_Ven_Key === "" || keyItem.Pre_Ven_Key === null ? "-" : formatCurrency(keyItem.Pre_Ven_Key)}</p>
				</div>
				<div className="rounded-md border p-3 sm:col-span-2">
					<p className="text-xs text-zinc-500">Tipo de key</p>
					<p className="font-medium mt-1">{keyItem.Es_Per_Vid_Key ? "Por vida" : "Con vencimiento"}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Fecha compra</p>
					<p className="font-medium mt-1">{keyItem.Fec_Com_Key ? formatDate(keyItem.Fec_Com_Key) : "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Fecha vencimiento</p>
					<p className="font-medium mt-1">{keyItem.Fec_Ven_Key ? formatDate(keyItem.Fec_Ven_Key) : "-"}</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3 text-sm">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500 flex items-center gap-1">
					<ShieldCheck className="size-3.5" />
					Notas
				</p>
				<p className="text-zinc-600 dark:text-zinc-300">{keyItem.Not_Key || "Sin notas."}</p>
			</div>
		</div>
	);
}
