import { BadgeDollarSign, CircleDollarSign, ReceiptText, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import ROUTES from "../../constants/routes";
import { formatCurrency } from "../../utils/currency";
import FinanzasChart from "./components/FinanzasChart";
import KpiCard from "./components/KpiCard";
import PeriodoSelector from "./components/PeriodoSelector";
import RenovacionesPanel from "./components/RenovacionesPanel";
import SuscripcionesPanel from "./components/SuscripcionesPanel";
import TopClientes from "./components/TopClientes";
import TopProductos from "./components/TopProductos";
import UltimasVentas from "./components/UltimasVentas";
import useDashboard from "./hooks/useDashboard";

function DashboardSkeleton() {
	return (
		<div className="mx-auto w-full max-w-7xl space-y-6">
			<Skeleton className="h-20 w-full rounded-2xl" />
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-36 rounded-2xl" />)}</div>
			<div className="grid gap-6 lg:grid-cols-3"><Skeleton className="h-[430px] rounded-2xl lg:col-span-2" /><Skeleton className="h-[430px] rounded-2xl" /></div>
		</div>
	);
}

export default function DashboardPage() {
	const dashboard = useDashboard();
	const { data } = dashboard;

	if (dashboard.isLoading) return <DashboardSkeleton />;

	if (dashboard.error) {
		return (
			<div className="mx-auto w-full max-w-7xl">
				<Card className="border-red-200 bg-red-50 p-10 text-center dark:bg-red-950/20">
					<p className="text-red-600">{dashboard.error?.data?.message || dashboard.error?.message || "No se pudo cargar el dashboard."}</p>
					<Button variant="outline" className="mt-4" onClick={() => dashboard.refetch()}>Reintentar</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6">
			<PeriodoSelector
				periodo={dashboard.periodo}
				ancla={dashboard.ancla}
				etiqueta={data.rango.etiqueta}
				actualizando={dashboard.isFetching}
				onPeriodoChange={dashboard.setPeriodo}
				onAnterior={dashboard.irAnterior}
				onSiguiente={dashboard.irSiguiente}
				onActual={dashboard.irActual}
			/>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<KpiCard label="Ingresos" valor={formatCurrency(data.totales.ingresos)} variacion={data.comparacion.ingresos} icono={CircleDollarSign} color="text-emerald-600" hint={`vs. ${data.rangoAnterior.etiqueta}`} />
				<KpiCard label="Ganancia" valor={formatCurrency(data.totales.ganancia)} variacion={data.comparacion.ganancia} icono={BadgeDollarSign} color="text-teal-600" hint={`${data.totales.margen.toFixed(1)}% de margen`}>
					{data.totales.lineasSinCosto > 0 ? (
						<p className="mt-3 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
							{data.totales.lineasSinCosto} líneas sin costo cargado — la ganancia real puede ser menor. <Link to={ROUTES.VARIANTES} className="font-medium underline underline-offset-2">Revisar variantes</Link>
						</p>
					) : null}
				</KpiCard>
				<KpiCard label="Ventas" valor={String(data.totales.cantidadVentas)} variacion={data.comparacion.cantidadVentas} icono={ShoppingBag} color="text-blue-600" hint={`${data.totales.unidades} unidades vendidas`} />
				<KpiCard label="Ticket medio" valor={formatCurrency(data.totales.ticketMedio)} variacion={data.comparacion.ticketMedio} icono={ReceiptText} color="text-violet-600" hint={`vs. ${data.rangoAnterior.etiqueta}`} />
			</section>

			<section className="grid gap-6 lg:grid-cols-3">
				<FinanzasChart serie={data.serie} etiqueta={data.rango.etiqueta} />
				<SuscripcionesPanel resumen={data.suscripciones} conteos={data.conteos} />
			</section>

			<section className="grid gap-6 lg:grid-cols-3">
				<RenovacionesPanel data={data.renovaciones} etiqueta={data.rango.etiqueta} />
				<TopProductos items={data.topProductos} etiqueta={data.rango.etiqueta} />
			</section>

			<section className="grid gap-6 lg:grid-cols-3">
				<TopClientes items={data.topClientes} etiqueta={data.rango.etiqueta} />
				<div className="lg:col-span-2"><UltimasVentas items={data.ultimasVentas} /></div>
			</section>
		</div>
	);
}
