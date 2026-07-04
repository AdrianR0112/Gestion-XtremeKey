import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default function CheckoutPage() {
  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <PageHeader
          eyebrow="Compra"
          title="Checkout"
          description="Confirma tus datos, aplica un cupón y completa el pago."
        />
        <CheckoutForm />
      </section>
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <CartSummary />
      </aside>
    </div>
  );
}
