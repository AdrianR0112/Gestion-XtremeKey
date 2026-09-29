import { useMemo } from "react";
import { AlertTriangle, ArrowRight, CalendarClock, Info, RotateCcw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import FormSection from "../../../components/form-section";
import formatDate from "../../../utils/formatDate";
import { diffDiasDateInput, duracionEnDias, formatDuracion, toDateInputValue } from "../../../utils/duration";
import { opcionesMetodoPago } from "../../../utils/metodosPago";
import { getDuracionSugerida, getPeriodoSugerido, getPrecioSugerido, getTotalEstimado } from "../helpers/renovacion.mapper";
import { validateRenovacionForm } from "../schemas/renovacion.schema";
import { formatVenceEn, getDiasRestantes } from "../utils/vencimiento";

const DURACIONES = [
	{ value: "dias", label: "Días" },
	{ value: "meses", label: "Meses" },
	{ value: "anios", label: "Años" },
];

// Los periodos que se venden casi siempre. El input numerico sigue ahi para
// cualquier otra combinacion.
const ATAJOS_DURACION = [
	{ label: "1 mes", Dur_Tip: "meses", Dur_Val: "1" },
	{ label: "3 meses", Dur_Tip: "meses", Dur_Val: "3" },
	{ label: "6 meses", Dur_Tip: "meses", Dur_Val: "6" },
	{ label: "1 año", Dur_Tip: "anios", Dur_Val: "1" },
];

export default function SuscripcionRenovarDialog({
	open,
	onOpenChange,
	suscripciones,
	form,
	setForm,
	graciaDias,
	variantesPorProducto,
	saving,
	onConfirm,
}) {
	const esLote = suscripciones.length > 1;
	const unica = suscripciones.length === 1 ? suscripciones[0] : null;
	const referencia = suscripciones[0] ?? {};
	const errores = validateRenovacionForm(form);
	const valido = Object.keys(errores).length === 0 && suscripciones.length > 0;

	const diasRestantes = unica ? getDiasRestantes(unica) : null;
	const totalEstimado = useMemo(() => getTotalEstimado(suscripciones, form), [suscripciones, form]);

	// El periodo exacto que va a quedar registrado, recalculado en vivo con
	// cada cambio de fecha o duracion.
	const periodo = useMemo(
		() => (unica ? getPeriodoSugerido(unica, { graciaDias, form }) : null),
		[unica, graciaDias, form]
	);
	const inicioPersonalizado = Boolean(form.Fec_Ini);
	const diasSinCobertura = useMemo(() => {
		if (!unica || !inicioPersonalizado) return 0;
		const vencimiento = toDateInputValue(unica.Fec_Fin_Sus);
		const diferencia = diffDiasDateInput(vencimiento, form.Fec_Ini);
		return diferencia && diferencia > 0 ? diferencia : 0;
	}, [unica, inicioPersonalizado, form.Fec_Ini]);

	// Ordenados por nombre y luego por duracion: varios planes comparten nombre
	// y solo se distinguen por cuanto duran.
	const variantesDisponibles = useMemo(() => {
		if (!unica || !variantesPorProducto) return [];
		const lista = variantesPorProducto.get(Number(unica.Id_Prd)) ?? [];
		return [...lista].sort(
			(a, b) =>
				String(a.Nom_Var || "").localeCompare(String(b.Nom_Var || ""), "es") ||
				duracionEnDias(a.Dur_Tip_Var, a.Dur_Val_Var) - duracionEnDias(b.Dur_Tip_Var, b.Dur_Val_Var)
		);
	}, [unica, variantesPorProducto]);

	/** "Premium · 3 meses · $20.00" — sin la duracion los planes son indistinguibles. */
	const etiquetaVariante = (variante) => {
		const duracion = formatDuracion(variante.Dur_Tip_Var, variante.Dur_Val_Var);
		const precio = getPrecioSugerido({
			Tip_Tit_Sus: unica?.Tip_Tit_Sus,
			Pre_Ven_Var: variante.Pre_Ven_Var,
			Pre_Rev_Var: variante.Pre_Rev_Var,
		});
		return [variante.Nom_Var || `Plan #${variante.Id_Var}`, duracion, precio ? `$${Number(precio).toFixed(2)}` : ""]
			.filter(Boolean)
			.join(" · ");
	};

	// En lote hay un titular por grupo: se muestran para que quede claro cuantas
	// ventas se van a generar.
	const grupos = useMemo(() => {
		const mapa = new Map();
		for (const suscripcion of suscripciones) {
			const clave = suscripcion.Id_Rev ? `R${suscripcion.Id_Rev}` : `C${suscripcion.Id_Cli}`;
			if (!mapa.has(clave)) mapa.set(clave, { clave, nombre: suscripcion.Nom_Tit_Sus || `#${clave}`, items: 0 });
			mapa.get(clave).items += 1;
		}
		// La clave es el id del titular, no su nombre: hay clientes distintos que
		// comparten nombre.
		return [...mapa.values()];
	}, [suscripciones]);

	const actualizar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

	const aplicarAtajo = (atajo) =>
		setForm((prev) => ({ ...prev, Dur_Tip: atajo.Dur_Tip, Dur_Val: atajo.Dur_Val }));

	/** Cambiar de plan arrastra su precio y su duracion: son del plan, no del form. */
	const cambiarVariante = (valor) => {
		const variante = variantesDisponibles.find((item) => String(item.Id_Var) === String(valor)) ?? null;
		setForm((prev) => {
			const siguiente = { ...prev, Id_Var: valor };
			if (!variante) return siguiente;

			const duracion = getDuracionSugerida({
				Dur_Tip_Var: variante.Dur_Tip_Var,
				Dur_Val_Var: variante.Dur_Val_Var,
			});
			return {
				...siguiente,
				...duracion,
				Pre_Uni: getPrecioSugerido({
					Tip_Tit_Sus: unica?.Tip_Tit_Sus,
					Pre_Ven_Var: variante.Pre_Ven_Var,
					Pre_Rev_Var: variante.Pre_Rev_Var,
				}),
			};
		});
	};

	const avisoPeriodo = () => {
		if (!periodo) return null;
		if (periodo.encadenado === null) {
			return diasSinCobertura > 0
				? `La fecha elegida deja ${diasSinCobertura} día(s) sin cobertura después del vencimiento actual.`
				: "Fecha de inicio personalizada. Si coincide con el vencimiento, se respetará su hora exacta.";
		}
		if (periodo.encadenado) {
			return periodo.diasVencida > 0
				? `Venció hace ${periodo.diasVencida} día(s): el periodo arranca en la fecha de vencimiento anterior para no dejar huecos de cobertura.`
				: "Se encadena desde el vencimiento actual para no perder los días ya pagados.";
		}
		return `Venció hace ${periodo.diasVencida} día(s), más que la gracia de ${periodo.graciaDias}: el periodo arranca hoy.`;
	};

	const restablecerInicioAutomatico = () => actualizar("Fec_Ini", "");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle>{esLote ? `Renovar ${suscripciones.length} suscripciones` : "Renovar suscripción"}</DialogTitle>
					<DialogDescription>
						{esLote
							? "Se generará una venta por titular con todas sus suscripciones."
							: "Se extenderá la vigencia y se generará la venta correspondiente."}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5 px-6 pb-6">
					{unica ? (
						<div className="rounded-xl border bg-muted/30 p-4">
							<p className="font-medium">{unica.Nom_Tit_Sus}</p>
							<p className="mt-0.5 text-sm text-zinc-500">
								{[unica.Nom_Prd, unica.Nom_Var, formatDuracion(unica.Dur_Tip_Var, unica.Dur_Val_Var)]
									.filter(Boolean)
									.join(" · ")}
							</p>
							<p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
								<CalendarClock className="size-4" />
								Vigencia actual:{" "}
								{unica.Fec_Fin_Sus ? formatDate(unica.Fec_Fin_Sus) : "sin vencimiento"} ·{" "}
								{formatVenceEn(diasRestantes)}
							</p>
						</div>
					) : (
						<div className="rounded-xl border bg-muted/30 p-4">
							<p className="text-sm font-medium">{grupos.length} venta(s) a generar</p>
							<ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
								{grupos.map((grupo) => (
									<li key={grupo.clave} className="flex justify-between gap-3">
										<span>{grupo.nombre}</span>
										<span className="text-zinc-500">{grupo.items} suscripción(es)</span>
									</li>
								))}
							</ul>
						</div>
					)}

					<FormSection
						title="Nuevo periodo"
						description="Por defecto arranca donde terminó el periodo anterior y dura lo que el plan contratado."
					>
						<div className="flex flex-wrap gap-2">
							{ATAJOS_DURACION.map((atajo) => {
								const activo = form.Dur_Tip === atajo.Dur_Tip && String(form.Dur_Val) === atajo.Dur_Val;
								return (
									<Button
										key={atajo.label}
										type="button"
										size="sm"
										variant={activo ? "default" : "outline"}
										onClick={() => aplicarAtajo(atajo)}
									>
										{atajo.label}
									</Button>
								);
							})}
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-2">
								<Label>Duración</Label>
								<Input
									type="number"
									min="1"
									value={form.Dur_Val}
									onChange={(event) => actualizar("Dur_Val", event.target.value)}
								/>
								{errores.Dur_Val ? <p className="text-xs text-red-600">{errores.Dur_Val}</p> : null}
							</div>
							<div className="space-y-2">
								<Label>Unidad</Label>
								<Select value={form.Dur_Tip} onValueChange={(value) => actualizar("Dur_Tip", value)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{DURACIONES.map((duracion) => (
											<SelectItem key={duracion.value} value={duracion.value}>
												{duracion.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{unica ? (
							<>
								<div className="space-y-2">
									<div className="flex min-w-0 items-center justify-between gap-3">
										<Label htmlFor="renovacion-inicio">Inicio del periodo</Label>
										<span className="shrink-0 text-xs font-medium text-muted-foreground">
											{inicioPersonalizado ? "Personalizado" : "Automático"}
										</span>
									</div>
									<Input
										id="renovacion-inicio"
										type="date"
										value={form.Fec_Ini || periodo?.inicio || ""}
										onChange={(event) => actualizar("Fec_Ini", event.target.value)}
										aria-describedby="renovacion-inicio-ayuda"
									/>
									<div id="renovacion-inicio-ayuda" className="flex min-w-0 items-start justify-between gap-3">
										<p className="min-w-0 text-xs text-muted-foreground">
											{inicioPersonalizado
												? "Esta fecha reemplaza el inicio calculado automáticamente."
												: "Se calcula desde el vencimiento actual para conservar los días ya pagados."}
										</p>
										{inicioPersonalizado ? (
											<Button
												type="button"
												variant="link"
												size="xs"
												className="h-auto shrink-0 px-0 py-0"
												onClick={restablecerInicioAutomatico}
											>
												<RotateCcw className="size-3" />
												Restablecer
											</Button>
										) : null}
									</div>
									{errores.Fec_Ini ? <p className="text-xs text-red-600">{errores.Fec_Ini}</p> : null}
								</div>

								<div className="flex items-center justify-center gap-3 rounded-md border bg-muted/30 px-3 py-3 text-sm font-medium tabular-nums">
									<span>{formatDate(periodo.inicio)}</span>
									<ArrowRight className="size-4 shrink-0 text-zinc-500" />
									<span>{formatDate(periodo.fin)}</span>
								</div>

								<p
									className={
										diasSinCobertura > 0
											? "flex items-start gap-1.5 rounded-md bg-amber-50 p-2.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
											: "flex items-start gap-1.5 rounded-md bg-muted/40 p-2.5 text-xs text-zinc-600 dark:text-zinc-300"
									}
									role={diasSinCobertura > 0 ? "alert" : undefined}
								>
									{diasSinCobertura > 0 ? (
										<AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
									) : (
										<Info className="mt-0.5 size-3.5 shrink-0" />
									)}
									{avisoPeriodo()}
								</p>

								<div className="space-y-2">
								<Label>Cuenta del cliente final</Label>
								<Input
									type="email"
									value={form.Cor_Cue}
									placeholder="correo@dominio.com"
									onChange={(event) => actualizar("Cor_Cue", event.target.value)}
								/>
								<p className="text-xs text-zinc-500">
									{unica.Tip_Tit_Sus === "revendedor"
										? "Cámbialo si el revendedor reasignó este cupo a otro cliente."
										: "Cuenta donde está activo el servicio."}
								</p>
							</div>

							{variantesDisponibles.length > 1 ? (
									<div className="space-y-2">
										<Label>Plan</Label>
										<Select value={String(form.Id_Var || "")} onValueChange={cambiarVariante}>
											<SelectTrigger>
												<SelectValue placeholder="Mantener el plan actual" />
											</SelectTrigger>
											<SelectContent>
												{variantesDisponibles.map((variante) => (
													<SelectItem key={variante.Id_Var} value={String(variante.Id_Var)}>
														{etiquetaVariante(variante)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<p className="text-xs text-zinc-500">
											Cambiar de plan actualiza el precio y la duración sugeridos.
										</p>
									</div>
								) : null}
							</>
						) : (
							<p className="flex items-start gap-1.5 rounded-md bg-muted/40 p-2.5 text-xs text-zinc-600 dark:text-zinc-300">
								<Info className="mt-0.5 size-3.5 shrink-0" />
								Cada suscripción encadena desde su propio vencimiento (hasta {graciaDias} días de gracia);
								las más atrasadas arrancan hoy.
							</p>
						)}
					</FormSection>

					<FormSection
						title="Cobro"
						description={
							esLote
								? "Cada suscripción se cobra al precio de su plan según el tipo de titular."
								: "Se sugiere el precio del plan según el tipo de titular."
						}
					>
						{esLote ? null : (
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-2">
									<Label>Precio unitario</Label>
									<Input
										type="number"
										step="0.01"
										min="0"
										value={form.Pre_Uni}
										placeholder={getPrecioSugerido(referencia) || "0.00"}
										onChange={(event) => actualizar("Pre_Uni", event.target.value)}
									/>
									{errores.Pre_Uni ? <p className="text-xs text-red-600">{errores.Pre_Uni}</p> : null}
								</div>
								<div className="space-y-2">
									<Label>Descuento</Label>
									<Input
										type="number"
										step="0.01"
										min="0"
										value={form.Des_Uni}
										onChange={(event) => actualizar("Des_Uni", event.target.value)}
									/>
									{errores.Des_Uni ? <p className="text-xs text-red-600">{errores.Des_Uni}</p> : null}
								</div>
							</div>
						)}

						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								className="size-4 rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100"
								checked={form.generarVenta !== false}
								onChange={(event) => actualizar("generarVenta", event.target.checked)}
							/>
							Generar venta al renovar
						</label>

						{form.generarVenta !== false ? (
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-2">
									<Label>Estado de la venta</Label>
									<Select value={form.Est_Ven} onValueChange={(value) => actualizar("Est_Ven", value)}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="completada">Completada</SelectItem>
											<SelectItem value="pendiente">Pendiente</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Método de pago</Label>
									<Select value={form.Met_Pag} onValueChange={(value) => actualizar("Met_Pag", value)}>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona un método" />
										</SelectTrigger>
										<SelectContent>
											{opcionesMetodoPago(form.Met_Pag).map((metodo) => (
												<SelectItem key={metodo} value={metodo}>
													{metodo}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errores.Met_Pag ? <p className="text-xs text-red-600">{errores.Met_Pag}</p> : null}
								</div>
								<div className="space-y-2 sm:col-span-2">
									<Label>Nota de la venta</Label>
									<Textarea
										value={form.Not_Ven}
										placeholder="Opcional"
										onChange={(event) => actualizar("Not_Ven", event.target.value)}
									/>
								</div>
							</div>
						) : (
							<p className="rounded-md bg-muted/40 p-2.5 text-xs text-zinc-600 dark:text-zinc-300">
								Solo se extenderá la vigencia: no se registrará ninguna venta, y la renovación no
								aparecerá en el historial de la suscripción.
							</p>
						)}

						{form.generarVenta !== false && !esLote ? (
							<div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
								<span className="text-zinc-500">Total estimado</span>
								<span className="font-semibold tabular-nums">${totalEstimado.toFixed(2)}</span>
							</div>
						) : null}
					</FormSection>
				</div>

				<div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2 border-t bg-background px-4 py-4 [&>button]:w-full sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:[&>button]:w-auto">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
						Cancelar
					</Button>
					<Button type="button" onClick={onConfirm} disabled={!valido || saving}>
						{saving ? "Renovando..." : esLote ? `Renovar ${suscripciones.length}` : "Renovar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
