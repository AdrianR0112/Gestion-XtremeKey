import { Badge } from "../../../components/ui/badge";

const PRIORIDAD_COLORS = {
  baja: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  alta: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  urgente: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

const ESTADO_COLORS = {
  pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  en_progreso: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  completada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  cancelada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export function PrioridadBadge({ prioridad }) {
  return (
    <Badge className={`${PRIORIDAD_COLORS[prioridad] || "bg-gray-100"}`}>
      {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
    </Badge>
  );
}

export function EstadoBadge({ estado }) {
  return (
    <Badge className={`${ESTADO_COLORS[estado] || "bg-gray-100"}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1).replace(/_/g, " ")}
    </Badge>
  );
}

export default { PrioridadBadge, EstadoBadge };
