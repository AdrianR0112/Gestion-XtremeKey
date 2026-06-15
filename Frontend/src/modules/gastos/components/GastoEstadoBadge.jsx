import { Badge } from "../../../components/ui/badge";

export default function GastoEstadoBadge({ estado }) {
  const estadoNorm = (estado || "").toString().toLowerCase();
  const variant =
    estadoNorm === "pagado" ? "secondary" : estadoNorm === "cancelado" ? "destructive" : "default";
  return <Badge variant={variant}>{estadoNorm || "registrado"}</Badge>;
}
