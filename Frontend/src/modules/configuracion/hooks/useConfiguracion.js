import { useEffect, useMemo, useState } from "react";
import { mapConfiguracionFromApi } from "../helpers/configuracion.mapper";
import { CONFIGURACION_INICIAL, validateConfiguracionForm } from "../schemas/configuracion.schema";
import configuracionService from "../services/configuracion.service";

export default function useConfiguracion() {
	const [configuraciones, setConfiguraciones] = useState([]);
	const [selectedConfiguracionId, setSelectedConfiguracionId] = useState(null);
	const [currentConfiguracionId, setCurrentConfiguracionId] = useState(null);
	const [form, setForm] = useState(CONFIGURACION_INICIAL);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const resetForm = () => setForm(CONFIGURACION_INICIAL);

	const cargarConfiguraciones = async () => {
		setLoading(true);
		setError("");
		try {
			const [listData, currentData] = await Promise.all([
				configuracionService.list(),
				configuracionService.getCurrent().catch((err) => {
					if (err?.status === 404) return null;
					throw err;
				}),
			]);

			const mappedList = Array.isArray(listData)
				? listData.map((item) => mapConfiguracionFromApi(item))
				: [];
			const mappedCurrent = currentData ? mapConfiguracionFromApi(currentData) : null;

			setConfiguraciones(mappedList);
			setCurrentConfiguracionId(mappedCurrent?.Id_Con ?? null);
			setSelectedConfiguracionId((prev) => {
				if (prev && mappedList.some((item) => item.Id_Con === prev)) return prev;
				if (mappedCurrent?.Id_Con) return mappedCurrent.Id_Con;
				return mappedList[0]?.Id_Con ?? null;
			});
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar la configuracion.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarConfiguraciones();
	}, []);

	const configuracionSeleccionada = useMemo(
		() => configuraciones.find((item) => item.Id_Con === selectedConfiguracionId) || null,
		[configuraciones, selectedConfiguracionId]
	);

	const formErrors = validateConfiguracionForm(form);
	const formValido = Object.keys(formErrors).length === 0;

	return {
		configuraciones,
		setConfiguraciones,
		selectedConfiguracionId,
		setSelectedConfiguracionId,
		currentConfiguracionId,
		setCurrentConfiguracionId,
		form,
		setForm,
		loading,
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		configuracionSeleccionada,
		formErrors,
		formValido,
		resetForm,
		cargarConfiguraciones,
	};
}
