import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Order } from "@/types/order";

type PurchaseTableProps = {
  orders: Order[];
};

export function PurchaseTable({ orders }: PurchaseTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Pedido</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-medium text-slate-900">{order.number}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3 text-slate-600">{order.status}</td>
              <td className="px-4 py-3 text-slate-900">{formatCurrency(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
