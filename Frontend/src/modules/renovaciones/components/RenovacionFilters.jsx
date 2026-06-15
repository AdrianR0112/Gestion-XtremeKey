import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function RenovacionFilters({
	searchTerm,
	onSearchTermChange,
	estadoFilter,
	onEstadoFilterChange,
}) {
	return (
		<div className="flex flex-col sm:flex-row gap-3">
			<Input
				value={searchTerm}
				onChange={(event) => onSearchTermChange(event.target.value)}
				placeholder="Buscar por ID, cliente, producto, tipo..."
			/>
			<Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
				<SelectTrigger className="sm:w-52">
					<SelectValue placeholder="Estado" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="todos">Todos</SelectItem>
					<SelectItem value="pendiente">Pendiente</SelectItem>
					<SelectItem value="completada">Completada</SelectItem>
					<SelectItem value="rechazada">Rechazada</SelectItem>
					<SelectItem value="expirada">Expirada</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
