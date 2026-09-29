import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../../components/tables";
import { formatCurrency } from "../../../utils/currency";
import formatDate from "../../../utils/formatDate";

export default function RenovacionTable({ loading, renovacionesFiltradas, onView }) {
	const [pageIndex, setPageIndex] = useState(0);
	const pageSize = 10;
	const pageCount = Math.max(1, Math.ceil(renovacionesFiltradas.length / pageSize));
	const rows = renovacionesFiltradas.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

	if (loading) return <p className="text-sm text-zinc-500">Cargando renovaciones...</p>;

	return (
		<div className="space-y-4">
			<MobileExpandableList
				items={rows}
				getItemId={(item) => item.Id_Dve}
				resetKey={`${pageIndex}-${renovacionesFiltradas.map((item) => item.Id_Dve).join(",")}`}
				emptyMessage="No hay renovaciones."
				renderSummary={(item) => <div className="min-w-0"><p className="truncate font-semibold">{item.Nom_Prd || `Renovación #${item.Id_Dve}`}</p><p className="mt-1 truncate text-xs text-muted-foreground">{`${item.Nom_Cli || ""} ${item.Ape_Cli || ""}`.trim() || "Sin cliente"}</p></div>}
				renderDetails={(item) => <MobileDetailGrid><MobileDetail label="Detalle anterior">#{item.Id_Dve_Ant}</MobileDetail><MobileDetail label="Detalle nuevo">#{item.Id_Dve}</MobileDetail><MobileDetail label="Venta anterior">{item.Cod_Ven_Ant || `#${item.Id_Ven_Ant}`}</MobileDetail><MobileDetail label="Venta nueva">{item.Cod_Ven_Nue || `#${item.Id_Ven_Nue}`}</MobileDetail><MobileDetail label="Vigencia">{formatDate(item.Fec_Ini_Dve_Nue)} – {formatDate(item.Fec_Fin_Dve_Nue)}</MobileDetail><MobileDetail label="Precio">{formatCurrency(Number(item.Pre_Uni_Dve_Nue || 0) - Number(item.Des_Uni_Dve_Nue || 0))}</MobileDetail></MobileDetailGrid>}
				renderActions={(item) => <Button className="col-span-2" variant="outline" onClick={() => onView(item)}><Eye className="size-4" />Ver detalle</Button>}
			/>

			<div className="hidden overflow-x-auto rounded-md border md:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Detalle nuevo</TableHead>
							<TableHead>Detalle anterior</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead>Producto</TableHead>
							<TableHead>Ventas</TableHead>
							<TableHead>Vigencia nueva</TableHead>
							<TableHead>Precio</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length ? rows.map((item) => (
							<TableRow key={item.Id_Dve}>
								<TableCell className="font-medium">#{item.Id_Dve}</TableCell>
								<TableCell>#{item.Id_Dve_Ant}</TableCell>
								<TableCell>{`${item.Nom_Cli || ""} ${item.Ape_Cli || ""}`.trim() || "-"}</TableCell>
								<TableCell>
									<p className="font-medium">{item.Nom_Prd || "-"}</p>
									{item.Nom_Var ? <p className="text-xs text-zinc-500">{item.Nom_Var}</p> : null}
								</TableCell>
								<TableCell>
									<p>{item.Cod_Ven_Ant || `#${item.Id_Ven_Ant}`}</p>
									<p className="text-xs text-zinc-500">→ {item.Cod_Ven_Nue || `#${item.Id_Ven_Nue}`}</p>
								</TableCell>
								<TableCell>
									<p>{formatDate(item.Fec_Ini_Dve_Nue)}</p>
									<p className="text-xs text-zinc-500">{formatDate(item.Fec_Fin_Dve_Nue)}</p>
								</TableCell>
								<TableCell>{formatCurrency(Number(item.Pre_Uni_Dve_Nue || 0) - Number(item.Des_Uni_Dve_Nue || 0))}</TableCell>
								<TableCell className="text-right">
									<Button variant="ghost" size="sm" onClick={() => onView(item)}>Ver</Button>
								</TableCell>
							</TableRow>
						)) : (
							<TableRow><TableCell colSpan={8} className="h-24 text-center">No hay renovaciones.</TableCell></TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-sm text-zinc-500">Mostrando {rows.length} de {renovacionesFiltradas.length} renovaciones</div>
				<div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
					<Button variant="outline" size="sm" onClick={() => setPageIndex((value) => Math.max(0, value - 1))} disabled={pageIndex === 0}>Anterior</Button>
					<Button variant="outline" size="sm" onClick={() => setPageIndex((value) => Math.min(pageCount - 1, value + 1))} disabled={pageIndex >= pageCount - 1}>Siguiente</Button>
				</div>
			</div>
		</div>
	);
}
