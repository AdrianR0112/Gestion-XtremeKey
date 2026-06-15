import { Search, RefreshCcw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function ConfiguracionFilters({ searchTerm, onSearchTermChange, onRefresh, loading }) {
	return (
		<div className="flex flex-col sm:flex-row gap-3">
			<div className="relative flex-1">
				<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
				<Input
					placeholder="Buscar por empresa, correo o zona horaria"
					className="pl-8"
					value={searchTerm}
					onChange={(event) => onSearchTermChange(event.target.value)}
				/>
			</div>
			<Button variant="outline" onClick={onRefresh} disabled={loading}>
				<RefreshCcw className="size-4 mr-2" />
				Actualizar
			</Button>
		</div>
	);
}
