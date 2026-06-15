import { Badge } from "../../../components/ui/badge";

export default function ConfiguracionEstadoBadge({ isCurrent }) {
	if (isCurrent) {
		return <Badge>Actual</Badge>;
	}

	return <Badge variant="secondary">Registrada</Badge>;
}
