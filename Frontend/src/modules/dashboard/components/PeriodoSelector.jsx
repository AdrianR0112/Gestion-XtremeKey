import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";

const PERIODOS = [
	{ value: "hoy", label: "Hoy" },
	{ value: "semana", label: "Semana" },
	{ value: "mes", label: "Mes" },
	{ value: "trimestre", label: "Trimestre" },
	{ value: "anio", label: "Año" },
];

export default function PeriodoSelector({ periodo, ancla, etiqueta, actualizando, onPeriodoChange, onAnterior, onSiguiente, onActual }) {
	return (
		<div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
		<div className="inline-flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
			{PERIODOS.map((opcion) => (
				<Button
					key={opcion.value}
					type="button"
					size="sm"
					variant={periodo === opcion.value ? "default" : "ghost"}
					className="h-8"
					onClick={() => onPeriodoChange(opcion.value)}
				>
					{opcion.label}
				</Button>
			))}
		</div>

		<div className="flex flex-wrap items-center gap-2">
			<Button type="button" size="icon" variant="outline" onClick={onAnterior} disabled={ancla <= -60} aria-label="Periodo anterior">
				<ChevronLeft className="size-4" />
			</Button>
			<div className={cn("min-w-40 text-center transition-opacity", actualizando && "opacity-60")}>
				<p className="text-sm font-semibold">{etiqueta}</p>
				<p className="text-xs text-muted-foreground">Periodo seleccionado</p>
			</div>
			<Button type="button" size="icon" variant="outline" onClick={onSiguiente} disabled={ancla === 0} aria-label="Periodo siguiente">
				<ChevronRight className="size-4" />
			</Button>
			{ancla !== 0 ? (
				<Button type="button" size="sm" variant="ghost" onClick={onActual}>Hoy</Button>
			) : null}
		</div>
		</div>
	);
}
