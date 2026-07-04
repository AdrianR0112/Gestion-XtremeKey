export type OrderStatus = "pagado" | "pendiente" | "procesando";

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  source: "orden" | "venta_whatsapp";
  sourceLabel: string;
  items: Array<{
    productName: string;
    quantity: number;
  }>;
};
