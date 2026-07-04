export type DetalleVenta = {
  Id_Dve: number;
  Id_Ven: number;
  Id_Prd?: number | null;
  Id_Var?: number | null;
  Id_Cue?: number | null;
  Id_Key?: number | null;
  Cant_Dve?: number;
  Pre_Uni_Dve?: number | string;
  Sub_Tot_Dve?: number | string;
  Fec_Ini_Dve?: string | null;
  Fec_Fin_Dve?: string | null;
  Est_Dve?: string | null;
  Nom_Prd?: string;
  Nom_Var?: string;
  Nom_Cue?: string;
  Des_Key?: string;
};

export type Venta = {
  Id_Ven: number;
  Id_Cli?: number | null;
  Id_Rev?: number | null;
  Origen_Ven: "whatsapp" | "ecommerce" | "presencial" | string;
  Fec_Ven?: string | null;
  Des_Tot_Ven?: number | string;
  Imp_Tot_Ven?: number | string;
  Tot_Ven: number | string;
  Met_Pag_Ven?: string | null;
  Not_Ven?: string | null;
  Est_Ven: "pendiente" | "pagada" | "cancelada" | "reembolsada" | string;
  Nom_Cli?: string;
  Ape_Cli?: string;
  Nom_Rev?: string;
  Ape_Rev?: string;
  Tel_Rev?: string;
  detalles?: DetalleVenta[];
};
