import { useState } from "react";
import { getErrorMessage } from "../../../app/query-utils";
import suscripcionesService from "../services/suscripciones.service";

/**
 * Estado del modal de mensaje por WhatsApp.
 *
 * El texto lo arma el backend a partir de la plantilla activa (la misma que usa
 * el bot de Telegram), asi que abrir el modal implica una llamada: no se puede
 * componer en cliente sin duplicar plantilla y reglas de redaccion.
 */
export default function useSuscripcionMensaje() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [datos, setDatos] = useState(null);
	const [mensaje, setMensaje] = useState("");
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState("");

	const abrir = async (suscripcion) => {
		if (!suscripcion?.Id_Sus) return;

		setDialogOpen(true);
		setCargando(true);
		setError("");
		setDatos(null);
		setMensaje("");

		try {
			const respuesta = await suscripcionesService.getMensajeWhatsapp(suscripcion.Id_Sus);
			setDatos(respuesta);
			setMensaje(respuesta?.mensaje || "");
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo generar el mensaje."));
		} finally {
			setCargando(false);
		}
	};

	const cerrar = () => {
		setDialogOpen(false);
		setError("");
	};

	return {
		dialogOpen,
		setDialogOpen,
		datos,
		mensaje,
		setMensaje,
		cargando,
		error,
		abrir,
		cerrar,
	};
}
