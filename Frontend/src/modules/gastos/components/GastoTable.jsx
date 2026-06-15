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
import GastoEstadoBadge from "./GastoEstadoBadge";

const CATEGORIAS = [
	{ label: "Todas", value: "todas" },
	{ label: "operativo", value: "operativo" },
	{ label: "administrativo", value: "administrativo" },
	{ label: "marketing", value: "marketing" },
	{ label: "proveedor", value: "proveedor" },
	{ label: "impuesto", value: "impuesto" },
	{ label: "otro", value: "otro" },
];

export default function GastoTable({
	loading,
	gastosFiltrados,
	searchTerm,
	onSearchTermChange,
	categoriaFilter,
	onCategoriaFilterChange,
	onView,
	onEdit,
	onDelete,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = [
		{
			id: "Id_Gas",
			accessorKey: "Id_Gas",
			header: ({ column }) => (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					ID
					<ArrowUpDown className="ml-2 size-4" />
				</Button>
			),
			cell: ({ row }) => <span className="font-medium">{row.original.Id_Gas}</span>,
		},
		{
			accessorKey: "Nom_Gas",
			header: "Descripción",
			cell: ({ row }) => <span className="font-medium">{row.original.Nom_Gas}</span>,
		},
		{
			accessorKey: "Mon_Gas",
			header: "Monto",
			cell: ({ row }) => `$${Number(row.original.Mon_Gas).toFixed(2)}`,
		},
		{
			accessorKey: "Cat_Gas",
			header: "Categoría",
			cell: ({ row }) => (
				<span className="text-sm capitalize">{row.original.Cat_Gas || "-"}</span>
			),
		},
		{
			accessorKey: "Fec_Gas",
			header: "Fecha",
			cell: ({ row }) => new Date(row.original.Fec_Gas).toLocaleDateString("es-EC"),
		},
		{
			accessorKey: "Est_Gas",
			header: "Estado",
			cell: ({ row }) => <GastoEstadoBadge estado={row.original.Est_Gas} />,
		},
		{
			id: "acciones",
			header: () => <div className="text-right">Acciones</div>,
			enableHiding: false,
			cell: ({ row }) => {
				const gasto = row.original;
				return (
					<div className="flex justify-end gap-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onView(gasto);
							}}
						>
							<Eye className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onEdit(gasto);
							}}
						>
							<Pencil className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={(event) => {
								event.stopPropagation();
								onDelete(gasto);
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
		data: gastosFiltrados || [],
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
		return <p className="text-sm text-zinc-500">Cargando gastos...</p>;
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-col sm:flex-row gap-3 lg:flex-1">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
						<Input
							value={searchTerm}
							onChange={(event) => onSearchTermChange(event.target.value)}
							placeholder="Buscar gasto o proveedor"
							className="pl-8"
						/>
					</div>
					<Select
						value={categoriaFilter || "todas"}
						onValueChange={(v) => onCategoriaFilterChange(v === "todas" ? "" : v)}
					>
						<SelectTrigger className="sm:w-44">
							<SelectValue placeholder="Categoría" />
						</SelectTrigger>
						<SelectContent>
							{CATEGORIAS.map((categoria) => (
								<SelectItem key={categoria.value} value={categoria.value}>
									{categoria.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Columns3 className="mr-2 size-4" />
							Columnas
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						{table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
							const label =
								column.id === "Id_Gas" ? "ID" :
								column.id === "Nom_Gas" ? "Descripción" :
								column.id === "Mon_Gas" ? "Monto" :
								column.id === "Cat_Gas" ? "Categoría" :
								column.id === "Fec_Gas" ? "Fecha" :
								column.id === "Est_Gas" ? "Estado" :
								column.id;
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
								>
									{label}
								</DropdownMenuCheckboxItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
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
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center text-sm text-zinc-500">
									No hay gastos para mostrar
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-zinc-500">
					{table.getRowModel().rows.length} fila(s) visibles de {gastosFiltrados.length}
				</div>
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
