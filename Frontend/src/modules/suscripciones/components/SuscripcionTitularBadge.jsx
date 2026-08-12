import { Store, User } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export default function SuscripcionTitularBadge({ tipo }) {
	const esRevendedor = tipo === "revendedor";
	const Icono = esRevendedor ? Store : User;

	return (
		<Badge variant={esRevendedor ? "default" : "secondary"} className="gap-1 font-medium">
			<Icono className="size-3" />
			{esRevendedor ? "Revendedor" : "Cliente"}
		</Badge>
	);
}
