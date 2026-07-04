import Link from "next/link";
import { Github, Instagram, Mail, MessageCircle } from "lucide-react";

import { APP_NAME, APP_TAGLINE, FOOTER_SECTIONS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <Link className="flex items-center gap-3" href="/">
              <span className="brand-font grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
                XK
              </span>
              <span className="flex flex-col leading-tight">
                <strong className="brand-font text-lg text-slate-950">{APP_NAME}</strong>
                <span className="text-xs text-slate-500">{APP_TAGLINE}</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              Licencias digitales verificadas con entrega inmediata, activación guiada y soporte humano por WhatsApp y correo.
            </p>
            <div className="flex items-center gap-2">
              <SocialLink href="mailto:soporte@xtremekey.com" label="Correo">
                <Mail className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://wa.me/" label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://instagram.com/" label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://github.com/" label="GitHub">
                <Github className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {section.title}
                </p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link className="text-sm text-slate-600 transition hover:text-slate-950" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {year} {APP_NAME}. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link className="hover:text-slate-800" href="#">Términos</Link>
            <Link className="hover:text-slate-800" href="#">Privacidad</Link>
            <Link className="hover:text-slate-800" href="#">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
