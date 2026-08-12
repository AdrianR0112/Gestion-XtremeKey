import { AlertTriangle, CalendarClock, CheckCircle2, Layers, Store } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tarjetas de cabecera. Cada una es un atajo a su filtro: al pulsarlas la tabla
 * se recarga con ese criterio, que es el mismo que aplica el servidor.
 */
export default function SuscripcionKpiCards({ resumen, diasPorVencer = 7, estadoFilter, vencimientoFilter, titularFilter, onSelect }) {
	const tarjetas = [
		{
			id: "activas",
			label: "Activas",
			valor: resumen?.activas ?? 0,
			icono: CheckCircle2,
			color: "text-emerald-600 dark:text-emerald-400",
			activa: estadoFilter === "activa" && vencimientoFilter === "todas" && titularFilter === "todos",
			filtros: { estado: "activa", vencimiento: "todas", titular: "todos" },
		},
		{
			id: "por-vencer",
			label: `Vencen en ${diasPorVencer} días`,
			valor: resumen?.por_vencer ?? 0,
			icono: CalendarClock,
			color: "text-amber-600 dark:text-amber-400",
			activa: vencimientoFilter === "por_vencer",
			filtros: { estado: "activa", vencimiento: "por_vencer", titular: "todos" },
		},
		{
			id: "vencidas",
			label: "Vencidas",
			valor: resumen?.vencidas ?? 0,
			icono: AlertTriangle,
			color: "text-red-600 dark:text-red-400",
			activa: vencimientoFilter === "vencidas",
			filtros: { estado: "todos", vencimiento: "vencidas", titular: "todos" },
		},
		{
			id: "revendedores",
			label: "De revendedores",
			valor: resumen?.de_revendedor ?? 0,
			icono: Store,
			color: "text-blue-600 dark:text-blue-400",
			activa: titularFilter === "revendedor",
			filtros: { estado: "todos", vencimiento: "todas", titular: "revendedor" },
		},
		{
			id: "total",
			label: "Total",
			valor: resumen?.total ?? 0,
			icono: Layers,
			color: "text-zinc-600 dark:text-zinc-400",
			activa: estadoFilter === "todos" && vencimientoFilter === "todas" && titularFilter === "todos",
			filtros: { estado: "todos", vencimiento: "todas", titular: "todos" },
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{tarjetas.map((tarjeta) => {
				const Icono = tarjeta.icono;
				return (
					<button
						key={tarjeta.id}
						type="button"
						onClick={() => onSelect(tarjeta.filtros)}
						className={cn(
							"rounded-2xl border bg-white/85 px-4 py-3 text-left transition-colors dark:bg-zinc-900/85",
							"hover:border-zinc-400 dark:hover:border-zinc-600",
							tarjeta.activa
								? "border-zinc-900 shadow-sm dark:border-zinc-100"
								: "border-zinc-200 dark:border-zinc-800"
						)}
					>
						<div className="flex items-center justify-between gap-2">
							<p className="text-xs font-medium text-zinc-500">{tarjeta.label}</p>
							<Icono className={cn("size-4 shrink-0", tarjeta.color)} />
						</div>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums">{tarjeta.valor}</p>
					</button>
				);
			})}
		</div>
	);
}
