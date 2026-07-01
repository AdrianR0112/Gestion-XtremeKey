import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import { mapDetalleCompraFromApi } from "../helpers/detalleCompra.mapper";
import { DETALLE_COMPRA_INICIAL, isDetalleCompraFormValid } from "../schemas/detalleCompra.schema";
import detalleComprasService from "../services/detalleCompras.service";

export default function useDetalleCompras() {
	const queryClient = useQueryClient();
	const [selectedDetalleId, setSelectedDetalleId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(DETALLE_COMPRA_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const detallesQueryKey = queryKeys.detalleCompras.list();
	const detallesQuery = useQuery({
		queryKey: detallesQueryKey,
		queryFn: async () => toArray(await detalleComprasService.list()).map((item) => mapDetalleCompraFromApi(item)),
	});
	const detalles = detallesQuery.data ?? [];
	const setDetalles = createQueryDataSetter(queryClient, detallesQueryKey, []);
	const loading = detallesQuery.isLoading || detallesQuery.isFetching;

	const cargarDetalles = async () => {
		setError("");
		try {
			return await queryClient.fetchQuery({
				queryKey: detallesQueryKey,
				queryFn: async () => toArray(await detalleComprasService.list()).map((item) => mapDetalleCompraFromApi(item)),
			});
		} catch (err) {
			setError(getErrorMessage(err, "No se pudo cargar detalles de compras."));
			return [];
		}
	};

	useEffect(() => {
		setSelectedDetalleId((prev) => {
			if (prev && detalles.some((item) => item.Id_Dco === prev)) return prev;
			return detalles[0]?.Id_Dco ?? null;
		});
	}, [detalles]);

	const detalleSeleccionado = useMemo(
		() => detalles.find((detalle) => detalle.Id_Dco === selectedDetalleId) || null,
		[detalles, selectedDetalleId]
	);

	const resetForm = () => setForm(DETALLE_COMPRA_INICIAL);

	const detallesFiltrados = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return detalles.filter((detalle) => {
			const matchesSearch =
				!query ||
				`${detalle.Id_Dco} ${detalle.Id_Com}`.toLowerCase().includes(query);
			return matchesSearch;
		});
	}, [detalles, searchTerm]);

	const formValido = isDetalleCompraFormValid(form);

	return {
		detalles,
		setDetalles,
		detallesFiltrados,
		selectedDetalleId,
		setSelectedDetalleId,
		sheetOpen,
		setSheetOpen,
		sheetMode,
		setSheetMode,
		form,
		setForm,
		searchTerm,
		setSearchTerm,
		loading,
		saving,
		setSaving,
		error,
		setError,
		success,
		setSuccess,
		detalleSeleccionado,
		formValido,
		resetForm,
		cargarDetalles,
	};
}
