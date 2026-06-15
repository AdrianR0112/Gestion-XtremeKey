import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  TIPOS_PLANTILLA,
  CANALES_PLANTILLA,
  ESTADOS_PLANTILLA,
} from "../schemas/plantilla.schema";

export default function PlantillaFilters({
  searchTerm,
  setSearchTerm,
  tipoFilter,
  setTipoFilter,
  canalFilter,
  setCanalFilter,
  estadoFilter,
  setEstadoFilter,
  loading,
}) {
  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Filtro de tipo */}
      <div className="space-y-2">
        <Label htmlFor="tipo-filter">Tipo</Label>
        <Select value={tipoFilter} onValueChange={setTipoFilter} disabled={loading}>
          <SelectTrigger id="tipo-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {TIPOS_PLANTILLA.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de canal */}
      <div className="space-y-2">
        <Label htmlFor="canal-filter">Canal</Label>
        <Select value={canalFilter} onValueChange={setCanalFilter} disabled={loading}>
          <SelectTrigger id="canal-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {CANALES_PLANTILLA.map((canal) => (
              <SelectItem key={canal} value={canal}>
                {canal.charAt(0).toUpperCase() + canal.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            {ESTADOS_PLANTILLA.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
