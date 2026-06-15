import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { formatCurrency } from "../../../utils/currency";
import formatDate from "../../../utils/formatDate";
import VentaEstadoBadge from "./VentaEstadoBadge";

export default function VentaTable({
	loading,
	ventasFiltradas,
	clienteMap,
	revendedorMap,
	onView,
	onEdit,
	onDelete,
}) {
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

	const columns = useMemo(
		() => [
			{ id: "id", header: "ID", cell: (venta) => venta.Id_Ven },
			{
				id: "cliente",
				header: "Cliente / Revendedor",
				cell: (venta) => {
					if (venta.Id_Cli) {
						return venta.Nom_Cli
							? `${venta.Nom_Cli || ""} ${venta.Ape_Cli || ""}`.trim()
							: clienteMap.get(Number(venta.Id_Cli)) || "-";
					}
					if (venta.Id_Rev) {
						return venta.Nom_Rev
							? `${venta.Nom_Rev || ""} ${venta.Ape_Rev || ""}`.trim()
							: revendedorMap.get(Number(venta.Id_Rev)) || "-";
					}
					return "-";
				},
			},
			{ id: "fecha", header: "Fecha", cell: (venta) => (venta.Fec_Ven ? formatDate(venta.Fec_Ven) : "-") },
			{ id: "total", header: "Total", cell: (venta) => formatCurrency(venta.Tot_Ven || 0) },
			{ id: "estado", header: "Estado", cell: (venta) => <VentaEstadoBadge estado={venta.Est_Ven} /> },
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				cell: (venta) => (
					<div className="flex justify-end gap-1">
						<Button variant="ghost" size="icon" onClick={() => onView(venta)}>
							<Eye className="size-4" />
						</Button>
						<Button variant="ghost" size="icon" onClick={() => onEdit(venta)}>
							<Pencil className="size-4" />
						</Button>
						<Button variant="ghost" size="icon" onClick={() => onDelete(venta)}>
							<Trash2 className="size-4 text-red-600" />
						</Button>
					</div>
				),
			},
		],
		[clienteMap, revendedorMap, onDelete, onEdit, onView]
	);

	const table = useReactTable({
		data: ventasFiltradas,
		columns,
		state: { pagination },
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: false,
	});

	if (loading) {
		return <p className="text-sm text-zinc-500">Cargando ventas...</p>;
	}

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Cliente / Revendedor</TableHead>
						<TableHead>Fecha</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead className="text-right">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => {
							const venta = row.original;
							return (
								<TableRow key={venta.Id_Ven}>
									{columns.map((column) => (
										<TableCell key={column.id} className={column.id === "id" ? "font-medium" : undefined}>
											{typeof column.cell === "function" ? column.cell(venta) : null}
										</TableCell>
									))}
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell colSpan={6} className="h-24 text-center">
								No hay ventas.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-sm text-zinc-500">
					Mostrando {table.getRowModel().rows.length} de {ventasFiltradas.length} ventas
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Siguiente
					</Button>
				</div>
			</div>
		</div>
	);
}
