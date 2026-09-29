import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../app/query-keys";
import suscripcionesService from "../services/suscripciones.service";

export default function useSuscripcionHistorial(idSus) {
	const query = useQuery({
		queryKey: queryKeys.suscripciones.historial(idSus),
		queryFn: async () => suscripcionesService.getHistorial(idSus),
		enabled: Boolean(idSus),
	});

	return {
		periodos: query.data?.periodos ?? [],
		resumen: query.data?.resumen ?? null,
		loading: query.isLoading || query.isFetching,
		error: query.error ? query.error?.data?.message || query.error?.message : "",
	};
}
