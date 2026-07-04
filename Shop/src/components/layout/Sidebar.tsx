"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  Heart,
  KeyRound,
  LayoutDashboard,
  Repeat,
  RefreshCw,
  ShoppingBag,
  Star,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { DASHBOARD_SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Bell,
  KeyRound,
  RefreshCw,
  Repeat,
  Heart,
  Star,
  UserCircle2,
};

export function Sidebar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <aside className="surface-panel flex h-fit flex-col gap-5 rounded-3xl p-4 lg:sticky lg:top-24">
      <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mi cuenta</p>
      <div className="space-y-5">
        {DASHBOARD_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {section.title}
            </p>
            <nav className="space-y-0.5">
              {section.links.map((link) => {
                const Icon = ICONS[link.icon];
                const active = pathname === link.href;
                const badge = link.href === "/dashboard/notificaciones" && unreadCount > 0 ? unreadCount : null;
                return (
                  <Link
                    className={cn(
                      "group flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-[15px] transition",
                      active
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-slate-950",
                    )}
                    href={link.href}
                    key={link.href}
                  >
                    <span className="flex items-center gap-2.5">
                      {Icon ? <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-400 group-hover:text-slate-700")} /> : null}
                      {link.label}
                    </span>
                    {badge ? (
                      <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      <div className="mt-2 border-t border-slate-200/70 pt-4">
        <LogoutButton variant="full" />
      </div>
    </aside>
  );
}
