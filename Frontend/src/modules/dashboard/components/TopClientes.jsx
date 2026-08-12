import { UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { formatCurrency } from "../../../utils/currency";

export default function TopClientes({ items, etiqueta }) {
	return (
		<Card>
			<CardHeader><CardTitle>Top clientes · {etiqueta}</CardTitle></CardHeader>
			<CardContent className="space-y-4">
				{items.length === 0 ? <p className="text-sm text-muted-foreground">No hay clientes con compras en este periodo.</p> : items.map((item) => (
					<div key={`${item.tipo}-${item.id}`} className="flex items-center gap-3">
						<span className="grid size-9 place-items-center rounded-full bg-muted"><UsersRound className="size-4 text-muted-foreground" /></span>
						<div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.nombre}</p><p className="text-xs text-muted-foreground">{item.tipo === "cliente" ? "Cliente" : "Revendedor"} · {Number(item.compras || 0)} compras</p></div>
						<span className="text-sm font-semibold">{formatCurrency(item.monto)}</span>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
