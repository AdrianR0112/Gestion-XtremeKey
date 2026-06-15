import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import FormSection from "../../../components/form-section";
import FeedbackAlert from "../../../components/feedback-alert";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { formatCurrency } from "../../../utils/currency";
import { getTimezone } from "../../../utils/timezone";
import {
	addDaysToDateInput,
	addMonthsToDateInput,
	addDurationToDateInput,
	createDetalleInitialValues,
	getTodayDateInputValue,
	getTomorrowDateInputValue,
	toNullableInteger,
	toNullableString,
} from "../utils/constants";

const PRODUCT_DETAIL_STATES = ["activo", "vencido", "cancelado", "renovado"];
const DURATION_OPTIONS_DAYS = [
	{ label: "30 días", days: 30 },
	{ label: "60 días", days: 60 },
	{ label: "90 días", days: 90 },
	{ label: "180 días", days: 180 },
	{ label: "365 días", days: 365 },
];
const DURATION_OPTIONS_MONTHS = [
	{ label: "1 mes", months: 1 },
	{ label: "3 meses", months: 3 },
	{ label: "6 meses", months: 6 },
	{ label: "1 año", months: 12 },
];

function formatDateRange(start, end) {
	if (!start && !end) return "—";

	const parseDate = (value) => {
		if (!value) return null;
		const text = String(value).trim();
		if (!text) return null;
		if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
			return new Date(`${text}T12:00:00.000Z`);
		}
		const d = new Date(text);
		return Number.isNaN(d.getTime()) ? null : d;
	};

	const s = parseDate(start);
	const e = parseDate(end);
	if (!s && !e) return "—";

	const formatter = new Intl.DateTimeFormat("es-EC", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: getTimezone(),
	});

	if (s && e) return `${formatter.format(s)} - ${formatter.format(e)}`;
	if (s) return `${formatter.format(s)} - —`;
	return `— - ${formatter.format(e)}`;
}

function inferSubscriptionFromProduct(product) {
	if (!product) return false;
	const signature = `${product.Nom_Prd || ""} ${product.Tip_Prd || ""}`.toLowerCase();
	return ["suscrip", "internet", "plan", "mensual", "stream", "servicio"].some((term) => signature.includes(term));
}

function findVariantById(variantes, idVariante) {
	return variantes.find((item) => Number(item.Id_Var) === Number(idVariante)) || null;
}

function buildProductLabel(product) {
	if (!product) return "Sin producto";
	return product.Nom_Prd || `Producto #${product.Id_Prd}`;
}

export default function DetalleVentasManager({
	detallesTemporales = [],
	detalleFormOpen,
	detalleForm,
	detalleEditandoIdx,
	detalleSubtotal,
	productos,
	variantes,
	productoMap,
	varianteMap,
	clienteId,
	revendedorId,
	licenciasCliente = [],
	onDetallesChange,
	onFormChange,
	onFormClose,
	onAddClick,
	onEditClick,
	onDeleteClick,
	error,
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const selectedProduct = useMemo(
		() => productos.find((item) => Number(item.Id_Prd) === Number(detalleForm.Id_Prd)) || null,
		[detalleForm.Id_Prd, productos]
	);

	function getVariantPrice(variant) {
		if (!variant) return "";
		if (revendedorId && variant.Pre_Rev_Var != null && variant.Pre_Rev_Var !== "") {
			return String(variant.Pre_Rev_Var);
		}
		if (variant.Pre_Ven_Var == null || variant.Pre_Ven_Var === "" || variant.Pre_Ven_Var === undefined) return "";
		return String(variant.Pre_Ven_Var);
	}

	function findPreviousLicenses(idPrd) {
		if (!clienteId || !idPrd) return [];
		return licenciasCliente
			.filter((d) => Number(d.Id_Prd) === Number(idPrd))
			.sort((a, b) => {
				const dateA = a.Fec_Fin_Dve ? new Date(a.Fec_Fin_Dve) : new Date(0);
				const dateB = b.Fec_Fin_Dve ? new Date(b.Fec_Fin_Dve) : new Date(0);
				return dateB - dateA || (Number(b.Id_Dve) - Number(a.Id_Dve));
			});
	}

	function detectRenewal(idPrd, idVar) {
		const prevLicenses = findPreviousLicenses(idPrd);
		if (prevLicenses.length === 0) return null;
		const best = prevLicenses.find((d) => Number(d.Id_Var) === Number(idVar)) || prevLicenses[0];
		return best;
	}

	const variantsByProduct = useMemo(() => {
		return variantes.reduce((acc, variant) => {
			if ((variant.Est_Var || "").toString().toLowerCase() !== "activo") return acc;
			const idProducto = Number(variant.Id_Prd);
			if (!idProducto) return acc;
			if (!acc[idProducto]) acc[idProducto] = [];
			acc[idProducto].push(variant);
			return acc;
		}, {});
	}, [variantes]);
	const productsWithVariants = useMemo(() => {
		return productos.filter((product) => {
			const hasVariants = (variantsByProduct[Number(product.Id_Prd)] || []).length > 0;
			const isActive = (product.Est_Prd || "").toString().toLowerCase() === "activo";
			return hasVariants && isActive;
		});
	}, [productos, variantsByProduct]);
	const availableVariants = useMemo(() => {
		return variantsByProduct[Number(detalleForm.Id_Prd)] || [];
	}, [detalleForm.Id_Prd, variantsByProduct]);
	const hasSubscription = Boolean(
		detalleForm.Es_Suscripcion_Dve ||
		inferSubscriptionFromProduct(selectedProduct) ||
		(detalleForm.Fec_Ini_Dve && detalleForm.Fec_Fin_Dve && detalleForm.Fec_Ini_Dve !== detalleForm.Fec_Fin_Dve)
	);
	const normalizedSearch = searchTerm.trim().toLowerCase();

	const filteredDetalles = useMemo(() => {
		if (!normalizedSearch) return detallesTemporales;
		return detallesTemporales.filter((detalle) => {
			const productName = productoMap.get(Number(detalle.Id_Prd)) || detalle.Nom_Prd || "";
			const variantName = varianteMap.get(Number(detalle.Id_Var)) || detalle.Nom_Var || "";
			return `${productName} ${variantName} ${detalle.Est_Dve || ""}`.toLowerCase().includes(normalizedSearch);
		});
	}, [detallesTemporales, normalizedSearch, productoMap, varianteMap]);

    

	const matchingVariants = useMemo(() => {
		if (!normalizedSearch) return [];
		return variantes.filter((variant) => {
			if ((variant.Est_Var || "").toString().toLowerCase() !== "activo") return false;
			const product = productos.find((p) => Number(p.Id_Prd) === Number(variant.Id_Prd)) || null;
			const isActive = (product?.Est_Prd || "").toString().toLowerCase() === "activo";
			if (!isActive) return false;
			const hay = `${product?.Nom_Prd || ""} ${variant.Nom_Var || ""} ${variant.Des_Var || ""} ${variant.Atr_Var || ""} ${product?.Cod_Prd || ""}`.toLowerCase();
			return hay.includes(normalizedSearch);
		});
	}, [normalizedSearch, variantes, productos]);

	const detalleValidationMessage = useMemo(() => {
		if (!detalleForm.Id_Prd) return "Selecciona un producto.";
		if (detalleForm.Pre_Uni_Dve === "" || Number(detalleForm.Pre_Uni_Dve) < 0) return "El precio unitario debe ser valido.";
		if (Number(detalleForm.Can_Dve || 0) < 1) return "La cantidad debe ser al menos 1.";
		if (Number(detalleForm.Des_Uni_Dve || 0) > Number(detalleForm.Pre_Uni_Dve || 0)) return "El descuento unitario no puede ser mayor al precio.";
		if (hasSubscription && new Date(`${detalleForm.Fec_Fin_Dve}T00:00:00`) < new Date(`${detalleForm.Fec_Ini_Dve}T00:00:00`)) {
			return "La fecha de fin no puede ser menor a la fecha de inicio.";
		}
		return "";
	}, [detalleForm, hasSubscription]);

	const productSummary = {
		cantidad: Number(detalleForm.Can_Dve || 0),
		precio: Number(detalleForm.Pre_Uni_Dve || 0),
		descuento: Number(detalleForm.Des_Uni_Dve || 0),
		subtotal: Number.isFinite(detalleSubtotal) ? detalleSubtotal : 0,
	};

    

	const handleOpenRecommendation = (item) => {
		if (!item) return;

		if (item.type === "variant") {
			const today = getTodayDateInputValue();
			const isSubscription = Boolean(item.variant.Dur_Tip_Var && item.variant.Dur_Val_Var) || inferSubscriptionFromProduct(item.product || null);
			const previousLicense = detectRenewal(item.variant.Id_Prd, item.variant.Id_Var);
			onAddClick({
				...createDetalleInitialValues(),
				Id_Prd: String(item.product?.Id_Prd || item.variant.Id_Prd || ""),
				Id_Var: String(item.variant.Id_Var),
				Pre_Uni_Dve: getVariantPrice(item.variant),
				Es_Suscripcion_Dve: isSubscription,
				Fec_Ini_Dve: today,
				Fec_Fin_Dve: isSubscription ? addDurationToDateInput(today, item.variant.Dur_Tip_Var, item.variant.Dur_Val_Var) : today,
				tipoOperacion: previousLicense ? "renovacion" : "nueva",
				renovacion: previousLicense ? { Id_Dve_Ori: previousLicense.Id_Dve, Tip_Ren: "manual", Des_Ren: 0 } : undefined,
			});
			return;
		}

		const primaryVariant = item.variants?.[0] || null;
		const today = getTodayDateInputValue();
		const isSubscription = Boolean(primaryVariant?.Dur_Tip_Var && primaryVariant?.Dur_Val_Var) || inferSubscriptionFromProduct(item.product || null);
		const productId = item.product?.Id_Prd;
		const variantId = primaryVariant?.Id_Var;
		const previousLicense = detectRenewal(productId, variantId);
		onAddClick({
			...createDetalleInitialValues(),
			Id_Prd: String(item.product?.Id_Prd || ""),
			Id_Var: primaryVariant ? String(primaryVariant.Id_Var) : "",
			Pre_Uni_Dve: getVariantPrice(primaryVariant),
			Es_Suscripcion_Dve: isSubscription,
			Fec_Ini_Dve: today,
			Fec_Fin_Dve: isSubscription ? addDurationToDateInput(today, primaryVariant?.Dur_Tip_Var, primaryVariant?.Dur_Val_Var) : today,
			tipoOperacion: previousLicense ? "renovacion" : "nueva",
			renovacion: previousLicense ? { Id_Dve_Ori: previousLicense.Id_Dve, Tip_Ren: "manual", Des_Ren: 0 } : undefined,
		});
	};

	const handleProductChange = (productId) => {
		const product = productos.find((item) => Number(item.Id_Prd) === Number(productId)) || null;
		const productVariants = variantsByProduct[Number(productId)] || [];
		const firstVariant = productVariants[0] || null;
		const today = getTodayDateInputValue();
		const isSubscription = Boolean(firstVariant?.Dur_Tip_Var && firstVariant?.Dur_Val_Var) || inferSubscriptionFromProduct(product);
		const previousLicense = detectRenewal(productId, firstVariant?.Id_Var);
		onFormChange({
			...detalleForm,
			Id_Prd: productId,
			Id_Var: firstVariant ? String(firstVariant.Id_Var) : "",
			Pre_Uni_Dve: getVariantPrice(firstVariant) || detalleForm.Pre_Uni_Dve,
			Es_Suscripcion_Dve: isSubscription,
			Fec_Ini_Dve: today,
			Fec_Fin_Dve: isSubscription ? addDurationToDateInput(today, firstVariant?.Dur_Tip_Var, firstVariant?.Dur_Val_Var) : today,
			tipoOperacion: previousLicense ? "renovacion" : "nueva",
			renovacion: previousLicense ? { Id_Dve_Ori: previousLicense.Id_Dve, Tip_Ren: "manual", Des_Ren: 0 } : undefined,
		});
	};

	const handleVariantChange = (variantId) => {
		const variant = findVariantById(availableVariants, variantId);
		const today = getTodayDateInputValue();
		const isSubscription = Boolean(variant?.Dur_Tip_Var && variant?.Dur_Val_Var) || inferSubscriptionFromProduct(selectedProduct);
		const previousLicense = detectRenewal(detalleForm.Id_Prd, variantId);
		onFormChange({
			...detalleForm,
			Id_Var: variantId,
			Pre_Uni_Dve: getVariantPrice(variant) || detalleForm.Pre_Uni_Dve,
			Es_Suscripcion_Dve: isSubscription,
			Fec_Ini_Dve: detalleForm.Fec_Ini_Dve || today,
			Fec_Fin_Dve: isSubscription ? addDurationToDateInput(detalleForm.Fec_Ini_Dve || today, variant?.Dur_Tip_Var, variant?.Dur_Val_Var) : detalleForm.Fec_Fin_Dve,
			tipoOperacion: previousLicense ? "renovacion" : (detalleForm.tipoOperacion || "nueva"),
			renovacion: previousLicense ? { Id_Dve_Ori: previousLicense.Id_Dve, Tip_Ren: "manual", Des_Ren: 0 } : detalleForm.renovacion,
		});
	};

	const handleSubscriptionToggle = (enabled) => {
		const today = getTodayDateInputValue();
		onFormChange({
			...detalleForm,
			Es_Suscripcion_Dve: enabled,
			Fec_Ini_Dve: detalleForm.Fec_Ini_Dve || today,
			Fec_Fin_Dve: enabled ? detalleForm.Fec_Fin_Dve || detalleForm.Fec_Ini_Dve || today : detalleForm.Fec_Ini_Dve || today,
		});
	};

	const handleSubscriptionStartChange = (value) => {
		const start = value || getTodayDateInputValue();
		const end = detalleForm.Fec_Fin_Dve && detalleForm.Fec_Fin_Dve >= start ? detalleForm.Fec_Fin_Dve : start;
		onFormChange({
			...detalleForm,
			Fec_Ini_Dve: start,
			Fec_Fin_Dve: end,
		});
	};

	const handleSaveDetail = () => {
		if (detalleValidationMessage) return false;

		const isEditing = detalleEditandoIdx !== null;
		const fechaInicio = detalleForm.Fec_Ini_Dve || getTodayDateInputValue();
		const detailData = {
			Id_Prd: toNullableInteger(detalleForm.Id_Prd),
			Id_Var: toNullableInteger(detalleForm.Id_Var),
			Id_Cue: toNullableInteger(detalleForm.Id_Cue),
			Id_Key: toNullableInteger(detalleForm.Id_Key),
			Can_Dve: Number(detalleForm.Can_Dve || 1),
			Pre_Uni_Dve: Number(detalleForm.Pre_Uni_Dve || 0),
			Des_Uni_Dve: Number(detalleForm.Des_Uni_Dve || 0),
			Sub_Tot_Dve: Number(detalleSubtotal), // keep for local state only, not sent to backend
			Fec_Ini_Dve: fechaInicio,
			Fec_Fin_Dve: hasSubscription ? detalleForm.Fec_Fin_Dve || fechaInicio : fechaInicio,
			Es_Suscripcion_Dve: hasSubscription,
			Cor_Cue: toNullableString(detalleForm.Cor_Cue),
			Con_Cue: toNullableString(detalleForm.Con_Cue),
			Not_Dve: toNullableString(detalleForm.Not_Dve),
			Est_Dve: detalleForm.Est_Dve || "activo",
			tipoOperacion: detalleForm.tipoOperacion || "nueva",
			renovacion: detalleForm.tipoOperacion === "renovacion" && detalleForm.renovacion?.Id_Dve_Ori
				? { ...detalleForm.renovacion }
				: undefined,
		};

		if (isEditing) {
			const updated = [...detallesTemporales];
			updated[detalleEditandoIdx] = {
				...updated[detalleEditandoIdx],
				...detailData,
			};
			onDetallesChange(updated);
		} else {
			onDetallesChange([...detallesTemporales, detailData]);
		}

		onFormClose();
		return true;
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<h3 className="font-semibold text-sm">Productos a vender</h3>
				<p className="text-sm text-zinc-500">Agrega productos, servicios y suscripciones a esta venta.</p>
			</div>

			<div className="flex flex-col gap-3 md:flex-row md:items-center">
				<Input
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder="Buscar producto o variante para agregar..."
					className="md:flex-1"
				/>
				{/* quick selection button removed; use search to find variants */}
			</div>

			{normalizedSearch && (
				<div className="space-y-2">
					<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Variantes encontradas</p>
					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{matchingVariants.length === 0 ? (
							<div className="rounded-xl border bg-white p-3">No se encontraron variantes.</div>
						) : (
							matchingVariants.map((variant) => {
								const product = productos.find((p) => Number(p.Id_Prd) === Number(variant.Id_Prd)) || null;
								const duration = variant.Dur_Tip_Var && variant.Dur_Val_Var ? `${variant.Dur_Val_Var} ${variant.Dur_Tip_Var}` : "—";
								return (
									<button
										key={`match-${variant.Id_Var}`}
										type="button"
										onClick={() => handleOpenRecommendation({ type: "variant", variant, product })}
										className="rounded-xl border bg-white p-3 text-left transition hover:border-zinc-400 hover:shadow-sm"
									>
										<p className="font-medium">{product?.Nom_Prd || "Sin producto"}</p>
										<p className="mt-1 text-xs text-zinc-500">{variant.Nom_Var || `Variante #${variant.Id_Var}`}</p>
										<div className="mt-2 text-sm flex items-center justify-between">
											<span className="text-zinc-600">Duración: {duration}</span>
											<span className="font-semibold">{variant.Pre_Ven_Var == null ? "Sin precio" : formatCurrency(variant.Pre_Ven_Var)}</span>
										</div>
									</button>
								);
							})
						)}
					</div>
				</div>
			)}

			{detallesTemporales.length === 0 ? (
				<div className="rounded-xl border border-dashed bg-zinc-50 p-6 text-center">
					<h4 className="font-medium">Todavia no agregaste productos a esta venta.</h4>
					<p className="mt-2 text-sm text-zinc-500">Puedes buscar un producto o abrir el panel para agregar el primero.</p>
					{/* quick selections removed from empty state */}
				</div>
			) : (
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full min-w-[1060px] text-sm">
						<thead className="bg-zinc-50 text-left">
							<tr>
								<th className="px-4 py-3 font-medium">Producto</th>
								<th className="px-4 py-3 font-medium">Variante</th>
								<th className="px-4 py-3 font-medium">Tipo</th>
								<th className="px-4 py-3 font-medium">Cant.</th>
								<th className="px-4 py-3 font-medium">Precio</th>
								<th className="px-4 py-3 font-medium">Desc.</th>
								<th className="px-4 py-3 font-medium">Fechas</th>
								<th className="px-4 py-3 font-medium">Subtotal</th>
								<th className="px-4 py-3 font-medium">Estado</th>
								<th className="px-4 py-3 font-medium">Accion</th>
							</tr>
						</thead>
						<tbody>
							{filteredDetalles.map((detalle, index) => {
								const realIndex = detallesTemporales.indexOf(detalle);
								const prevLicense = detalle.renovacion?.Id_Dve_Ori
									? licenciasCliente.find((d) => Number(d.Id_Dve) === Number(detalle.renovacion.Id_Dve_Ori))
									: null;
								return (
									<tr key={`${detalle.Id_Dve || "tmp"}-${index}`} className="border-t align-top">
										<td className="px-4 py-3">
											<p className="font-medium">{productoMap.get(Number(detalle.Id_Prd)) || detalle.Nom_Prd || "Sin producto"}</p>
											<p className="text-xs text-zinc-500">{detalle.Es_Suscripcion_Dve ? "Suscripcion" : "Producto"}</p>
										</td>
										<td className="px-4 py-3">{varianteMap.get(Number(detalle.Id_Var)) || detalle.Nom_Var || "—"}</td>
										<td className="px-4 py-3">
											{detalle.tipoOperacion === "renovacion" ? (
												<span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
													Renovación
													{prevLicense ? ` #${prevLicense.Id_Dve}` : ""}
												</span>
											) : (
												<span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
													Nueva
												</span>
											)}
										</td>
										<td className="px-4 py-3">{detalle.Can_Dve ?? 1}</td>
										<td className="px-4 py-3">{formatCurrency(detalle.Pre_Uni_Dve || 0)}</td>
										<td className="px-4 py-3">{formatCurrency(detalle.Des_Uni_Dve || 0)}</td>
										<td className="px-4 py-3">
										{formatDateRange(detalle.Fec_Ini_Dve, detalle.Fec_Fin_Dve)}
										</td>
										<td className="px-4 py-3 font-medium">{formatCurrency(detalle.Sub_Tot_Dve || 0)}</td>
										<td className="px-4 py-3">{detalle.Est_Dve || "activo"}</td>
										<td className="px-4 py-3">
											<div className="flex gap-2">
												<Button type="button" variant="outline" size="sm" onClick={() => onEditClick(realIndex)}>
													Editar
												</Button>
												<Button type="button" variant="ghost" size="sm" onClick={() => onDeleteClick(realIndex)}>
													Quitar
												</Button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}

			<FeedbackAlert message={error} variant="error" />

			<Dialog open={detalleFormOpen} onOpenChange={(open) => (!open ? onFormClose() : null)}>
				<DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
					<DialogHeader className="px-6 pt-6 shrink-0">
						<DialogTitle>{detalleEditandoIdx !== null ? "Editar producto" : "Agregar producto"}</DialogTitle>
						<DialogDescription>Configura cantidades, precios y datos de suscripcion si aplica.</DialogDescription>
					</DialogHeader>

					<div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
						<div className="space-y-5">
							<FormSection title="Producto y variante" description="Selecciona el producto base y la variante deseada.">
								<div className="space-y-2">
									<Label>Producto *</Label>
									<Select value={detalleForm.Id_Prd || ""} onValueChange={handleProductChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Seleccionar producto" />
										</SelectTrigger>
										<SelectContent>
											{productsWithVariants.map((product) => (
												<SelectItem key={product.Id_Prd} value={String(product.Id_Prd)}>
													{buildProductLabel(product)}
												</SelectItem>
											))}
											{productsWithVariants.length === 0 ? (
												<SelectItem value="__none__" disabled>
													No hay productos con variantes disponibles
												</SelectItem>
											) : null}
										</SelectContent>
									</Select>
									<p className="text-xs text-zinc-500">Solo se muestran productos que tienen variantes con precio y duración.</p>
								</div>

								<div className="space-y-2">
									<Label>Variante</Label>
									<Select value={detalleForm.Id_Var || ""} onValueChange={handleVariantChange} disabled={!detalleForm.Id_Prd}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Seleccionar variante" />
										</SelectTrigger>
										<SelectContent>
											{availableVariants.length === 0 ? (
												<SelectItem value="__none__" disabled>
													Sin variantes disponibles
												</SelectItem>
											) : (
												availableVariants.map((variant) => (
													<SelectItem key={variant.Id_Var} value={String(variant.Id_Var)}>
														{variant.Nom_Var || `Variante #${variant.Id_Var}`}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</div>
							</FormSection>

							{detalleForm.Id_Prd ? (
								<FormSection title="Tipo de operacion" description="Indica si es una nueva licencia o una renovacion de una licencia existente.">
									<div className="space-y-4">
										<div className="inline-flex rounded-lg border bg-muted/30 p-1">
											<Button
												type="button"
												size="sm"
												variant={(detalleForm.tipoOperacion || "nueva") === "nueva" ? "default" : "ghost"}
												onClick={() => onFormChange({ ...detalleForm, tipoOperacion: "nueva", renovacion: undefined })}
											>
												Nueva licencia
											</Button>
											<Button
												type="button"
												size="sm"
												variant={detalleForm.tipoOperacion === "renovacion" ? "default" : "ghost"}
												onClick={() => {
													const idPrd = Number(detalleForm.Id_Prd);
													const prevLicenses = findPreviousLicenses(idPrd);
													const best = prevLicenses[0] || null;
													onFormChange({
														...detalleForm,
														tipoOperacion: "renovacion",
														renovacion: best ? { Id_Dve_Ori: best.Id_Dve, Tip_Ren: "manual", Des_Ren: 0 } : undefined,
													});
												}}
											>
												Renovacion
											</Button>
										</div>

										{detalleForm.tipoOperacion === "renovacion" ? (
											(() => {
												const idPrd = Number(detalleForm.Id_Prd);
												const prevLicenses = findPreviousLicenses(idPrd);
												return (
													<div className="space-y-2">
														<Label>Licencia anterior a renovar</Label>
														{prevLicenses.length === 0 ? (
															<p className="text-sm text-amber-600">No se encontraron licencias anteriores de este producto para este cliente.</p>
														) : (
															<Select
																value={detalleForm.renovacion?.Id_Dve_Ori ? String(detalleForm.renovacion.Id_Dve_Ori) : ""}
																onValueChange={(value) => onFormChange({
																	...detalleForm,
																	renovacion: {
																		...detalleForm.renovacion,
																		Id_Dve_Ori: Number(value),
																		Tip_Ren: "manual",
																		Des_Ren: 0,
																	},
																})}
															>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="Seleccionar licencia anterior" />
																</SelectTrigger>
																<SelectContent>
																	{prevLicenses.map((lic) => {
																		const prodName = lic.Nom_Prd || productoMap.get(Number(lic.Id_Prd)) || "Producto";
																		const varName = lic.Nom_Var || varianteMap.get(Number(lic.Id_Var)) || "";
																		const date = lic.Fec_Fin_Dve ? `hasta ${lic.Fec_Fin_Dve}` : "";
																		return (
																			<SelectItem key={lic.Id_Dve} value={String(lic.Id_Dve)}>
																				{`#${lic.Id_Dve} - ${prodName}${varName ? ` (${varName})` : ""} ${date}`}
																			</SelectItem>
																		);
																	})}
																</SelectContent>
															</Select>
														)}
													</div>
												);
											})()
										) : null}
									</div>
								</FormSection>
							) : null}

							<FormSection title="Valores" description="Define cantidad, precio, descuento y estado del detalle.">
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="space-y-2">
										<Label>Cantidad *</Label>
										<Input
											type="number"
											min="1"
											value={detalleForm.Can_Dve}
											onChange={(event) => onFormChange({ ...detalleForm, Can_Dve: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>Precio unitario *</Label>
										<Input
											type="number"
											min="0"
											step="0.01"
											value={detalleForm.Pre_Uni_Dve}
											onChange={(event) => onFormChange({ ...detalleForm, Pre_Uni_Dve: event.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>Descuento unitario</Label>
										<Input
											type="number"
											min="0"
											step="0.01"
											value={detalleForm.Des_Uni_Dve}
											onChange={(event) => onFormChange({ ...detalleForm, Des_Uni_Dve: event.target.value })}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label>Estado del producto</Label>
									<Select value={detalleForm.Est_Dve || "activo"} onValueChange={(value) => onFormChange({ ...detalleForm, Est_Dve: value })}>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{PRODUCT_DETAIL_STATES.map((state) => (
												<SelectItem key={state} value={state}>
													{state.charAt(0).toUpperCase() + state.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</FormSection>

							<FormSection title="Credenciales" description="Correo y contrasena de la cuenta asociada al producto.">
								<div className="space-y-2">
									<Label>Correo de cuenta</Label>
									<Input
										type="email"
										value={detalleForm.Cor_Cue || ""}
										onChange={(event) => onFormChange({ ...detalleForm, Cor_Cue: event.target.value })}
									/>
								</div>
								<div className="space-y-2">
									<Label>Contrasena de cuenta</Label>
									<Input
										type="text"
										value={detalleForm.Con_Cue || ""}
										onChange={(event) => onFormChange({ ...detalleForm, Con_Cue: event.target.value })}
									/>
								</div>
							</FormSection>

							<FormSection title="Suscripción" description="Opcional. Configura vigencia si el producto se renueva periódicamente.">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="font-medium">Tiene suscripcion?</p>
										<p className="text-sm text-zinc-500">Muestra periodo de inicio y fin solo cuando aplica.</p>
									</div>
									<div className="inline-flex rounded-lg border bg-muted/30 p-1 shrink-0">
										<Button
											type="button"
											size="sm"
											variant={hasSubscription ? "default" : "ghost"}
											onClick={() => handleSubscriptionToggle(true)}
										>
											Si
										</Button>
										<Button
											type="button"
											size="sm"
											variant={!hasSubscription ? "default" : "ghost"}
											onClick={() => handleSubscriptionToggle(false)}
										>
											No
										</Button>
									</div>
								</div>

								{hasSubscription ? (
									<div className="space-y-4 rounded-lg bg-zinc-50 p-4">
										<div className="space-y-2">
											<Label>Inicio</Label>
											<div className="flex flex-wrap gap-2">
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={() => handleSubscriptionStartChange(getTodayDateInputValue())}
												>
													Hoy
												</Button>
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={() => handleSubscriptionStartChange(getTomorrowDateInputValue())}
												>
													Manana
												</Button>
												<Input
													type="date"
													value={detalleForm.Fec_Ini_Dve && detalleForm.Fec_Ini_Dve.trim() ? detalleForm.Fec_Ini_Dve : getTodayDateInputValue()}
													onChange={(event) => handleSubscriptionStartChange(event.target.value)}
													className="max-w-[220px]"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Duracion</Label>
											<div className="flex flex-wrap gap-2">
													{DURATION_OPTIONS_DAYS.map((option) => (
														<Button
															key={option.label}
															type="button"
															size="sm"
															variant="outline"
															onClick={() => {
																const startDate = detalleForm.Fec_Ini_Dve || getTodayDateInputValue();
																onFormChange({ ...detalleForm, Fec_Fin_Dve: addDaysToDateInput(startDate, option.days) });
															}}
														>
															{option.label}
														</Button>
													))}
												</div>
												<div className="border-t my-1" />
												<div className="flex flex-wrap gap-2">
													{DURATION_OPTIONS_MONTHS.map((option) => (
														<Button
															key={option.label}
															type="button"
															size="sm"
															variant="outline"
															onClick={() => {
																const startDate = detalleForm.Fec_Ini_Dve || getTodayDateInputValue();
																onFormChange({ ...detalleForm, Fec_Fin_Dve: addMonthsToDateInput(startDate, option.months) });
															}}
														>
															{option.label}
														</Button>
													))}
												</div>
												<div className="flex flex-wrap gap-2">
													<Button type="button" size="sm" variant="ghost">
														Personalizado
													</Button>
												</div>
										</div>

										<div className="space-y-2">
											<Label>Fin</Label>
											<Input
												type="date"
												min={detalleForm.Fec_Ini_Dve && detalleForm.Fec_Ini_Dve.trim() ? detalleForm.Fec_Ini_Dve : getTodayDateInputValue()}
												value={detalleForm.Fec_Fin_Dve && detalleForm.Fec_Fin_Dve.trim() ? detalleForm.Fec_Fin_Dve : detalleForm.Fec_Ini_Dve && detalleForm.Fec_Ini_Dve.trim() ? detalleForm.Fec_Ini_Dve : getTodayDateInputValue()}
												onChange={(event) => onFormChange({ ...detalleForm, Fec_Fin_Dve: event.target.value })}
												className="w-full"
											/>
										</div>
									</div>
								) : null}
							</FormSection>

							<div className="rounded-xl border bg-blue-50 p-4">
								<h4 className="font-medium">Resumen del producto</h4>
								<div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
									<p>Cantidad: {productSummary.cantidad}</p>
									<p>Precio unitario: {formatCurrency(productSummary.precio)}</p>
									<p>Descuento unitario: {formatCurrency(productSummary.descuento)}</p>
									<p className="font-semibold">Subtotal: {formatCurrency(productSummary.subtotal)}</p>
								</div>
								{hasSubscription ? (
									<p className="mt-3 text-sm">Periodo: {formatDateRange(detalleForm.Fec_Ini_Dve, detalleForm.Fec_Fin_Dve)}</p>
								) : null}
							</div>

							<FeedbackAlert message={detalleValidationMessage} variant="warning" />
						</div>
					</div>

					<div className="border-t bg-background px-6 py-4 shrink-0">
						<div className="flex flex-wrap items-center justify-end gap-2">
							{detalleEditandoIdx !== null ? (
								<Button
									type="button"
									variant="destructive"
									onClick={() => {
										onDeleteClick(detalleEditandoIdx);
										onFormClose();
									}}
								>
									Eliminar producto
								</Button>
							) : null}
							<Button type="button" variant="outline" onClick={onFormClose}>
								Cancelar
							</Button>
							<Button type="button" onClick={handleSaveDetail} disabled={Boolean(detalleValidationMessage)}>
								{detalleEditandoIdx !== null ? "Guardar cambios" : "Agregar producto"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
