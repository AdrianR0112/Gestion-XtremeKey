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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";

export default function DetalleCompraTable({
	detalles,
	selectedDetalleId,
	searchTerm,
	onSearchTermChange,
	onSelect,
	onViewDetail,
	onEdit,
	onDelete,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = [
		{
			id: "Id_Dco",
			accessorKey: "Id_Dco",
			header: ({ column }) => (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					ID Detalle
					<ArrowUpDown className="ml-2 size-4" />
				</Button>
			),
			cell: ({ row }) => <span className="font-medium">{row.original.Id_Dco}</span>,
		},
		{
			accessorKey: "Id_Com",
			header: "Compra",
			cell: ({ row }) => row.original.Id_Com || "-",
		},
		{
			accessorKey: "Id_Prd",
			header: "Producto",
			cell: ({ row }) => row.original.Id_Prd || "-",
		},
		{
			accessorKey: "Can_Dco",
			header: "Cantidad",
			cell: ({ row }) => row.original.Can_Dco || 0,
		},
		{
			accessorKey: "Pre_Uni_Dco",
			header: "Precio Unitario",
			cell: ({ row }) => `$${Number(row.original.Pre_Uni_Dco).toFixed(2)}`,
		},
		{
			accessorKey: "Sub_Tot_Dco",
			header: "Subtotal",
			cell: ({ row }) => `$${Number(row.original.Sub_Tot_Dco).toFixed(2)}`,
		},
		{
			id: "acciones",
			header: () => <div className="text-right">Acciones</div>,
			enableHiding: false,
			cell: ({ row }) => {
				const detalle = row.original;
				return (
					<div className="flex justify-end gap-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onViewDetail(detalle);
							}}
						>
							<Eye className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onEdit(detalle);
							}}
						>
							<Pencil className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onDelete(detalle);
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
		data: detalles,
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

	return (
		<div className="space-y-3">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1 sm:max-w-xs">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
					<Input
						type="text"
						placeholder="Buscar por ID..."
						value={searchTerm}
						onChange={(e) => onSearchTermChange(e.target.value)}
						className="pl-9"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon">
							<Columns3 className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="border border-zinc-200 rounded-lg dark:border-zinc-800">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={selectedDetalleId === row.original.Id_Dco ? "bg-zinc-50 dark:bg-zinc-800/50" : ""}
									onClick={() => onSelect(row.original.Id_Dco)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No hay detalles de compras.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
				<div>
					Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
					{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{" "}
					de {table.getFilteredRowModel().rows.length}
				</div>
				<div className="flex gap-1">
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
