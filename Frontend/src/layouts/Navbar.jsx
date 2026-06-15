import {
	Activity,
	Bell,
	Languages,
	LogOut,
	Moon,
	Search,
	Settings,
	Share2,
	SlidersHorizontal,
	Sun,
	User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { SidebarTrigger } from "../components/ui/sidebar";
import authService from "../modules/auth/services/auth.service";
import { logout as clearAuth } from "../store/auth.store";

export default function Navbar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

	const onToggleTheme = () => {
		document.documentElement.classList.toggle("dark");
		setIsDark(document.documentElement.classList.contains("dark"));
	};

	const onLogout = async () => {
		try {
			await authService.logout();
		} finally {
			dispatch(clearAuth());
			navigate("/auth", { replace: true });
		}
	};

	return (
		<header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 xl:px-10">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/85 px-3 py-2 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/85">
				<div className="flex items-center gap-2 sm:gap-3">
					<SidebarTrigger className="border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" />
					<div className="hidden h-5 w-px bg-zinc-200 sm:block dark:bg-zinc-700" />
					<div className="hidden w-80 items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-muted-foreground sm:flex dark:border-zinc-700">
						<Search className="size-4" />
						<Input
							className="h-auto border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
							placeholder="Buscar clientes, ventas, tareas..."
						/>
					</div>
					<Button size="icon" variant="ghost" className="sm:hidden" aria-label="Buscar">
						<Search className="size-4" />
					</Button>
				</div>

				<div className="flex items-center gap-1.5">
					<Button size="icon" variant="ghost" aria-label="Compartir">
						<Share2 className="size-4" />
					</Button>
					<Button size="icon" variant="ghost" aria-label="Idioma">
						<Languages className="size-4" />
					</Button>
					<Button size="icon" variant="ghost" aria-label="Actividad">
						<Activity className="size-4" />
					</Button>
					<Button size="icon" variant="ghost" aria-label="Notificaciones" className="relative">
						<Bell className="size-4" />
						<span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500" />
					</Button>
					<Button variant="outline" size="icon" onClick={onToggleTheme} aria-label="Cambiar tema">
						{isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" aria-label="Menu de perfil">
								<User className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Perfil</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => navigate("/auth/change-password")}>
								<Settings className="mr-2 size-4" />
								Configuracion del perfil
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate("/configuracion")}>
								<SlidersHorizontal className="mr-2 size-4" />
								Configuracion del sitio
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
								<LogOut className="mr-2 size-4" />
								Cerrar sesion
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
