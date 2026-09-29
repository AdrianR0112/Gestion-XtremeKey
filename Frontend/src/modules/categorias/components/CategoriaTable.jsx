import { useMemo, useState } from "react";
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
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../../components/tables";
import CategoriaEstadoBadge from "./CategoriaEstadoBadge";

export default function CategoriaTable({
	categorias,
	selectedCategoriaId,
	searchTerm,
	onSearchTermChange,
	estadoFilter,
	onEstadoFilterChange,
	onSelect,
	onViewDetail,
	onEdit,
	onDelete,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = useMemo(
		() => [
			{
				accessorKey: "Nom_Cat",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Nombre
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => <span className="font-medium">{row.original.Nom_Cat || "-"}</span>,
			},
			{
				accessorKey: "Id_Cat_Pad",
				header: "Categoria padre",
				cell: ({ row }) => row.original.Id_Cat_Pad || "-",
			},
			{
				accessorKey: "Ord_Cat",
				header: "Orden",
				cell: ({ row }) => row.original.Ord_Cat ?? "-",
			},
			{
				accessorKey: "Ico_Cat",
				header: "Icono",
				cell: ({ row }) => row.original.Ico_Cat || "-",
			},
			{
				id: "estado",
				header: "Estado",
				cell: ({ row }) => <CategoriaEstadoBadge estado={row.original.Est_Cat} />,
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const categoria = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onViewDetail(categoria);
								}}
							>
								<Eye className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onEdit(categoria);
								}}
							>
								<Pencil className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onDelete(categoria);
								}}
							>
								<Trash2 className="size-4 text-red-600" />
							</Button>
						</div>
					);
				},
			},
		],
		[onDelete, onEdit, onViewDetail]
	);

	const table = useReactTable({
		data: categorias,
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
							placeholder="Buscar por nombre, descripcion o icono"
							className="pl-8"
						/>
					</div>
					<Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
						<SelectTrigger className="sm:w-52">
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							<SelectItem value="activo">Activo</SelectItem>
							<SelectItem value="inactivo">Inactivo</SelectItem>
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
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								const label =
									column.id === "Nom_Cat"
										? "Nombre"
										: column.id === "Id_Cat_Pad"
											? "Categoria padre"
											: column.id === "Ord_Cat"
												? "Orden"
												: column.id === "Ico_Cat"
													? "Icono"
													: column.id;
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

			<MobileExpandableList
				items={mobileRows}
				getItemId={(categoria) => categoria.Id_Cat}
				resetKey={`${searchTerm}-${estadoFilter}-${sorting.map((item) => `${item.id}:${item.desc}`).join(",")}`}
				emptyMessage="No hay categorías que coincidan con los filtros."
				onItemOpen={(categoria) => onSelect(categoria.Id_Cat)}
				renderSummary={(categoria) => <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{categoria.Nom_Cat || `Categoría #${categoria.Id_Cat}`}</p><p className="mt-1 text-xs text-muted-foreground">Orden {categoria.Ord_Cat ?? "-"}</p></div><CategoriaEstadoBadge estado={categoria.Est_Cat} /></div>}
				renderDetails={(categoria) => <MobileDetailGrid><MobileDetail label="Categoría padre">{categoria.Id_Cat_Pad || "Ninguna"}</MobileDetail><MobileDetail label="Orden">{categoria.Ord_Cat ?? "-"}</MobileDetail><MobileDetail label="Ícono" className="min-[380px]:col-span-2">{categoria.Ico_Cat || "Sin ícono"}</MobileDetail></MobileDetailGrid>}
				renderActions={(categoria) => <><Button variant="outline" onClick={() => onViewDetail(categoria)}><Eye className="size-4" />Ver detalle</Button><Button variant="outline" onClick={() => onEdit(categoria)}><Pencil className="size-4" />Editar</Button><Button variant="destructive" className="col-span-2" onClick={() => onDelete(categoria)}><Trash2 className="size-4" />Eliminar</Button></>}
			/>

			<div className="hidden overflow-x-auto rounded-md border md:block">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => {
								const isSelected = selectedCategoriaId === row.original.Id_Cat;
								return (
									<TableRow
										key={row.id}
										data-categoria-row="true"
										onClick={() => onSelect(row.original.Id_Cat)}
										className={`cursor-pointer ${isSelected ? "bg-zinc-100/70 dark:bg-zinc-800/70" : ""}`}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
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
					{table.getRowModel().rows.length} fila(s) visibles de {categorias.length}
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
