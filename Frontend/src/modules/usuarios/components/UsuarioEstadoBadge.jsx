import { Badge } from "../../../components/ui/badge";

export default function UsuarioEstadoBadge({ estado }) {
	if (estado === "activo") return <Badge>Activo</Badge>;
	if (estado === "bloqueado") return <Badge variant="destructive">Bloqueado</Badge>;
	return <Badge variant="secondary">Inactivo</Badge>;
}
