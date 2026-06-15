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
import RenovacionEstadoBadge from "./RenovacionEstadoBadge";

export default function RenovacionTable({
	loading,
	renovacionesFiltradas,
	onEdit,
	onDelete,
}) {
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

	const columns = useMemo(
		() => [
			{ id: "id", header: "ID", cell: (item) => `#${item.Id_Ren}` },
			{
				id: "cliente",
				header: "Cliente",
				cell: (item) => item.Nom_Cli || "-",
			},
			{
				id: "producto",
				header: "Producto",
				cell: (item) => (
					<div>
						<p className="font-medium">{item.Nom_Prd || "-"}</p>
						{item.Nom_Var ? <p className="text-xs text-zinc-500">{item.Nom_Var}</p> : null}
					</div>
				),
			},
			{
				id: "tipo",
				header: "Tipo",
				cell: (item) => <span className="uppercase text-xs">{item.Tip_Ren || "-"}</span>,
			},
			{
				id: "fechas",
				header: "Vence - Inicia",
				cell: (item) => (
					<div className="text-xs">
						<p>{item.Fec_Ven_Ant_Ren ? formatDate(item.Fec_Ven_Ant_Ren) : "-"}</p>
						<p className="text-zinc-500">{item.Fec_Ini_Nue_Ren ? formatDate(item.Fec_Ini_Nue_Ren) : "-"}</p>
					</div>
				),
			},
			{
				id: "precios",
				header: "Original -> Nuevo",
				cell: (item) => (
					<div className="text-xs">
						<p>{formatCurrency(item.Pre_Ori_Ren || 0)}</p>
						<p className="text-zinc-500">{item.Pre_Ren != null ? formatCurrency(item.Pre_Ren) : "-"}</p>
					</div>
				),
			},
			{
				id: "estado",
				header: "Estado",
				cell: (item) => <RenovacionEstadoBadge estado={item.Est_Ren} />,
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				cell: (item) => (
					<div className="flex justify-end gap-1">
						<Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
							<Pencil className="size-4" />
						</Button>
						<Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
							<Trash2 className="size-4 text-red-600" />
						</Button>
					</div>
				),
			},
		],
		[onEdit, onDelete]
	);

	const table = useReactTable({
		data: renovacionesFiltradas,
		columns,
		state: { pagination },
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: false,
	});

	if (loading) {
		return <p className="text-sm text-zinc-500">Cargando renovaciones...</p>;
	}

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead>Producto</TableHead>
							<TableHead>Tipo</TableHead>
							<TableHead>Vence - Inicia</TableHead>
							<TableHead>Original - Nuevo</TableHead>
							<TableHead>Estado</TableHead>
							<TableHead className="text-right">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => {
								const item = row.original;
								return (
									<TableRow key={item.Id_Ren}>
										{columns.map((column) => (
											<TableCell key={column.id} className={column.id === "id" ? "font-medium" : undefined}>
												{typeof column.cell === "function" ? column.cell(item) : null}
											</TableCell>
										))}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={8} className="h-24 text-center">
									No hay renovaciones.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-sm text-zinc-500">
					Mostrando {table.getRowModel().rows.length} de {renovacionesFiltradas.length} renovaciones
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
