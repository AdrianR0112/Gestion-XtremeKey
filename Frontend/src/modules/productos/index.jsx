import { useState } from "react";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../../components/ui/drawer";
import useProductos from "./hooks/useProductos";
import useProductosActions from "./hooks/useProductosActions";
import ProductoTable from "./components/ProductoTable";
import ProductoForm from "./components/ProductoForm";
import ProductoVariantesPanel from "./components/ProductoVariantesPanel";
import ProductoCard from "./components/ProductoCard";
import VariantCard from "../variantes/components/VariantCard";
import VariantForm from "../variantes/components/VariantForm";
import { mapVariantFromApi, mapVariantPayload } from "../variantes/helpers/variant.mapper";
import { isVariantFormValid, validateVariantForm, VARIANTE_INICIAL } from "../variantes/schemas/variant.schema";
import { variantesService } from "../variantes/services/variantes.service";

export default function ProductosPage() {
	const state = useProductos();
	const actions = useProductosActions(state);

	const [detailSheetOpen, setDetailSheetOpen] = useState(false);
	const [editSheetOpen, setEditSheetOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedProductForVariants, setSelectedProductForVariants] = useState(null);
	const [variantsDrawerOpen, setVariantsDrawerOpen] = useState(false);
	const [variantDetailSheetOpen, setVariantDetailSheetOpen] = useState(false);
	const [variantEditSheetOpen, setVariantEditSheetOpen] = useState(false);
	const [variantDeleteDialogOpen, setVariantDeleteDialogOpen] = useState(false);
	const [variantSaving, setVariantSaving] = useState(false);
	const [variantError, setVariantError] = useState(null);
	const [selectedVariant, setSelectedVariant] = useState(null);
	const [variantForm, setVariantForm] = useState(VARIANTE_INICIAL);
	const [variantSearchTerm, setVariantSearchTerm] = useState("");
	const [variantEstadoFilter, setVariantEstadoFilter] = useState("");
	const [selectedVariantIds, setSelectedVariantIds] = useState([]);
	const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

	const handleViewProducto = (producto) => {
		state.setSelectedId(producto.Id_Prd);
		setDetailSheetOpen(true);
	};

	const handleShowVariantes = (producto) => {
		state.setSelectedId(producto.Id_Prd);
		setSelectedProductForVariants(producto);
		setVariantsDrawerOpen(true);
		setSelectedVariantIds([]);
		setVariantSearchTerm("");
		setVariantEstadoFilter("");
	};

	const handleEditProducto = (producto) => {
		actions.abrirEditar(producto);
		setEditSheetOpen(true);
	};

	const handleDeleteProducto = (producto) => {
		state.setSelectedId(producto.Id_Prd);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		const success = await actions.confirmarEliminacion(state.productoSeleccionado);
		if (success) {
			setDeleteDialogOpen(false);
		}
	};

	const handleOpenCreate = () => {
		actions.abrirCrear();
		setEditSheetOpen(true);
	};

	const handleOpenCreateVariante = () => {
		setSelectedVariant(null);
		setVariantError(null);
		setVariantForm({
			...VARIANTE_INICIAL,
			Id_Prd: activeProduct?.Id_Prd ? String(activeProduct.Id_Prd) : "",
		});
		setVariantEditSheetOpen(true);
	};

	const handleToggleVariantSelection = (variantId) => {
		setSelectedVariantIds((current) =>
			current.includes(variantId) ? current.filter((id) => id !== variantId) : [...current, variantId]
		);
	};

	const handleToggleSelectAllVisible = (visibleVariants) => {
		const visibleIds = visibleVariants.map((variante) => variante.Id_Var);
		const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedVariantIds.includes(id));
		setSelectedVariantIds((current) =>
			allSelected ? current.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...current, ...visibleIds]))
		);
	};

	const handleDuplicateSelected = async () => {
		const variantsToDuplicate = activeVariants.filter((variante) => selectedVariantIds.includes(variante.Id_Var));
		if (variantsToDuplicate.length === 0) return;

		try {
			setVariantSaving(true);
			setVariantError(null);
			for (const variante of variantsToDuplicate) {
				const payload = mapVariantPayload(mapVariantFromApi(variante));
				await variantesService.create(payload);
			}
			await state.cargarVariantes();
			setSelectedVariantIds([]);
			state.setSuccess("Variantes duplicadas correctamente.");
			setTimeout(() => state.setSuccess(null), 3000);
		} catch (err) {
			setVariantError(err?.message || "Error al duplicar variantes.");
		} finally {
			setVariantSaving(false);
		}
	};

	const handleBulkDeleteSelected = async () => {
		const variantsToDelete = activeVariants.filter((variante) => selectedVariantIds.includes(variante.Id_Var));
		if (variantsToDelete.length === 0) return;
		setBulkDeleteDialogOpen(true);
	};

	const handleConfirmBulkDelete = async () => {
		const variantsToDelete = activeVariants.filter((variante) => selectedVariantIds.includes(variante.Id_Var));
		if (variantsToDelete.length === 0) return;

		try {
			setVariantSaving(true);
			setVariantError(null);
			for (const variante of variantsToDelete) {
				await variantesService.remove(variante.Id_Var);
			}
			await state.cargarVariantes();
			setSelectedVariantIds([]);
			setBulkDeleteDialogOpen(false);
			state.setSuccess("Variantes eliminadas correctamente.");
			setTimeout(() => state.setSuccess(null), 3000);
		} catch (err) {
			setVariantError(err?.message || "Error al eliminar variantes.");
		} finally {
			setVariantSaving(false);
		}
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const ok = await actions.guardarProducto(e);
		if (ok) {
			setEditSheetOpen(false);
		}
	};

	const handleEditVariante = (variante) => {
		setSelectedVariant(variante);
		setVariantForm(mapVariantFromApi(variante));
		setVariantError(null);
		setVariantEditSheetOpen(true);
	};

	const handleViewVariante = (variante) => {
		setSelectedVariant(variante);
		setVariantDetailSheetOpen(true);
	};

	const handleDeleteVariante = (variante) => {
		setSelectedVariant(variante);
		setVariantDeleteDialogOpen(true);
	};

	const handleVariantSubmit = async (event) => {
		event?.preventDefault();

		const errors = validateVariantForm(variantForm);
		if (Object.keys(errors).length > 0) {
			setVariantError("Por favor completa los campos requeridos de la variante.");
			return;
		}

		try {
			setVariantSaving(true);
			setVariantError(null);
			if (selectedVariant?.Id_Var) {
				await variantesService.update(selectedVariant.Id_Var, mapVariantPayload(variantForm));
				state.setSuccess("Variante actualizada correctamente.");
			} else {
				await variantesService.create(mapVariantPayload(variantForm));
				state.setSuccess("Variante creada correctamente.");
			}
			await state.cargarVariantes();
			setVariantEditSheetOpen(false);
			setSelectedVariant(null);
			setVariantForm(VARIANTE_INICIAL);
			setTimeout(() => state.setSuccess(null), 3000);
		} catch (err) {
			setVariantError(err?.message || "Error al actualizar la variante.");
		}
		finally {
			setVariantSaving(false);
		}
	};

	const handleConfirmDeleteVariante = async () => {
		if (!selectedVariant?.Id_Var) {
			return;
		}

		try {
			setVariantSaving(true);
			await variantesService.remove(selectedVariant.Id_Var);
			await state.cargarVariantes();
			setVariantDeleteDialogOpen(false);
			setSelectedVariant(null);
			state.setSuccess("Variante eliminada correctamente.");
			setTimeout(() => state.setSuccess(null), 3000);
		} catch (err) {
			state.setError(err?.message || "Error al eliminar la variante.");
		} finally {
			setVariantSaving(false);
		}
	};

	const clearMessages = () => {
		setTimeout(() => {
			state.setError(null);
			state.setSuccess(null);
		}, 3000);
	};

	if (state.error && !state.success) {
		clearMessages();
	}

	const activeProduct =
		state.productos.find((item) => Number(item.Id_Prd) === Number(selectedProductForVariants?.Id_Prd)) || selectedProductForVariants;
	const activeVariants = activeProduct ? state.variantesPorProducto[Number(activeProduct.Id_Prd)] || [] : [];
	const activeCategory = activeProduct
		? state.categorias.find((cat) => Number(cat.Id_Cat) === Number(activeProduct.Id_Cat))?.Nom_Cat || "Sin categoría"
		: "Sin categoría";
	const filteredActiveVariants = activeVariants.filter((variante) => {
		const query = variantSearchTerm.trim().toLowerCase();
		const matchesSearch =
			!query ||
			`${variante.Nom_Var || ""} ${variante.Des_Var || ""} ${variante.Pre_Ven_Var ?? ""} ${variante.Pre_Cos_Var ?? ""} ${variante.Pre_Rev_Var ?? ""} ${variante.Not_Ven_Cor_Var ? "correo activo" : "correo inactivo"} ${variante.Not_Ven_Wsp_Var ? "whatsapp activo" : "whatsapp inactivo"}`
				.toLowerCase()
				.includes(query);
		const matchesEstado = !variantEstadoFilter || variante.Est_Var === variantEstadoFilter;
		return matchesSearch && matchesEstado;
	});

	return (
		<div className="max-w-7xl mx-auto space-y-5">
			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-center justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 sm:px-5 dark:border-zinc-800/80">
					<div>
						<h1 className="text-2xl font-semibold">Productos</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Gestiona el catálogo de productos y servicios</p>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={handleOpenCreateVariante}>+ Nueva Variante</Button>
						<Button onClick={handleOpenCreate}>+ Nuevo Producto</Button>
					</div>
				</div>

				<div className="space-y-3 px-4 py-4 sm:px-5">
					<FeedbackAlert message={state.error} variant="error" />
					<FeedbackAlert message={state.success} variant="success" />
					<FeedbackAlert message={variantError} variant="error" />

					{state.loading && <p className="text-center py-8 text-muted-foreground">Cargando productos...</p>}

					{!state.loading && (
						<ProductoTable
							productos={state.productosFiltrados}
							categorias={state.categorias}
							variantesPorProducto={state.variantesPorProducto}
							searchTerm={state.searchTerm}
							setSearchTerm={state.setSearchTerm}
							estadoFilter={state.estadoFilter}
							setEstadoFilter={state.setEstadoFilter}
							onView={handleViewProducto}
							onShowVariantes={handleShowVariantes}
							onEdit={handleEditProducto}
							onDelete={handleDeleteProducto}
							selectedProductId={activeProduct?.Id_Prd || null}
						/>
					)}
				</div>
			</section>

			{/* Variants Drawer */}
			<Drawer open={variantsDrawerOpen} onOpenChange={setVariantsDrawerOpen}>
				<DrawerContent className="max-w-6xl mx-auto">
					<DrawerHeader>
						<DrawerTitle>Variantes del producto</DrawerTitle>
						<DrawerDescription>
							{activeProduct ? `${activeProduct.Nom_Prd} (${activeVariants.length} variantes)` : "Selecciona un producto para ver sus variantes"}
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 pb-4 overflow-y-auto">
						<ProductoVariantesPanel
							producto={activeProduct}
							variantes={filteredActiveVariants}
							categoriaNombre={activeCategory}
							searchTerm={variantSearchTerm}
							setSearchTerm={setVariantSearchTerm}
							estadoFilter={variantEstadoFilter}
							setEstadoFilter={setVariantEstadoFilter}
							selectedVariantIds={selectedVariantIds}
							onToggleVariantSelection={handleToggleVariantSelection}
							onToggleSelectAll={handleToggleSelectAllVisible}
							onDuplicateSelected={handleDuplicateSelected}
							onDeleteSelected={handleBulkDeleteSelected}
							onVariantView={handleViewVariante}
							onVariantEdit={handleEditVariante}
							onVariantDelete={handleDeleteVariante}
						/>
					</div>
				</DrawerContent>
			</Drawer>

				{/* Product Detail Sheet */}
				<Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
					<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
						<SheetHeader className="px-6 pt-6">
							<SheetTitle>Detalle del Producto</SheetTitle>
							<SheetDescription>Información completa del producto seleccionado</SheetDescription>
						</SheetHeader>
						<div className="px-6 pb-6">
							<ProductoCard
								producto={state.productoSeleccionado}
								categorias={state.categorias}
								onEdit={(producto) => {
									setDetailSheetOpen(false);
									handleEditProducto(producto);
								}}
								onDelete={(producto) => {
									setDetailSheetOpen(false);
									handleDeleteProducto(producto);
								}}
							/>
						</div>
					</SheetContent>
				</Sheet>

				{/* Variant Detail Sheet */}
				<Sheet open={variantDetailSheetOpen} onOpenChange={setVariantDetailSheetOpen}>
					<SheetContent side="right" className="sm:max-w-xl p-0 overflow-y-auto">
						<SheetHeader className="px-6 pt-6">
							<SheetTitle>Detalle de la Variante</SheetTitle>
							<SheetDescription>Información completa de la variante seleccionada</SheetDescription>
						</SheetHeader>
						<div className="px-6 pb-6">
							<VariantCard
								variante={selectedVariant}
								productos={state.productos}
								onEdit={(variante) => {
									setVariantDetailSheetOpen(false);
									handleEditVariante(variante);
								}}
								onDelete={(variante) => {
									setVariantDetailSheetOpen(false);
									handleDeleteVariante(variante);
								}}
							/>
						</div>
					</SheetContent>
				</Sheet>

			{/* Edit/Create Sheet */}
			<Dialog open={editSheetOpen} onOpenChange={setEditSheetOpen}>
				<DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{state.form.Id_Prd ? "Editar Producto" : "Crear Nuevo Producto"}</DialogTitle>
						<DialogDescription>
							{state.form.Id_Prd ? "Actualiza los datos del producto" : "Completa los datos para crear un nuevo producto"}
						</DialogDescription>
					</DialogHeader>
					<ProductoForm
						form={state.form}
						onFormChange={state.setForm}
						categoriasActivas={state.categoriasActivas}
						onSubmit={handleFormSubmit}
						onRemovePersistedImage={actions.eliminarImagenProducto}
						onCancel={() => setEditSheetOpen(false)}
						isValid={state.formValido}
						isLoading={state.saving}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El producto "{state.productoSeleccionado?.Nom_Prd}" será eliminado permanentemente.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex gap-2 justify-end">
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
							Eliminar
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>

			{/* Variant Edit Sheet */}
			<Dialog
				open={variantEditSheetOpen}
				onOpenChange={(open) => {
					setVariantEditSheetOpen(open);
					if (!open) {
						setSelectedVariant(null);
						setVariantForm(VARIANTE_INICIAL);
						setVariantError(null);
					}
				}}
			>
				<DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
					<DialogHeader className="px-6 pt-6">
						<DialogTitle>{selectedVariant?.Id_Var ? "Editar Variante" : "Nueva Variante"}</DialogTitle>
						<DialogDescription>
							{selectedVariant?.Id_Var
								? "Actualiza los datos de la variante seleccionada"
								: "Completa los datos para crear una nueva variante"}
						</DialogDescription>
					</DialogHeader>
					<VariantForm
						form={variantForm}
						productos={state.productos}
						onFormChange={setVariantForm}
						onSubmit={handleVariantSubmit}
						onCancel={() => {
							setVariantEditSheetOpen(false);
							setSelectedVariant(null);
							setVariantForm(VARIANTE_INICIAL);
							setVariantError(null);
						}}
						isValid={isVariantFormValid(variantForm)}
						isLoading={variantSaving}
					/>
				</DialogContent>
			</Dialog>

			{/* Variant Delete Confirmation */}
			<AlertDialog open={variantDeleteDialogOpen} onOpenChange={setVariantDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. La variante "{selectedVariant?.Nom_Var}" será eliminada permanentemente.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex gap-2 justify-end">
						<AlertDialogCancel disabled={variantSaving}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDeleteVariante}
							disabled={variantSaving}
							className="bg-red-600 hover:bg-red-700"
						>
							{variantSaving ? "Eliminando..." : "Eliminar"}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar variantes seleccionadas?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. Se eliminarán permanentemente las variantes seleccionadas.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex gap-2 justify-end">
						<AlertDialogCancel disabled={variantSaving}>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmBulkDelete} disabled={variantSaving} className="bg-red-600 hover:bg-red-700">
							{variantSaving ? "Eliminando..." : "Eliminar seleccionadas"}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
