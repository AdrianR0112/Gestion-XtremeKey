import { Badge } from "../../../components/ui/badge";
import { getSuscripcionEstadoVariant } from "../helpers/suscripcion.mapper";

const LABELS = {
	activa: "Activa",
	suspendida: "Suspendida",
	cancelada: "Cancelada",
	expirada: "Expirada",
};

export default function SuscripcionEstadoBadge({ estado }) {
	return <Badge variant={getSuscripcionEstadoVariant(estado)}>{LABELS[estado] || estado || "-"}</Badge>;
}
