export type License = {
  id: string;
  key: string;
  productName: string;
  status: "activa" | "por-vencer";
  expiresAt: string;
};
