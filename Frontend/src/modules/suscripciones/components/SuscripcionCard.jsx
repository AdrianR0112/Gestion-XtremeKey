import { AtSign, Calendar, FileText, History, MessageCircle, Package, Pencil, Phone, RefreshCw, Trash2, User } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import formatDate from "../../../utils/formatDate";
import SuscripcionEstadoBadge from "./SuscripcionEstadoBadge";
import SuscripcionHistorial from "./SuscripcionHistorial";
import SuscripcionTitularBadge from "./SuscripcionTitularBadge";
import { formatVenceEn, getDiasRestantes, getVencimientoVariant } from "../utils/vencimiento";

export default function SuscripcionCard({ suscripcion, onEdit, onDelete, onRenovar, onEnviarMensaje }) {
	if (!suscripcion) return null;

	const dias = getDiasRestantes(suscripcion);

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{suscripcion.Nom_Prd || "Suscripción"}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{suscripcion.Id_Sus}</p>
					</div>
					<SuscripcionEstadoBadge estado={suscripcion.Est_Sus} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						size="sm"
						onClick={() => onRenovar(suscripcion)}
						disabled={suscripcion.Est_Sus === "cancelada"}
					>
						<RefreshCw className="size-4 mr-2" />
						Renovar
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onEnviarMensaje(suscripcion)}
						disabled={!suscripcion.Tel_Tit_Sus}
						title={suscripcion.Tel_Tit_Sus ? undefined : "El titular no tiene teléfono registrado"}
					>
						<MessageCircle className="size-4 mr-2 text-green-600" />
						Mensaje
					</Button>
					<Button variant="outline" size="sm" onClick={() => onEdit(suscripcion)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(suscripcion)}>
						<Trash2 className="size-4 mr-2 text-red-600" />
						Eliminar
					</Button>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<div className="flex items-center justify-between gap-2">
					<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Titular</p>
					<SuscripcionTitularBadge tipo={suscripcion.Tip_Tit_Sus} />
				</div>
				<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
					<User className="size-4" />
					<span>{suscripcion.Nom_Tit_Sus || "-"}</span>
				</div>
				{suscripcion.Ema_Tit_Sus ? <p className="text-sm text-zinc-500 ml-6">{suscripcion.Ema_Tit_Sus}</p> : null}
				{suscripcion.Tel_Tit_Sus ? (
					<div className="flex items-center gap-2 text-sm text-zinc-500">
						<Phone className="size-4" />
						<span>{suscripcion.Tel_Tit_Sus}</span>
					</div>
				) : null}
				{suscripcion.Cor_Cue_Sus ? (
					<div className="flex items-start gap-2 text-sm">
						<AtSign className="size-4 mt-0.5 shrink-0 text-zinc-500" />
						<div>
							<p className="break-all">{suscripcion.Cor_Cue_Sus}</p>
							<p className="text-xs text-zinc-500">
								{suscripcion.Tip_Tit_Sus === "revendedor"
									? "Cuenta del cliente final"
									: "Cuenta donde se activó el servicio"}
							</p>
						</div>
					</div>
				) : null}
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Plan</p>
				<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
					<Package className="size-4" />
					<span>
						{suscripcion.Nom_Prd || "-"}
						{suscripcion.Nom_Var ? ` · ${suscripcion.Nom_Var}` : ""}
					</span>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<Calendar className="size-3.5" />
						Inicio
					</p>
					<p className="font-medium mt-1">{suscripcion.Fec_Ini_Sus ? formatDate(suscripcion.Fec_Ini_Sus) : "-"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<Calendar className="size-3.5" />
						Fin
					</p>
					<p className="font-medium mt-1">
						{suscripcion.Fec_Fin_Sus ? formatDate(suscripcion.Fec_Fin_Sus) : "Sin vencimiento"}
					</p>
					<Badge variant={getVencimientoVariant(dias)} className="mt-2">
						{formatVenceEn(dias)}
					</Badge>
				</div>
				<div className="rounded-md border p-3 sm:col-span-2">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<RefreshCw className="size-3.5" />
						Renovación automática
					</p>
					<p className="font-medium mt-1">{suscripcion.Ren_Auto ? "Sí" : "No"}</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500 flex items-center gap-1">
					<History className="size-3.5" />
					Historial de periodos
				</p>
				<SuscripcionHistorial idSus={suscripcion.Id_Sus} />
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500 flex items-center gap-1">
					<FileText className="size-3.5" />
					Notas
				</p>
				<p className="text-sm text-zinc-600 dark:text-zinc-300">{suscripcion.Not_Sus || "Sin notas."}</p>
			</div>
		</div>
	);
}
