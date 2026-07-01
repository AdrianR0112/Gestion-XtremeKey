import type { License } from "@/types/license";
import type { Order } from "@/types/order";
import type { Product, ProductCategory } from "@/types/product";
import type { User } from "@/types/user";

export const APP_NAME = "Shop";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/carrito", label: "Carrito" },
  { href: "/dashboard", label: "Dashboard" },
];

export const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/dashboard/compras", label: "Compras" },
  { href: "/dashboard/licencias", label: "Licencias" },
  { href: "/dashboard/renovaciones", label: "Renovaciones" },
  { href: "/dashboard/perfil", label: "Perfil" },
];

export const PAYMENT_METHODS = [
  { id: "card", label: "Tarjeta" },
  { id: "paypal", label: "PayPal" },
  { id: "transfer", label: "Transferencia" },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: "productividad",
    name: "Productividad",
    description: "Office, herramientas colaborativas y suites de trabajo.",
  },
  {
    slug: "diseno",
    name: "Diseno",
    description: "Licencias para creacion visual, branding y contenido.",
  },
  {
    slug: "seguridad",
    name: "Seguridad",
    description: "Proteccion para equipos, archivos y navegacion.",
  },
  {
    slug: "desarrollo",
    name: "Desarrollo",
    description: "Herramientas para programadores y equipos tecnicos.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-office-2024",
    slug: "microsoft-office-2024",
    name: "Microsoft Office 2024",
    shortDescription: "Suite completa para trabajo y estudio.",
    description:
      "Licencia digital con activacion guiada para Word, Excel, PowerPoint y Outlook.",
    price: 29.99,
    listPrice: 49.99,
    categorySlug: "productividad",
    categoryName: "Productividad",
    featured: true,
    delivery: "Entrega digital en minutos",
    licenseType: "Licencia perpetua",
    images: [
      { src: "/images/office-cover.jpg", alt: "Microsoft Office" },
      { src: "/images/office-dashboard.jpg", alt: "Panel de Office" },
    ],
    features: ["Activacion en 1 equipo", "Guia de instalacion", "Soporte por correo"],
  },
  {
    id: "prod-adobe-cc",
    slug: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    shortDescription: "Herramientas creativas para diseno y video.",
    description:
      "Acceso a aplicaciones de Adobe para creacion de contenido digital y edicion profesional.",
    price: 39.99,
    listPrice: 59.99,
    categorySlug: "diseno",
    categoryName: "Diseno",
    featured: true,
    delivery: "Entrega el mismo dia",
    licenseType: "Suscripcion anual",
    images: [
      { src: "/images/adobe-cover.jpg", alt: "Adobe Creative Cloud" },
      { src: "/images/adobe-tools.jpg", alt: "Apps de Adobe" },
    ],
    features: ["Apps creativas", "Perfil personal", "Activacion remota"],
  },
  {
    id: "prod-eset-premium",
    slug: "eset-smart-security-premium",
    name: "ESET Smart Security Premium",
    shortDescription: "Proteccion avanzada para equipos personales.",
    description:
      "Suite de seguridad con antimalware, banca protegida y control de privacidad.",
    price: 19.99,
    listPrice: 34.99,
    categorySlug: "seguridad",
    categoryName: "Seguridad",
    featured: false,
    delivery: "Clave inmediata por email",
    licenseType: "24 meses",
    images: [
      { src: "/images/eset-cover.jpg", alt: "ESET premium" },
      { src: "/images/eset-security.jpg", alt: "Seguridad ESET" },
    ],
    features: ["Proteccion en tiempo real", "Antiphishing", "Soporte basico"],
  },
  {
    id: "prod-jetbrains",
    slug: "jetbrains-all-products-pack",
    name: "JetBrains All Products Pack",
    shortDescription: "IDE y herramientas para desarrollo moderno.",
    description:
      "Pack para equipos de desarrollo con acceso a IntelliJ, WebStorm, Rider y mas.",
    price: 54.99,
    listPrice: 79.99,
    categorySlug: "desarrollo",
    categoryName: "Desarrollo",
    featured: true,
    delivery: "Provision digital asistida",
    licenseType: "Licencia anual",
    images: [
      { src: "/images/jetbrains-cover.jpg", alt: "JetBrains pack" },
      { src: "/images/jetbrains-ides.jpg", alt: "Entornos JetBrains" },
    ],
    features: ["Multiples IDEs", "Uso comercial", "Renovacion disponible"],
  },
];

export const CUSTOMER_PROFILE: User = {
  id: "user-demo",
  name: "Cliente Demo",
  email: "cliente@shop.dev",
  company: "Shop Labs",
};

export const ORDERS: Order[] = [
  {
    id: "ord-1",
    number: "SHOP-1001",
    createdAt: "2026-06-12",
    total: 69.98,
    status: "pagado",
    items: [
      { productName: "Microsoft Office 2024", quantity: 1 },
      { productName: "ESET Smart Security Premium", quantity: 2 },
    ],
  },
  {
    id: "ord-2",
    number: "SHOP-1002",
    createdAt: "2026-06-26",
    total: 54.99,
    status: "procesando",
    items: [{ productName: "JetBrains All Products Pack", quantity: 1 }],
  },
];

export const LICENSES: License[] = [
  {
    id: "lic-1",
    key: "OFFC-2024-ABCD-1234",
    productName: "Microsoft Office 2024",
    status: "activa",
    expiresAt: "2027-06-12",
  },
  {
    id: "lic-2",
    key: "JETB-ALLP-7788-XYZZ",
    productName: "JetBrains All Products Pack",
    status: "por-vencer",
    expiresAt: "2026-07-18",
  },
];
