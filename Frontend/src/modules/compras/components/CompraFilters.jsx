import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function CompraFilters({ searchTerm, onSearchTermChange, estadoFilter, onEstadoFilterChange }) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<Input
				type="text"
				placeholder="Buscar por ID o método..."
				value={searchTerm}
				onChange={(e) => onSearchTermChange(e.target.value)}
				className="sm:max-w-xs"
			/>

			<Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
				<SelectTrigger className="w-40">
					<SelectValue placeholder="Filtrar por estado" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="todos">Todos los estados</SelectItem>
					<SelectItem value="pendiente">Pendiente</SelectItem>
					<SelectItem value="completada">Completada</SelectItem>
					<SelectItem value="cancelada">Cancelada</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
