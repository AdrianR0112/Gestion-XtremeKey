import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { requireCustomerSession } from "@/lib/server-auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireCustomerSession();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="page-shell grid gap-8 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <section className="min-w-0">{children}</section>
      </main>
      <Footer />
    </div>
  );
}
