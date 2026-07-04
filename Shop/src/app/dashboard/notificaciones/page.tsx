"use client";

import { Bell, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDate } from "@/lib/formatters";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, error, markAsRead, remove } = useNotifications();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Notificaciones"
        description="Todos los avisos operativos y de compra en un solo lugar."
        actions={
          unreadCount > 0 ? <StatusPill label={`${unreadCount} sin leer`} tone="info" /> : null
        }
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50/60 text-sm text-rose-700">
          No pudimos cargar tus notificaciones. {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="text-sm text-slate-500">Cargando...</Card>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-5 w-5" />}
          title="Sin notificaciones"
          description="Aquí verás actualizaciones de pedidos, licencias y renovaciones."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`flex items-start justify-between gap-4 ${n.leida ? "opacity-70" : ""}`}
            >
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-950">{n.titulo}</p>
                  {!n.leida ? <StatusPill label="Nueva" tone="info" /> : null}
                  {n.canal ? <span className="text-xs uppercase text-slate-500">{n.canal}</span> : null}
                </div>
                <p className="text-sm text-slate-600">{n.mensaje}</p>
                <p className="text-xs text-slate-400">{formatDate(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {!n.leida ? (
                  <Button onClick={() => markAsRead(n.id)} type="button" variant="ghost">
                    <Check className="h-4 w-4" />
                  </Button>
                ) : null}
                <Button onClick={() => remove(n.id)} type="button" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
