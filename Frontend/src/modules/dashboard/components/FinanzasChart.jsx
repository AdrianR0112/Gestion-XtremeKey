import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { formatCurrency } from "../../../utils/currency";

const MESES_CORTOS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatBucket(bucket) {
	if (!bucket) return "";
	const [, month, day] = bucket.split("-").map(Number);
	if (!day) return MESES_CORTOS[month - 1] || bucket;
	return `${day} ${(MESES_CORTOS[month - 1] || "").toLowerCase()}`;
}

function formatAxisCurrency(value) {
	return new Intl.NumberFormat("es-EC", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value || 0));
}

export default function FinanzasChart({ serie, etiqueta }) {
	const data = serie.map((item) => ({ ...item, label: formatBucket(item.bucket) }));

	return (
		<Card className="lg:col-span-2">
			<CardHeader>
				<div className="flex items-center justify-between gap-3">
					<div>
						<CardTitle>Finanzas · {etiqueta}</CardTitle>
						<p className="mt-1 text-sm text-muted-foreground">Ingresos y ganancia por periodo</p>
					</div>
					<BarChart3 className="size-5 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className="grid h-[310px] place-items-center rounded-xl border border-dashed text-sm text-muted-foreground">
						No hay ventas completadas en este periodo.
					</div>
				) : (
					<div className="h-[310px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={data} barCategoryGap={18} barSize={24}>
								<CartesianGrid vertical={false} strokeDasharray="2 6" strokeWidth={0.7} stroke="currentColor" className="text-zinc-300/80 dark:text-zinc-700/80" />
								<XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
								<YAxis axisLine={false} tickLine={false} width={54} tick={{ fontSize: 12 }} tickFormatter={formatAxisCurrency} />
								<Tooltip
									cursor={{ fill: "rgba(148,163,184,0.10)" }}
									contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7" }}
									formatter={(value, name) => [formatCurrency(value), name === "ingresos" ? "Ingresos" : "Ganancia"]}
								/>
								<Legend formatter={(value) => (value === "ingresos" ? "Ingresos" : "Ganancia")} />
								<Bar dataKey="ganancia" fill="#0d9488" radius={[6, 6, 0, 0]} />
								<Bar dataKey="ingresos" fill="#a3a3a3" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
