import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";

export default function DashboardLayout() {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset className="min-h-screen">
				<div className="flex min-h-screen flex-col bg-background text-gray-900 dark:bg-zinc-950 dark:text-slate-100">
					<Navbar />
					<main className="h-full flex-1 overflow-y-auto px-4 py-5 sm:px-6 xl:px-10">
						<Outlet />
					</main>
					<Footer />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
