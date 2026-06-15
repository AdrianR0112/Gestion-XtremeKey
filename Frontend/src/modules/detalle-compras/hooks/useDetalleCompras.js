import { useEffect, useMemo, useState } from "react";
import { mapDetalleCompraFromApi } from "../helpers/detalleCompra.mapper";
import { DETALLE_COMPRA_INICIAL, isDetalleCompraFormValid } from "../schemas/detalleCompra.schema";
import detalleComprasService from "../services/detalleCompras.service";

export default function useDetalleCompras() {
	const [detalles, setDetalles] = useState([]);
	const [selectedDetalleId, setSelectedDetalleId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetMode, setSheetMode] = useState("create");
	const [form, setForm] = useState(DETALLE_COMPRA_INICIAL);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const cargarDetalles = async () => {
		setLoading(true);
		setError("");
		try {
			const list = await detalleComprasService.list();
			const mapped = Array.isArray(list) ? list.map((item) => mapDetalleCompraFromApi(item)) : [];
			setDetalles(mapped);
			setSelectedDetalleId((prev) => {
				if (prev && mapped.some((item) => item.Id_Dco === prev)) return prev;
				return mapped[0]?.Id_Dco ?? null;
			});
			return mapped;
		} catch (err) {
			setError(err?.data?.message || err?.message || "No se pudo cargar detalles de compras.");
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarDetalles();
	}, []);

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
