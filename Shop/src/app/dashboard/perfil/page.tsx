"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <Card className="space-y-5">
      <div>
        <h1 className="section-title text-4xl font-semibold text-slate-950">Perfil</h1>
        <p className="mt-2 text-sm text-slate-600">Datos actuales del cliente autenticado con better auth.</p>
      </div>
      <div className="space-y-2 text-sm text-slate-700">
        <p><strong>Nombre:</strong> {user?.name ?? "Sin sesion"}</p>
        <p><strong>Correo:</strong> {user?.email ?? "Sin sesion"}</p>
        <p><strong>Empresa:</strong> {user?.company ?? "No especificada"}</p>
      </div>
      <Button
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
        type="button"
        variant="ghost"
      >
        Cerrar sesion
      </Button>
    </Card>
  );
}
