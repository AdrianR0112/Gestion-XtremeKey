import { Calendar, CheckCircle2, Clock, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { Progress } from "../../../components/ui/progress";
import { PrioridadBadge, EstadoBadge } from "./TareaBadges";

export default function TareaCard({ tarea, onEdit, onDelete }) {
	if (!tarea) return null;

	return (
		<div data-tarea-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{tarea.Tit_Tar}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{tarea.Id_Tar}</p>
					</div>
					<EstadoBadge estado={tarea.Est_Tar} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(tarea)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(tarea)}>
						<Trash2 className="size-4 mr-2 text-red-600" />
						Eliminar
					</Button>
				</div>
			</div>

			<Separator />

			{/* Descripción */}
			{tarea.Des_Tar && (
				<div className="space-y-3">
					<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Descripción</p>
					<p className="text-sm text-zinc-600 dark:text-zinc-300">{tarea.Des_Tar}</p>
				</div>
			)}

			{(tarea.Des_Tar) && <Separator />}

			{/* Información principal */}
			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Información</p>
				<div className="space-y-3 text-sm">
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Clock className="size-4" />
						<span>Prioridad: </span>
						<PrioridadBadge prioridad={tarea.Pri_Tar} />
					</div>
					{tarea.Fec_Lim_Tar && (
						<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
							<Calendar className="size-4" />
							<span>Fecha límite: {new Date(tarea.Fec_Lim_Tar).toLocaleDateString()}</span>
						</div>
					)}
				</div>
			</div>

			<Separator />

			{/* Progreso */}
			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Progreso</p>
				<div className="space-y-2">
					<div className="flex items-center justify-between gap-2">
						<Progress value={tarea.Pro_Tar} className="flex-1" />
						<span className="text-sm font-semibold">{tarea.Pro_Tar}%</span>
					</div>
				</div>
			</div>

			<Separator />

			{/* Relaciones */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				{tarea.Id_Cli && (
					<div className="rounded-md border p-3">
						<p className="text-xs text-zinc-500">Cliente</p>
						<p className="font-medium mt-1">ID #{tarea.Id_Cli}</p>
					</div>
				)}
				{tarea.Id_Ven && (
					<div className="rounded-md border p-3">
						<p className="text-xs text-zinc-500">Venta</p>
						<p className="font-medium mt-1">ID #{tarea.Id_Ven}</p>
					</div>
				)}
				{tarea.Fec_Com_Tar && (
					<div className="rounded-md border p-3">
						<p className="text-xs text-zinc-500 flex items-center gap-1">
							<CheckCircle2 className="size-3.5" />
							Completada
						</p>
						<p className="font-medium mt-1">
							{new Date(tarea.Fec_Com_Tar).toLocaleDateString()}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
