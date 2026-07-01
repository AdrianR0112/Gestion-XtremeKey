import { requireCustomerSession } from "@/lib/server-auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireCustomerSession();

  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section>{children}</section>
    </div>
  );
}
