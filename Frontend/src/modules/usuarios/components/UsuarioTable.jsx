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
import UsuarioEstadoBadge from "./UsuarioEstadoBadge";

export default function UsuarioTable({
	usuarios,
	selectedUsuarioId,
	searchTerm,
	onSearchTermChange,
	estadoFilter,
	onEstadoFilterChange,
	onSelect,
	onViewDetail,
	onEdit,
	onDelete,
	onChangeEstado,
	saving,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = useMemo(
		() => [
			{
				id: "nombre",
				accessorFn: (usuario) => `${usuario.Nom_Usu} ${usuario.Ape_Usu}`.trim(),
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Nombre
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => {
					const usuario = row.original;
					return <span className="font-medium">{`${usuario.Nom_Usu} ${usuario.Ape_Usu}`.trim()}</span>;
				},
			},
			{
				accessorKey: "Ema_Usu",
				header: "Correo",
				cell: ({ row }) => row.original.Ema_Usu,
			},
			{
				accessorKey: "Rol_Usu",
				header: "Rol",
				cell: ({ row }) => <span className="uppercase">{row.original.Rol_Usu}</span>,
			},
			{
				id: "estado",
				header: "Estado",
				cell: ({ row }) => {
					const usuario = row.original;
					return (
						<div className="flex items-center gap-2">
							<UsuarioEstadoBadge estado={usuario.Est_Usu} />
							<Select
								value={usuario.Est_Usu}
								onValueChange={(value) => onChangeEstado(usuario, value)}
								disabled={saving}
							>
								<SelectTrigger className="h-8 w-32" onClick={(event) => event.stopPropagation()}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="activo">activo</SelectItem>
									<SelectItem value="inactivo">inactivo</SelectItem>
									<SelectItem value="bloqueado">bloqueado</SelectItem>
								</SelectContent>
							</Select>
						</div>
					);
				},
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const usuario = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onViewDetail(usuario);
								}}
							>
								<Eye className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onEdit(usuario);
								}}
							>
								<Pencil className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onDelete(usuario);
								}}
							>
								<Trash2 className="size-4 text-red-600" />
							</Button>
						</div>
					);
				},
			},
		],
		[onChangeEstado, onDelete, onEdit, onViewDetail, saving]
	);

	const table = useReactTable({
		data: usuarios,
		columns,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
			columnVisibility,
		},
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
							placeholder="Buscar por nombre, apellido o correo"
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
							<SelectItem value="bloqueado">Bloqueado</SelectItem>
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
								const label = column.id === "nombre" ? "Nombre" : column.id;
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
							const isSelected = selectedUsuarioId === row.original.Id_Usu;
							return (
								<TableRow
									key={row.id}
									data-usuario-row="true"
									onClick={() => onSelect(row.original.Id_Usu)}
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

			<div className="flex items-center justify-between">
				<div className="text-sm text-zinc-500">
					{table.getRowModel().rows.length} fila(s) visibles de {usuarios.length}
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
