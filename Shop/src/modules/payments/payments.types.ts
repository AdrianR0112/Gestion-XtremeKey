export type Pago = {
  Id_Pag: number;
  Id_Ord: number;
  Numero_Ord?: string;
  Metodo_Pago: string;
  Proveedor_Pago?: string | null;
  Monto: number | string;
  Moneda: string;
  Estado_Pago_Prov: string;
  Id_Transaccion?: string | null;
  Stripe_PaymentIntent_Id?: string | null;
  Metadatos?: unknown;
  Fec_Crea_Pag?: string;
  Fec_Actu_Pag?: string;
};

export type PagoInput = {
  Id_Ord: number;
  Metodo_Pago: string;
  Proveedor_Pago?: string;
  Monto: number;
  Moneda?: string;
  Estado_Pago_Prov?: string;
  Id_Transaccion?: string;
  Stripe_PaymentIntent_Id?: string;
  Metadatos?: Record<string, unknown>;
};

export type PagoUpdate = Partial<PagoInput>;
