<<<<<<< Updated upstream
﻿import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import {
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
=======
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../../components/tables";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
				<div className="text-sm text-zinc-500">Mostrando {rows.length} de {renovacionesFiltradas.length} renovaciones</div>
				<div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
					<Button variant="outline" size="sm" onClick={() => setPageIndex((value) => Math.max(0, value - 1))} disabled={pageIndex === 0}>Anterior</Button>
					<Button variant="outline" size="sm" onClick={() => setPageIndex((value) => Math.min(pageCount - 1, value + 1))} disabled={pageIndex >= pageCount - 1}>Siguiente</Button>
>>>>>>> Stashed changes
				</div>
			</div>
		</div>
	);
}
