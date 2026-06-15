import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { DollarSign, Eye, Pencil, Trash2 } from "lucide-react";
import VariantEstadoBadge from "./VariantEstadoBadge";
import VariantFilters from "./VariantFilters";

function formatNotificationValue(value) {
	return value ? "Activo" : "Inactivo";
}

function formatDuration(tipo, valor) {
	if (valor === "" || valor === null || valor === undefined) return null;
	const value = Number(valor);
	if (!Number.isFinite(value)) return null;
	return `${value} ${tipo || "dias"}`;
}

export default function VariantTable({
	variantes = [],
	productos = [],
	searchTerm = "",
	setSearchTerm = () => {},
	estadoFilter = "",
	setEstadoFilter = () => {},
	onView = () => {},
	onEdit = () => {},
	onDelete = () => {},
}) {
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 12 });

	const paginatedVariants = variantes.slice(
		pagination.pageIndex * pagination.pageSize,
		(pagination.pageIndex + 1) * pagination.pageSize
	);
	const totalPages = Math.ceil(variantes.length / pagination.pageSize);

	const getProductoNombre = (idProducto) => {
		if (!idProducto) return "Sin producto";
		const producto = productos.find((item) => Number(item.Id_Prd) === Number(idProducto));
		return producto?.Nom_Prd || `Producto #${idProducto}`;
	};

	return (
		<div className="space-y-4">
			<VariantFilters
				searchTerm={searchTerm}
				onSearchTermChange={setSearchTerm}
				estadoFilter={estadoFilter}
				onEstadoFilterChange={setEstadoFilter}
			/>

			{paginatedVariants.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{paginatedVariants.map((variante) => (
						<Card key={variante.Id_Var} className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1">
										<CardTitle className="line-clamp-2 text-lg">{variante.Nom_Var}</CardTitle>
										<p className="text-xs text-muted-foreground mt-1">{getProductoNombre(variante.Id_Prd)}</p>
									</div>
									<VariantEstadoBadge estado={variante.Est_Var} />
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">Precio venta:</span>
										<span className="font-semibold">
											{variante.Pre_Ven_Var === "" || variante.Pre_Ven_Var === null || variante.Pre_Ven_Var === undefined ? "—" : `$${Number(variante.Pre_Ven_Var).toFixed(2)}`}
										</span>
									</div>

									{variante.Pre_Cos_Var !== "" && variante.Pre_Cos_Var !== null && variante.Pre_Cos_Var !== undefined && (
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">Costo:</span>
											<span className="text-sm text-muted-foreground">
												${Number(variante.Pre_Cos_Var).toFixed(2)}
											</span>
										</div>
									)}

									{variante.Pre_Rev_Var !== "" && variante.Pre_Rev_Var !== null && variante.Pre_Rev_Var !== undefined && (
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">Revendedor:</span>
											<span className="text-sm text-muted-foreground">${Number(variante.Pre_Rev_Var).toFixed(2)}</span>
										</div>
									)}

									{formatDuration(variante.Dur_Tip_Var, variante.Dur_Val_Var) && (
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">Duración:</span>
											<span className="text-sm text-muted-foreground">{formatDuration(variante.Dur_Tip_Var, variante.Dur_Val_Var)}</span>
										</div>
									)}

									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">Correo:</span>
										<span className="text-sm text-muted-foreground">{formatNotificationValue(variante.Not_Ven_Cor_Var)}</span>
									</div>

									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">WhatsApp:</span>
										<span className="text-sm text-muted-foreground">{formatNotificationValue(variante.Not_Ven_Wsp_Var)}</span>
									</div>
								</div>

								<div className="flex gap-2 pt-2">
									<Button variant="outline" size="sm" className="flex-1" onClick={() => onView(variante)} title="Ver detalle">
										<Eye className="h-4 w-4 mr-1" />
										Ver
									</Button>
									<Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(variante)} title="Editar">
										<Pencil className="h-4 w-4 mr-1" />
										Editar
									</Button>
									<Button variant="destructive" size="sm" onClick={() => onDelete(variante)} title="Eliminar">
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No hay variantes que coincidan con los filtros</p>
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">
						Mostrando {paginatedVariants.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0} de {variantes.length}
					</span>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" disabled={pagination.pageIndex === 0} onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}>
							Anterior
						</Button>
						<span className="text-xs text-muted-foreground flex items-center px-2">
							Página {pagination.pageIndex + 1} de {totalPages}
						</span>
						<Button variant="outline" size="sm" disabled={pagination.pageIndex === totalPages - 1} onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}>
							Siguiente
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
