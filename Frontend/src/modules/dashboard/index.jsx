import { useQuery } from "@tanstack/react-query";
import {
	Activity,
	ArrowDownLeft,
	ArrowUpRight,
	BadgeDollarSign,
	BarChart3,
	CreditCard,
	DollarSign,
	Ellipsis,
	Laptop,
	Package,
	Smartphone,
	Tablet,
	UsersRound,
	Wallet,
} from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "../../components/ui/badge";
import { queryKeys } from "../../app/query-keys";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { formatCurrency } from "../../utils/currency";
import dashboardService from "./services/dashboard.service";

const MESES_CORTOS = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function toMonthLabel(monthStr) {
	if (!monthStr) return "";
	const parts = monthStr.split("-");
	const mes = parseInt(parts[1], 10);
	return MESES_CORTOS[mes] || monthStr;
}

function TrendPill({ value, up }) {
	return (
		<span className="inline-flex items-center gap-1 text-sm font-medium">
			{value}
			{up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
		</span>
	);
}

function DashboardStatusBadge({ estado }) {
	if (estado === "activo") {
		return <Badge className="bg-emerald-500/10 text-emerald-600">Activo</Badge>;
	}
	if (estado === "por culminar") {
		return <Badge className="bg-amber-500/10 text-amber-600">Por culminar</Badge>;
	}
	if (estado === "vencido") {
		return <Badge className="bg-rose-500/10 text-rose-600">Vencido</Badge>;
	}
	return <Badge className="bg-zinc-500/10 text-zinc-600">Inactivo</Badge>;
}

const EMPTY_RESUMEN = {
	ventasPorMes: [],
	totales: { mes: { monto: 0, cantidad: 0, ganancia: 0 }, semana: { monto: 0, cantidad: 0, ganancia: 0 }, hoy: { monto: 0, cantidad: 0, ganancia: 0 } },
	conteos: { productos: 0, clientes: 0, revendedores: 0 },
	ingresosTrimestre: 0,
	gananciaTrimestre: 0,
	topProductos: [],
	topClientes: [],
	ultimasVentas: [],
};

export default function DashboardPage() {
	const { data = EMPTY_RESUMEN, isLoading: loading, error, refetch } = useQuery({
		queryKey: queryKeys.dashboard.resumen(),
		queryFn: async () => (await dashboardService.getResumen()) || EMPTY_RESUMEN,
	});

	const ventasChart = data.ventasPorMes.map((item) => ({
		month: toMonthLabel(item.mes),
		ventas: Number(item.total || 0),
		ganancia: Number(item.ganancia || 0),
		cantidad: Number(item.cantidad || 0),
	}));

	const topBySales = data.topProductos.slice(0, 5).map((p, i) => ({
		product: p.nombre || "Sin nombre",
		brand: `${p.cantidad || 0} unidad${p.cantidad === 1 ? "" : "es"}`,
		amount: formatCurrency(p.monto),
		ganancia: formatCurrency(p.ganancia),
		icon: [BadgeDollarSign, Laptop, Wallet, Smartphone, Tablet][i] || Package,
	}));

	const topByVolume = data.topProductos
		.slice()
		.sort((a, b) => (b.cantidad || 0) - (a.cantidad || 0))
		.slice(0, 5)
		.map((p, i) => ({
			product: p.nombre || "Sin nombre",
			brand: "Producto",
			units: String(p.cantidad || 0),
			trend: "",
			icon: [Laptop, Tablet, Activity, Smartphone, BarChart3][i] || Package,
		}));

	if (loading) {
		return (
			<div className="mx-auto w-full max-w-7xl space-y-6">
				<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md p-10 text-center">
					<p className="text-zinc-500">Cargando dashboard...</p>
				</section>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mx-auto w-full max-w-7xl space-y-6">
				<section className="overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
					<p className="text-red-600">{error?.data?.message || error?.message || "No se pudo cargar el dashboard."}</p>
					<Button variant="outline" className="mt-4" onClick={() => refetch()}>Reintentar</Button>
				</section>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6">
			<section className="grid grid-cols-1 gap-6 xl:grid-cols-6">
				<Card className="xl:col-span-4">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
						<div className="border-b p-6 lg:col-span-3 lg:border-r lg:border-b-0">
							<div className="mb-5 flex items-start justify-between gap-3">
								<div>
									<h2 className="text-3xl font-semibold tracking-tight">Finanzas</h2>
									<p className="text-sm text-muted-foreground">Resumen anual de ventas</p>
								</div>
							</div>
							<div className="h-[320px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={ventasChart} barCategoryGap={22} barSize={28}>
										<CartesianGrid
											vertical={false} strokeDasharray="2 6" strokeWidth={0.7}
											stroke="currentColor" className="text-zinc-300/80 dark:text-zinc-700/80"
										/>
										<XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
										<YAxis axisLine={false} tickLine={false} width={44} tick={{ fontSize: 12 }} />
										<Tooltip cursor={{ fill: "rgba(148,163,184,0.10)" }} contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7" }} />
										<Bar dataKey="ganancia" fill="#0d9488" radius={[6, 6, 0, 0]} />
										<Bar dataKey="ventas" fill="#a3a3a3" radius={[6, 6, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className="flex flex-col p-6 lg:col-span-2">
							<div className="mb-6 flex items-start justify-between gap-3">
								<div>
									<h3 className="text-2xl font-semibold tracking-tight">Reporte</h3>
									<p className="text-sm text-muted-foreground">Totales del periodo actual</p>
								</div>
							</div>

							<div className="flex flex-1 flex-col justify-between gap-5">
								<div className="flex items-center gap-3">
									<span className="grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
										<DollarSign className="size-5" />
									</span>
									<div>
										<p className="text-base">Ganancia del mes</p>
										<p className="text-xl font-semibold text-emerald-600">{formatCurrency(data.totales.mes.ganancia)}</p>
										<p className="text-xs text-muted-foreground">Neto: {formatCurrency(data.totales.mes.monto)}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<span className="grid size-11 place-items-center rounded-xl bg-orange-500/10 text-orange-600">
										<Wallet className="size-5" />
									</span>
									<div>
										<p className="text-base">Ganancia de la semana</p>
										<p className="text-xl font-semibold text-orange-600">{formatCurrency(data.totales.semana.ganancia)}</p>
										<p className="text-xs text-muted-foreground">Neto: {formatCurrency(data.totales.semana.monto)}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<span className="grid size-11 place-items-center rounded-xl bg-yellow-500/10 text-yellow-600">
										<CreditCard className="size-5" />
									</span>
									<div>
										<p className="text-base">Ganancia de hoy</p>
										<p className="text-xl font-semibold text-yellow-600">{formatCurrency(data.totales.hoy.ganancia)}</p>
										<p className="text-xs text-muted-foreground">Neto: {formatCurrency(data.totales.hoy.monto)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-2">
					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total ordenes</CardTitle>
							<Package className="size-4 text-emerald-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{data.totales.mes.cantidad}</div>
							<p className="text-xs text-muted-foreground mt-1">Ventas este mes</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Ingresos trimestre</CardTitle>
							<DollarSign className="size-4 text-amber-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{formatCurrency(data.ingresosTrimestre)}</div>
							<p className="text-xs text-muted-foreground mt-1">Neto ultimos 3 meses</p>
							<div className="text-lg font-semibold text-emerald-600 mt-1">{formatCurrency(data.gananciaTrimestre)}</div>
							<p className="text-xs text-emerald-600/70">Ganancia</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Clientes activos</CardTitle>
							<UsersRound className="size-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{data.conteos.clientes}</div>
							<p className="text-xs text-muted-foreground mt-1">+ {data.conteos.revendedores} revendedores</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Productos activos</CardTitle>
							<Package className="size-4 text-violet-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{data.conteos.productos}</div>
							<p className="text-xs text-muted-foreground mt-1">En catalogo</p>
						</CardContent>
					</Card>
				</div>
			</section>

			<section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader className="flex-row items-center justify-between">
						<CardTitle>Top productos por ventas</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{topBySales.length === 0 ? (
							<p className="text-sm text-zinc-500">No hay datos de ventas aun.</p>
						) : (
							topBySales.map((item) => {
								const Icon = item.icon;
								return (
									<div key={item.product} className="flex items-center gap-3">
										<span className="grid size-10 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
											<Icon className="size-4 text-zinc-600" />
										</span>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">{item.product}</p>
											<p className="text-xs text-muted-foreground">{item.brand}</p>
										</div>
										<div className="text-right">
											<span className="text-sm font-semibold">{item.amount}</span>
											<p className="text-xs text-emerald-600">{item.ganancia}</p>
										</div>
									</div>
								);
							})
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top clientes</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{data.topClientes.length === 0 ? (
							<p className="text-sm text-zinc-500">No hay datos de clientes aun.</p>
						) : (
							data.topClientes.slice(0, 5).map((c) => (
								<div key={`${c.tipo}-${c.id}`} className="flex items-center gap-3">
									<span className="grid size-9 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800">
										<UsersRound className="size-4 text-zinc-600" />
									</span>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{c.nombre}</p>
										<p className="text-xs text-muted-foreground">{c.tipo === "cliente" ? "Cliente" : "Revendedor"} · {c.compras} compras</p>
									</div>
									<span className="text-sm font-semibold">{formatCurrency(c.monto)}</span>
								</div>
							))
						)}
					</CardContent>
				</Card>
			</section>

			<section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Ultimas ventas</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Cliente / Revendedor</TableHead>
										<TableHead>Rol</TableHead>
										<TableHead>Producto</TableHead>
										<TableHead>Duracion</TableHead>
										<TableHead>Estado</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.ultimasVentas.length === 0 ? (
										<TableRow>
											<TableCell colSpan={5} className="h-20 text-center">No hay ventas registradas.</TableCell>
										</TableRow>
									) : (
										data.ultimasVentas.map((venta) => (
											<TableRow key={venta.id}>
												<TableCell className="font-medium">{venta.cliente}</TableCell>
												<TableCell>{venta.rol}</TableCell>
												<TableCell>{venta.producto}</TableCell>
												<TableCell>{venta.duracion}</TableCell>
												<TableCell><DashboardStatusBadge estado={venta.estado} /></TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Resumen</CardTitle>
					</CardHeader>
					<CardContent className="space-y-5">
						<div>
							<p className="text-xs text-zinc-500 mb-1">Total visitantes</p>
							<p className="text-sm font-medium text-zinc-400">Proximamente</p>
						</div>
						<Separator />
						<div>
							<p className="text-xs text-zinc-500 mb-3">Estado operativo</p>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Sistema</span>
									<span className="text-zinc-400">Proximamente</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span>Procesos</span>
									<span className="text-zinc-400">Proximamente</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span>Integraciones</span>
									<span className="text-zinc-400">Proximamente</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
