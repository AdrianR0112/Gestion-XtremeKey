import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

function TrendPill({ value }) {
	if (value == null) {
		return <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">—</span>;
	}

	const sube = value >= 0;
	const Icon = sube ? ArrowUpRight : ArrowDownLeft;
	return (
		<span className={cn(
			"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
			sube ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
		)}>
			{value > 0 ? "+" : ""}{value.toFixed(1)}%
			<Icon className="size-3.5" />
		</span>
	);
}

export default function KpiCard({ label, valor, variacion, icono, color, hint, children }) {
	const Icono = icono;
	return (
		<Card className="h-full">
			<CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{label}</CardTitle>
				<span className={cn("grid size-9 place-items-center rounded-lg bg-muted", color)}>
					<Icono className="size-4" />
				</span>
			</CardHeader>
			<CardContent className="flex h-full flex-col">
				<div className="flex flex-wrap items-end gap-x-3 gap-y-2">
					<p className="whitespace-nowrap text-xl font-bold leading-none tabular-nums sm:text-2xl">{valor}</p>
					<div className="ml-auto shrink-0"><TrendPill value={variacion} /></div>
				</div>
				<p className="mt-1 text-xs text-muted-foreground">{hint}</p>
				{children}
			</CardContent>
		</Card>
	);
}
