import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Shop. Licencias digitales y herramientas para equipos modernos.</p>
        <div className="flex gap-4">
          <Link href="/productos">Catalogo</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/dashboard">Mi cuenta</Link>
        </div>
      </div>
    </footer>
  );
}
