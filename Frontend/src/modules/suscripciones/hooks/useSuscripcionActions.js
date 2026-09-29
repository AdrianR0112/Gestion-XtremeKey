import { buildRenovarLotePayload, buildRenovarPayload } from "../helpers/renovacion.mapper";
import { mapSuscripcionPayload } from "../helpers/suscripcion.mapper";
import suscripcionesService from "../services/suscripciones.service";
import { toDateInputValue } from "../utils/date";

export default function useSuscripcionActions(state) {
	const {
		setSelectedId,
		setSheetOpen,
		setSheetMode,
		setForm,
		sheetMode,
		resetForm,
		setSaving,
		setError,
		setSuccess,
		cargarSuscripciones,
		clearSelection,
		selectedId,
		form,
	} = state;

	const abrirCrear = () => {
		setSheetMode("create");
		resetForm();
		setSelectedId(null);
		setSheetOpen(true);
	};

	const abrirEditar = (suscripcion) => {
		setSheetMode("edit");
		setForm({
			Tip_Tit: suscripcion.Id_Rev ? "revendedor" : "cliente",
			Id_Cli: suscripcion.Id_Cli ?? "",
			Id_Rev: suscripcion.Id_Rev ?? "",
			Id_Prd: suscripcion.Id_Prd ?? "",
			Id_Var: suscripcion.Id_Var ?? "",
			Cor_Cue_Sus: suscripcion.Cor_Cue_Sus ?? "",
			Fec_Ini_Sus: toDateInputValue(suscripcion.Fec_Ini_Sus),
			Fec_Fin_Sus: toDateInputValue(suscripcion.Fec_Fin_Sus),
			Est_Sus: suscripcion.Est_Sus || "activa",
			Ren_Auto: Boolean(suscripcion.Ren_Auto),
			Not_Sus: suscripcion.Not_Sus || "",
		});
		setSelectedId(suscripcion.Id_Sus);
		setSheetOpen(true);
	};

	const guardarSuscripcion = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = mapSuscripcionPayload(form);
			if (sheetMode === "create") {
				const creada = await suscripcionesService.create(payload);
				const actualizadas = await cargarSuscripciones();
				setSelectedId(creada?.Id_Sus ?? actualizadas[0]?.Id_Sus ?? null);
				setSuccess("Suscripción creada correctamente.");
			} else {
				await suscripcionesService.update(selectedId, payload);
				await cargarSuscripciones();
				setSuccess("Suscripción actualizada correctamente.");
			}
			setSheetOpen(false);
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo guardar la suscripción.");
		} finally {
			setSaving(false);
		}
	};

	const confirmarEliminacion = async () => {
		if (!selectedId) return false;
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			await suscripcionesService.remove(selectedId);
			const actualizadas = await cargarSuscripciones();
			setSelectedId(actualizadas[0]?.Id_Sus ?? null);
			setSuccess("Suscripción eliminada correctamente.");
			return true;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo eliminar la suscripción.");
			return false;
		} finally {
			setSaving(false);
		}
	};

	/** Renovacion de una sola suscripcion. Devuelve el resultado, o null si fallo. */
	const renovarSuscripcion = async (suscripcion, formRenovacion) => {
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = buildRenovarPayload(suscripcion, formRenovacion);
			const resultado = await suscripcionesService.renovar(suscripcion.Id_Sus, payload);
			await cargarSuscripciones();

			const codigo = resultado?.venta?.Cod_Ven;
			// Se muestra el periodo completo, no solo el fin: lo que importa
			// confirmar es que arranco donde termino el anterior.
			const periodo = `${String(resultado.periodo.inicio).slice(0, 10)} → ${String(resultado.periodo.fin).slice(0, 10)}`;
			setSuccess(
				codigo
					? `Suscripción renovada (${periodo}). Venta ${codigo} generada.`
					: `Suscripción renovada (${periodo}).`
			);
			return resultado;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo renovar la suscripción.");
			return null;
		} finally {
			setSaving(false);
		}
	};

	/**
	 * Renovacion en lote. El backend responde 200 aunque haya fallos parciales,
	 * asi que el reporte se devuelve para pintarlo y solo se marca error cuando
	 * no se renovo ninguna.
	 */
	const renovarLote = async (suscripciones, formRenovacion) => {
		setSaving(true);
		setError("");
		setSuccess("");

		try {
			const payload = buildRenovarLotePayload(suscripciones, formRenovacion);
			const reporte = await suscripcionesService.renovarLote(payload);
			await cargarSuscripciones();

			if (reporte.exitos > 0) {
				const ventas = reporte.ventas?.length || 0;
				setSuccess(
					`${reporte.exitos} suscripción(es) renovada(s)` +
						(ventas ? ` en ${ventas} venta(s).` : ".") +
						(reporte.fallos ? ` ${reporte.fallos} con error.` : "")
				);
				clearSelection();
			} else {
				setError(`No se pudo renovar ninguna de las ${reporte.total} suscripciones seleccionadas.`);
			}

			return reporte;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo renovar el lote.");
			return null;
		} finally {
			setSaving(false);
		}
	};

	return {
		abrirCrear,
		abrirEditar,
		guardarSuscripcion,
		confirmarEliminacion,
		renovarSuscripcion,
		renovarLote,
	};
}
