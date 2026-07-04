"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CircleDollarSign,
  CreditCard,
  Headset,
  Key,
  KeyRound,
  Package,
  Shield,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { ProductoCard } from "@/components/products/ProductoCard";
import { useProductos } from "@/hooks/useProductos";
import { useVariantes } from "@/hooks/useVariantes";
import type { Variante } from "@/modules/variants/variants.types";

const benefits = [
  { title: "Entrega rápida", text: "Recibe tu licencia y guía de activación en minutos.", icon: Zap },
  { title: "Activación segura", text: "Claves verificadas con soporte paso a paso.", icon: ShieldCheck },
  { title: "Soporte personalizado", text: "Asistencia humana por WhatsApp y correo.", icon: Headset },
  { title: "Precios accesibles", text: "Planes flexibles para estudio, trabajo y negocio.", icon: CircleDollarSign },
];

const categories = [
  { title: "Diseño gráfico", copy: "Creative Cloud, Canva, plug-ins y recursos visuales.", icon: WandSparkles, accent: "from-pink-500 to-violet-500" },
  { title: "Productividad", copy: "Office, suites colaborativas y licencias empresariales.", icon: BriefcaseBusiness, accent: "from-blue-500 to-cyan-400" },
  { title: "Seguridad", copy: "Antivirus, respaldos y protección para tu operación.", icon: ShieldCheck, accent: "from-emerald-500 to-teal-400" },
  { title: "Sistemas operativos", copy: "Windows y activaciones seguras para equipos nuevos.", icon: KeyRound, accent: "from-orange-400 to-rose-500" },
];

const stats = [
  { value: "5000+", label: "Licencias entregadas" },
  { value: "1200+", label: "Clientes satisfechos" },
  { value: "24/7", label: "Soporte activo" },
  { value: "15 min", label: "Activación promedio" },
];

const trustCards = [
  { title: "Garantía por producto", text: "Cobertura clara por tipo de licencia y renovación.", icon: BadgeCheck, accent: "from-blue-500 to-indigo-500" },
  { title: "Soporte por WhatsApp", text: "Atención directa para instalación, pago y activación.", icon: Headset, accent: "from-emerald-500 to-green-400" },
  { title: "Métodos de pago seguros", text: "Checkout protegido con validación y confirmación inmediata.", icon: CreditCard, accent: "from-violet-500 to-fuchsia-500" },
  { title: "Entrega digital inmediata", text: "Recibes la clave, instrucciones y comprobante en línea.", icon: KeyRound, accent: "from-cyan-500 to-sky-400" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const hoverLift = { y: -10, transition: { duration: 0.28 } };

export function HomeLanding() {
  const { productos, loading, error } = useProductos({ sort: "mas_vendidos" });
  const { variantes } = useVariantes();

  const variantesByProducto = useMemo(() => {
    const map = new Map<string, Variante[]>();
    for (const v of variantes) {
      const list = map.get(v.Id_Prd) ?? [];
      list.push(v);
      map.set(v.Id_Prd, list);
    }
    return map;
  }, [variantes]);

  // Destacados: primeros productos activos del catálogo del backend.
  const destacados = useMemo(
    () => productos.filter((p) => p.Est_Prd !== "inactivo").slice(0, 4),
    [productos],
  );

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-24 px-4 py-14 sm:px-6 lg:px-8">
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
                Olvida las mensualidades. Consigue licencias auténticas para las herramientas de creatividad, productividad y seguridad más potentes del mundo.
              </p>
            </motion.div>
            <motion.div className="flex flex-wrap gap-4" variants={fadeUp}>
              <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Link className="primary-button group" href="/productos">
                  Ver catálogo
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
                    <p>Entrega, soporte y activación guiada en una experiencia de compra limpia.</p>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                      <span>Estado del sistema</span>
                      <span className="text-cyan-300">Óptimo</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div animate={{ x: [0, -5, 0], y: [0, -12, 0], rotateZ: [-8, -4, -8] }} className="hero-glass-card hero-tilt-left absolute bottom-[64px] left-[6px] z-30 w-[180px] rounded-[28px] p-5" transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                  <div className="mb-7 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <Shield className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-500">Protección</p>
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
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Clave activada</p>
                      <p className="brand-font text-sm font-semibold text-slate-950">ABCD-2026-XY</p>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute bottom-[108px] left-1/2 z-10 h-20 w-64 -translate-x-1/2 rounded-full bg-blue-900/18 blur-2xl" />
                <div className="absolute bottom-[82px] left-1/2 z-0 h-14 w-48 -translate-x-1/2 rounded-full bg-violet-500/18 blur-2xl" />
              </div>
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
              <p className="section-kicker">Por qué elegirnos</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Compra con velocidad, soporte y activación real</h2>
              <p className="section-copy">Beneficios, catálogo y confianza en bloques claros para mejorar lectura, foco y conversión.</p>
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
              <p className="section-kicker">Lo más comprado</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Los favoritos de nuestros clientes</h2>
              <p className="section-copy">Las licencias más vendidas primero, con precios y variantes en tiempo real desde el catálogo.</p>
            </div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }}>
              <Link className="secondary-button" href="/productos">Ver catálogo completo</Link>
            </motion.div>
          </motion.div>
          <motion.div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            {loading ? (
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-[30px] border border-slate-200 bg-slate-100/70" />
              ))
            ) : error ? (
              <div className="col-span-full rounded-[30px] border border-rose-200 bg-rose-50/60 p-6 text-sm text-rose-700">
                No pudimos cargar el catálogo. {error}
              </div>
            ) : destacados.length === 0 ? (
              <div className="col-span-full flex flex-col items-center gap-3 rounded-[30px] border border-slate-200 bg-white/70 p-10 text-center text-slate-500">
                <Package className="h-6 w-6" />
                <p className="text-sm">Aún no hay productos disponibles en el catálogo.</p>
              </div>
            ) : (
              destacados.map((producto) => (
                <motion.div key={producto.Id_Prd} variants={fadeUp} whileHover={hoverLift}>
                  <ProductoCard producto={producto} variantes={variantesByProducto.get(producto.Id_Prd) ?? []} />
                </motion.div>
              ))
            )}
          </motion.div>
        </section>

        <section className="section-shell" id="categorias">
          <motion.div className="section-head" initial="hidden" variants={fadeUp} whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <div>
              <p className="section-kicker">Categorías</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Explora por necesidad</h2>
              <p className="section-copy">Cada categoría respira mejor y reacciona al hover para guiar la exploración.</p>
            </div>
          </motion.div>
          <motion.div className="grid gap-4 lg:grid-cols-2" initial="hidden" variants={stagger} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {categories.map((category, index) => (
              <motion.div key={category.title} variants={fadeUp} whileHover={{ x: 6 }}>
                <Link
                  href="/productos"
                  className="landing-card interactive-card group relative flex items-center gap-5 overflow-hidden !py-5"
                >
                  <span className="brand-font text-2xl font-semibold text-slate-300 transition group-hover:text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <motion.div
                    className={`inline-flex shrink-0 rounded-2xl bg-gradient-to-br ${category.accent} p-3.5 text-white shadow-md`}
                    whileHover={{ rotate: 6, scale: 1.08 }}
                  >
                    <category.icon className="h-6 w-6" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h3 className="brand-font text-xl font-semibold text-slate-950">{category.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{category.copy}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 -translate-x-2 text-slate-400 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:text-blue-600 group-hover:opacity-100" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="section-shell">
          <motion.div className="section-head" initial="hidden" variants={fadeUp} whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <div>
              <p className="section-kicker">Confianza operativa</p>
              <h2 className="brand-font text-4xl font-semibold text-slate-950">Tu compra respaldada de principio a fin</h2>
              <p className="section-copy">Cada paso de tu compra tiene respaldo, soporte humano y entrega garantizada.</p>
            </div>
          </motion.div>
          <motion.div
            className="overflow-hidden rounded-[30px] border border-white/60 bg-white/80 shadow-sm"
            initial="hidden"
            variants={stagger}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {trustCards.map((card) => (
              <motion.div
                key={card.title}
                className="group relative flex items-center gap-5 border-b border-slate-100 p-6 transition duration-300 last:border-b-0 hover:bg-slate-50/70"
                variants={fadeUp}
                whileHover={{ x: 6 }}
              >
                <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${card.accent} opacity-0 transition duration-300 group-hover:opacity-100`} />
                <motion.div
                  className={`inline-flex shrink-0 rounded-2xl bg-gradient-to-br ${card.accent} p-3.5 text-white shadow-md`}
                  whileHover={{ rotate: 6, scale: 1.08 }}
                >
                  <card.icon className="h-6 w-6" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <h3 className="brand-font text-lg font-semibold text-slate-950">{card.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{card.text}</p>
                </div>
                <BadgeCheck className="h-5 w-5 shrink-0 text-slate-300 transition duration-300 group-hover:text-emerald-500" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.section className="cta-panel" initial={{ opacity: 0, y: 40 }} transition={{ duration: 0.7, ease: "easeOut" }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} whileHover={{ y: -4 }}>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-200">Activa tu siguiente stack</p>
              <h2 className="brand-font mt-3 text-4xl font-semibold">Licencias premium con entrega, soporte y renovación.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">De impacto visual a beneficios, catálogo, categorías y cierre comercial con menos ruido.</p>
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
      </div>
    </div>
  );
}
