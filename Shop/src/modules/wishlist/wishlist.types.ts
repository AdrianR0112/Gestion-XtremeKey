export type WishlistItem = {
  Id_Des: number;
  Id_Cli: number;
  Id_Prd: number;
  Nom_Prd?: string;
  Nom_Cli?: string;
  Ape_Cli?: string;
  Fec_Crea_Des?: string;
};

export type WishlistInput = {
  Id_Prd: number;
};
