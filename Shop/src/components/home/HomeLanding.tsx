"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CircleDollarSign,
  CreditCard,
  Headset,
  Home,
  Key,
  KeyRound,
  LayoutGrid,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  UserRound,
  WandSparkles,
  Zap,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const mobileDockItems = [
  { label: "Inicio", icon: Home, href: "#home" },
  { label: "Categorias", icon: LayoutGrid, href: "#categorias" },
  { label: "Ofertas", icon: Sparkles, href: "#productos" },
  { label: "Carrito", icon: ShoppingCart, href: "/carrito" },
  { label: "Cuenta", icon: UserRound, href: "/login" },
];

const benefits = [
  {
    title: "Entrega rapida",
    text: "Recibe tu licencia y guia de activacion en minutos.",
    icon: Zap,
  },
  {
    title: "Activacion segura",
    text: "Claves verificadas con soporte paso a paso.",
    icon: ShieldCheck,
  },
  {
    title: "Soporte personalizado",
    text: "Asistencia humana por WhatsApp y correo.",
    icon: Headset,
  },
  {
    title: "Precios accesibles",
    text: "Planes flexibles para estudio, trabajo y negocio.",
    icon: CircleDollarSign,
  },
];

const products = [
  {
    name: "Adobe Creative Cloud",
    price: "$39.99",
    duration: "12 meses",
    badge: "20% OFF",
    status: "Entrega inmediata",
    accent: "from-pink-500 to-violet-500",
    icon: Sparkles,
  },
  {
    name: "JetBrains All Products",
    price: "$54.99",
    duration: "Licencia anual",
    badge: "Top pro",
    status: "Activacion guiada",
    accent: "from-blue-500 to-cyan-400",
    icon: BriefcaseBusiness,
  },
  {
    name: "Canva Pro",
    price: "$12.99",
    duration: "12 meses",
    badge: "Popular",
    status: "Disponible hoy",
    accent: "from-cyan-500 to-indigo-500",
    icon: WandSparkles,
  },
  {
    name: "Microsoft Office",
    price: "$29.99",
    duration: "Licencia perpetua",
    badge: "Bundle",
    status: "Stock verificado",
    accent: "from-orange-400 to-rose-500",
    icon: BriefcaseBusiness,
  },
];

const categories = [
  {
    title: "Diseno grafico",
    copy: "Creative Cloud, Canva, plug-ins y recursos visuales.",
    icon: WandSparkles,
  },
  {
    title: "Productividad",
    copy: "Office, suites colaborativas y licencias empresariales.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Seguridad",
    copy: "Antivirus, respaldos y proteccion para tu operacion.",
    icon: ShieldCheck,
  },
  {
    title: "Sistemas operativos",
    copy: "Windows y activaciones seguras para equipos nuevos.",
    icon: KeyRound,
  },
];

const stats = [
  { value: "5000+", label: "Licencias entregadas" },
  { value: "1200+", label: "Clientes satisfechos" },
  { value: "24/7", label: "Soporte activo" },
  { value: "15 min", label: "Activacion promedio" },
];

const trustCards = [
  {
    title: "Garantia segun producto",
    text: "Cobertura clara por tipo de licencia y renovacion.",
    icon: BadgeCheck,
  },
  {
    title: "Soporte por WhatsApp",
    text: "Atencion directa para instalacion, pago y activacion.",
    icon: Headset,
  },
  {
    title: "Metodos de pago seguros",
    text: "Checkout protegido con validacion y confirmacion inmediata.",
    icon: CreditCard,
  },
  {
    title: "Entrega digital inmediata",
    text: "Recibes la clave, instrucciones y comprobante en linea.",
    icon: KeyRound,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65 },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const hoverLift = {
  y: -10,
  transition: { duration: 0.28 },
};

export function HomeLanding() {
  return (
    <div className="relative overflow-hidden px-4 pb-28 pt-4 sm:px-6 lg:px-8">
      <motion.header animate={{ opacity: 1, y: 0 }} className="topbar surface-panel" initial={{ opacity: 0, y: -20 }} transition={{ duration: 0.55, ease: "easeOut" }}>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -6, 0], y: [0, -2, 0] }}
            className="brand-font grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-bold text-white shadow-lg shadow-blue-500/30"
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            XK
          </motion.div>
          <div>
            <strong className="brand-font block text-lg text-slate-950">XtremeKey</strong>
            <span className="block text-xs text-slate-500">Licencias premium para trabajo digital</span>
          </div>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a className="page-link" href="#home">Inicio</a>
          <a className="page-link" href="#productos">Productos</a>
          <a className="page-link" href="#categorias">Categorias</a>
          <Link className="page-link" href="/dashboard">Dashboard</Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link className="secondary-button" href="/login">Ingresar</Link>
          <Link className="primary-button" href="/productos">Comprar ahora</Link>
        </div>
      </motion.header>

      <main className="mx-auto max-w-7xl space-y-12 pt-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12" id="home">
          <motion.div className="space-y-6" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-700 shadow-sm" variants={fadeUp}>
              <Sparkles className="h-4 w-4" />
              V.2.0 extreme edition
            </motion.div>
            <motion.div className="space-y-4" variants={fadeUp}>
              <h1 className="hero-title text-5xl font-bold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                SOFTWARE THAT <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">EMPOWERS</span> EVERY PIXEL
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                Ditch the monthly drain. Secure authentic licenses for the world&apos;s most powerful creative, productivity and security tools.
              </p>
            </motion.div>
            <motion.div className="flex flex-wrap gap-4" variants={fadeUp}>
              <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Link className="primary-button group" href="/productos">
                  Claim your access
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }}>
                <Link className="secondary-button" href="/carrito">Ir al carrito</Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="hero-stage" initial={{ opacity: 0, x: 40, rotateY: -8 }} transition={{ duration: 0.8, ease: "easeOut" }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true, amount: 0.2 }}>
            <div className="hero-canvas relative min-h-[540px] overflow-hidden rounded-[42px] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.86),rgba(225,236,255,0.72))] p-6 shadow-[0_30px_80px_rgba(19,40,89,0.18)]">
              <div className="hero-orb animate-pulse-glow left-[-30px] top-[-10px] h-36 w-36 bg-blue-400/30" />
              <div className="hero-orb animate-pulse-glow bottom-[40px] right-[-24px] h-40 w-40 bg-violet-400/30" />
              <div className="hero-grid-lines absolute inset-0 opacity-60" />

              <div className="animate-orbit-spin absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full">
                <div className="absolute left-[-6px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(36,87,255,0.65)]" />
                <div className="absolute right-[18px] top-[48px] h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.65)]" />
              </div>

              <div className="hero-ring absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
              <div className="hero-ring absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70" />

              <div className="relative flex min-h-[492px] items-center justify-center">
                <motion.div className="hero-glass-card hero-tilt-main animate-shine-sweep relative z-20 w-full max-w-[360px] overflow-hidden rounded-[34px] bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-white" transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} animate={{ y: [0, -14, 0], rotateZ: [0, 1.5, 0] }}>
                  <div className="mb-16 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-blue-200">Premium stack</p>
                      <h2 className="brand-font mt-3 text-3xl font-semibold">Licencias digitales listas para activar</h2>
                    </div>
                    <KeyRound className="h-8 w-8 text-cyan-300" />
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>Entrega, soporte y activacion guiada en una experiencia de compra limpia.</p>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                      <span>System status</span>
                      <span className="text-cyan-300">Optimal</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div animate={{ x: [0, -5, 0], y: [0, -12, 0], rotateZ: [-8, -4, -8] }} className="hero-glass-card hero-tilt-left absolute bottom-[64px] left-[6px] z-30 w-[180px] rounded-[28px] p-5" transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                  <div className="mb-7 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <Shield className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-500">Proteccion</p>
                  <p className="brand-font mt-1 text-2xl font-semibold text-slate-950">Quantum Secure</p>
                </motion.div>

                <motion.div animate={{ x: [0, 4, 0], y: [0, -16, 0], rotateZ: [10, 6, 10] }} className="hero-glass-card hero-tilt-right absolute right-[2px] top-[28px] z-30 w-[190px] rounded-[28px] p-5" transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                  <div className="mb-7 inline-flex rounded-2xl bg-violet-50 p-3 text-violet-700">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-500">Entrega</p>
                  <p className="brand-font mt-1 text-2xl font-semibold text-slate-950">0.4 sec</p>
                </motion.div>

                <motion.div animate={{ y: [0, -10, 0], rotateY: [-20, -10, -20] }} className="hero-glass-card hero-tilt-chip absolute bottom-[34px] right-[42px] z-40 rounded-[24px] px-4 py-3" transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-cyan-50 p-2 text-cyan-700">
                      <Key className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Injected key</p>
                      <p className="brand-font text-sm font-semibold text-slate-950">ABCD-2026-XY</p>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute bottom-[108px] left-1/2 z-10 h-20 w-64 -translate-x-1/2 rounded-full bg-blue-900/18 blur-2xl" />
                <div className="absolute bottom-[82px] left-1/2 z-0 h-14 w-48 -translate-x-1/2 rounded-full bg-violet-500/18 blur-2xl" />
              </div>

              <motion.div className="relative z-30 mt-2 grid gap-4 sm:grid-cols-2" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true }}>
                <motion.div className="hero-glass-card rounded-[26px] p-5" variants={fadeUp} whileHover={hoverLift}>
                  <p className="text-sm text-slate-500">Entrega</p>
                  <p className="brand-font mt-2 text-2xl font-semibold text-slate-950">Inmediata</p>
                </motion.div>
                <motion.div className="hero-glass-card rounded-[26px] p-5" variants={fadeUp} whileHover={hoverLift}>
                  <p className="text-sm text-slate-500">Cobertura</p>
                  <p className="brand-font mt-2 text-2xl font-semibold text-slate-950">24/7</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <motion.section className="stats-band" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          {stats.map((stat) => (
            <motion.article className="stats-tile interactive-card" key={stat.label} variants={fadeUp} whileHover={hoverLift}>
              <p className="brand-font text-3xl font-semibold text-slate-950">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </motion.article>
          ))}
        </motion.section>

        <section className="section-shell">
          <motion.div className="section-head" initial="hidden" variants={fadeUp} whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <div>
              <p className="section-kicker">Por que elegirnos</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Compra con velocidad, soporte y activacion real</h2>
              <p className="section-copy">La interfaz ahora separa beneficios, catalogo y confianza en bloques mas claros para mejorar lectura, foco y conversion.</p>
            </div>
          </motion.div>
          <motion.div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {benefits.map((benefit) => (
              <motion.article className="landing-card interactive-card group relative overflow-hidden" key={benefit.title} variants={fadeUp} whileHover={hoverLift}>
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/70 blur-2xl transition duration-300 group-hover:scale-125" />
                <motion.div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700" whileHover={{ rotate: 6, scale: 1.08 }}>
                  <benefit.icon className="h-5 w-5" />
                </motion.div>
                <h3 className="brand-font text-xl font-semibold text-slate-950">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="section-shell" id="productos">
          <motion.div className="section-head" initial="hidden" variants={fadeUp} whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <div>
              <p className="section-kicker">Curated catalog</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Premium Collections</h2>
              <p className="section-copy">Separo mejor el encabezado del grid y hago que cada producto tenga mas presencia, profundidad y microinteraccion en hover.</p>
            </div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }}>
              <Link className="secondary-button" href="/productos">Ver catalogo completo</Link>
            </motion.div>
          </motion.div>
          <motion.div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            {products.map((product) => (
              <motion.article className="landing-card interactive-card group flex h-full flex-col gap-4 overflow-hidden" key={product.name} variants={fadeUp} whileHover={hoverLift}>
                <motion.div className={`rounded-[28px] bg-gradient-to-br ${product.accent} p-5 text-white`} whileHover={{ y: -3, scale: 1.02 }}>
                  <div className="mb-12 flex items-center justify-between text-sm">
                    <span className="rounded-full bg-white/20 px-3 py-1">{product.badge}</span>
                    <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
                      <product.icon className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <p className="text-sm text-white/80">{product.status}</p>
                </motion.div>
                <div className="space-y-2">
                  <h3 className="brand-font text-xl font-semibold text-slate-950">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.duration}</p>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold text-slate-950">{product.price}</p>
                  <Link className="inline-flex items-center gap-1 text-sm font-medium text-blue-700" href="/productos">
                    Comprar
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="section-shell" id="categorias">
          <motion.div className="section-head" initial="hidden" variants={fadeUp} whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <div>
              <p className="section-kicker">Categorias</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Explora por necesidad</h2>
              <p className="section-copy">Cada categoria ahora respira mejor y reacciona al hover para guiar la exploracion del catalogo.</p>
            </div>
          </motion.div>
          <motion.div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {categories.map((category) => (
              <motion.article className="landing-card interactive-card group" key={category.title} variants={fadeUp} whileHover={hoverLift}>
                <motion.div className="mb-4 inline-flex rounded-2xl bg-violet-50 p-3 text-violet-700" whileHover={{ rotate: 6, scale: 1.08 }}>
                  <category.icon className="h-5 w-5" />
                </motion.div>
                <h3 className="brand-font text-xl font-semibold text-slate-950">{category.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{category.copy}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="section-shell">
          <motion.div className="section-head" initial="hidden" variants={fadeUp} whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <div>
              <p className="section-kicker">Confianza operativa</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Tu compra respaldada de principio a fin</h2>
            </div>
          </motion.div>
          <motion.div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {trustCards.map((card) => (
              <motion.article className="landing-card interactive-card group relative overflow-hidden" key={card.title} variants={fadeUp} whileHover={hoverLift}>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 opacity-0 transition duration-300 group-hover:opacity-100" />
                <motion.div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-800" whileHover={{ rotate: 6, scale: 1.08 }}>
                  <card.icon className="h-5 w-5" />
                </motion.div>
                <h3 className="brand-font text-xl font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{card.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <motion.section className="cta-panel" initial={{ opacity: 0, y: 40 }} transition={{ duration: 0.7, ease: "easeOut" }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} whileHover={{ y: -4 }}>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-200">Activa tu siguiente stack</p>
              <h2 className="brand-font mt-3 text-4xl font-semibold">Licencias premium con entrega, soporte y renovacion.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">Mejoré la organización general del recorrido para que el usuario pase de impacto visual a beneficios, catalogo, categorias y cierre comercial con menos ruido.</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.985 }}>
              <Link className="secondary-button group border-white/20 bg-white/10 text-white hover:bg-white/15" href="/registro">
                Crear cuenta
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <footer className="pb-8 pt-4 text-center text-sm text-slate-500">
          XtremeKey. Software, activaciones y soporte en una experiencia ecommerce moderna.
        </footer>
      </main>

      <motion.nav animate={{ y: [0, -4, 0] }} className="mobile-dock" transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
        {mobileDockItems.map((item) => (
          <motion.a className="flex flex-col items-center gap-1 rounded-2xl px-2 py-1 text-[11px] text-slate-600" href={item.href} key={item.label} whileHover={{ y: -3, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </motion.a>
        ))}
      </motion.nav>
    </div>
  );
}
