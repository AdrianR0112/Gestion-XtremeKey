import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="section-title text-4xl font-semibold text-slate-950">Checkout</h1>
          <p className="text-sm text-slate-600">Confirma tus datos y simula el pago del pedido.</p>
        </div>
        <CheckoutForm />
      </section>
      <aside>
        <CartSummary />
      </aside>
    </div>
  );
}
