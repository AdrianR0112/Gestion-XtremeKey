import { useMemo, useState } from "react";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { TipoBadge, CanalBadge, EstadoBadge } from "./PlantillaBadges";
import { TIPOS_PLANTILLA, CANALES_PLANTILLA, ESTADOS_PLANTILLA } from "../schemas/plantilla.schema";

export default function PlantillaTable({
	plantillas,
	selectedPlantillaId,
	searchTerm,
	onSearchTermChange,
	tipoFilter,
	onTipoFilterChange,
	canalFilter,
	onCanalFilterChange,
	estadoFilter,
	onEstadoFilterChange,
	onSelect,
	onViewDetail,
	onEdit,
	onDelete,
	loading,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});

	const columns = useMemo(
		() => [
			{
				id: "nombre",
				accessorFn: (plantilla) => plantilla.Nom_Pla,
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Nombre
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => <span className="font-medium">{row.original.Nom_Pla}</span>,
			},
			{
				id: "tipo",
				accessorFn: (plantilla) => plantilla.Tip_Pla,
				header: "Tipo",
				cell: ({ row }) => <TipoBadge tipo={row.original.Tip_Pla} />,
			},
			{
				id: "canal",
				accessorFn: (plantilla) => plantilla.Can_Pla,
				header: "Canal",
				cell: ({ row }) => <CanalBadge canal={row.original.Can_Pla} />,
			},
			{
				id: "estado",
				accessorFn: (plantilla) => plantilla.Est_Pla,
				header: "Estado",
				cell: ({ row }) => <EstadoBadge estado={row.original.Est_Pla} />,
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const plantilla = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onViewDetail(plantilla); }}>
								<Eye className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onEdit(plantilla); }}>
								<Pencil className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onDelete(plantilla); }}>
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
		data: plantillas,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnVisibility,
		},
	});

	return (
		<div className="space-y-4">
			{/* Filtros */}
			<div className="flex gap-3 items-end flex-wrap">
				<div className="flex-1 min-w-64 space-y-2">
					<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Buscar</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
						<Input
							placeholder="Buscar por nombre..."
							value={searchTerm}
							onChange={(e) => onSearchTermChange(e.target.value)}
							disabled={loading}
							className="pl-10"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Tipo</label>
					<Select value={tipoFilter} onValueChange={onTipoFilterChange} disabled={loading}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							{TIPOS_PLANTILLA.map((tipo) => (
								<SelectItem key={tipo} value={tipo}>
									{tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Canal</label>
					<Select value={canalFilter} onValueChange={onCanalFilterChange} disabled={loading}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							{CANALES_PLANTILLA.map((canal) => (
								<SelectItem key={canal} value={canal}>
									{canal.charAt(0).toUpperCase() + canal.slice(1)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Estado</label>
					<Select value={estadoFilter} onValueChange={onEstadoFilterChange} disabled={loading}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							{ESTADOS_PLANTILLA.map((estado) => (
								<SelectItem key={estado} value={estado}>
									{estado.charAt(0).toUpperCase() + estado.slice(1)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Tabla */}
			<div className="border rounded-lg overflow-hidden">
				{loading ? (
					<div className="text-center py-8">
						<p className="text-sm text-zinc-500">Cargando plantillas...</p>
					</div>
				) : plantillas.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-sm text-zinc-600 dark:text-zinc-400">No se encontraron plantillas</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="bg-zinc-50 dark:bg-zinc-900">
								{table.getHeaderGroups().map((headerGroup) =>
									headerGroup.headers.map((header) => (
										<TableHead key={header.id} className="h-12">
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
									onClick={() => onSelect(row.original.Id_Pla)}
									data-state={selectedPlantillaId === row.original.Id_Pla && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Paginación */}
			{!loading && plantillas.length > 0 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-zinc-600 dark:text-zinc-400">
						Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
					</div>
					<div className="flex gap-2">
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
			)}
		</div>
	);
}
