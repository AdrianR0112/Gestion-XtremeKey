import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
	Sidebar as AppSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	SidebarSeparator,
} from "../components/ui/sidebar";
import { Button } from "../components/ui/button";
import authService from "../modules/auth/services/auth.service";
import configuracionService from "../modules/configuracion/services/configuracion.service";
import { queryKeys } from "../app/query-keys";
import { loadTimezone } from "../utils/timezone";
import { logout as clearAuth } from "../store/auth.store";
import {
	LayoutDashboard,
	BarChart3,
	CalendarRange,
	Users,
	Truck,
	Package,
	FolderTree,
	Boxes,
	Wallet,
	KeyRound,
	ShoppingCart,
	Receipt,
	HandCoins,
	RefreshCw,
	CheckSquare,
	FileText,
	UserCog,
	Building2,
	ChevronDown,
	ChevronRight,
	LogOut,
} from "lucide-react";

const navigationGroups = [
	{
		label: "GENERAL",
		items: [
			{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
			{ name: "Calendario", href: "/calendario", icon: CalendarRange },
			{ name: "Tareas", href: "/tareas", icon: CheckSquare },
			{ name: "Reportes", href: "/reportes", icon: BarChart3 },
		],
	},
	{
		label: "NEGOCIO",
		items: [
			{ name: "Clientes", href: "/clientes", icon: Users },
			{ name: "Revendedores", href: "/revendedores", icon: Users },
			{ name: "Ventas", href: "/ventas", icon: ShoppingCart },
			{ name: "Compras", href: "/compras", icon: Receipt },
			{ name: "Gastos", href: "/gastos", icon: HandCoins },
			{ name: "Renovaciones", href: "/renovaciones", icon: RefreshCw },
		],
	},
	{
		label: "CATALOGO",
		items: [
			{
				name: "Productos",
				href: "/productos",
				icon: Package,
				expandable: true,
				children: [
					{ name: "Categorias", href: "/categorias", icon: FolderTree },
					{ name: "Variantes", href: "/variantes", icon: Boxes },
				],
			},
			{ name: "Proveedores", href: "/proveedores", icon: Truck },
		],
	},
		{
			label: "SISTEMA",
			items: [
				{ name: "Staff", href: "/staff", icon: UserCog },
			{ name: "Cuentas", href: "/cuentas", icon: Wallet },
			{ name: "Plantillas", href: "/plantillas", icon: FileText },
			{ name: "Keys", href: "/keys", icon: KeyRound },
		],
	},
];

export default function Sidebar() {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState({
		Productos: false,
		Operaciones: false,
	});
	const { data: currentConfig } = useQuery({
		queryKey: queryKeys.configuracion.current(),
		queryFn: async () => {
			return await configuracionService.getCurrent().catch((err) => {
				if (err?.status === 404) return null;
				throw err;
			});
		},
	});
	const companyName = String(currentConfig?.Nom_Emp_Con || "").trim() || "Sistema de Ventas";

	useEffect(() => {
		loadTimezone(configuracionService);
	}, []);

	const onLogout = async () => {
		try {
			await authService.logout();
		} finally {
			dispatch(clearAuth());
			navigate("/auth", { replace: true });
		}
	};

	const isRouteActive = (href) => location.pathname === href || location.pathname.startsWith(`${href}/`);

	const renderMenuItem = (item) => {
		const hasChildren = Boolean(item.children?.length);
		const childActive = hasChildren ? item.children.some((child) => isRouteActive(child.href)) : false;
		const active = isRouteActive(item.href) || childActive;
		const isExpanded = expanded[item.name];

		if (!hasChildren) {
			return (
				<SidebarMenuItem key={item.name}>
					<SidebarMenuButton asChild isActive={active} tooltip={item.name}>
						<NavLink to={item.href}>
							{item.icon ? <item.icon className="size-4" /> : null}
							<span>{item.name}</span>
						</NavLink>
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		}

		return (
			<SidebarMenuItem key={item.name}>
				<SidebarMenuButton asChild isActive={active} tooltip={item.name}>
					<NavLink to={item.href}>
						{item.icon ? <item.icon className="size-4" /> : null}
						<span>{item.name}</span>
					</NavLink>
				</SidebarMenuButton>
				<SidebarMenuAction
					showOnHover
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						setExpanded((prev) => ({ ...prev, [item.name]: !prev[item.name] }));
					}}
				>
					{isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
				</SidebarMenuAction>
				{isExpanded ? (
					<SidebarMenuSub>
						{item.children.map((child) => {
							const subActive = isRouteActive(child.href);
							return (
								<SidebarMenuSubItem key={child.name}>
									<SidebarMenuSubButton asChild isActive={subActive}>
										<NavLink to={child.href}>
											<child.icon className="size-4" />
											<span>{child.name}</span>
										</NavLink>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							);
						})}
					</SidebarMenuSub>
				) : null}
			</SidebarMenuItem>
		);
	};

	return (
		<AppSidebar collapsible="icon" variant="floating">
			<SidebarHeader className="p-4 pb-3">
				<div className="flex items-center gap-2.5 min-w-0 px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
					<Building2 className="size-5 shrink-0 text-sidebar-foreground" />
					<div className="min-w-0 group-data-[collapsible=icon]:hidden">
						<h2 className="text-xl font-semibold truncate">{companyName}</h2>
						<p className="text-[11px] text-sidebar-foreground/60 truncate">Gestión Comercial</p>
					</div>
				</div>
			</SidebarHeader>
			<SidebarSeparator />
			<SidebarContent>
				{navigationGroups.map((group, index) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel className="text-[11px] uppercase tracking-wide">
							{group.label}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map(renderMenuItem)}
							</SidebarMenu>
						</SidebarGroupContent>
						{index < navigationGroups.length - 1 ? <SidebarSeparator className="mt-2" /> : null}
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarSeparator />
			<SidebarFooter className="p-3">
				<Button
					variant="outline"
					className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
					onClick={onLogout}
				>
					<LogOut className="size-4 mr-2 group-data-[collapsible=icon]:mr-0" />
					<span className="group-data-[collapsible=icon]:hidden">Cerrar sesion</span>
				</Button>
			</SidebarFooter>
			<SidebarRail />
		</AppSidebar>
	);
}
