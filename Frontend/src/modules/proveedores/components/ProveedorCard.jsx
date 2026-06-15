import { Mail, Phone, UserRound, Globe, MapPin, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import ProveedorEstadoBadge from "./ProveedorEstadoBadge";

export default function ProveedorCard({ proveedor, onEdit, onDelete }) {
	if (!proveedor) return null;

	return (
		<div data-proveedor-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{proveedor.Nom_Pro || "-"}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{proveedor.Id_Pro}</p>
					</div>
					<ProveedorEstadoBadge estado={proveedor.Est_Pro} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(proveedor)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(proveedor)}>
						<Trash2 className="size-4 mr-2 text-red-600" />
						Eliminar
					</Button>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Contacto</p>
				<div className="space-y-3 text-sm">
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<UserRound className="size-4" />
						<span>{proveedor.Con_Pri_Pro || "Sin contacto principal"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Phone className="size-4" />
						<span>{proveedor.Tel_Pro || "Sin telefono"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Mail className="size-4" />
						<span>{proveedor.Ema_Pro || "Sin correo"}</span>
					</div>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Tipo</p>
					<p className="font-medium mt-1 uppercase">{proveedor.Tip_Pro || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Medio de contacto</p>
					<p className="font-medium mt-1 uppercase">{proveedor.Med_Con_Pro || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<MapPin className="size-3.5" />
						Pais
					</p>
					<p className="font-medium mt-1">{proveedor.Pai_Pro || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<Star className="size-3.5" />
						Calificacion
					</p>
					<p className="font-medium mt-1">{proveedor.Cal_Pro ?? "-"}</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Canales adicionales</p>
				<div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
					<p>WhatsApp: {proveedor.Wha_Pro || "-"}</p>
					<p>Telegram: {proveedor.Tel_Gram_Pro || "-"}</p>
					<p className="flex items-center gap-1">
						<Globe className="size-4" />
						{proveedor.Web_Pro || "Sin web"}
					</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Notas</p>
				<p className="text-sm text-zinc-600 dark:text-zinc-300">{proveedor.Not_Pro || "Sin notas."}</p>
			</div>
		</div>
	);
}
