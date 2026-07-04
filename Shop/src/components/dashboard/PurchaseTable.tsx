import { StatusPill } from "@/components/ui/StatusPill";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { orderStatusTone } from "@/lib/status";
import type { Order } from "@/types/order";

type PurchaseTableProps = {
  orders: Order[];
};

export function PurchaseTable({ orders }: PurchaseTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Pedido</th>
            <th className="px-4 py-3 font-medium">Canal</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Detalle</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr className="transition hover:bg-slate-50/60" key={order.id}>
              <td className="px-4 py-3 font-medium text-slate-900">{order.number}</td>
              <td className="px-4 py-3 text-slate-600">{order.sourceLabel}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3 text-slate-600">
                <p>{order.items.length} item(s)</p>
                {order.items.length > 0 ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {order.items
                      .map((item) => `${item.productName} x${item.quantity}`)
                      .join(", ")}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <StatusPill label={order.status} tone={orderStatusTone(order.status)} />
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
