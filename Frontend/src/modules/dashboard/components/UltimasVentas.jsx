import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../../components/tables";

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
				<MobileExpandableList
					items={items}
					getItemId={(venta, index) => venta.id ?? index}
					resetKey={items.map((venta, index) => venta.id ?? index).join(",")}
					emptyMessage="No hay ventas registradas."
					renderSummary={(venta) => <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{venta.cliente}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{venta.producto}</p></div><StatusBadge estado={venta.estado} /></div>}
					renderDetails={(venta) => <MobileDetailGrid><MobileDetail label="Rol">{venta.rol}</MobileDetail><MobileDetail label="Duración">{venta.duracion}</MobileDetail><MobileDetail label="Productos" className="min-[380px]:col-span-2">{venta.producto}</MobileDetail></MobileDetailGrid>}
				/>
				<div className="hidden overflow-x-auto rounded-md border md:block">
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
