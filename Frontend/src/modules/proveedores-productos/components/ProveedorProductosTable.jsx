import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Pencil, Search, Trash2 } from "lucide-react";

export default function ProveedorProductosTable({
	relaciones = [],
	searchTerm = "",
	onSearchTermChange = () => {},
	onEdit = () => {},
	onDelete = () => {},
	deletingId = null,
}) {
	return (
		<div className="space-y-3">
			<div className="relative">
				<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
				<Input
					value={searchTerm}
					onChange={(event) => onSearchTermChange(event.target.value)}
					placeholder="Buscar ítem del proveedor..."
					className="pl-8"
				/>
			</div>

			{relaciones.length === 0 ? (
				<p className="text-sm text-muted-foreground">No hay productos asociados para este proveedor.</p>
			) : (
				<div className="overflow-x-auto rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ítem</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead className="text-right">Precio compra</TableHead>
								<TableHead>Principal</TableHead>
								<TableHead>Notas</TableHead>
								<TableHead className="text-right">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{relaciones.map((item) => (
								<TableRow key={item.Id_Pro_Prd}>
									<TableCell className="font-medium">
										{item.Id_Var
											? item.Nom_Var || `Variante #${item.Id_Var}`
											: item.Nom_Prd || `Producto #${item.Id_Prd}`}
									</TableCell>
									<TableCell>{item.Id_Var ? "Variante" : "Producto"}</TableCell>
									<TableCell className="text-right">
										{item.Pre_Com_Pro_Prd === "" || item.Pre_Com_Pro_Prd === null || item.Pre_Com_Pro_Prd === undefined
											? "—"
											: `$${Number(item.Pre_Com_Pro_Prd).toFixed(2)}`}
									</TableCell>
									<TableCell>
										{Number(item.Es_Pri_Pro_Prd) === 1 ? <Badge variant="success">Sí</Badge> : <Badge variant="outline">No</Badge>}
									</TableCell>
									<TableCell className="max-w-52 truncate text-muted-foreground">{item.Not_Pro_Prd || "—"}</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onEdit(item)}
												title="Editar relación"
											>
												<Pencil className="size-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onDelete(item)}
												disabled={deletingId === item.Id_Pro_Prd}
												title="Eliminar relación"
											>
												<Trash2 className="size-4 text-red-600" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
