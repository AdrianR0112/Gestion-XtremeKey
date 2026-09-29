import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { getErrorMessage, toArray } from "../../../app/query-utils";
import { mapRenovacionFromApi } from "../helpers/renovacion.mapper";
import renovacionesService from "../services/renovaciones.service";

export default function useRenovaciones() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRenovacionId, setSelectedRenovacionId] = useState(null);
	const renovacionesQuery = useQuery({
		queryKey: queryKeys.renovaciones.list(),
		queryFn: async () => toArray(await renovacionesService.list()).map(mapRenovacionFromApi),
	});

	const renovaciones = useMemo(() => renovacionesQuery.data ?? [], [renovacionesQuery.data]);
	const renovacionesFiltradas = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) return renovaciones;
		return renovaciones.filter((item) => [
			item.Id_Dve,
			item.Id_Dve_Ant,
			item.Id_Ven_Nue,
			item.Id_Ven_Ant,
			item.Cod_Ven_Nue,
			item.Cod_Ven_Ant,
			item.Nom_Cli,
			item.Ape_Cli,
			item.Nom_Prd,
			item.Nom_Var,
		].filter(Boolean).join(" ").toLowerCase().includes(query));
	}, [renovaciones, searchTerm]);

	const renovacionSeleccionada = renovaciones.find(
		(item) => Number(item.Id_Dve) === Number(selectedRenovacionId)
	) || null;

	return {
		renovaciones,
		renovacionesFiltradas,
		searchTerm,
		setSearchTerm,
		selectedRenovacionId,
		setSelectedRenovacionId,
		renovacionSeleccionada,
		loading: renovacionesQuery.isLoading || renovacionesQuery.isFetching,
		error: renovacionesQuery.error ? getErrorMessage(renovacionesQuery.error, "No se pudo cargar renovaciones.") : "",
	};
}
