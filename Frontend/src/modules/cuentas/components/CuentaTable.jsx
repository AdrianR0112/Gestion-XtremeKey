import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, Columns3, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import formatDate from "../../../utils/formatDate";
import CuentaEstadoBadge from "./CuentaEstadoBadge";

export default function CuentaTable({
	cuentas,
	selectedCuentaId,
	searchTerm,
	onSearchTermChange,
	estadoFilter,
	onEstadoFilterChange,
	onSelect,
	onViewDetail,
	onEdit,
	onDelete,
	productoMap,
	varianteMap,
	proveedorMap,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = useMemo(
		() => [
			{
				accessorKey: "Nom_Cue",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Cuenta
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => <span className="font-medium">{row.original.Nom_Cue || "-"}</span>,
			},
			{
				id: "producto",
				header: "Producto",
				cell: ({ row }) => {
					const id = row.original.Id_Prd;
					return id ? productoMap.get(Number(id)) || `#${id}` : "-";
				},
			},
			{
				id: "variante",
				header: "Variante",
				cell: ({ row }) => {
					const id = row.original.Id_Var;
					return id ? varianteMap.get(Number(id)) || `#${id}` : "-";
				},
			},
			{
				accessorKey: "Usu_Cue",
				header: "Usuario",
				cell: ({ row }) => row.original.Usu_Cue || "-",
			},
			{
				accessorKey: "Fec_Ven_Cue",
				header: "Vencimiento",
				cell: ({ row }) => (row.original.Fec_Ven_Cue ? formatDate(row.original.Fec_Ven_Cue) : "-"),
			},
			{
				id: "estado",
				header: "Estado",
				cell: ({ row }) => <CuentaEstadoBadge estado={row.original.Est_Cue} />,
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const cuenta = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onViewDetail(cuenta); }}>
								<Eye className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onEdit(cuenta); }}>
								<Pencil className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onDelete(cuenta); }}>
								<Trash2 className="size-4 text-red-600" />
							</Button>
						</div>
					);
				},
			},
		],
		[onDelete, onEdit, onViewDetail, productoMap, varianteMap]
	);

	const table = useReactTable({
		data: cuentas,
		columns,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { sorting, columnVisibility },
	});

	return (
		<div className="space-y-3">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-col sm:flex-row gap-3 lg:flex-1">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
						<Input
							value={searchTerm}
							onChange={(event) => onSearchTermChange(event.target.value)}
							placeholder="Buscar por nombre, usuario, perfil o proveedor"
							className="pl-8"
						/>
					</div>
					<Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
						<SelectTrigger className="sm:w-52">
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							<SelectItem value="disponible">Disponible</SelectItem>
							<SelectItem value="ocupada">Ocupada</SelectItem>
							<SelectItem value="parcial">Parcial</SelectItem>
							<SelectItem value="vencida">Vencida</SelectItem>
							<SelectItem value="suspendida">Suspendida</SelectItem>
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
						{table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						))}
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
							table.getRowModel().rows.map((row) => {
								const isSelected = Number(selectedCuentaId) === Number(row.original.Id_Cue);
								return (
									<TableRow
										key={row.id}
										data-cuenta-row="true"
										onClick={() => onSelect(row.original.Id_Cue)}
										className={`cursor-pointer ${isSelected ? "bg-zinc-100/70 dark:bg-zinc-800/70" : ""}`}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No hay resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-zinc-500">
					{table.getRowModel().rows.length} fila(s) visibles de {cuentas.length}
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Anterior
					</Button>
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Siguiente
					</Button>
				</div>
			</div>
		</div>
	);
}
