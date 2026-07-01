"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { X } from "lucide-react";

import { NAV_LINKS } from "@/lib/constants";
import { uiStore } from "@/store/ui.store";

export function MobileMenu() {
  const { isMobileMenuOpen } = useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot, uiStore.getSnapshot);

  if (!isMobileMenuOpen) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 bg-white md:hidden">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="mb-4 flex justify-end">
          <button className="rounded-full p-2 text-slate-600" onClick={() => uiStore.closeMobileMenu()} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link className="rounded-2xl px-3 py-3 text-sm text-slate-700 hover:bg-slate-100" href={link.href} key={link.href} onClick={() => uiStore.closeMobileMenu()}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
