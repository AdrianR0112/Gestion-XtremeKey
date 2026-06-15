import { Badge } from "../../../components/ui/badge";

const TIPO_COLORS = {
  bienvenida: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  venta: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  renovacion: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  vencimiento: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  recordatorio: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  personalizado: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
};

const CANAL_COLORS = {
  email: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
  whatsapp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  sms: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  push: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
};

const ESTADO_COLORS = {
  activo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactivo: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
};

export function TipoBadge({ tipo }) {
  return (
    <Badge className={`${TIPO_COLORS[tipo] || "bg-gray-100"}`}>
      {tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, " ")}
    </Badge>
  );
}

export function CanalBadge({ canal }) {
  return (
    <Badge className={`${CANAL_COLORS[canal] || "bg-gray-100"}`}>
      {canal.charAt(0).toUpperCase() + canal.slice(1)}
    </Badge>
  );
}

export function EstadoBadge({ estado }) {
  return (
    <Badge className={`${ESTADO_COLORS[estado] || "bg-gray-100"}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </Badge>
  );
}

export default { TipoBadge, CanalBadge, EstadoBadge };
