export type VarianteDuracionTipo = "dias" | "meses" | "anios";
export type VarianteEstado = "activo" | "inactivo";

export type Variante = {
  Id_Var: string;
  Id_Prd: string;
  Nom_Var: string;
  Des_Var?: string | null;
  Pre_Cos_Var: number;
  Pre_Ven_Var: number;
  Pre_Rev_Var?: number | null;
  Dur_Tip_Var?: VarianteDuracionTipo | null;
  Dur_Val_Var?: number | null;
  Max_Usu_Var?: number | null;
  Atr_Var?: string | Record<string, unknown> | null;
  Est_Var?: VarianteEstado | null;
  createdAt?: string;
  updatedAt?: string;
};

export type VarianteInput = {
  Id_Prd: string;
  Nom_Var: string;
  Des_Var?: string;
  Pre_Cos_Var: number;
  Pre_Ven_Var: number;
  Pre_Rev_Var?: number | null;
  Dur_Tip_Var?: VarianteDuracionTipo | null;
  Dur_Val_Var?: number | null;
  Max_Usu_Var?: number;
  Atr_Var?: string | Record<string, unknown>;
  Est_Var?: VarianteEstado;
};

export type VarianteUpdate = Partial<VarianteInput>;
