import type { CheckoutFormData } from "@/modules/orders/orders.types";

export function validateCheckoutForm(data: CheckoutFormData) {
  const errors: Partial<Record<keyof CheckoutFormData, string>> = {};

  if (!data.name.trim()) {
    errors.name = "Ingresa tu nombre.";
  }

  if (!data.email.includes("@")) {
    errors.email = "Ingresa un correo valido.";
  }

  if (!data.paymentMethod) {
    errors.paymentMethod = "Selecciona un metodo de pago.";
  }

  return errors;
}
