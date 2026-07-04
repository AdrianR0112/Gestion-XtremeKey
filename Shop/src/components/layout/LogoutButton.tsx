"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

type LogoutButtonProps = {
  variant?: "icon" | "compact" | "full";
  className?: string;
  onDone?: () => void;
};

export function LogoutButton({ variant = "compact", className, onDone }: LogoutButtonProps) {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const [pending, setPending] = useState(false);

  if (!isAuthenticated) return null;

  async function handleClick() {
    setPending(true);
    try {
      await logout();
      onDone?.();
      router.push("/login");
    } finally {
      setPending(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        aria-label="Cerrar sesión"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60",
          className,
        )}
        disabled={pending}
        onClick={handleClick}
        type="button"
      >
        <LogOut className="h-4 w-4" />
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-60",
          className,
        )}
        disabled={pending}
        onClick={handleClick}
        type="button"
      >
        <LogOut className="h-4 w-4" />
        {pending ? "Cerrando..." : "Cerrar sesión"}
      </button>
    );
  }

  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60",
        className,
      )}
      disabled={pending}
      onClick={handleClick}
      type="button"
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
