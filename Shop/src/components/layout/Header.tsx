"use client";

import Link from "next/link";
import { Menu, ShoppingCart, UserCircle2 } from "lucide-react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { uiStore } from "@/store/ui.store";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="text-lg font-semibold tracking-tight text-slate-950" href="/">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link className="text-sm text-slate-600 transition hover:text-slate-950" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href="/carrito">
            <ShoppingCart className="h-4 w-4" />
            <span>{itemCount}</span>
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href={isAuthenticated ? "/dashboard" : "/login"}>
            <UserCircle2 className="h-4 w-4" />
            <span>{user?.name ?? "Ingresar"}</span>
          </Link>
        </div>
        <Button className="md:hidden" onClick={() => uiStore.openMobileMenu()} type="button" variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <MobileMenu />
    </header>
  );
}
