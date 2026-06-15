import { Badge } from "../../../components/ui/badge";

function getRenovacionEstadoVariant(estado) {
	if (estado === "completada") return "success";
	if (estado === "pendiente") return "warning";
	if (estado === "rechazada" || estado === "expirada") return "destructive";
	return "secondary";
}

export default function RenovacionEstadoBadge({ estado }) {
	return <Badge variant={getRenovacionEstadoVariant(estado)}>{estado || "-"}</Badge>;
}
