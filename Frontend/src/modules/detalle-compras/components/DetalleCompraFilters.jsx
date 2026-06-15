import { Input } from "../../../components/ui/input";

export default function DetalleCompraFilters({ searchTerm, onSearchTermChange }) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<Input
				type="text"
				placeholder="Buscar por ID..."
				value={searchTerm}
				onChange={(e) => onSearchTermChange(e.target.value)}
				className="sm:max-w-xs"
			/>
		</div>
	);
}
