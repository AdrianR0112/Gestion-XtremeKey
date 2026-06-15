import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function UsuarioFilters({ searchTerm, onSearchTermChange, estadoFilter, onEstadoFilterChange }) {
	return (
		<div className="flex flex-col sm:flex-row gap-3">
			<div className="relative flex-1">
				<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
				<Input
					value={searchTerm}
					onChange={(event) => onSearchTermChange(event.target.value)}
					placeholder="Buscar por nombre, apellido o correo"
					className="pl-8"
				/>
			</div>
			<Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
				<SelectTrigger className="sm:w-52">
					<SelectValue placeholder="Estado" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="todos">Todos</SelectItem>
					<SelectItem value="activo">Activo</SelectItem>
					<SelectItem value="inactivo">Inactivo</SelectItem>
					<SelectItem value="bloqueado">Bloqueado</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
