const metodosPago = ['tarjeta', 'paypal', 'cripto', 'transferencia'];

const allowedFields = [
  'Id_Ord',
  'Metodo_Pago',
  'Proveedor_Pago',
  'Monto',
  'Moneda',
  'Estado_Pago_Prov',
  'Id_Transaccion',
  'Stripe_PaymentIntent_Id',
  'Metadatos'
];

module.exports = { metodosPago, allowedFields };
