export default function getStatusColor(status) {
  if (status === "Activo" || status === "Pagada") return "success";
  if (status === "Inactivo" || status === "Pendiente") return "warning";
  return "secondary";
}
