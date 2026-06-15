import { useMemo, useState } from "react";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Columns3, Eye, Pencil, Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import ConfiguracionEstadoBadge from "./ConfiguracionEstadoBadge";

export default function ConfiguracionTable({
	configuraciones,
	selectedConfiguracionId,
	currentConfiguracionId,
	searchTerm,
	onSearchTermChange,
	onSelect,
	onViewDetail,
	onEdit,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = useMemo(
		() => [
			{
				accessorKey: "Nom_Emp_Con",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Empresa
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => <span className="font-medium">{row.original.Nom_Emp_Con || "Sin nombre"}</span>,
			},
			{
				accessorKey: "Ema_Con",
				header: "Correo",
				cell: ({ row }) => row.original.Ema_Con || "-",
			},
			{
				accessorKey: "Zon_Hor_Con",
				header: "Zona horaria",
				cell: ({ row }) => row.original.Zon_Hor_Con || "-",
			},
			{
				id: "impuesto",
				header: "Impuesto",
				cell: ({ row }) =>
					!row.original.Hab_Imp_Con
						? "Desactivado"
						: row.original.Imp_Con === "" || row.original.Imp_Con === null
							? "-"
							: `${row.original.Imp_Con}%`,
			},
			{
				id: "estado",
				header: "Estado",
				cell: ({ row }) => {
					const isCurrent = currentConfiguracionId === row.original.Id_Con;
					return <ConfiguracionEstadoBadge isCurrent={isCurrent} />;
				},
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const item = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onViewDetail(item);
								}}
							>
								<Eye className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={(event) => {
									event.stopPropagation();
									onEdit(item);
								}}
							>
								<Pencil className="size-4" />
							</Button>
						</div>
					);
				},
			},
		],
		[currentConfiguracionId, onEdit, onViewDetail]
	);

	const table = useReactTable({
		data: configuraciones,
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

	if (!configuraciones.length) {
		return <p className="text-sm text-zinc-500">No hay configuraciones registradas.</p>;
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
					<Input
						value={searchTerm}
						onChange={(event) => onSearchTermChange(event.target.value)}
						placeholder="Buscar por empresa, correo o zona horaria"
						className="pl-8"
					/>
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
								const label = column.id === "Nom_Emp_Con" ? "empresa" : column.id;
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
								const isSelected = selectedConfiguracionId === row.original.Id_Con;
								return (
									<TableRow
										key={row.id}
										data-configuracion-row="true"
										onClick={() => onSelect(row.original.Id_Con)}
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
					{table.getRowModel().rows.length} fila(s) visibles de {configuraciones.length}
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
