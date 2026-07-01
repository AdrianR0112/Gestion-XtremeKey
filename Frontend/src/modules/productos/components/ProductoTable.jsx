import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Eye, ListTree, Pencil, Trash } from "lucide-react";
import ProductoEstadoBadge from "./ProductoEstadoBadge";
import { ESTADOS_PRODUCTO } from "../schemas/producto.schema";
import { resolveProductoImageUrl } from "../helpers/producto-image";

export default function ProductoTable({
	productos = [],
	categorias = [],
	searchTerm = "",
	setSearchTerm = () => {},
	estadoFilter = "",
	setEstadoFilter = () => {},
	variantesPorProducto = {},
	onView = () => {},
	onShowVariantes = () => {},
	onEdit = () => {},
	onDelete = () => {},
	selectedProductId = null,
}) {
	const [page, setPage] = useState(1);
	const pageSize = 6;

	useEffect(() => {
		setPage(1);
	}, [productos.length]);

	const getCategoriaNombre = (idCategoria) => {
		if (!idCategoria) return "Sin categoría";
		const categoria = categorias.find((item) => Number(item.Id_Cat) === Number(idCategoria));
		return categoria?.Nom_Cat || `Categoría #${idCategoria}`;
	};

	const totalPages = Math.max(1, Math.ceil(productos.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const startIndex = (currentPage - 1) * pageSize;
	const paginatedProducts = productos.slice(startIndex, startIndex + pageSize);

	return (
		<div className="space-y-4">
			{/* Filtros */}
			<div className="flex gap-3 items-end flex-wrap">
				<Input
					type="text"
					placeholder="Buscar por nombre, código..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-xs"
				/>

				<Select value={estadoFilter || "all"} onValueChange={(value) => setEstadoFilter(value === "all" ? "" : value)}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Filtrar por estado" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos los estados</SelectItem>
						{ESTADOS_PRODUCTO.map((estado) => (
							<SelectItem key={estado} value={estado}>
								{estado}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Grid de Tarjetas */}
			{productos.length > 0 ? (
				<div className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{paginatedProducts.map((producto) => {
							const variantes = variantesPorProducto[Number(producto.Id_Prd)] || [];
							const hasVariantes = variantes.length > 0;
							const isSelected = Number(selectedProductId) === Number(producto.Id_Prd);
							const imageUrl = resolveProductoImageUrl(producto.Ima_Prd);

							return (
								<Card
									key={producto.Id_Prd}
									className={`border-2 transition-all hover:shadow-lg ${isSelected ? "border-primary shadow-lg" : "border-transparent"}`}
								>
									<CardHeader>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<CardTitle className="line-clamp-2 text-lg">{producto.Nom_Prd}</CardTitle>
												<p className="text-xs text-muted-foreground mt-1">{getCategoriaNombre(producto.Id_Cat)}</p>
												{producto.Cod_Prd && <p className="text-xs text-muted-foreground mt-1">Código: {producto.Cod_Prd}</p>}
												<p className="text-xs text-muted-foreground mt-1">
													{hasVariantes ? `${variantes.length} variante${variantes.length > 1 ? "s" : ""}` : "Sin variantes"}
												</p>
											</div>
											<ProductoEstadoBadge estado={producto.Est_Prd} />
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										{imageUrl && (
											<div className="overflow-hidden rounded-lg border bg-muted/20">
												<img src={imageUrl} alt={producto.Nom_Prd || "Imagen del producto"} className="h-36 w-full object-contain" />
											</div>
										)}

										<div className="space-y-2">
											{producto.Tip_Prd && (
												<div className="flex justify-between items-center">
													<span className="text-sm font-medium">Tipo:</span>
													<span className="text-sm bg-secondary px-2 py-1 rounded">{producto.Tip_Prd}</span>
												</div>
											)}
										</div>

										<div className="grid grid-cols-2 gap-2 pt-2">
											<Button variant="outline" size="sm" onClick={() => onView(producto)} title="Ver detalle">
												<Eye className="h-4 w-4 mr-1" />
												Detalle
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={() => onShowVariantes(producto)}
												disabled={!hasVariantes}
												title="Mostrar variantes"
											>
												<ListTree className="h-4 w-4 mr-1" />
												Variantes
											</Button>
											<Button variant="outline" size="sm" onClick={() => onEdit(producto)} title="Editar">
												<Pencil className="h-4 w-4 mr-1" />
												Editar
											</Button>
											<Button variant="destructive" size="sm" onClick={() => onDelete(producto)} title="Eliminar">
												<Trash className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Mostrando {productos.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + pageSize, productos.length)} de {productos.length}
						</p>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
								Anterior
							</Button>
							<span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
							<Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
								Siguiente
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No hay productos que coincidan con los filtros</p>
				</div>
			)}
		</div>
	);
}
