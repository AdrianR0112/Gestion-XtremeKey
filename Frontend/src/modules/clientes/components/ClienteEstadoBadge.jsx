import { Badge } from "../../../components/ui/badge";

export default function ClienteEstadoBadge({ estado }) {
	if (estado === "activo") return <Badge>Activo</Badge>;
	if (estado === "suspendido") return <Badge variant="destructive">Suspendido</Badge>;
	return <Badge variant="secondary">Inactivo</Badge>;
}
