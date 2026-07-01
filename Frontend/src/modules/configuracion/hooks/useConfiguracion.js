import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapConfiguracionFromApi } from "../helpers/configuracion.mapper";
import { CONFIGURACION_INICIAL, validateConfiguracionForm } from "../schemas/configuracion.schema";
import configuracionService from "../services/configuracion.service";

export default function useConfiguracion() {
	const queryClient = useQueryClient();
	const [selectedConfiguracionId, setSelectedConfiguracionId] = useState(null);
	const [currentConfiguracionId, setCurrentConfiguracionId] = useState(null);
	const [form, setForm] = useState(CONFIGURACION_INICIAL);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const configuracionesQueryKey = queryKeys.configuracion.list();
	const currentConfiguracionQueryKey = queryKeys.configuracion.current();

	const configuracionesQuery = useQuery({
		queryKey: configuracionesQueryKey,
		queryFn: async () => toArray(await configuracionService.list()).map((item) => mapConfiguracionFromApi(item)),
	});

	const currentConfiguracionQuery = useQuery({
		queryKey: currentConfiguracionQueryKey,
		queryFn: async () => {
			const current = await configuracionService.getCurrent().catch((err) => {
				if (err?.status === 404) return null;
				throw err;
			});

			return current ? mapConfiguracionFromApi(current) : null;
		},
	});

	const configuraciones = configuracionesQuery.data ?? [];
	const configuracionActual = currentConfiguracionQuery.data ?? null;
	const setConfiguraciones = createQueryDataSetter(queryClient, configuracionesQueryKey, []);
	const loading =
		configuracionesQuery.isLoading ||
		configuracionesQuery.isFetching ||
		currentConfiguracionQuery.isLoading ||
		currentConfiguracionQuery.isFetching;

	const resetForm = () => setForm(CONFIGURACION_INICIAL);

	const cargarConfiguraciones = async () => {
		setError("");
		try {
			const [listData, currentData] = await Promise.all([
				queryClient.fetchQuery({
					queryKey: configuracionesQueryKey,
					queryFn: async () => toArray(await configuracionService.list()).map((item) => mapConfiguracionFromApi(item)),
				}),
				queryClient.fetchQuery({
					queryKey: currentConfiguracionQueryKey,
					queryFn: async () => {
						const current = await configuracionService.getCurrent().catch((err) => {
							if (err?.status === 404) return null;
							throw err;
						});

						return current ? mapConfiguracionFromApi(current) : null;
					},
				}),
			]);

			setCurrentConfiguracionId(currentData?.Id_Con ?? null);
			return { listData, currentData };
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar la configuracion."));
			return { listData: [], currentData: null };
		}
	};

	useEffect(() => {
		setCurrentConfiguracionId(configuracionActual?.Id_Con ?? null);
		setSelectedConfiguracionId((prev) => {
			if (prev && configuraciones.some((item) => item.Id_Con === prev)) return prev;
			if (configuracionActual?.Id_Con) return configuracionActual.Id_Con;
			return configuraciones[0]?.Id_Con ?? null;
		});
	}, [configuracionActual, configuraciones]);

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
