export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

export type Carrito = {
  id: string;
  clienteId: string | null;
  estado: "abierto" | "convertido" | "abandonado" | string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items?: CarritoItem[];
};

export type CarritoInput = {
  clienteId?: string;
  estado?: string;
};

export type CarritoUpdate = Partial<CarritoInput>;

export type CarritoItem = {
  id: string;
  carritoId: string;
  productoId: string;
  varianteId?: string | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
};

export type CarritoItemInput = {
  productoId: string;
  cantidad: number;
  precioUnitario?: number;
  varianteId?: string;
};

export type CarritoItemUpdate = Partial<Pick<CarritoItemInput, "cantidad" | "precioUnitario" | "varianteId">>;
