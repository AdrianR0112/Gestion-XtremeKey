type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const ORDER_STATUS_MAP: Record<string, Tone> = {
  pagada: "success",
  pagado: "success",
  entregada: "success",
  completada: "success",
  pendiente: "warning",
  procesando: "info",
  cancelada: "danger",
  reembolsada: "neutral",
};

const PAYMENT_STATUS_MAP: Record<string, Tone> = {
  aprobado: "success",
  pendiente: "warning",
  rechazado: "danger",
  reembolsado: "neutral",
};

const SUBSCRIPTION_STATUS_MAP: Record<string, Tone> = {
  activa: "success",
  pausada: "warning",
  cancelada: "danger",
  vencida: "neutral",
};

const LICENSE_STATUS_MAP: Record<string, Tone> = {
  activa: "success",
  "por-vencer": "warning",
  vencida: "danger",
  suspendida: "neutral",
};

export function orderStatusTone(status: string): Tone {
  return ORDER_STATUS_MAP[status] ?? "neutral";
}

export function paymentStatusTone(status: string): Tone {
  return PAYMENT_STATUS_MAP[status] ?? "neutral";
}

export function subscriptionStatusTone(status: string): Tone {
  return SUBSCRIPTION_STATUS_MAP[status] ?? "neutral";
}

export function licenseStatusTone(status: string): Tone {
  return LICENSE_STATUS_MAP[status] ?? "neutral";
}
