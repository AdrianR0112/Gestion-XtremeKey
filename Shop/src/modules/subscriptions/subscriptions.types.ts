export type Suscripcion = {
  Id_Sus: number;
  Id_Cli: number;
  Id_Prd: number;
  Id_Var?: number | null;
  Fec_Ini_Sus: string;
  Fec_Fin_Sus?: string | null;
  Est_Sus: "activa" | "pausada" | "cancelada" | "vencida" | string;
  Ren_Auto?: number | boolean | null;
  Not_Sus?: string | null;
  Nom_Prd?: string;
  Tip_Prd?: string;
  Nom_Var?: string;
  Nom_Cli?: string;
  Ape_Cli?: string;
  Ema_Cli?: string;
  Fec_Crea_Sus?: string;
  Fec_Actu_Sus?: string;
};

export type SuscripcionInput = {
  Id_Prd: number;
  Id_Var?: number;
  Fec_Ini_Sus: string;
  Fec_Fin_Sus?: string;
  Est_Sus?: string;
  Ren_Auto?: boolean;
  Not_Sus?: string;
};

export type SuscripcionUpdate = Partial<SuscripcionInput>;
