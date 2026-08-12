import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";

function StatusBadge({ estado }) {
	if (estado === "activo") return <Badge className="bg-emerald-500/10 text-emerald-600">Activo</Badge>;
	if (estado === "por culminar") return <Badge className="bg-amber-500/10 text-amber-600">Por culminar</Badge>;
	if (estado === "vencido") return <Badge className="bg-rose-500/10 text-rose-600">Vencido</Badge>;
	return <Badge className="bg-zinc-500/10 text-zinc-600">Inactivo</Badge>;
}

export default function UltimasVentas({ items }) {
	return (
		<Card>
			<CardHeader><CardTitle>Últimas ventas completadas</CardTitle></CardHeader>
			<CardContent>
				<div className="overflow-x-auto rounded-md border">
					<Table>
						<TableHeader><TableRow><TableHead>Cliente / Revendedor</TableHead><TableHead>Rol</TableHead><TableHead>Productos</TableHead><TableHead>Duración</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
						<TableBody>
							{items.length === 0 ? <TableRow><TableCell colSpan={5} className="h-20 text-center">No hay ventas registradas.</TableCell></TableRow> : items.map((venta) => (
								<TableRow key={venta.id}><TableCell className="font-medium">{venta.cliente}</TableCell><TableCell>{venta.rol}</TableCell><TableCell className="max-w-80 whitespace-normal">{venta.producto}</TableCell><TableCell>{venta.duracion}</TableCell><TableCell><StatusBadge estado={venta.estado} /></TableCell></TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
