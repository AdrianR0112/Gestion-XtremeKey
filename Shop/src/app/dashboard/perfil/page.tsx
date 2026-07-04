"use client";

import { Mail, Building2, User } from "lucide-react";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/hooks/useAuth";

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3">
      <span className="mt-0.5 rounded-full bg-slate-950/5 p-2 text-slate-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-slate-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Perfil"
        description="Datos del cliente autenticado."
      />
      <Card className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field icon={<User className="h-4 w-4" />} label="Nombre" value={user?.name} />
          <Field icon={<Mail className="h-4 w-4" />} label="Correo" value={user?.email} />
          <Field icon={<Building2 className="h-4 w-4" />} label="Empresa" value={user?.company} />
        </div>
        <div className="pt-3">
          <LogoutButton variant="compact" />
        </div>
      </Card>
    </div>
  );
}
