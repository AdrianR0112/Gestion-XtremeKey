"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { X } from "lucide-react";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import { NAV_LINKS } from "@/lib/constants";
import { uiStore } from "@/store/ui.store";

export function MobileMenu() {
  const { isMobileMenuOpen } = useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot, uiStore.getSnapshot);
  const { isAuthenticated } = useAuth();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="mt-3 rounded-3xl border border-slate-200 bg-white/95 shadow-lg md:hidden">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="mb-4 flex justify-end">
          <button className="rounded-full p-2 text-slate-600" onClick={() => uiStore.closeMobileMenu()} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              className="rounded-2xl px-3 py-3 text-base text-slate-700 hover:bg-slate-100"
              href={link.href}
              key={link.href}
              onClick={() => uiStore.closeMobileMenu()}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <>
              <Link
                className="rounded-2xl px-3 py-3 text-base text-slate-700 hover:bg-slate-100"
                href="/login"
                onClick={() => uiStore.closeMobileMenu()}
              >
                Ingresar
              </Link>
              <Link
                className="rounded-2xl bg-slate-950 px-3 py-3 text-center text-base font-medium text-white"
                href="/registro"
                onClick={() => uiStore.closeMobileMenu()}
              >
                Crear cuenta
              </Link>
            </>
          ) : null}
        </nav>
        {isAuthenticated ? (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <LogoutButton onDone={() => uiStore.closeMobileMenu()} variant="full" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
