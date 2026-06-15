import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ESTADOS_TAREA, PRIORIDADES_TAREA } from "../schemas/tarea.schema";

export default function TareaFilters({
  searchTerm,
  setSearchTerm,
  estadoFilter,
  setEstadoFilter,
  prioridadFilter,
  setPrioridadFilter,
  loading,
}) {
  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Buscar por título o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Filtro de estado */}
      <div className="space-y-2">
        <Label htmlFor="estado-filter">Estado</Label>
        <Select value={estadoFilter} onValueChange={setEstadoFilter} disabled={loading}>
          <SelectTrigger id="estado-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {ESTADOS_TAREA.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1).replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de prioridad */}
      <div className="space-y-2">
        <Label htmlFor="prioridad-filter">Prioridad</Label>
        <Select value={prioridadFilter} onValueChange={setPrioridadFilter} disabled={loading}>
          <SelectTrigger id="prioridad-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            {PRIORIDADES_TAREA.map((prio) => (
              <SelectItem key={prio} value={prio}>
                {prio.charAt(0).toUpperCase() + prio.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
