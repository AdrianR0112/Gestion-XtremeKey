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
import RevendedorEstadoBadge from "./RevendedorEstadoBadge";

export default function RevendedorTable({
	loading,
	revendedores,
	selectedRevendedorId,
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
				id: "nombre",
				accessorFn: (revendedor) => `${revendedor.Nom_Rev} ${revendedor.Ape_Rev}`.trim(),
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Nombre
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => (
					<span className="font-medium">{`${row.original.Nom_Rev} ${row.original.Ape_Rev}`.trim()}</span>
				),
			},
			{
				accessorKey: "Tel_Rev",
				header: "Telefono",
				cell: ({ row }) => row.original.Tel_Rev,
			},
			{
				accessorKey: "Ema_Rev",
				header: "Correo",
				cell: ({ row }) => row.original.Ema_Rev || "-",
			},
			{
				accessorKey: "Doc_Rev",
				header: "Documento",
				cell: ({ row }) => row.original.Doc_Rev || "-",
			},
			{
				id: "estado",
				accessorKey: "Est_Rev",
				header: "Estado",
				cell: ({ row }) => <RevendedorEstadoBadge estado={row.original.Est_Rev} />,
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const revendedor = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onViewDetail(revendedor); }}>
								<Eye className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onEdit(revendedor); }}>
								<Pencil className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onDelete(revendedor); }}>
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
		data: revendedores,
		columns,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { sorting, columnVisibility },
	});
	const mobileRows = table.getRowModel().rows.map((row) => row.original);

	if (loading) {
		return <p className="text-sm text-zinc-500">Cargando revendedores...</p>;
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
							placeholder="Buscar por nombre, apellido, telefono o correo"
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
						{table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
							const label =
								column.id === "nombre"
									? "Nombre"
									: column.id === "Tel_Rev"
										? "Telefono"
										: column.id === "Ema_Rev"
											? "Correo"
											: column.id === "Doc_Rev"
												? "Documento"
												: column.id === "estado"
													? "Estado"
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
				getItemId={(revendedor) => revendedor.Id_Rev}
				resetKey={`${searchTerm}-${estadoFilter}-${sorting.map((item) => `${item.id}:${item.desc}`).join(",")}`}
				emptyMessage="No hay revendedores que coincidan con los filtros."
				onItemOpen={(revendedor) => onSelect(revendedor.Id_Rev)}
				renderSummary={(revendedor) => (
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0"><p className="truncate font-semibold">{`${revendedor.Nom_Rev} ${revendedor.Ape_Rev}`.trim() || `Revendedor #${revendedor.Id_Rev}`}</p><p className="mt-1 truncate text-xs text-muted-foreground">{revendedor.Tel_Rev || revendedor.Ema_Rev || "Sin contacto"}</p></div>
						<RevendedorEstadoBadge estado={revendedor.Est_Rev} />
					</div>
				)}
				renderDetails={(revendedor) => <MobileDetailGrid><MobileDetail label="Teléfono">{revendedor.Tel_Rev || "-"}</MobileDetail><MobileDetail label="Correo"><span className="break-all">{revendedor.Ema_Rev || "-"}</span></MobileDetail><MobileDetail label="Comisión">{revendedor.Por_Com_Rev ?? "-"}</MobileDetail><MobileDetail label="Documento">{revendedor.Doc_Rev || "-"}</MobileDetail></MobileDetailGrid>}
				renderActions={(revendedor) => <><Button variant="outline" onClick={() => onViewDetail(revendedor)}><Eye className="size-4" />Ver detalle</Button><Button variant="outline" onClick={() => onEdit(revendedor)}><Pencil className="size-4" />Editar</Button><Button variant="destructive" className="col-span-2" onClick={() => onDelete(revendedor)}><Trash2 className="size-4" />Eliminar</Button></>}
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
								const isSelected = selectedRevendedorId === row.original.Id_Rev;
								return (
									<TableRow
										key={row.id}
										data-revendedor-row="true"
										onClick={() => onSelect(row.original.Id_Rev)}
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
					{table.getRowModel().rows.length} fila(s) visibles de {revendedores.length}
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
