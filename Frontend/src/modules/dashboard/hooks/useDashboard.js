import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { queryKeys } from "../../../app/query-keys";
import { mapDashboardFromApi } from "../helpers/dashboard.mapper";
import dashboardService from "../services/dashboard.service";

export default function useDashboard() {
	const [periodo, setPeriodoState] = useState("mes");
	const [ancla, setAncla] = useState(0);
	const params = useMemo(() => ({ periodo, ancla }), [periodo, ancla]);

	const query = useQuery({
		queryKey: queryKeys.dashboard.resumen(params),
		queryFn: () => dashboardService.getResumen(params),
		placeholderData: (previousData) => previousData,
	});

	const setPeriodo = (nextPeriodo) => {
		setPeriodoState(nextPeriodo);
		setAncla(0);
	};

	return {
		...query,
		data: mapDashboardFromApi(query.data),
		periodo,
		ancla,
		setPeriodo,
		irAnterior: () => setAncla((value) => Math.max(-60, value - 1)),
		irSiguiente: () => setAncla((value) => Math.min(0, value + 1)),
		irActual: () => setAncla(0),
	};
}
