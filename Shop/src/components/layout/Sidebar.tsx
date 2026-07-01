"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-slate-900">Mi cuenta</p>
      <nav className="space-y-1">
        {DASHBOARD_LINKS.map((link) => (
          <Link className={cn("block rounded-2xl px-3 py-2 text-sm transition", pathname === link.href ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100")} href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
