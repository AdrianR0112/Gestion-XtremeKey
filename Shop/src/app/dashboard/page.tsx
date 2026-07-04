"use client";

import Link from "next/link";
import {
  Bell,
  CreditCard,
  Heart,
  KeyRound,
  Repeat,
  ShoppingBag,
  Star,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { orderStatusTone } from "@/lib/status";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { usePurchases } from "@/hooks/usePurchases";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useWishlist } from "@/hooks/useWishlist";
import { licensesApi } from "@/modules/licenses/licenses.api";

export default function DashboardPage() {
  const { user } = useAuth();
  const { orders, loading: ordersLoading } = usePurchases();
  const { items: wishlist } = useWishlist();
  const { notifications, unreadCount } = useNotifications();
  const { subscriptions, activeSubscriptions } = useSubscriptions();
  const licenses = licensesApi.list();
  const renewals = licensesApi.listRenewals();

  const recentOrders = orders.slice(0, 5);
  const recentNotifications = notifications.slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Panel"
        title={`Hola, ${user?.name ?? "cliente"}`}
        description="Resumen ejecutivo de tu cuenta, licencias y actividad reciente."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Pedidos"
          value={orders.length}
          hint={ordersLoading ? "Actualizando..." : "Total en tu historial"}
        />
        <Stat icon={<KeyRound className="h-4 w-4" />} label="Licencias" value={licenses.length} hint={`${renewals.length} por renovar`} />
        <Stat icon={<Repeat className="h-4 w-4" />} label="Suscripciones" value={activeSubscriptions.length} hint={`${subscriptions.length} totales`} />
        <Stat icon={<Bell className="h-4 w-4" />} label="No leídas" value={unreadCount} hint="Notificaciones" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Section>
          <SectionHeader
            title="Compras recientes"
            description="Últimas órdenes registradas."
            actions={
              <Link className="secondary-button" href="/dashboard/compras">
                Ver todas
              </Link>
            }
          />
          {recentOrders.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Sin compras registradas"
              description="Cuando realices tu primer pedido lo verás aquí."
            />
          ) : (
            <ul className="divide-y divide-slate-200/70">
              {recentOrders.map((o) => (
                <li className="flex items-center justify-between gap-4 py-3" key={o.id}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-950">{o.number}</p>
                    <p className="text-xs text-slate-500">
                      {o.sourceLabel} · {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill label={o.status} tone={orderStatusTone(o.status)} />
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(o.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section>
          <SectionHeader
            title="Notificaciones"
            description="Últimos avisos de tu cuenta."
            actions={
              <Link className="secondary-button" href="/dashboard/notificaciones">
                Ver todas
              </Link>
            }
          />
          {recentNotifications.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-5 w-5" />}
              title="Sin notificaciones"
              description="Todo en orden por aquí."
            />
          ) : (
            <ul className="space-y-3">
              {recentNotifications.map((n) => (
                <li key={n.id} className={`rounded-2xl border border-slate-200/70 bg-white/60 p-3 ${n.leida ? "opacity-70" : ""}`}>
                  <p className="text-sm font-medium text-slate-950">{n.titulo}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{n.mensaje}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">{formatDate(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickLink
          href="/dashboard/deseos"
          icon={<Heart className="h-4 w-4" />}
          title="Lista de deseos"
          value={wishlist.length}
          description="Productos guardados"
        />
        <QuickLink
          href="/dashboard/pagos"
          icon={<CreditCard className="h-4 w-4" />}
          title="Pagos"
          value="Ver historial"
          description="Estados y comprobantes"
        />
        <QuickLink
          href="/dashboard/resenias"
          icon={<Star className="h-4 w-4" />}
          title="Mis reseñas"
          value="Publicar"
          description="Comparte tu experiencia"
        />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  value,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description: string;
}) {
  return (
    <Link className="group" href={href}>
      <Card className="flex items-center justify-between gap-4 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div>
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <span className="rounded-full bg-slate-950/5 p-1.5 text-slate-700">{icon}</span>
            {title}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <span className="text-slate-400 transition group-hover:translate-x-1">→</span>
      </Card>
    </Link>
  );
}
