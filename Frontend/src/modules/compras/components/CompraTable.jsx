import { useState } from "react";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Columns3, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import CompraEstadoBadge from "./CompraEstadoBadge";

export default function CompraTable({
	loading,
	comprasFiltradas,
	proveedorMap,
	onView,
	onEdit,
	onDelete,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = [
		{
			id: "Id_Com",
			accessorKey: "Id_Com",
			header: ({ column }) => (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					ID
					<ArrowUpDown className="ml-2 size-4" />
				</Button>
			),
			cell: ({ row }) => <span className="font-medium">{row.original.Id_Com}</span>,
		},
		{
			accessorKey: "Id_Pro",
			header: "Proveedor",
			cell: ({ row }) => proveedorMap[row.original.Id_Pro]?.Nom_Pro || "-",
		},
		{
			accessorKey: "Sub_Tot_Com",
			header: "Subtotal",
			cell: ({ row }) => `$${Number(row.original.Sub_Tot_Com).toFixed(2)}`,
		},
		{
			accessorKey: "Tot_Com",
			header: "Total",
			cell: ({ row }) => `$${Number(row.original.Tot_Com).toFixed(2)}`,
		},
		{
			accessorKey: "Met_Pag_Com",
			header: "Método de Pago",
			cell: ({ row }) => row.original.Met_Pag_Com || "-",
		},
		{
			id: "estado",
			header: "Estado",
			cell: ({ row }) => <CompraEstadoBadge estado={row.original.Est_Com} />,
		},
		{
			id: "acciones",
			header: () => <div className="text-right">Acciones</div>,
			enableHiding: false,
			cell: ({ row }) => {
				const compra = row.original;
				return (
					<div className="flex justify-end gap-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onView(compra);
							}}
						>
							<Eye className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onEdit(compra);
							}}
						>
							<Pencil className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onDelete(compra);
							}}
						>
							<Trash2 className="size-4 text-red-600" />
						</Button>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: comprasFiltradas || [],
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnVisibility,
		},
	});

	if (loading) {
		return <p className="text-sm text-zinc-500">Cargando compras...</p>;
	}

	return (
		<div className="space-y-3">
			<div className="flex justify-end">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Columns3 className="size-4 mr-1" />
							Columnas
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{column.id.charAt(0).toUpperCase() + column.id.slice(1)}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="rounded-lg border overflow-hidden">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="text-xs sm:text-sm">
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => onView(row.original)}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="text-xs sm:text-sm">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center text-sm text-zinc-500">
									No hay compras para mostrar
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
					Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
					{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de{" "}
					{table.getFilteredRowModel().rows.length} compras
				</p>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
					>
						Siguiente
					</Button>
				</div>
			</div>
		</div>
	);
}
