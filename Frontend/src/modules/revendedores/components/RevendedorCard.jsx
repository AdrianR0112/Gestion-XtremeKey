import { Mail, Phone, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import RevendedorEstadoBadge from "./RevendedorEstadoBadge";

export default function RevendedorCard({ revendedor, onEdit, onDelete }) {
	if (!revendedor) return null;

	return (
		<div data-revendedor-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{`${revendedor.Nom_Rev} ${revendedor.Ape_Rev}`.trim()}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{revendedor.Id_Rev}</p>
					</div>
					<RevendedorEstadoBadge estado={revendedor.Est_Rev} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(revendedor)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(revendedor)}>
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
						<span>{revendedor.Tel_Rev || "-"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Mail className="size-4" />
						<span>{revendedor.Ema_Rev || "Sin correo"}</span>
					</div>
				</div>
			</div>

			<Separator />

			<div className="rounded-md border p-3">
				<p className="text-xs text-zinc-500 flex items-center gap-1">
					<FileText className="size-3.5" />
					Documento
				</p>
				<p className="font-medium mt-1">{revendedor.Doc_Rev || "-"}</p>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Observaciones</p>
				<p className="text-sm text-zinc-600 dark:text-zinc-300">{revendedor.Not_Rev || "Sin notas."}</p>
			</div>
		</div>
	);
}
