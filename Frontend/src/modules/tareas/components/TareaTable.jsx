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
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../../components/tables";
import { Progress } from "../../../components/ui/progress";
import { PrioridadBadge, EstadoBadge } from "./TareaBadges";
import { ESTADOS_TAREA, PRIORIDADES_TAREA } from "../schemas/tarea.schema";

export default function TareaTable({
	tareas,
	selectedTareaId,
	searchTerm,
	onSearchTermChange,
	estadoFilter,
	onEstadoFilterChange,
	prioridadFilter,
	onPrioridadFilterChange,
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
				id: "titulo",
				accessorFn: (tarea) => tarea.Tit_Tar,
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Título
						<ArrowUpDown className="ml-2 size-4" />
					</Button>
				),
				cell: ({ row }) => <span className="font-medium">{row.original.Tit_Tar}</span>,
			},
			{
				id: "prioridad",
				accessorFn: (tarea) => tarea.Pri_Tar,
				header: "Prioridad",
				cell: ({ row }) => <PrioridadBadge prioridad={row.original.Pri_Tar} />,
			},
			{
				id: "estado",
				accessorFn: (tarea) => tarea.Est_Tar,
				header: "Estado",
				cell: ({ row }) => <EstadoBadge estado={row.original.Est_Tar} />,
			},
			{
				id: "progreso",
				accessorFn: (tarea) => tarea.Pro_Tar,
				header: "Progreso",
				cell: ({ row }) => (
					<div className="flex items-center gap-2 max-w-xs">
						<Progress value={row.original.Pro_Tar} className="flex-1" />
						<span className="text-xs font-semibold">{row.original.Pro_Tar}%</span>
					</div>
				),
			},
			{
				id: "fechalimite",
				accessorFn: (tarea) => tarea.Fec_Lim_Tar,
				header: "Fecha Límite",
				cell: ({ row }) => (
					<span className="text-sm text-zinc-600 dark:text-zinc-400">
						{row.original.Fec_Lim_Tar ? new Date(row.original.Fec_Lim_Tar).toLocaleDateString() : "-"}
					</span>
				),
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				enableHiding: false,
				cell: ({ row }) => {
					const tarea = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onViewDetail(tarea); }}>
								<Eye className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onEdit(tarea); }}>
								<Pencil className="size-4" />
							</Button>
							<Button variant="ghost" size="icon" onClick={(event) => { event.stopPropagation(); onDelete(tarea); }}>
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
		data: tareas,
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
	const mobileRows = table.getRowModel().rows.map((row) => row.original);

	return (
		<div className="space-y-4">
			{/* Filtros */}
			<div className="flex gap-3 items-end flex-wrap">
				<div className="min-w-0 flex-1 space-y-2">
					<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Buscar</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
						<Input
							placeholder="Buscar por título..."
							value={searchTerm}
							onChange={(e) => onSearchTermChange(e.target.value)}
							disabled={loading}
							className="pl-10"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Estado</label>
					<Select value={estadoFilter} onValueChange={onEstadoFilterChange} disabled={loading}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							{ESTADOS_TAREA.map((estado) => (
								<SelectItem key={estado} value={estado}>
									{estado.charAt(0).toUpperCase() + estado.slice(1).replace(/_/g, " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Prioridad</label>
					<Select value={prioridadFilter} onValueChange={onPrioridadFilterChange} disabled={loading}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todas</SelectItem>
							{PRIORIDADES_TAREA.map((prio) => (
								<SelectItem key={prio} value={prio}>
									{prio.charAt(0).toUpperCase() + prio.slice(1)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Tabla */}
			<div>
				{loading ? (
					<div className="text-center py-8">
						<p className="text-sm text-zinc-500">Cargando tareas...</p>
					</div>
				) : tareas.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-sm text-zinc-600 dark:text-zinc-400">No se encontraron tareas</p>
					</div>
				) : (
					<>
						<MobileExpandableList
							items={mobileRows}
							getItemId={(tarea) => tarea.Id_Tar}
							resetKey={`${searchTerm}-${estadoFilter}-${prioridadFilter}-${sorting.map((item) => `${item.id}:${item.desc}`).join(",")}`}
							onItemOpen={(tarea) => onSelect(tarea.Id_Tar)}
							renderSummary={(tarea) => <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="line-clamp-2 font-semibold">{tarea.Tit_Tar || `Tarea #${tarea.Id_Tar}`}</p><div className="mt-1"><PrioridadBadge prioridad={tarea.Pri_Tar} /></div></div><EstadoBadge estado={tarea.Est_Tar} /></div>}
							renderDetails={(tarea) => <div className="space-y-3"><MobileDetailGrid><MobileDetail label="Fecha límite">{tarea.Fec_Lim_Tar ? new Date(tarea.Fec_Lim_Tar).toLocaleDateString() : "-"}</MobileDetail><MobileDetail label="Progreso">{tarea.Pro_Tar ?? 0}%</MobileDetail>{tarea.Des_Tar ? <MobileDetail label="Descripción" className="min-[380px]:col-span-2">{tarea.Des_Tar}</MobileDetail> : null}</MobileDetailGrid><Progress value={tarea.Pro_Tar} /></div>}
							renderActions={(tarea) => <><Button variant="outline" onClick={() => onViewDetail(tarea)}><Eye className="size-4" />Ver detalle</Button><Button variant="outline" onClick={() => onEdit(tarea)}><Pencil className="size-4" />Editar</Button><Button variant="destructive" className="col-span-2" onClick={() => onDelete(tarea)}><Trash2 className="size-4" />Eliminar</Button></>}
						/>
						<div className="hidden overflow-hidden rounded-lg border md:block">
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
									onClick={() => onSelect(row.original.Id_Tar)}
									data-state={selectedTareaId === row.original.Id_Tar && "selected"}
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
						</div>
					</>
				)}
			</div>

			{/* Paginación */}
			{!loading && tareas.length > 0 && (
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
