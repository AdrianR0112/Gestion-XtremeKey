import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";

export default function DashboardLayout() {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset className="min-h-screen min-w-0">
				<div className="flex min-h-screen min-w-0 flex-col bg-background text-gray-900 dark:bg-zinc-950 dark:text-slate-100">
					<Navbar />
					<main className="h-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-6 sm:py-5 xl:px-10">
						<Outlet />
					</main>
					<Footer />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
