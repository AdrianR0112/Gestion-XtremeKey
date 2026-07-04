"use client";

import Link from "next/link";
import { Bell, Heart, Menu, ShoppingCart, UserCircle2 } from "lucide-react";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNotifications } from "@/hooks/useNotifications";
import { APP_NAME, APP_TAGLINE, NAV_LINKS } from "@/lib/constants";
import { uiStore } from "@/store/ui.store";

function IconButton({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      aria-label={label}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-white/70"
      href={href}
    >
      {children}
      {count && count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();

  return (
    <div className="px-4 pt-4 sm:px-6 lg:px-8">
      <header className="topbar surface-panel">
        <Link className="flex items-center gap-3" href="/">
          <span className="brand-font grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-base font-bold text-white shadow-lg shadow-blue-500/30">
            XK
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <strong className="brand-font text-lg text-slate-950">{APP_NAME}</strong>
            <span className="text-xs text-slate-500">{APP_TAGLINE}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link className="page-link" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          {isAuthenticated ? (
            <>
              <IconButton href="/dashboard/deseos" label="Lista de deseos">
                <Heart className="h-5 w-5" />
              </IconButton>
              <IconButton count={unreadCount} href="/dashboard/notificaciones" label="Notificaciones">
                <Bell className="h-5 w-5" />
              </IconButton>
            </>
          ) : null}
          <IconButton count={itemCount} href="/carrito" label="Carrito">
            <ShoppingCart className="h-5 w-5" />
          </IconButton>
          {isAuthenticated ? (
            <>
              <Link
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base text-slate-700 hover:bg-white/70"
                href="/dashboard"
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="max-w-[12ch] truncate font-medium">{user?.name ?? "Cuenta"}</span>
              </Link>
              <LogoutButton className="ml-1" variant="compact" />
            </>
          ) : (
            <div className="flex items-center gap-3 pl-2">
              <Link className="page-link" href="/login">
                Ingresar
              </Link>
              <Link className="primary-button" href="/registro">
                Crear cuenta
              </Link>
            </div>
          )}
        </div>

        <Button className="md:hidden" onClick={() => uiStore.openMobileMenu()} type="button" variant="ghost">
          <Menu className="h-6 w-6" />
        </Button>
      </header>
      <MobileMenu />
    </div>
  );
}
