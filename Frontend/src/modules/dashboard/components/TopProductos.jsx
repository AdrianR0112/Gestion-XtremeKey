import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { formatCurrency } from "../../../utils/currency";

export default function TopProductos({ items, etiqueta }) {
	return (
		<Card className="lg:col-span-2">
			<CardHeader><CardTitle>Top productos · {etiqueta}</CardTitle></CardHeader>
			<CardContent className="space-y-4">
				{items.length === 0 ? <p className="text-sm text-muted-foreground">No hay productos vendidos en este periodo.</p> : items.map((item) => (
					<div key={item.id} className="flex items-center gap-3">
						<span className="grid size-10 place-items-center rounded-lg bg-muted"><Package className="size-4 text-muted-foreground" /></span>
						<div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.nombre || "Sin nombre"}</p><p className="text-xs text-muted-foreground">{Number(item.cantidad || 0)} unidad(es)</p></div>
						<div className="text-right"><p className="text-sm font-semibold">{formatCurrency(item.monto)}</p><p className="text-xs text-emerald-600">{formatCurrency(item.ganancia)} ganancia</p></div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
