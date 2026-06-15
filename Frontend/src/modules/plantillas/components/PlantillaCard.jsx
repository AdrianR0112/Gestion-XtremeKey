import { Mail, MessageSquare, Pencil, Smartphone, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { TipoBadge, CanalBadge, EstadoBadge } from "./PlantillaBadges";

export default function PlantillaCard({ plantilla, onEdit, onDelete }) {
	if (!plantilla) return null;

	const canalIcon = {
		whatsapp: <MessageSquare className="size-4" />,
		email: <Mail className="size-4" />,
		sms: <Smartphone className="size-4" />,
		push: <Smartphone className="size-4" />,
	};

	return (
		<div data-plantilla-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{plantilla.Nom_Pla}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{plantilla.Id_Pla}</p>
					</div>
					<EstadoBadge estado={plantilla.Est_Pla} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(plantilla)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(plantilla)}>
						<Trash2 className="size-4 mr-2 text-red-600" />
						Eliminar
					</Button>
				</div>
			</div>

			<Separator />

			{/* Información principal */}
			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Información</p>
				<div className="space-y-2 text-sm">
					<div className="flex items-center gap-2">
						<TipoBadge tipo={plantilla.Tip_Pla} />
						<span className="text-zinc-600 dark:text-zinc-300">Tipo</span>
					</div>
					<div className="flex items-center gap-2">
						{canalIcon[plantilla.Can_Pla]}
						<CanalBadge canal={plantilla.Can_Pla} />
					</div>
				</div>
			</div>

			<Separator />

			{/* Asunto (si existe) */}
			{plantilla.Asu_Pla && (
				<>
					<div className="space-y-3">
						<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Asunto</p>
						<p className="text-sm text-zinc-600 dark:text-zinc-300">{plantilla.Asu_Pla}</p>
					</div>
					<Separator />
				</>
			)}

			{/* Contenido */}
			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Contenido</p>
				<div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-200 dark:border-zinc-700">
					<p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{plantilla.Cue_Pla}</p>
				</div>
			</div>

			{/* Variables (si existen) */}
			{plantilla.Var_Pla && Object.keys(plantilla.Var_Pla).length > 0 && (
				<>
					<Separator />
					<div className="space-y-3">
						<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Variables</p>
						<div className="space-y-2">
							{Object.entries(plantilla.Var_Pla).map(([key, value]) => (
								<div key={key} className="flex justify-between items-center text-sm">
									<span className="font-mono text-zinc-600 dark:text-zinc-400">{key}</span>
									<span className="text-zinc-500 dark:text-zinc-500">{String(value)}</span>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
