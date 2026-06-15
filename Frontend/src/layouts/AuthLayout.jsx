import { Outlet } from "react-router-dom";

export default function AuthLayout() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_34%),linear-gradient(180deg,_#ffffff,_#f8fafc_48%,_#eef2ff)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_34%),linear-gradient(180deg,_#09090b,_#111827_48%,_#0f172a)]">
			<Outlet />
		</div>
	);
}
