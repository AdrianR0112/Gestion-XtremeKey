import { Tag, Layers3, Hash, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import CategoriaEstadoBadge from "./CategoriaEstadoBadge";

export default function CategoriaCard({ categoria, onEdit, onDelete }) {
	if (!categoria) return null;

	return (
		<div data-categoria-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{categoria.Nom_Cat || "-"}</h3>
						<p className="text-xs text-zinc-500 mt-1">ID #{categoria.Id_Cat}</p>
					</div>
					<CategoriaEstadoBadge estado={categoria.Est_Cat} />
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(categoria)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
					<Button variant="outline" size="sm" onClick={() => onDelete(categoria)}>
						<Trash2 className="size-4 mr-2 text-red-600" />
						Eliminar
					</Button>
				</div>
			</div>

			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<Layers3 className="size-3.5" />
						Categoria padre
					</p>
					<p className="font-medium mt-1">{categoria.Id_Cat_Pad || "Ninguna"}</p>
				</div>
				<div className="rounded-md border p-3">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<Hash className="size-3.5" />
						Orden
					</p>
					<p className="font-medium mt-1">{categoria.Ord_Cat ?? "-"}</p>
				</div>
				<div className="rounded-md border p-3 sm:col-span-2">
					<p className="text-xs text-zinc-500 flex items-center gap-1">
						<Tag className="size-3.5" />
						Icono
					</p>
					<p className="font-medium mt-1">{categoria.Ico_Cat || "Sin icono"}</p>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Descripcion</p>
				<p className="text-sm text-zinc-600 dark:text-zinc-300">{categoria.Des_Cat || "Sin descripcion."}</p>
			</div>
		</div>
	);
}
