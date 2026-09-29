import { useMemo, useState } from "react";
import { Eye, MessageCircle, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../../components/tables";
import { cn } from "@/lib/utils";
import formatDate from "../../../utils/formatDate";
import SuscripcionEstadoBadge from "./SuscripcionEstadoBadge";
import SuscripcionTitularBadge from "./SuscripcionTitularBadge";
import { formatVenceEn, getDiasRestantes, getVencimientoVariant } from "../utils/vencimiento";

export default function SuscripcionTable({
	suscripciones,
	searchTerm,
	onSearchTermChange,
	estadoFilter,
	onEstadoFilterChange,
	titularFilter,
	onTitularFilterChange,
	selectedIds,
	onToggleSelected,
	onSelectAll,
	onClearSelection,
	onView,
	onEdit,
	onDelete,
	onRenovar,
	onEnviarMensaje,
}) {
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

	// La cabecera marca TODAS las filtradas, no solo la pagina visible: de lo
	// contrario "renovar N seleccionadas" significaria algo distinto en cada
	// pagina.
	const todasSeleccionadas = suscripciones.length > 0 && suscripciones.every((item) => selectedIds.has(item.Id_Sus));
	const algunaSeleccionada = suscripciones.some((item) => selectedIds.has(item.Id_Sus));

	const columns = useMemo(
		() => [
			{
				id: "seleccion",
				header: () => (
					<input
						type="checkbox"
						aria-label="Seleccionar todas las suscripciones filtradas"
						className="size-4 cursor-pointer rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100"
						checked={todasSeleccionadas}
						ref={(node) => {
							if (node) node.indeterminate = algunaSeleccionada && !todasSeleccionadas;
						}}
						onChange={() => (todasSeleccionadas ? onClearSelection() : onSelectAll())}
					/>
				),
				cell: (suscripcion) => (
					<input
						type="checkbox"
						aria-label={`Seleccionar la suscripción ${suscripcion.Id_Sus}`}
						className="size-4 cursor-pointer rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100"
						checked={selectedIds.has(suscripcion.Id_Sus)}
						onChange={() => onToggleSelected(suscripcion.Id_Sus)}
					/>
				),
			},
			{
				id: "titular",
				header: "Titular",
				cell: (suscripcion) => (
					<div className="space-y-1">
						<p className="font-medium">{suscripcion.Nom_Tit_Sus || "-"}</p>
						{/* La cuenta del cliente final es lo unico que distingue dos
						    suscripciones del mismo revendedor. */}
						{suscripcion.Cor_Cue_Sus ? (
							<p className="text-xs text-zinc-500 break-all">{suscripcion.Cor_Cue_Sus}</p>
						) : null}
						<SuscripcionTitularBadge tipo={suscripcion.Tip_Tit_Sus} />
					</div>
				),
			},
			{
				id: "producto",
				header: "Producto",
				cell: (suscripcion) => (
					<div>
						<p>{suscripcion.Nom_Prd || "-"}</p>
						{suscripcion.Nom_Var ? <p className="text-xs text-zinc-500">{suscripcion.Nom_Var}</p> : null}
					</div>
				),
			},
			{
				id: "fin",
				header: "Vence",
				cell: (suscripcion) => (
					<span className="text-sm">
						{suscripcion.Fec_Fin_Sus ? formatDate(suscripcion.Fec_Fin_Sus) : "Sin vencimiento"}
					</span>
				),
			},
			{
				id: "venceEn",
				header: "Vence en",
				cell: (suscripcion) => {
					const dias = getDiasRestantes(suscripcion);
					return <Badge variant={getVencimientoVariant(dias)}>{formatVenceEn(dias)}</Badge>;
				},
			},
			{
				id: "estado",
				header: "Estado",
				cell: (suscripcion) => <SuscripcionEstadoBadge estado={suscripcion.Est_Sus} />,
			},
			{
				id: "acciones",
				header: () => <div className="text-right">Acciones</div>,
				cell: (suscripcion) => (
					<div className="flex justify-end gap-1">
						<Button
							variant="ghost"
							size="icon"
							title="Renovar"
							disabled={suscripcion.Est_Sus === "cancelada"}
							onClick={() => onRenovar(suscripcion)}
						>
							<RefreshCw className="size-4 text-emerald-600" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							title={
								suscripcion.Tel_Tit_Sus
									? "Enviar mensaje por WhatsApp"
									: "El titular no tiene teléfono registrado"
							}
							disabled={!suscripcion.Tel_Tit_Sus}
							onClick={() => onEnviarMensaje(suscripcion)}
						>
							<MessageCircle className="size-4 text-green-600" />
						</Button>
						<Button variant="ghost" size="icon" title="Ver detalle" onClick={() => onView(suscripcion)}>
							<Eye className="size-4" />
						</Button>
						<Button variant="ghost" size="icon" title="Editar" onClick={() => onEdit(suscripcion)}>
							<Pencil className="size-4" />
						</Button>
						<Button variant="ghost" size="icon" title="Eliminar" onClick={() => onDelete(suscripcion)}>
							<Trash2 className="size-4 text-red-600" />
						</Button>
					</div>
				),
			},
		],
		[
			algunaSeleccionada,
			onClearSelection,
			onDelete,
			onEdit,
			onEnviarMensaje,
			onRenovar,
			onSelectAll,
			onToggleSelected,
			onView,
			selectedIds,
			todasSeleccionadas,
		]
	);

	const table = useReactTable({
		data: suscripciones,
		columns,
		state: { pagination },
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: false,
	});
	const mobileRows = table.getRowModel().rows.map((row) => row.original);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
					<Input
						value={searchTerm}
						onChange={(event) => onSearchTermChange(event.target.value)}
						placeholder="Buscar por titular, cuenta, producto o notas"
						className="pl-8"
					/>
				</div>
				<Select value={titularFilter} onValueChange={onTitularFilterChange}>
					<SelectTrigger className="sm:w-44">
						<SelectValue placeholder="Titular" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="todos">Todos los titulares</SelectItem>
						<SelectItem value="cliente">Clientes</SelectItem>
						<SelectItem value="revendedor">Revendedores</SelectItem>
					</SelectContent>
				</Select>
				<Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
					<SelectTrigger className="sm:w-44">
						<SelectValue placeholder="Estado" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="todos">Todos los estados</SelectItem>
						<SelectItem value="activa">Activa</SelectItem>
						<SelectItem value="suspendida">Suspendida</SelectItem>
						<SelectItem value="cancelada">Cancelada</SelectItem>
						<SelectItem value="expirada">Expirada</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<MobileExpandableList
				items={mobileRows}
				getItemId={(suscripcion) => suscripcion.Id_Sus}
				resetKey={`${pagination.pageIndex}-${searchTerm}-${estadoFilter}-${titularFilter}`}
				emptyMessage="No hay suscripciones que coincidan con los filtros."
				renderLeading={(suscripcion) => (
					<input
						type="checkbox"
						aria-label={`Seleccionar la suscripción ${suscripcion.Id_Sus}`}
						checked={selectedIds.has(suscripcion.Id_Sus)}
						onChange={() => onToggleSelected(suscripcion.Id_Sus)}
					/>
				)}
				renderSummary={(suscripcion) => {
					const dias = getDiasRestantes(suscripcion);
					return <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{suscripcion.Nom_Tit_Sus || `Suscripción #${suscripcion.Id_Sus}`}</p><p className="mt-1 truncate text-xs text-muted-foreground">{suscripcion.Nom_Prd || "Sin producto"}{suscripcion.Nom_Var ? ` · ${suscripcion.Nom_Var}` : ""}</p></div><div className="flex shrink-0 flex-col items-end gap-1"><SuscripcionEstadoBadge estado={suscripcion.Est_Sus} /><Badge variant={getVencimientoVariant(dias)}>{formatVenceEn(dias)}</Badge></div></div>;
				}}
				renderDetails={(suscripcion) => <MobileDetailGrid><MobileDetail label="Tipo de titular"><SuscripcionTitularBadge tipo={suscripcion.Tip_Tit_Sus} /></MobileDetail><MobileDetail label="Vencimiento">{suscripcion.Fec_Fin_Sus ? formatDate(suscripcion.Fec_Fin_Sus) : "Sin vencimiento"}</MobileDetail><MobileDetail label="Cuenta" className="min-[380px]:col-span-2"><span className="break-all">{suscripcion.Cor_Cue_Sus || "-"}</span></MobileDetail></MobileDetailGrid>}
				renderActions={(suscripcion) => <><Button disabled={suscripcion.Est_Sus === "cancelada"} onClick={() => onRenovar(suscripcion)}><RefreshCw className="size-4" />Renovar</Button><Button variant="outline" disabled={!suscripcion.Tel_Tit_Sus} onClick={() => onEnviarMensaje(suscripcion)}><MessageCircle className="size-4 text-green-600" />Mensaje</Button><Button variant="outline" onClick={() => onView(suscripcion)}><Eye className="size-4" />Ver detalle</Button><Button variant="outline" onClick={() => onEdit(suscripcion)}><Pencil className="size-4" />Editar</Button><Button variant="destructive" className="col-span-2" onClick={() => onDelete(suscripcion)}><Trash2 className="size-4" />Eliminar</Button></>}
			/>

			<div className="hidden overflow-x-auto rounded-md border md:block">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.id} className={column.id === "acciones" ? "text-right" : undefined}>
									{typeof column.header === "function" ? column.header() : column.header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => {
								const suscripcion = row.original;
								const dias = getDiasRestantes(suscripcion);
								return (
									<TableRow
										key={suscripcion.Id_Sus}
										className={cn(
											dias !== null && dias < 0 && "bg-red-50/60 dark:bg-red-950/20",
											selectedIds.has(suscripcion.Id_Sus) && "bg-zinc-100/70 dark:bg-zinc-800/50"
										)}
									>
										{columns.map((column) => (
											<TableCell key={column.id}>
												{typeof column.cell === "function" ? column.cell(suscripcion) : null}
											</TableCell>
										))}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No hay suscripciones que coincidan con los filtros.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="text-sm text-zinc-500">
					Mostrando {table.getRowModel().rows.length} de {suscripciones.length} suscripciones
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
