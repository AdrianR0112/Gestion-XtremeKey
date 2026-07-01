export type OrderStatus = "pagado" | "pendiente" | "procesando";

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  items: Array<{
    productName: string;
    quantity: number;
  }>;
};
