export type CheckoutFormData = {
  name: string;
  email: string;
  paymentMethod: string;
};

/**
 * Estructura devuelta por el backend para ordenes (mysql columns).
 */
export type Orden = {
  Id_Ord: number;
  Numero_Ord: string;
  Id_Cli: number | null;
  Email_Invitado?: string | null;
  Estado_Ord: string;
  Estado_Pago: string;
  Moneda: string;
  Subtotal: number | string;
  Descuento?: number | string | null;
  Total: number | string;
  Id_Cupon?: number | null;
  Codigo_Cupon?: string | null;
  Notas_Cliente?: string | null;
  Metadatos?: unknown;
  Fec_Crea_Ord?: string;
  Fec_Actu_Ord?: string;
  Nom_Cli?: string;
  Ape_Cli?: string;
  Ema_Cli?: string;
  items?: OrdenItem[];
};

export type OrdenInput = {
  Numero_Ord?: string;
  Id_Cli?: number;
  Email_Invitado?: string;
  Estado_Ord?: string;
  Estado_Pago?: string;
  Moneda?: string;
  Subtotal?: number;
  Descuento?: number;
  Total?: number;
  Id_Cupon?: number;
  Codigo_Cupon?: string;
  Notas_Cliente?: string;
  Metadatos?: Record<string, unknown>;
};

export type OrdenUpdate = Partial<OrdenInput>;

export type OrdenItem = {
  Id_Item_Ord: number;
  Id_Ord: number;
  Id_Prd: number;
  Id_Var?: number | null;
  Id_Key?: number | null;
  Id_Cue?: number | null;
  Nombre_Prd: string;
  Nombre_Var?: string | null;
  Precio_Unitario: number | string;
  Cantidad: number;
  Precio_Total: number | string;
  Descuento_Item?: number | string | null;
  Clave_Licencia?: string | null;
  Nom_Prd_Actual?: string;
  Nom_Var_Actual?: string;
};

export type OrdenItemInput = {
  Id_Prd: number;
  Id_Var?: number;
  Nombre_Prd: string;
  Nombre_Var?: string;
  Precio_Unitario: number;
  Cantidad: number;
  Precio_Total: number;
};

export type OrdenItemUpdate = Partial<OrdenItemInput>;
