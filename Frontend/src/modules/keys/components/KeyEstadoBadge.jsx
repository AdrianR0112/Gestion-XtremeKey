import { Badge } from "../../../components/ui/badge";

const estadoConfig = {
	disponible: { label: "Disponible", variant: "success" },
	vendida: { label: "Vendida", variant: "secondary" },
	reservada: { label: "Reservada", variant: "warning" },
	vencida: { label: "Vencida", variant: "outline" },
	cancelada: { label: "Cancelada", variant: "outline" },
};

export default function KeyEstadoBadge({ estado }) {
	const config = estadoConfig[estado] || { label: estado || "Sin estado", variant: "secondary" };
	return <Badge variant={config.variant}>{config.label}</Badge>;
}
