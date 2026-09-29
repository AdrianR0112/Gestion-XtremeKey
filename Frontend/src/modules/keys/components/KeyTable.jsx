import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, Columns3, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../../components/tables";
import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";
import KeyEstadoBadge from "./KeyEstadoBadge";

export default function KeyTable({
	keysData,
	selectedKeyId,
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
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = useMemo(
		() => [
			{
				accessorKey: "Cla_Key",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Key
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => <span className="font-medium">{row.original.Cla_Key || "-"}</span>,
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
				accessorKey: "Pre_Ven_Key",
				header: "Precio venta",
				cell: ({ row }) => (row.original.Pre_Ven_Key === null || row.original.Pre_Ven_Key === "" ? "-" : formatCurrency(row.original.Pre_Ven_Key)),
			},
			{
				id: "porVida",
				header: "Por vida",
				cell: ({ row }) => (row.original.Es_Per_Vid_Key ? "Si" : "No"),
			},
			{
				accessorKey: "Fec_Ven_Key",
				header: "Vencimiento",
				cell: ({ row }) => (row.original.Fec_Ven_Key ? formatDate(row.original.Fec_Ven_Key) : "-"),
			},
			{
				id: "estado",
				header: "Estado",
				cell: ({ row }) => <KeyEstadoBadge estado={row.original.Est_Key} />,
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const keyItem = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onViewDetail(keyItem); }}>
								<Eye className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onEdit(keyItem); }}>
								<Pencil className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onDelete(keyItem); }}>
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
		data: keysData,
		columns,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { sorting, columnVisibility },
	});
	const mobileRows = table.getRowModel().rows.map((row) => row.original);

	return (
		<div className="space-y-3">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-col sm:flex-row gap-3 lg:flex-1">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
						<Input
							value={searchTerm}
							onChange={(event) => onSearchTermChange(event.target.value)}
							placeholder="Buscar por key, descripcion, producto o proveedor"
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
							<SelectItem value="vendida">Vendida</SelectItem>
							<SelectItem value="reservada">Reservada</SelectItem>
							<SelectItem value="vencida">Vencida</SelectItem>
							<SelectItem value="cancelada">Cancelada</SelectItem>
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

			<MobileExpandableList
				items={mobileRows}
				getItemId={(keyItem) => keyItem.Id_Key}
				resetKey={`${searchTerm}-${estadoFilter}-${sorting.map((item) => `${item.id}:${item.desc}`).join(",")}`}
				emptyMessage="No hay keys que coincidan con los filtros."
				onItemOpen={(keyItem) => onSelect(keyItem.Id_Key)}
				renderSummary={(keyItem) => <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-mono text-sm font-semibold">{keyItem.Cla_Key || `Key #${keyItem.Id_Key}`}</p><p className="mt-1 truncate text-xs text-muted-foreground">{keyItem.Id_Prd ? productoMap.get(Number(keyItem.Id_Prd)) || `Producto #${keyItem.Id_Prd}` : "Sin producto"}</p></div><KeyEstadoBadge estado={keyItem.Est_Key} /></div>}
				renderDetails={(keyItem) => <MobileDetailGrid><MobileDetail label="Variante">{keyItem.Id_Var ? varianteMap.get(Number(keyItem.Id_Var)) || `#${keyItem.Id_Var}` : "-"}</MobileDetail><MobileDetail label="Precio">{keyItem.Pre_Ven_Key === null || keyItem.Pre_Ven_Key === "" ? "-" : formatCurrency(keyItem.Pre_Ven_Key)}</MobileDetail><MobileDetail label="Por vida">{keyItem.Es_Per_Vid_Key ? "Sí" : "No"}</MobileDetail><MobileDetail label="Vencimiento">{keyItem.Fec_Ven_Key ? formatDate(keyItem.Fec_Ven_Key) : "-"}</MobileDetail></MobileDetailGrid>}
				renderActions={(keyItem) => <><Button variant="outline" onClick={() => onViewDetail(keyItem)}><Eye className="size-4" />Ver detalle</Button><Button variant="outline" onClick={() => onEdit(keyItem)}><Pencil className="size-4" />Editar</Button><Button variant="destructive" className="col-span-2" onClick={() => onDelete(keyItem)}><Trash2 className="size-4" />Eliminar</Button></>}
			/>

			<div className="hidden overflow-x-auto rounded-md border md:block">
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
								const isSelected = Number(selectedKeyId) === Number(row.original.Id_Key);
								return (
									<TableRow
										key={row.id}
										data-key-row="true"
										onClick={() => onSelect(row.original.Id_Key)}
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

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-sm text-zinc-500">
					{table.getRowModel().rows.length} fila(s) visibles de {keysData.length}
				</div>
				<div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
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
