import { Mail, MapPin, Phone, Clock3, Percent, Pencil } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";

export default function ConfiguracionCard({ configuracion, isCurrent, onEdit }) {
	if (!configuracion) return null;

	return (
		<div data-configuracion-detalle="true" className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-2">
					<div>
						<h3 className="text-lg font-semibold">{configuracion.Nom_Emp_Con || "Configuracion"}</h3>
					</div>
					{isCurrent ? <Badge>Actual</Badge> : <Badge variant="secondary">Registrada</Badge>}
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(configuracion)}>
						<Pencil className="size-4 mr-2" />
						Editar
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				{configuracion.Log_Con ? (
					<div className="rounded-lg border bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
						<img
							src={`data:image/*;base64,${configuracion.Log_Con}`}
							alt="Logo"
							className="w-full h-32 object-contain"
						/>
					</div>
				) : null}

				<div className="space-y-3 text-sm">
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<MapPin className="size-4" />
						<span>{configuracion.Dir_Con || "Sin direccion"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Phone className="size-4" />
						<span>{configuracion.Tel_Con || "Sin telefono"}</span>
					</div>
					<div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
						<Mail className="size-4" />
						<span>{configuracion.Ema_Con || "Sin correo"}</span>
					</div>
				</div>

				<Separator />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
					<div className="rounded-md border p-3">
						<p className="text-xs text-zinc-500">Moneda/indice</p>
						<p className="font-medium mt-1">{configuracion.Mon_Con === "" ? "-" : configuracion.Mon_Con}</p>
					</div>
					<div className="rounded-md border p-3">
						<p className="text-xs text-zinc-500 flex items-center gap-1">
							<Percent className="size-3.5" />
							Impuesto
						</p>
						<p className="font-medium mt-1">
							{!configuracion.Hab_Imp_Con
								? "Desactivado"
								: configuracion.Imp_Con === "" || configuracion.Imp_Con === null
								? "-"
								: `${configuracion.Imp_Con}%`}
						</p>
					</div>
					<div className="rounded-md border p-3 sm:col-span-2">
						<p className="text-xs text-zinc-500 flex items-center gap-1">
							<Clock3 className="size-3.5" />
							Zona horaria
						</p>
						<p className="font-medium mt-1">{configuracion.Zon_Hor_Con || "-"}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
