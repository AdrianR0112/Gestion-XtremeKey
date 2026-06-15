import { Badge } from "../../../components/ui/badge";

export default function VariantEstadoBadge({ estado = "activo" }) {
	const variant = estado === "inactivo" ? "secondary" : "default";

	return <Badge variant={variant}>{estado?.toUpperCase()}</Badge>;
}
