import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { createQueryDataSetter, getErrorMessage, toArray } from "../../../app/query-utils";
import comprasService from "../../compras/services/compras.service";
import proveedoresService from "../../proveedores/services/proveedores.service";
import { buildCompraMap, buildProveedorMap, filterGastos, mapGastoFromApi } from "../helpers/gasto.mapper";
import { createGastoForm } from "../schemas/gasto.schema";
import gastosService from "../services/gastos.service";
import useGastosActions from "./useGastosActions";

export default function useGastos() {
	const queryClient = useQueryClient();
	const [actionLoading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [gastoSheetOpen, setGastoSheetOpen] = useState(false);
	const [gastoForm, setGastoForm] = useState(createGastoForm());
	const [searchTerm, setSearchTerm] = useState("");
	const [categoriaFilter, setCategoriaFilter] = useState("");
	const gastosQueryKey = queryKeys.gastos.list();
	const proveedoresQueryKey = queryKeys.proveedores.list();
	const comprasQueryKey = queryKeys.compras.list();

	const gastosQuery = useQuery({
		queryKey: gastosQueryKey,
		queryFn: async () => toArray(await gastosService.list()).map(mapGastoFromApi),
	});
	const proveedoresQuery = useQuery({
		queryKey: proveedoresQueryKey,
		queryFn: async () => toArray(await proveedoresService.list()),
	});
	const comprasQuery = useQuery({
		queryKey: comprasQueryKey,
		queryFn: async () => toArray(await comprasService.list()),
	});

	const gastos = gastosQuery.data ?? [];
	const proveedores = proveedoresQuery.data ?? [];
	const compras = comprasQuery.data ?? [];
	const setGastos = createQueryDataSetter(queryClient, gastosQueryKey, []);
	const setProveedores = createQueryDataSetter(queryClient, proveedoresQueryKey, []);
	const setCompras = createQueryDataSetter(queryClient, comprasQueryKey, []);
	const loading =
		actionLoading ||
		gastosQuery.isLoading ||
		gastosQuery.isFetching ||
		proveedoresQuery.isLoading ||
		proveedoresQuery.isFetching ||
		comprasQuery.isLoading ||
		comprasQuery.isFetching;

	const proveedorMap = useMemo(() => buildProveedorMap(proveedores), [proveedores]);
	const compraMap = useMemo(() => buildCompraMap(compras), [compras]);
	const gastosFiltrados = useMemo(
		() => filterGastos(gastos, searchTerm, categoriaFilter, proveedorMap),
		[gastos, searchTerm, categoriaFilter, proveedorMap]
	);

	const cargarTodo = async () => {
		try {
			setError("");
			const [gastosData, proveedoresData, comprasData] = await Promise.all([
				queryClient.fetchQuery({ queryKey: gastosQueryKey, queryFn: async () => toArray(await gastosService.list()).map(mapGastoFromApi) }),
				queryClient.fetchQuery({ queryKey: proveedoresQueryKey, queryFn: async () => toArray(await proveedoresService.list()) }),
				queryClient.fetchQuery({ queryKey: comprasQueryKey, queryFn: async () => toArray(await comprasService.list()) }),
			]);

			return { gastosData, proveedoresData, comprasData };
		} catch (err) {
			setError(getErrorMessage(err, "Error al cargar datos"));
			return { gastosData: [], proveedoresData: [], comprasData: [] };
		}
	};

	const actions = useGastosActions({
		setGastos,
		setProveedores,
		setGastoForm,
		setGastoSheetOpen,
		setError,
		setSuccess,
		gastos,
		gastoForm,
	});

	return {
		gastos,
		setGastos,
		proveedores,
		setProveedores,
		compras,
		setCompras,
		loading,
		setLoading,
		error,
		success,
		gastoSheetOpen,
		setGastoSheetOpen,
		gastoForm,
		setGastoForm,
		searchTerm,
		setSearchTerm,
		categoriaFilter,
		setCategoriaFilter,
		proveedorMap,
		compraMap,
		gastosFiltrados,
		cargarTodo,
		...actions,
	};
}
