import { Badge } from "../../../components/ui/badge";

export default function ProductoEstadoBadge({ estado = "activo" }) {
	const variant = estado === "activo" ? "default" : estado === "inactivo" ? "secondary" : "destructive";
	return <Badge variant={variant}>{estado?.toUpperCase()}</Badge>;
}
