import { Badge } from "../../../components/ui/badge";
import { getVentaEstadoVariant } from "../helpers/venta.mapper";

export default function VentaEstadoBadge({ estado }) {
	return <Badge variant={getVentaEstadoVariant(estado)}>{estado || "-"}</Badge>;
}
