export type ProductoTipo = "servicio" | "producto" | "suscripcion";
export type ProductoEstado = "activo" | "inactivo" | "agotado";

export type Producto = {
  Id_Prd: string;
  Cod_Prd?: string | null;
  Nom_Prd: string;
  Des_Prd?: string | null;
  Des_Cor_Prd?: string | null;
  Id_Cat?: string | null;
  Tip_Prd?: ProductoTipo | null;
  Ima_Prd?: string | null;
  Est_Prd?: ProductoEstado | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductoInput = {
  Cod_Prd?: string;
  Nom_Prd: string;
  Des_Prd?: string;
  Des_Cor_Prd?: string;
  Id_Cat?: string;
  Tip_Prd?: ProductoTipo;
  Ima_Prd?: string;
  Est_Prd?: ProductoEstado;
};

export type ProductoUpdate = Partial<ProductoInput>;
