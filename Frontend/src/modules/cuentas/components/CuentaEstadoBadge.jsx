import { Badge } from "../../../components/ui/badge";

const estadoConfig = {
	disponible: { label: "Disponible", variant: "success" },
	ocupada: { label: "Ocupada", variant: "warning" },
	parcial: { label: "Parcial", variant: "secondary" },
	vencida: { label: "Vencida", variant: "outline" },
	suspendida: { label: "Suspendida", variant: "outline" },
};

export default function CuentaEstadoBadge({ estado }) {
	const config = estadoConfig[estado] || { label: estado || "Sin estado", variant: "secondary" };
	return <Badge variant={config.variant}>{config.label}</Badge>;
}
