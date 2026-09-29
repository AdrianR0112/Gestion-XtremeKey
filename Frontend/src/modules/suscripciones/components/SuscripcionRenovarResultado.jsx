import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";

/**
 * Reporte de una renovacion en lote. El backend responde 200 aunque haya fallos
 * parciales, asi que aqui se muestran los dos lados.
 */
export default function SuscripcionRenovarResultado({ reporte, onClose }) {
	if (!reporte) return null;

	return (
		<div className="rounded-xl border bg-white/85 p-4 dark:bg-zinc-900/85">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="font-medium">Resultado de la renovación en lote</p>
					<p className="mt-0.5 text-sm text-zinc-500">
						{reporte.exitos} de {reporte.total} renovadas
						{reporte.ventas?.length ? ` · ${reporte.ventas.length} venta(s) generada(s)` : ""}
					</p>
				</div>
				<Button variant="ghost" size="icon" onClick={onClose} title="Cerrar">
					<X className="size-4" />
				</Button>
			</div>

			{reporte.ventas?.length ? (
				<ul className="mt-3 space-y-1.5">
					{reporte.ventas.map((venta) => (
						<li key={venta.Id_Ven} className="flex items-center gap-2 text-sm">
							<CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
							<span className="font-medium">{venta.Cod_Ven}</span>
							<span className="text-zinc-500">
								{venta.items} suscripción(es) · ${Number(venta.Tot_Ven).toFixed(2)}
							</span>
						</li>
					))}
				</ul>
			) : null}

			{reporte.errores?.length ? (
				<ul className="mt-3 space-y-1.5 border-t pt-3">
					{reporte.errores.map((error) => (
						<li key={error.Id_Sus} className="flex items-start gap-2 text-sm">
							<XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
							<span>
								<span className="font-medium">Suscripción #{error.Id_Sus}</span>
								<span className="text-zinc-500"> — {error.message}</span>
							</span>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
