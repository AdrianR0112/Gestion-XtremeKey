import { useEffect, useId, useState } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn } from "../lib/utils";

const ALERT_DURATION_MS = 4000;
const ALERT_STACK_GAP = 88;

let activeAlertIds = [];
const registryListeners = new Set();

function notifyRegistryListeners() {
	registryListeners.forEach((listener) => listener(activeAlertIds));
}

function registerAlert(id) {
	if (activeAlertIds.includes(id)) return;
	activeAlertIds = [...activeAlertIds, id];
	notifyRegistryListeners();
}

function unregisterAlert(id) {
	if (!activeAlertIds.includes(id)) return;
	activeAlertIds = activeAlertIds.filter((item) => item !== id);
	notifyRegistryListeners();
}

function subscribeToRegistry(listener) {
	registryListeners.add(listener);
	listener(activeAlertIds);
	return () => {
		registryListeners.delete(listener);
	};
}

const variantConfig = {
	error: {
		icon: AlertCircle,
		alertVariant: "destructive",
		className: "border-red-200/70 bg-red-50/80 text-red-950 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100",
		title: "Error",
	},
	success: {
		icon: CheckCircle2,
		alertVariant: "default",
		className: "border-emerald-200/70 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100",
		title: "Correcto",
	},
	warning: {
		icon: TriangleAlert,
		alertVariant: "default",
		className: "border-amber-200/70 bg-amber-50/80 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
		title: "Atención",
	},
	info: {
		icon: Info,
		alertVariant: "default",
		className: "border-blue-200/70 bg-blue-50/80 text-blue-950 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100",
		title: "Información",
	},
};

export default function FeedbackAlert({
	message,
	variant = "info",
	title,
	className,
}) {
	const alertId = useId();
	const [visible, setVisible] = useState(Boolean(message));
	const [stackIndex, setStackIndex] = useState(0);

	useEffect(() => {
		if (!message) {
			setVisible(false);
			unregisterAlert(alertId);
			return undefined;
		}

		setVisible(true);
		return undefined;
	}, [alertId, message]);

	useEffect(() => {
		if (!message || !visible) {
			unregisterAlert(alertId);
			return undefined;
		}

		registerAlert(alertId);
		const unsubscribe = subscribeToRegistry((ids) => {
			setStackIndex(Math.max(ids.indexOf(alertId), 0));
		});

		return () => {
			unsubscribe();
			unregisterAlert(alertId);
		};
	}, [alertId, message, visible]);

	useEffect(() => {
		if (!message || !visible) return undefined;

		const timeoutId = window.setTimeout(() => {
			setVisible(false);
		}, ALERT_DURATION_MS);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [message, visible]);

	if (!message || !visible) return null;

	const config = variantConfig[variant] || variantConfig.info;
	const Icon = config.icon;

	return (
		<Alert
			variant={config.alertVariant}
			className={cn(
				"fixed right-4 z-[100] w-[calc(100vw-2rem)] max-w-md shadow-lg transition-all sm:right-6",
				config.className,
				className
			)}
			style={{ top: `${16 + stackIndex * ALERT_STACK_GAP}px` }}
		>
			<Icon className="size-4" />
			<AlertTitle>{title || config.title}</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	);
}
