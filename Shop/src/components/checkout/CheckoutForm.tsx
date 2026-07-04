"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCoupons } from "@/hooks/useCoupons";
import { useOrders } from "@/hooks/useOrders";
import { usePayments } from "@/hooks/usePayments";
import { PAYMENT_METHODS } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import type { Cupon } from "@/modules/coupons/coupons.types";
import type { CheckoutFormData } from "@/modules/orders/orders.types";
import { validateCheckoutForm } from "@/modules/orders/orders.validators";

function computeDiscount(subtotal: number, coupon: Cupon | null): number {
  if (!coupon) return 0;
  if (coupon.tipo === "porcentaje") return (subtotal * Number(coupon.valor)) / 100;
  return Math.min(subtotal, Number(coupon.valor));
}

export function CheckoutForm() {
  const { user } = useAuth();
  const { itemCount, subtotal, clear } = useCart();
  const { create: createOrder } = useOrders();
  const { create: createPayment } = usePayments();
  const { findByCode, registerUso, validating } = useCoupons();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Cupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutFormData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    paymentMethod: PAYMENT_METHODS[0].id,
  });

  const discount = computeDiscount(subtotal, coupon);
  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    setCouponError(null);
    if (!couponCode.trim()) return;
    const found = await findByCode(couponCode.trim());
    if (!found) {
      setCoupon(null);
      setCouponError("Cupón inválido");
      return;
    }
    setCoupon(found);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCheckoutForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || itemCount === 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const numeroOrd = `SHOP-${Date.now()}`;
      const roundedSubtotal = Math.round(subtotal * 100) / 100;
      const roundedDiscount = Math.round(discount * 100) / 100;
      const roundedTotal = Math.round((roundedSubtotal - roundedDiscount) * 100) / 100;

      const orden = await createOrder({
        Numero_Ord: numeroOrd,
        Email_Invitado: form.email,
        Estado_Ord: "pendiente",
        Estado_Pago: "pendiente",
        Moneda: "USD",
        Subtotal: roundedSubtotal,
        Descuento: roundedDiscount,
        Total: roundedTotal,
        Codigo_Cupon: coupon?.codigo,
        Notas_Cliente: form.name,
      });

      await createPayment({
        Id_Ord: orden.Id_Ord,
        Metodo_Pago: form.paymentMethod,
        Monto: roundedTotal,
        Moneda: "USD",
        Estado_Pago_Prov: "pendiente",
      });

      if (coupon) {
        try {
          await registerUso({ cuponId: coupon.id, clienteId: user?.id, ordenId: String(orden.Id_Ord) });
        } catch {
          /* uso de cupon registrado opcionalmente */
        }
      }

      clear();
      setOrderId(String(orden.Id_Ord));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No pudimos procesar el pago");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-semibold text-slate-950">Pago registrado</h2>
        </div>
        <p className="text-sm text-slate-600">
          Tu orden <strong>{orderId.slice(0, 8).toUpperCase()}</strong> quedó registrada. Recibirás los detalles por correo.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link className="primary-button" href="/dashboard/compras">
            Ver mis compras
          </Link>
          <Link className="secondary-button" href="/productos">
            Seguir comprando
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="checkout-name">
              Nombre
            </label>
            <Input id="checkout-name" onChange={(event) => setForm({ ...form, name: event.target.value })} value={form.name} />
            {errors.name ? <p className="text-xs text-rose-600">{errors.name}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="checkout-email">
              Correo
            </label>
            <Input id="checkout-email" onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" value={form.email} />
            {errors.email ? <p className="text-xs text-rose-600">{errors.email}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Método de pago</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethod checked={form.paymentMethod === method.id} id={method.id} key={method.id} label={method.label} onChange={(paymentMethod) => setForm({ ...form, paymentMethod })} />
            ))}
          </div>
          {errors.paymentMethod ? <p className="text-xs text-rose-600">{errors.paymentMethod}</p> : null}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Cupón de descuento</p>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="max-w-xs"
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Código de cupón"
              value={couponCode}
            />
            <Button disabled={validating || !couponCode.trim()} onClick={applyCoupon} type="button" variant="secondary">
              {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
            </Button>
            {coupon ? <StatusPill label={`-${coupon.tipo === "porcentaje" ? `${coupon.valor}%` : formatCurrency(coupon.valor)}`} tone="success" /> : null}
          </div>
          {couponError ? <p className="text-xs text-rose-600">{couponError}</p> : null}
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between text-emerald-700">
              <span>Descuento</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-950">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {submitError ? <p className="text-xs text-rose-600">{submitError}</p> : null}

        <Button className="w-full" disabled={itemCount === 0 || submitting} type="submit">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar pago"}
        </Button>
      </form>
    </Card>
  );
}
