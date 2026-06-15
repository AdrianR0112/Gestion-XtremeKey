import { Mail, Phone, Shield, CalendarClock, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import UsuarioEstadoBadge from "./UsuarioEstadoBadge";

function formatDate(value) {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleString();
}

export default function UsuarioCard({ usuario, onEdit, onDelete }) {
	if (!usuario) return null;

	return (
		<div data-usuario-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{`${usuario.Nom_Usu} ${usuario.Ape_Usu}`.trim()}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{usuario.Id_Usu}</p>
					</div>
					<UsuarioEstadoBadge estado={usuario.Est_Usu} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(usuario)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(usuario)}>
						<Trash2 className="size-4 mr-2 text-red-600" />
						Eliminar
					</Button>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Informacion de contacto</p>
				<div className="space-y-3 text-sm">
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Mail className="size-4" />
						<span>{usuario.Ema_Usu || "-"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Phone className="size-4" />
						<span>{usuario.Tel_Usu || "Sin telefono"}</span>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Acceso</p>
				<div className="space-y-3 text-sm">
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Shield className="size-4" />
						<span className="uppercase">Rol: {usuario.Rol_Usu || "-"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<CalendarClock className="size-4" />
						<span>Ultimo acceso: {formatDate(usuario.Ult_Acc_Usu)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
