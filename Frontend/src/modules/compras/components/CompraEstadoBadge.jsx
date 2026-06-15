import { Badge } from "../../../components/ui/badge";

export default function CompraEstadoBadge({ estado }) {
	const getVariant = (state) => {
		switch (state?.toLowerCase()) {
			case "pendiente":
				return "default";
			case "completada":
				return "secondary";
			case "cancelada":
				return "destructive";
			default:
				return "outline";
		}
	};

	return (
		<Badge variant={getVariant(estado)}>
			{estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "Desconocido"}
		</Badge>
	);
}
