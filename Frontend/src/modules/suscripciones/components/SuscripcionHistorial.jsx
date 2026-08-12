import { AlertTriangle, AtSign, Receipt } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import formatDate from "../../../utils/formatDate";
import useSuscripcionHistorial from "../hooks/useSuscripcionHistorial";

export default function SuscripcionHistorial({ idSus }) {
	const { periodos, resumen, loading, error } = useSuscripcionHistorial(idSus);

	if (loading) return <p className="text-sm text-zinc-500">Cargando historial...</p>;
	if (error) return <p className="text-sm text-red-600">{error}</p>;

	if (periodos.length === 0) {
		return (
			<p className="text-sm text-zinc-500">
				Sin periodos registrados. Esta suscripción no tiene ventas asociadas todavía.
			</p>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
				<span>
					<strong className="text-zinc-900 dark:text-zinc-100">{resumen.totalPeriodos}</strong> periodo(s)
				</span>
				<span>
					<strong className="text-zinc-900 dark:text-zinc-100">{resumen.renovaciones}</strong> renovación(es)
				</span>
				<span>
					Total facturado{" "}
					<strong className="text-zinc-900 dark:text-zinc-100">${Number(resumen.montoTotal).toFixed(2)}</strong>
				</span>
			</div>

			{resumen.tieneHuecos ? (
				<p className="flex items-center gap-1.5 rounded-md bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
					<AlertTriangle className="size-3.5 shrink-0" />
					Hay días sin cobertura entre algunos periodos.
				</p>
			) : null}

			<ol className="space-y-2">
				{periodos.map((periodo) => (
					<li key={periodo.Id_Dve} className="rounded-md border p-3">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-zinc-500">#{periodo.Num_Per}</span>
								<Badge variant={periodo.Tip_Per === "inicial" ? "secondary" : "success"}>
									{periodo.Tip_Per === "inicial" ? "Inicial" : "Renovación"}
								</Badge>
							</div>
							<span className="font-semibold tabular-nums">${Number(periodo.Sub_Tot_Dve).toFixed(2)}</span>
						</div>

						<p className="mt-2 text-sm">
							{formatDate(periodo.Fec_Ini_Dve)} — {formatDate(periodo.Fec_Fin_Dve)}
						</p>

						<div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
							{periodo.Cod_Ven ? (
								<span className="flex items-center gap-1">
									<Receipt className="size-3" />
									{periodo.Cod_Ven}
								</span>
							) : null}
							{periodo.Nom_Var ? <span>{periodo.Nom_Var}</span> : null}
							{periodo.Met_Pag_Ven ? <span>{periodo.Met_Pag_Ven}</span> : null}
							<span>Estado: {periodo.Est_Dve}</span>
						</div>

						{/* La cuenta por periodo deja ver si el cupo cambio de cliente
						    final entre una renovacion y la siguiente. */}
						{periodo.Cor_Cue ? (
							<p className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500 break-all">
								<AtSign className="size-3 shrink-0" />
								{periodo.Cor_Cue}
							</p>
						) : null}
					</li>
				))}
			</ol>
		</div>
	);
}
