import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { MobileDetail, MobileDetailGrid, MobileExpandableList } from "../../components/tables";
import FeedbackAlert from "../../components/feedback-alert";
import formatDate from "../../utils/formatDate";
import RenovacionCard from "./components/RenovacionCard";
import RenovacionTable from "./components/RenovacionTable";
import useRenovaciones from "./hooks/useRenovaciones";
import { Input } from "../../components/ui/input";

export default function RenovacionesPage() {
	const renovaciones = useRenovaciones();

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<h1 className="text-2xl font-semibold">Renovaciones</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Historial derivado de detalles de venta completados.</p>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={renovaciones.error} variant="error" />
					<Input
						value={renovaciones.searchTerm}
						onChange={(event) => renovaciones.setSearchTerm(event.target.value)}
						placeholder="Buscar por cliente, producto, venta o detalle..."
					/>
					<RenovacionTable
						loading={renovaciones.loading}
						renovacionesFiltradas={renovaciones.renovacionesFiltradas}
						onView={(item) => renovaciones.setSelectedRenovacionId(item.Id_Dve)}
					/>
				</div>
			</section>

			<Sheet open={!!renovaciones.renovacionSeleccionada} onOpenChange={(open) => !open && renovaciones.setSelectedRenovacionId(null)}>
				<SheetContent side="right" className="sm:max-w-3xl p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>Detalle de renovación</SheetTitle>
						<SheetDescription>Relación entre la licencia anterior y la nueva.</SheetDescription>
					</SheetHeader>

					{renovaciones.renovacionSeleccionada ? (
						<div className="px-6 pb-6 space-y-5">
							<div className="grid sm:grid-cols-2 gap-3 text-sm">
								<RenovacionCard label="Detalle nuevo" value={`#${renovaciones.renovacionSeleccionada.Id_Dve}`} />
								<RenovacionCard label="Detalle anterior" value={`#${renovaciones.renovacionSeleccionada.Id_Dve_Ant}`} />
								<RenovacionCard label="Cliente" value={`${renovaciones.renovacionSeleccionada.Nom_Cli || ""} ${renovaciones.renovacionSeleccionada.Ape_Cli || ""}`.trim() || "-"} />
								<RenovacionCard label="Producto" value={renovaciones.renovacionSeleccionada.Nom_Prd || "-"} />
								<RenovacionCard label="Venta anterior" value={renovaciones.renovacionSeleccionada.Cod_Ven_Ant || `#${renovaciones.renovacionSeleccionada.Id_Ven_Ant}`} />
								<RenovacionCard label="Venta nueva" value={renovaciones.renovacionSeleccionada.Cod_Ven_Nue || `#${renovaciones.renovacionSeleccionada.Id_Ven_Nue}`} />
							</div>

							<MobileExpandableList
								items={[
									{
										id: "vigencia",
										campo: "Vigencia",
										anterior: `${formatDate(renovaciones.renovacionSeleccionada.Fec_Ini_Dve_Ant)} - ${formatDate(renovaciones.renovacionSeleccionada.Fec_Fin_Dve_Ant)}`,
										nueva: `${formatDate(renovaciones.renovacionSeleccionada.Fec_Ini_Dve_Nue)} - ${formatDate(renovaciones.renovacionSeleccionada.Fec_Fin_Dve_Nue)}`,
									},
									{ id: "precio", campo: "Precio unitario", anterior: renovaciones.renovacionSeleccionada.Pre_Uni_Dve_Ant, nueva: renovaciones.renovacionSeleccionada.Pre_Uni_Dve_Nue },
									{ id: "descuento", campo: "Descuento unitario", anterior: renovaciones.renovacionSeleccionada.Des_Uni_Dve_Ant, nueva: renovaciones.renovacionSeleccionada.Des_Uni_Dve_Nue },
								]}
								getItemId={(item) => item.id}
								resetKey={renovaciones.renovacionSeleccionada.Id_Dve}
								renderSummary={(item) => <p className="font-medium">{item.campo}</p>}
								renderDetails={(item) => (
									<MobileDetailGrid>
										<MobileDetail label="Anterior" value={item.anterior ?? "—"} />
										<MobileDetail label="Nueva" value={item.nueva ?? "—"} />
									</MobileDetailGrid>
								)}
							/>

							<div className="hidden rounded-md border md:block">
								<Table>
									<TableHeader><TableRow><TableHead>Campo</TableHead><TableHead>Anterior</TableHead><TableHead>Nueva</TableHead></TableRow></TableHeader>
									<TableBody>
										<TableRow><TableCell className="font-medium">Vigencia</TableCell><TableCell>{formatDate(renovaciones.renovacionSeleccionada.Fec_Ini_Dve_Ant)} - {formatDate(renovaciones.renovacionSeleccionada.Fec_Fin_Dve_Ant)}</TableCell><TableCell>{formatDate(renovaciones.renovacionSeleccionada.Fec_Ini_Dve_Nue)} - {formatDate(renovaciones.renovacionSeleccionada.Fec_Fin_Dve_Nue)}</TableCell></TableRow>
										<TableRow><TableCell className="font-medium">Precio unitario</TableCell><TableCell>{renovaciones.renovacionSeleccionada.Pre_Uni_Dve_Ant}</TableCell><TableCell>{renovaciones.renovacionSeleccionada.Pre_Uni_Dve_Nue}</TableCell></TableRow>
										<TableRow><TableCell className="font-medium">Descuento unitario</TableCell><TableCell>{renovaciones.renovacionSeleccionada.Des_Uni_Dve_Ant}</TableCell><TableCell>{renovaciones.renovacionSeleccionada.Des_Uni_Dve_Nue}</TableCell></TableRow>
									</TableBody>
								</Table>
							</div>

							{renovaciones.renovacionSeleccionada.Not_Dve ? <div className="rounded-md border p-3"><p className="text-xs text-zinc-500 mb-1">Notas</p><p className="text-sm">{renovaciones.renovacionSeleccionada.Not_Dve}</p></div> : null}
						</div>
					) : null}
				</SheetContent>
			</Sheet>
		</div>
	);
}
