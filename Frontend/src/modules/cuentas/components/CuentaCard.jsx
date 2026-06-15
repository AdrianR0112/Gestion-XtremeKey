import { KeySquare, Pencil, Trash2, UserRound } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";
import CuentaEstadoBadge from "./CuentaEstadoBadge";

export default function CuentaCard({
	cuenta,
	productoNombre,
	varianteNombre,
	proveedorNombre,
	onEdit,
	onDelete,
}) {
	if (!cuenta) return null;

	return (
		<div data-cuenta-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{cuenta.Nom_Cue || "Cuenta"}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{cuenta.Id_Cue}</p>
					</div>
					<CuentaEstadoBadge estado={cuenta.Est_Cue} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(cuenta)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(cuenta)}>
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
					<p className="text-xs text-zinc-500">Perfil</p>
					<p className="font-medium mt-1">{cuenta.Per_Cue || "-"}</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3 text-sm">
				<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
					<UserRound className="size-4" />
					<span>{cuenta.Usu_Cue || "Sin usuario"}</span>
				</div>
				<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
					<KeySquare className="size-4" />
					<span>{cuenta.Pin_Cue || "Sin PIN"}</span>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Total perfiles</p>
					<p className="font-medium mt-1">{cuenta.Tot_Per_Cue ?? "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Perfiles disponibles</p>
					<p className="font-medium mt-1">{cuenta.Per_Dis_Cue ?? "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Costo</p>
					<p className="font-medium mt-1">{cuenta.Cos_Cue === "" || cuenta.Cos_Cue === null ? "-" : formatCurrency(cuenta.Cos_Cue)}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Fecha compra</p>
					<p className="font-medium mt-1">{cuenta.Fec_Com_Cue ? formatDate(cuenta.Fec_Com_Cue) : "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Fecha vencimiento</p>
					<p className="font-medium mt-1">{cuenta.Fec_Ven_Cue ? formatDate(cuenta.Fec_Ven_Cue) : "-"}</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Observaciones</p>
				<p className="text-sm text-zinc-600 dark:text-zinc-300">{cuenta.Not_Cue || "Sin notas."}</p>
			</div>
		</div>
	);
}
