import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { ESTADOS_VARIANTE } from "../schemas/variant.schema";

export default function VariantFilters({
	searchTerm = "",
	onSearchTermChange = () => {},
	estadoFilter = "",
	onEstadoFilterChange = () => {},
}) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
			<div className="relative w-full sm:max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
				<Input
					className="pl-9"
					placeholder="Buscar por nombre, producto o atributos"
					value={searchTerm}
					onChange={(event) => onSearchTermChange(event.target.value)}
				/>
			</div>

			<Select value={estadoFilter || "all"} onValueChange={(value) => onEstadoFilterChange(value === "all" ? "" : value)}>
				<SelectTrigger className="w-full sm:w-48">
					<SelectValue placeholder="Estado" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Todos los estados</SelectItem>
					{ESTADOS_VARIANTE.map((estado) => (
						<SelectItem key={estado} value={estado}>
							{estado}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
