import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import ROUTES from "../../../constants/routes";
import { formatCurrency } from "../../../utils/currency";

export default function RenovacionesPanel({ data, etiqueta }) {
	return (
		<Card>
			<CardHeader className="flex-row items-start justify-between space-y-0">
				<div>
					<CardTitle>Renovaciones</CardTitle>
					<p className="mt-1 text-sm text-muted-foreground">{etiqueta}</p>
				</div>
				<span className="grid size-9 place-items-center rounded-lg bg-blue-500/10 text-blue-600"><RefreshCw className="size-4" /></span>
			</CardHeader>
			<CardContent className="space-y-5">
				<div>
					<p className="text-xs text-muted-foreground">Renovaciones completadas</p>
					<p className="mt-1 text-3xl font-semibold tabular-nums">{data.cantidad}</p>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Importe</p><p className="mt-1 font-semibold">{formatCurrency(data.importe)}</p></div>
					<div className="rounded-xl bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Retención</p><p className="mt-1 font-semibold">{data.tasaRenovacion.toFixed(1)}%</p></div>
				</div>
				<Link to={ROUTES.RENOVACIONES} className="inline-flex text-sm font-medium text-primary hover:underline">Ver historial de renovaciones</Link>
			</CardContent>
		</Card>
	);
}
