"use client";

import { useState } from "react";

import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/hooks/useCart";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { CheckoutFormData } from "@/modules/orders/orders.types";
import { validateCheckoutForm } from "@/modules/orders/orders.validators";

export function CheckoutForm() {
  const { itemCount, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [form, setForm] = useState<CheckoutFormData>({
    name: "",
    email: "",
    paymentMethod: PAYMENT_METHODS[0].id,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || itemCount === 0) {
      return;
    }

    clear();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-950">Pago registrado</h2>
        <p className="text-sm text-slate-600">Tu pedido fue simulado correctamente. Recibiras los detalles por correo.</p>
      </Card>
    );
  }

  return (
    <Card>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="checkout-name">
            Nombre
          </label>
          <Input id="checkout-name" onChange={(event) => setForm({ ...form, name: event.target.value })} value={form.name} />
          {errors.name ? <p className="text-xs text-red-600">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="checkout-email">
            Correo
          </label>
          <Input id="checkout-email" onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" value={form.email} />
          {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Metodo de pago</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethod checked={form.paymentMethod === method.id} id={method.id} key={method.id} label={method.label} onChange={(paymentMethod) => setForm({ ...form, paymentMethod })} />
            ))}
          </div>
          {errors.paymentMethod ? <p className="text-xs text-red-600">{errors.paymentMethod}</p> : null}
        </div>
        <Button className="w-full" disabled={itemCount === 0} type="submit">
          Confirmar pago
        </Button>
      </form>
    </Card>
  );
}
