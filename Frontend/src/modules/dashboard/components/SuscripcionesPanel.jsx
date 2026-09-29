import { AlertTriangle, CalendarClock, CheckCircle2, Package, Store, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import ROUTES from "../../../constants/routes";

export default function SuscripcionesPanel({ resumen, conteos }) {
	const items = [
		{ label: "Activas", value: resumen.activas, icon: CheckCircle2, color: "text-emerald-600", to: `${ROUTES.SUSCRIPCIONES}?estado=activa` },
		{ label: "Por vencer", value: resumen.porVencer, icon: CalendarClock, color: "text-amber-600", to: `${ROUTES.SUSCRIPCIONES}?vencimiento=por_vencer` },
		{ label: "Vencidas", value: resumen.vencidas, icon: AlertTriangle, color: "text-rose-600", to: `${ROUTES.SUSCRIPCIONES}?vencimiento=vencidas` },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Suscripciones</CardTitle>
				<p className="text-sm text-muted-foreground">Estado actual de la cartera</p>
			</CardHeader>
			<CardContent className="space-y-3">
				{items.map((item) => {
					const Icon = item.icon;
					return (
						<Link key={item.label} to={item.to} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50">
							<Icon className={`size-4 ${item.color}`} />
							<span className="flex-1 text-sm font-medium">{item.label}</span>
							<span className="text-lg font-semibold tabular-nums">{item.value}</span>
						</Link>
					);
				})}

				<div className="border-t pt-3">
					<p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Base activa</p>
					<div className="grid grid-cols-3 gap-2 text-center">
						<div className="rounded-lg bg-muted/50 p-2"><UsersRound className="mx-auto size-3.5 text-blue-600" /><p className="mt-1 font-semibold">{conteos.clientes}</p><p className="text-[11px] text-muted-foreground">Clientes</p></div>
						<div className="rounded-lg bg-muted/50 p-2"><Store className="mx-auto size-3.5 text-violet-600" /><p className="mt-1 font-semibold">{conteos.revendedores}</p><p className="text-[11px] text-muted-foreground">Revendedores</p></div>
						<div className="rounded-lg bg-muted/50 p-2"><Package className="mx-auto size-3.5 text-teal-600" /><p className="mt-1 font-semibold">{conteos.productos}</p><p className="text-[11px] text-muted-foreground">Productos</p></div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
