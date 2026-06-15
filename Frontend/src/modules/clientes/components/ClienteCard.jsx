import { Mail, MapPin, Phone, FileText, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import ClienteEstadoBadge from "./ClienteEstadoBadge";

export default function ClienteCard({ cliente, onEdit, onDelete }) {
	if (!cliente) return null;

	return (
		<div data-cliente-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{`${cliente.Nom_Cli} ${cliente.Ape_Cli}`.trim()}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{cliente.Id_Cli}</p>
					</div>
					<ClienteEstadoBadge estado={cliente.Est_Cli} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(cliente)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(cliente)}>
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
						<Phone className="size-4" />
						<span>{cliente.Tel_Cli || "-"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Mail className="size-4" />
						<span>{cliente.Ema_Cli || "Sin correo"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<MapPin className="size-4" />
						<span>{cliente.Pai_Cli || "Ecuador"}</span>
					</div>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Categoria</p>
					<p className="font-medium mt-1 uppercase">{cliente.Cat_Cli || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500">Preferencia de contacto</p>
					<p className="font-medium mt-1 uppercase">{cliente.Pre_Con_Cli || "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<CheckCircle2 className="size-3.5" />
						Acepta notificaciones por telegram
					</p>
					<p className="font-medium mt-1">{cliente.Ace_Not_Tel_Cli ? "Si" : "No"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<CheckCircle2 className="size-3.5" />
						Acepta notificaciones por correo
					</p>
					<p className="font-medium mt-1">{cliente.Ace_Not_Cor_Cli ? "Si" : "No"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<FileText className="size-3.5" />
						Documento
					</p>
					<p className="font-medium mt-1">{cliente.Doc_Cli || "-"}</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Observaciones</p>
				<p className="text-sm text-zinc-600 dark:text-zinc-300">{cliente.Not_Cli || "Sin notas."}</p>
			</div>
		</div>
	);
}
