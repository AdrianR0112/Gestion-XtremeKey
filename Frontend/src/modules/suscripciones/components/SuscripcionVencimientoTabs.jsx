import { Button } from "../../../components/ui/button";

import { Archive } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

const OPCIONES = [
	{ value: "todas", label: "Todas" },
	{ value: "por_vencer", label: "Por vencer" },
	{ value: "vencidas", label: "Vencidas" },
	{ value: "vigentes", label: "Vigentes" },
	{ value: "sin_vencimiento", label: "Sin vencimiento" },
];

/**
 * Grupo de pestañas. No hay componente Tabs en components/ui, asi que se usa el
 * mismo "pill group" que ya emplea la creacion de ventas.
 *
 * "Archivo" va separado del resto: no es otro tramo de vencimiento, es lo que
 * las demas pestañas ocultan. Se separa visualmente para dejar claro que el
 * listado normal no lo incluye.
 */
export default function SuscripcionVencimientoTabs({ value, onChange, archivadas = 0 }) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="inline-flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
				{OPCIONES.map((opcion) => (
					<Button
						key={opcion.value}
						type="button"
						size="sm"
						variant={value === opcion.value ? "default" : "ghost"}
						className="h-8"
						onClick={() => onChange(opcion.value)}
					>
						{opcion.label}
					</Button>
				))}
			</div>

			<Button
				type="button"
				size="sm"
				variant={value === "archivadas" ? "default" : "outline"}
				className="h-8"
				onClick={() => onChange(value === "archivadas" ? "todas" : "archivadas")}
			>
				<Archive className="size-4 mr-1.5" />
				Archivo
				{archivadas > 0 ? (
					<Badge variant="secondary" className="ml-1.5">
						{archivadas}
					</Badge>
				) : null}
			</Button>
		</div>
	);
}
