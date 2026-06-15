import { useState, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Textarea } from "../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Trash2, Edit2 } from "lucide-react";
import { formatCurrency } from "../../../utils/currency";
import { NONE_VALUE, toSelectValue, fromSelectValue } from "../utils/constants";

export default function DetalleComprasManager({
	detallesTemporales = [],
	detalleFormOpen,
	detalleForm,
	detalleEditandoIdx,
	detalleSubtotal,
	productos,
	variantes,
	productoMap,
	varianteMap,
	onDetallesChange,
	onFormChange,
	onFormClose,
	onAddClick,
	onEditClick,
	onDeleteClick,
}) {
	const [searchTerm, setSearchTerm] = useState("");

	const selectedProduct = useMemo(
		() => productos.find((item) => Number(item.Id_Prd) === Number(detalleForm.Id_Prd)) || null,
		[detalleForm.Id_Prd, productos]
	);

	const variantsByProduct = useMemo(() => {
		return variantes.reduce((acc, variant) => {
			const idProducto = Number(variant.Id_Prd);
			if (!idProducto) return acc;
			if (!acc[idProducto]) acc[idProducto] = [];
			acc[idProducto].push(variant);
			return acc;
		}, {});
	}, [variantes]);

	const availableVariants = useMemo(() => {
		return variantsByProduct[Number(detalleForm.Id_Prd)] || [];
	}, [detalleForm.Id_Prd, variantsByProduct]);

	const normalizedSearch = searchTerm.trim().toLowerCase();

	const filteredDetalles = useMemo(() => {
		if (!normalizedSearch) return detallesTemporales;
		return detallesTemporales.filter((detalle) => {
			const productName = productoMap[Number(detalle.Id_Prd)]?.Nom_Prd || "";
			const variantName = varianteMap[Number(detalle.Id_Var)]?.Nom_Var || "";
			return `${productName} ${variantName}`.toLowerCase().includes(normalizedSearch);
		});
	}, [detallesTemporales, normalizedSearch, productoMap, varianteMap]);

	const handleAddDetalle = () => {
		if (!detalleForm.Can_Dco || !detalleForm.Pre_Uni_Dco) {
			return;
		}

		const nuevoDetalle = {
			...detalleForm,
			Sub_Tot_Dco: detalleSubtotal,
		};

		if (detalleEditandoIdx !== null) {
			const updated = [...detallesTemporales];
			updated[detalleEditandoIdx] = nuevoDetalle;
			onDetallesChange(updated);
		} else {
			onDetallesChange([...detallesTemporales, nuevoDetalle]);
		}
		onFormClose();
	};

	return (
		<div className="space-y-4">
			{/* Item list */}
			{detallesTemporales.length > 0 && (
				<div className="rounded-lg border overflow-hidden">
					<Table className="text-sm">
						<TableHeader>
							<TableRow>
								<TableHead>Producto</TableHead>
								<TableHead>Cantidad</TableHead>
								<TableHead>Precio Unitario</TableHead>
								<TableHead>Subtotal</TableHead>
								<TableHead className="text-right">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredDetalles.map((detalle, idx) => (
								<TableRow key={idx}>
									<TableCell>
										<div>
											<p className="font-medium">{productoMap[Number(detalle.Id_Prd)]?.Nom_Prd || "Producto"}</p>
											{detalle.Id_Var && (
												<p className="text-xs text-zinc-600">
													Variante: {varianteMap[Number(detalle.Id_Var)]?.Nom_Var || detalle.Id_Var}
												</p>
											)}
										</div>
									</TableCell>
									<TableCell>{detalle.Can_Dco}</TableCell>
									<TableCell>{formatCurrency(detalle.Pre_Uni_Dco)}</TableCell>
									<TableCell className="font-semibold">{formatCurrency(detalle.Sub_Tot_Dco)}</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-1">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => onEditClick(detalle, idx)}
											>
												<Edit2 className="size-4" />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => onDeleteClick(idx)}
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

			{/* Form */}
			<Sheet open={detalleFormOpen} onOpenChange={(open) => !open && onFormClose()}>
				<SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto">
					<SheetHeader className="px-6 pt-6">
						<SheetTitle>
							{detalleEditandoIdx !== null ? "Editar item" : "Agregar item"}
						</SheetTitle>
						<SheetDescription>Completa los detalles del item.</SheetDescription>
					</SheetHeader>

					<form onSubmit={(e) => { e.preventDefault(); handleAddDetalle(); }} className="space-y-4 px-6 pb-6">
						<div className="space-y-2">
							<Label>Producto</Label>
							<Select
								value={toSelectValue(detalleForm.Id_Prd)}
								onValueChange={(value) =>
									onFormChange((prev) => ({
										...prev,
										Id_Prd: fromSelectValue(value),
										Id_Var: null,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona producto" />
								</SelectTrigger>
								<SelectContent>
									{productos.map((producto) => (
										<SelectItem key={producto.Id_Prd} value={String(producto.Id_Prd)}>
											{producto.Nom_Prd}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{availableVariants.length > 0 && (
							<div className="space-y-2">
								<Label>Variante (opcional)</Label>
								<Select
									value={toSelectValue(detalleForm.Id_Var)}
									onValueChange={(value) =>
										onFormChange((prev) => ({
											...prev,
											Id_Var: fromSelectValue(value),
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona variante" />
									</SelectTrigger>
									<SelectContent>
										{availableVariants.map((variante) => (
											<SelectItem key={variante.Id_Var} value={String(variante.Id_Var)}>
												{variante.Nom_Var}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-2">
								<Label>Cantidad *</Label>
								<Input
									type="number"
									min="1"
									value={detalleForm.Can_Dco}
									onChange={(e) =>
										onFormChange((prev) => ({
											...prev,
											Can_Dco: parseInt(e.target.value) || 1,
										}))
									}
									disabled={!detalleForm.Id_Prd}
								/>
							</div>
							<div className="space-y-2">
								<Label>Precio Unitario *</Label>
								<Input
									type="number"
									step="0.01"
									min="0"
									value={detalleForm.Pre_Uni_Dco}
									onChange={(e) =>
										onFormChange((prev) => ({
											...prev,
											Pre_Uni_Dco: parseFloat(e.target.value) || 0,
										}))
									}
									disabled={!detalleForm.Id_Prd}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Subtotal</Label>
							<div className="px-3 py-2 rounded-md border bg-muted text-sm font-semibold">
								{formatCurrency(detalleSubtotal)}
							</div>
						</div>

						<div className="space-y-2">
							<Label>Notas (opcional)</Label>
							<Textarea
								value={detalleForm.Not_Dco}
								onChange={(e) =>
									onFormChange((prev) => ({
										...prev,
										Not_Dco: e.target.value,
									}))
								}
								placeholder="Observaciones del item..."
								className="min-h-16"
							/>
						</div>

						<div className="flex gap-2 justify-end pt-4 border-t">
							<Button type="button" variant="outline" onClick={onFormClose}>
								Cancelar
							</Button>
							<Button type="submit" disabled={!detalleForm.Id_Prd || !detalleForm.Can_Dco || !detalleForm.Pre_Uni_Dco}>
								{detalleEditandoIdx !== null ? "Actualizar" : "Agregar"}
							</Button>
						</div>
					</form>
				</SheetContent>
			</Sheet>
		</div>
	);
}
