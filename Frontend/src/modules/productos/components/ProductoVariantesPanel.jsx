import { useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Eye, Pencil, Trash } from "lucide-react";
import VariantEstadoBadge from "../../variantes/components/VariantEstadoBadge";
import { ESTADOS_VARIANTE } from "../../variantes/schemas/variant.schema";

export default function ProductoVariantesPanel({
	producto = null,
	variantes = [],
	searchTerm = "",
	setSearchTerm = () => {},
	estadoFilter = "",
	setEstadoFilter = () => {},
	selectedVariantIds = [],
	onToggleVariantSelection = () => {},
	onToggleSelectAll = () => {},
	onDuplicateSelected = () => {},
	onDeleteSelected = () => {},
	onVariantView = () => {},
	onVariantEdit = () => {},
	onVariantDelete = () => {},
}) {
	const filteredVariants = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return variantes.filter((variante) => {
			const matchesSearch =
				!query ||
				`${variante.Nom_Var || ""} ${variante.Des_Var || ""} ${variante.Pre_Ven_Var ?? ""} ${variante.Pre_Cos_Var ?? ""} ${variante.Pre_Rev_Var ?? ""} ${variante.Not_Ven_Cor_Var ? "correo activo" : "correo inactivo"} ${variante.Not_Ven_Wsp_Var ? "whatsapp activo" : "whatsapp inactivo"}`
					.toLowerCase()
					.includes(query);
			const matchesEstado = !estadoFilter || variante.Est_Var === estadoFilter;
			return matchesSearch && matchesEstado;
		});
	}, [variantes, searchTerm, estadoFilter]);

	const allVisibleSelected = filteredVariants.length > 0 && filteredVariants.every((variante) => selectedVariantIds.includes(variante.Id_Var));
	const selectedCount = selectedVariantIds.length;

	if (!producto) {
		return (
			<p className="text-sm text-muted-foreground">Selecciona un producto para ver su tabla de variantes.</p>
		);
	}

	return (
		<div className="space-y-3">
			<div className="space-y-3 rounded-lg border bg-background p-3">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
					<div className="grid w-full gap-3 sm:grid-cols-2 lg:flex-1">
						<Input
							type="text"
							placeholder="Buscar variante..."
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
						/>
						<Select value={estadoFilter || "all"} onValueChange={(value) => setEstadoFilter(value === "all" ? "" : value)}>
							<SelectTrigger>
								<SelectValue placeholder="Filtrar estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos los estados</SelectItem>
								{ESTADOS_VARIANTE.map((estado) => (
									<SelectItem key={estado} value={estado}>
										{estado}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button type="button" variant="outline" onClick={() => onToggleSelectAll(filteredVariants)} disabled={filteredVariants.length === 0}>
							{allVisibleSelected ? "Quitar selección" : "Seleccionar visibles"}
						</Button>
						<Button type="button" variant="outline" onClick={onDuplicateSelected} disabled={selectedCount === 0}>
							Duplicar seleccionadas ({selectedCount})
						</Button>
						<Button type="button" variant="destructive" onClick={onDeleteSelected} disabled={selectedCount === 0}>
							Eliminar seleccionadas ({selectedCount})
						</Button>
					</div>
				</div>
				<p className="text-xs text-muted-foreground">
					{selectedCount > 0 ? `${selectedCount} variantes seleccionadas` : "Selecciona una o más variantes para operar en conjunto."}
				</p>
			</div>

			{variantes.length === 0 ? (
				<p className="text-sm text-muted-foreground">Este producto no tiene variantes registradas.</p>
			) : filteredVariants.length === 0 ? (
				<p className="text-sm text-muted-foreground">No hay variantes que coincidan con los filtros actuales.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-10">
								<input
									type="checkbox"
									checked={allVisibleSelected}
									onChange={() => onToggleSelectAll(filteredVariants)}
									aria-label="Seleccionar todas las variantes visibles"
								/>
							</TableHead>
							<TableHead>Variante</TableHead>
							<TableHead>Estado</TableHead>
							<TableHead className="text-right">Venta</TableHead>
							<TableHead className="text-right">Costo</TableHead>
							<TableHead className="text-right">Revendedor</TableHead>
							<TableHead className="text-center">Correo</TableHead>
							<TableHead className="text-center">WhatsApp</TableHead>
							<TableHead className="text-right">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredVariants.map((variante) => (
							<TableRow key={variante.Id_Var}>
								<TableCell>
									<input
										type="checkbox"
										checked={selectedVariantIds.includes(variante.Id_Var)}
										onChange={() => onToggleVariantSelection(variante.Id_Var)}
										aria-label={`Seleccionar variante ${variante.Nom_Var || variante.Id_Var}`}
									/>
								</TableCell>
								<TableCell className="min-w-44">
									<p className="text-sm font-medium truncate">{variante.Nom_Var || `Variante #${variante.Id_Var}`}</p>
									{variante.Des_Var ? <p className="text-xs text-muted-foreground line-clamp-2">{variante.Des_Var}</p> : null}
								</TableCell>
								<TableCell>
									<VariantEstadoBadge estado={variante.Est_Var} />
								</TableCell>
								<TableCell className="text-right font-medium">
									{variante.Pre_Ven_Var === "" || variante.Pre_Ven_Var === null || variante.Pre_Ven_Var === undefined
										? "—"
										: `$${Number(variante.Pre_Ven_Var).toFixed(2)}`}
								</TableCell>
								<TableCell className="text-right text-muted-foreground">
									{variante.Pre_Cos_Var === "" || variante.Pre_Cos_Var === null || variante.Pre_Cos_Var === undefined
										? "—"
										: `$${Number(variante.Pre_Cos_Var).toFixed(2)}`}
								</TableCell>
								<TableCell className="text-right text-muted-foreground">
									{variante.Pre_Rev_Var === "" || variante.Pre_Rev_Var === null || variante.Pre_Rev_Var === undefined
										? "—"
										: `$${Number(variante.Pre_Rev_Var).toFixed(2)}`}
								</TableCell>
								<TableCell className="text-center text-sm text-muted-foreground">{variante.Not_Ven_Cor_Var ? "Activo" : "Inactivo"}</TableCell>
								<TableCell className="text-center text-sm text-muted-foreground">{variante.Not_Ven_Wsp_Var ? "Activo" : "Inactivo"}</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-1">
										<Button variant="outline" size="sm" onClick={() => onVariantView(variante)}>
											<Eye className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="sm" onClick={() => onVariantEdit(variante)}>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button variant="destructive" size="sm" onClick={() => onVariantDelete(variante)}>
											<Trash className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
