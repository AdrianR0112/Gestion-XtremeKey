import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { endOfMonth, format, startOfMonth, addMonths, getDaysInMonth, getDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import {
	CalendarDays,
	CheckCircle2,
	CircleDollarSign,
	ListChecks,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { queryKeys } from "../../app/query-keys";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import FeedbackAlert from "../../components/feedback-alert";
import calendarioService from "./services/calendario.service";
import { getTimezone } from "../../utils/timezone";

function tz() { return getTimezone(); }

function getTodayInTimezone() {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz(),
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(new Date());
	const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	const y = Number(values.year);
	const m = Number(values.month) - 1;
	const d = Number(values.day);
	return new Date(y, m, d);
}

function toInputDate(date) {
	return format(date, "yyyy-MM-dd");
}

function getMonthRange(date) {
	return {
		startDate: toInputDate(startOfMonth(date)),
		endDate: toInputDate(endOfMonth(date)),
	};
}

function formatCalendarDate(value) {
	if (!value) return "-";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);

	return format(date, "dd MMM yyyy", { locale: es });
}

function getDaysRemaining(value) {
	if (!value) return "-";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";

	const startOfToday = getTodayInTimezone();
	startOfToday.setHours(0, 0, 0, 0);
	const targetDate = new Date(date);
	targetDate.setHours(0, 0, 0, 0);

	const diffInDays = Math.ceil((targetDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) return "Vence hoy";
	if (diffInDays === 1) return "1 día restante";
	if (diffInDays > 1) return `${diffInDays} días restantes`;
	if (diffInDays === -1) return "Vencido hace 1 día";
	return `Vencido hace ${Math.abs(diffInDays)} días`;
}

function getTypeLabel(type) {
	if (type === "tareas") return "Tarea";
	if (type === "detalle_ventas") return "Venta";
	return type || "Evento";
}

function getTypeVariant(type) {
	if (type === "tareas") return "secondary";
	if (type === "detalle_ventas") return "default";
	return "outline";
}

function getStatusVariant(status) {
	const normalized = String(status || "").toLowerCase();

	if (normalized.includes("complet") || normalized.includes("cerrad") || normalized.includes("pagad")) {
		return "success";
	}

	if (normalized.includes("pend") || normalized.includes("venc") || normalized.includes("atras")) {
		return "warning";
	}

	return "outline";
}

function getDayEventAccentClass(type) {
	if (type === "tareas") {
		return "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20";
	}

	if (type === "detalle_ventas") {
		return "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
	}

	return "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20";
}

function getSummaryCount(byType = {}, key, fallback) {
	if (byType[key] != null) return byType[key];

	const altKeys = {
		tareas: ["tarea", "task", "tasks"],
		detalle_ventas: ["detalleVentas", "detalle-ventas", "detalle_venta", "detalleventa", "detalleventas", "ventas"],
	};

	for (const altKey of altKeys[key] || []) {
		if (byType[altKey] != null) return byType[altKey];
	}

	return fallback;
}

function buildSummary(summary = {}, events = []) {
	const byType = summary.byType || {};
	const tareasCount = events.filter((event) => event.type === "tareas").length;
	const detalleVentasCount = events.filter((event) => event.type === "detalle_ventas").length;

	return {
		total: summary.total ?? events.length,
		tareas: getSummaryCount(byType, "tareas", tareasCount),
		detalleVentas: getSummaryCount(byType, "detalle_ventas", detalleVentasCount),
	};
}

function SimpleCalendar({ currentMonth, onMonthChange, selectedDate, onSelectDate, events = [] }) {
	const monthDays = getDaysInMonth(currentMonth);
	const firstDayOfMonth = getDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
	const daysArray = [];

	// Empty cells for days before month starts
	for (let i = 0; i < firstDayOfMonth; i++) {
		daysArray.push(null);
	}

	// Days of month
	for (let i = 1; i <= monthDays; i++) {
		daysArray.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
	}

	const hasEventsOnDate = (date) => {
		return events.some((e) => {
			const eventDate = new Date(e.start);
			return isSameDay(eventDate, date);
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-2">
				<Button variant="outline" size="sm" onClick={() => onMonthChange(addMonths(currentMonth, -1))}>
					<ChevronLeft className="size-4" />
				</Button>
				<h3 className="text-sm font-semibold">
					{format(currentMonth, "MMMM yyyy", { locale: es })}
				</h3>
				<Button variant="outline" size="sm" onClick={() => onMonthChange(addMonths(currentMonth, 1))}>
					<ChevronRight className="size-4" />
				</Button>
			</div>

			<div className="grid grid-cols-7 gap-1">
				{["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((day) => (
					<div key={day} className="text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 py-2">
						{day}
					</div>
				))}
				{daysArray.map((date, idx) =>
					date ? (
						<button
							key={idx}
							onClick={() => onSelectDate(date)}
							className={`aspect-square text-xs rounded-lg relative transition-colors ${
								isSameDay(date, selectedDate)
									? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
									: hasEventsOnDate(date)
										? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium"
										: "hover:bg-zinc-100 dark:hover:bg-zinc-800"
							}`}
						>
							{date.getDate()}
							{hasEventsOnDate(date) && (
								<div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 dark:text-blue-400">
									•
								</div>
							)}
						</button>
					) : (
						<div key={idx} />
					)
				)}
			</div>
		</div>
	);
}

export default function CalendarioPage() {
	const todayTz = getTodayInTimezone();
	const [currentMonth, setCurrentMonth] = useState(todayTz);
	const [selectedDate, setSelectedDate] = useState(todayTz);
	const range = useMemo(() => getMonthRange(currentMonth), [currentMonth]);
	const { data, isLoading: loading, error, refetch } = useQuery({
		queryKey: queryKeys.calendario.list(range),
		queryFn: async () => calendarioService.list(range),
	});
	const summary = data?.summary || { total: 0, byType: {} };
	const events = Array.isArray(data?.events) ? data.events : [];

	const calendarSummary = buildSummary(summary, events);
	const eventsForSelectedDate = useMemo(
		() => events.filter((event) => isSameDay(new Date(event.start), selectedDate)),
		[events, selectedDate]
	);

	const handleMonthChange = (nextMonth) => {
		setCurrentMonth(nextMonth);
		setSelectedDate(startOfMonth(nextMonth));
	};

	return (
		<div className="mx-auto max-w-7xl space-y-5">
			<section className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-white to-zinc-50 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
				<div className="flex flex-col gap-4 border-b border-zinc-200/80 p-5 sm:p-6 dark:border-zinc-800/80 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-3">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight">Calendario</h1>
							<p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
								Selecciona una fecha para ver los eventos del período.
							</p>
						</div>
					</div>
					<div className="grid gap-3 sm:grid-cols-3">
						<Card className="border-zinc-200/80 bg-white/90 shadow-none dark:border-zinc-800 dark:bg-zinc-900/80">
							<CardContent className="flex items-center gap-3 p-4">
								<div className="rounded-xl bg-zinc-900 p-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
									<ListChecks className="size-4" />
								</div>
								<div>
									<p className="text-xs text-zinc-500 dark:text-zinc-400">Eventos</p>
									<p className="text-xl font-semibold">{calendarSummary.total}</p>
								</div>
							</CardContent>
						</Card>
						<Card className="border-zinc-200/80 bg-white/90 shadow-none dark:border-zinc-800 dark:bg-zinc-900/80">
							<CardContent className="flex items-center gap-3 p-4">
								<div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
									<CheckCircle2 className="size-4" />
								</div>
								<div>
									<p className="text-xs text-zinc-500 dark:text-zinc-400">Tareas</p>
									<p className="text-xl font-semibold">{calendarSummary.tareas}</p>
								</div>
							</CardContent>
						</Card>
						<Card className="border-zinc-200/80 bg-white/90 shadow-none dark:border-zinc-800 dark:bg-zinc-900/80">
							<CardContent className="flex items-center gap-3 p-4">
								<div className="rounded-xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
									<CircleDollarSign className="size-4" />
								</div>
								<div>
									<p className="text-xs text-zinc-500 dark:text-zinc-400">Detalle ventas</p>
									<p className="text-xl font-semibold">{calendarSummary.detalleVentas}</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
				<div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[0.8fr_1.2fr]">
					<div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950/40">
						<SimpleCalendar
							currentMonth={currentMonth}
							onMonthChange={handleMonthChange}
							selectedDate={selectedDate}
							onSelectDate={setSelectedDate}
							events={events}
						/>
					</div>
					{selectedDate && (
						<div className="space-y-3">
							<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
								<p className="text-sm font-medium">Fecha seleccionada:</p>
								<p className="mt-1 text-base font-semibold">
									{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
								</p>
								<p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
									{eventsForSelectedDate.length > 0
										? `${eventsForSelectedDate.length} evento(s) programado(s)`
										: "Sin eventos para este día"
									}
								</p>
							</div>
							<div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
								<p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 font-medium">
									Eventos del día
								</p>
								{eventsForSelectedDate.length > 0 ? (
									<div className="space-y-2 max-h-64 overflow-y-auto">
										{eventsForSelectedDate.map((event, idx) => (
											<div key={idx} className={`rounded-r-md border-l-2 px-3 py-2 text-xs ${getDayEventAccentClass(event.type)}`}>
												<p className="font-medium">{event.title}</p>
												<p className="text-zinc-600 dark:text-zinc-400">{event.client || "Sin cliente"}</p>
											</div>
										))}
									</div>
								) : (
									<p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
										Nada programado para este día
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			</section>

			<section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
				<div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 sm:px-5 dark:border-zinc-800">
					<div>
						<h2 className="text-lg font-semibold">Eventos normalizados</h2>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							{loading ? "Cargando eventos..." : `${events.length} registros en el mes consultado.`}
						</p>
						<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
							<Badge variant="outline" className="rounded-full">{range.startDate}</Badge>
							<span>a</span>
							<Badge variant="outline" className="rounded-full">{range.endDate}</Badge>
						</div>
					</div>
					<FeedbackAlert message={error?.data?.message || error?.message || ""} variant="error" className="max-w-md" />
				</div>

				<div className="p-4 sm:p-5">
					{events.length === 0 && !loading ? (
						<div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
							<p className="text-sm font-medium">No hay eventos para este mes.</p>
							<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
								Cambia de mes o revisa si existen tareas y detalles de venta con fecha dentro de la consulta.
							</p>
							<Button variant="outline" className="mt-4" onClick={() => refetch()}>Reintentar</Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Fecha</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Titulo</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead>Cliente</TableHead>
									<TableHead>Días restantes</TableHead>
									<TableHead>Producto</TableHead>
									<TableHead>Variante</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{events.map((event, index) => (
									<TableRow key={`${event.type || "event"}-${event.saleId || event.client || index}`}>
										<TableCell className="whitespace-nowrap">{formatCalendarDate(event.start)}</TableCell>
										<TableCell>
											<Badge variant={getTypeVariant(event.type)}>{getTypeLabel(event.type)}</Badge>
										</TableCell>
										<TableCell className="font-medium">{event.title || "Sin titulo"}</TableCell>
										<TableCell>
											{event.status ? <Badge variant={getStatusVariant(event.status)}>{event.status}</Badge> : <span className="text-zinc-400">-</span>}
										</TableCell>
										<TableCell>{event.client || "-"}</TableCell>
										<TableCell>{getDaysRemaining(event.start)}</TableCell>
										<TableCell>{event.product || "-"}</TableCell>
										<TableCell>{event.variant || "-"}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</section>
		</div>
	);
}
