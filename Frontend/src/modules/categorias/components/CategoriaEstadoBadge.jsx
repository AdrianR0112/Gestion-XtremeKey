import { Badge } from "../../../components/ui/badge";

export default function CategoriaEstadoBadge({ estado }) {
	if (estado === "activo") return <Badge>Activo</Badge>;
	return <Badge variant="secondary">Inactivo</Badge>;
}
