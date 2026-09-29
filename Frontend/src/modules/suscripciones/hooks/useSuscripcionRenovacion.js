import { useState } from "react";
import { getDuracionSugerida, getPrecioSugerido } from "../helpers/renovacion.mapper";
import { RENOVACION_INICIAL } from "../schemas/renovacion.schema";
import { DEFAULT_DIAS_GRACIA } from "../../../utils/duration";

/**
 * Estado del modal de renovacion, compartido por el flujo individual y el de
 * lote: la unica diferencia es cuantas suscripciones lleva la lista.
 */
export default function useSuscripcionRenovacion() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [objetivo, setObjetivo] = useState([]);
	const [form, setForm] = useState(RENOVACION_INICIAL);
	const [reporte, setReporte] = useState(null);
	const [graciaDias, setGraciaDias] = useState(DEFAULT_DIAS_GRACIA);

	/**
	 * Precarga plan, duracion, precio y fecha de inicio desde la primera
	 * suscripcion. Los campos por suscripcion (fecha, plan, precio) solo se
	 * precargan en modo individual: en lote los resuelve el servidor para cada
	 * una, que es lo unico correcto cuando tienen vencimientos distintos.
	 *
	 * Fec_Ini queda vacia tambien en modo individual: el modal muestra la fecha
	 * automatica calculada, pero el payload solo debe incluirla cuando el usuario
	 * la cambie expresamente. Asi el servidor conserva la hora exacta del
	 * vencimiento al encadenar el nuevo periodo.
	 */
	const abrir = (suscripciones, opciones = {}) => {
		const lista = Array.isArray(suscripciones) ? suscripciones : [suscripciones];
		if (lista.length === 0) return;

		const gracia = Number.isInteger(Number(opciones.graciaDias))
			? Number(opciones.graciaDias)
			: DEFAULT_DIAS_GRACIA;
		const referencia = lista[0];
		const esIndividual = lista.length === 1;
		const duracion = getDuracionSugerida(referencia);

		setGraciaDias(gracia);
		setForm({
			...RENOVACION_INICIAL,
			...duracion,
			Fec_Ini: "",
			Id_Var: esIndividual && referencia.Id_Var != null ? String(referencia.Id_Var) : "",
			Cor_Cue: esIndividual ? referencia.Cor_Cue_Sus || "" : "",
			Pre_Uni: esIndividual ? getPrecioSugerido(referencia) : "",
		});
		setObjetivo(lista);
		setReporte(null);
		setDialogOpen(true);
	};

	const cerrar = () => setDialogOpen(false);

	return {
		dialogOpen,
		setDialogOpen,
		objetivo,
		esLote: objetivo.length > 1,
		form,
		setForm,
		graciaDias,
		reporte,
		setReporte,
		abrir,
		cerrar,
	};
}
