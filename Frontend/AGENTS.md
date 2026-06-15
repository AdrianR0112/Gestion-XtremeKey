# AGENTS.md

## Quick commands
- `npm run dev` — Vite dev server at `localhost:5173` (strict port, no auto-fallback)
- `npm run build` — production build
- `npm run lint` — ESLint (JS/JSX only, configured with react-hooks + react-refresh plugins)
- `npm run preview` — preview production build
- No test runner configured; there is no `npm test`.

## Stack
- Vite 7 + React 19 + React Router 7 + Redux Toolkit + Tailwind CSS 4 + shadcn/ui (Radix Nova, lucide icons)
- **JavaScript only** (no TypeScript). File extensions: `.js`, `.jsx`. `jsconfig.json` maps `@` → `./src`.
- shadcn components live in `src/components/ui/`. Use `cn()` from `@/lib/utils` for class merging.
- Font: Public Sans (Google Fonts, loaded via `@import` in CSS).

## Architecture
- Entry: `src/main.jsx` → `<Providers>` → `<App>`
- `src/app/providers.jsx`: BrowserRouter + Redux Provider + TooltipProvider
- `src/app/router.jsx`: all route definitions, `PrivateRoute` guard, `DashboardLayout` vs `AuthLayout`
- Redux store: `src/store/index.js` — two slices: `auth` (token/user/isAuthenticated) and `ui` (sidebar/loading/search). Context files in `src/context/` exist but are unused shims.
- Feature modules under `src/modules/<name>/` — each module exports its page component from `index.jsx` and may contain `components/`, `hooks/`, `services/`, `schemas/`, `helpers/`.
- Shared API layer: `src/services/api.js` is a fetch wrapper with auto JSON handling, FormData support, JWT injection from `localStorage("authToken")`, and forced redirect to `/auth` on 401 (token expiration).
- API endpoints: `src/services/endpoints.js`
- Utilities in `src/utils/` (currency, date, permissions, validators, Excel export).
- Constants in `src/constants/` (routes, sidebar items, enums, roles, estados).

## Language
All UI text, labels, and user-facing messages are in **Spanish** (es). Keep new UI strings in Spanish.

## API flow
- Base URL from `VITE_API_URL` env var (defaults to `http://localhost:4000/api/v1`).
- Auth token stored in both Redux (`state.auth.token`) and `localStorage("authToken")`.
- `PrivateRoute` checks Redux store first, falls back to localStorage.
- 401 responses with "token inválido o expirado" force a redirect to `/auth`.
- Module-level services (e.g. `src/modules/clientes/services/clientes.service.js`) use the shared `api` client from `src/services/api.js`.

## Lint conventions
- `no-unused-vars` is `error`; variables starting with uppercase (`[A-Z_]`) are ignored (for destructured unused props, etc.).
- `dist/` is globally ignored by ESLint.
