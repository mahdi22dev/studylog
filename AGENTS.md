# Study Log — Agent Instructions

## Stack
- **Next.js 15** (App Router), **React 19**, TypeScript (strict), **pnpm**
- **Tailwind CSS** + **shadcn/ui** (components in `components/ui/`), **recharts** (charts), **next-themes**
- **Prisma** with **@prisma/adapter-d1**, **Clerk** (auth), **sonner** (toasts), **howler** (sound), **luxon** (timezone), **worker-timers** (timer interval)

## Commands
| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | `next build && npx prisma generate` |
| `pnpm lint` | `next lint` |
| `pnpm seed` | Seed 100 fake study sessions (`tsx db/seed.ts`) |
| `pnpm purge` | Delete all study sessions (`tsx db/purge.ts`) |
| `pnpm users` | Runs `db/users.ts` — an empty stub, does nothing |
| `tsx db/seed-notes.ts` | Seed sample note groups + notes (no npm script) |

- No test framework, no formatter, no typecheck script. `next.config.mjs` ignores ESLint errors **and** TS type errors during build, so verify types manually with `npx tsc --noEmit`.

## Architecture
- **Public routes:** `/` (Focurio marketing landing, `components/home/*`), `/blog` (static), `/sign-in`, `/sign-up`. Everything else is protected by `middleware.ts`.
- **Signed-in app:** `/dashboard` redirects to `/dashboard/[username]` (the app shell). `/dashboard/timer` is the Pomodoro + stats page. `app/timer/page.tsx` is just a redirect to it, and `app/home/` is dead code — nothing links to `/home`.
- **`/dashboard/[username]` canonicalizes the username param:** it redirects any mismatched param to the canonical Clerk handle, so `/dashboard/me` works as a stable "current user" alias.
- **Other routes:** `/notes`, `/schedule`, `/admin`, `/admin/user/[id]`.
- **Admin:** `lib/admin.ts` and `/api/admin/*` check `publicMetadata.role === "admin"`. The landing navbar and `/admin` page do a client-side check against `/api/admin/me` (returns `{isAdmin: bool}`, never 401); `/admin` redirects to `/` if not admin.
- **API routes** in `app/api/*/route.ts` — check `await auth()` from Clerk, return 401 if missing. Exception: `/api/quote` (ZenQuotes proxy with hardcoded fallback) has no auth check.
- **DB actions** in `db/actions.ts`, imported by API routes. Always call `prisma.$disconnect()` in `finally`.
- **Models:** `StudySession` (WORK/BREAK/LONG_BREAK), `NoteGroup`, `Note`, `StudySchedule` (weekly JSON). Schema in `prisma/schema.prisma`.

## Key Quirks
- **DB is Cloudflare D1, not local SQLite.** `lib/prisma.ts` always builds `PrismaClient` with the `PrismaD1HTTP` adapter — even `pnpm dev` hits remote D1 via HTTP. Needs `CLOUDFLARE_D1_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID` in `.env`. The `prisma/dev.db` and schema's `sqlite` datasource are vestigial.
- **`prisma.config.ts`** also uses a `PrismaD1HTTP` adapter — only needed for migrations against D1.
- **Stray files inside `prisma/`:** `page.tsx`, `middleware.ts`, `utils.ts`, `package.json` are committed stale copies of root files — ignore them. Only `schema.prisma` and `dev.db` matter.
- **Two Pomodoro timer components.** Active one imported by `app/dashboard/timer/page.tsx` is `components/pomodoro/pomodoro-timer.tsx`. The root `components/pomodoro-timer.tsx` is a stale duplicate — don't edit it.
- **Typo in codebase:** DB action `increament` (missing 'e'), route `increament/`. Also `getAvarage` / route `avarge/` (same typo). Keep the misspellings — code references them.
- **localStorage** keys: `pomodoroSettings` (durations + audio), `weeklyGoalHours`, `currentSessionName`.
- **Sound:** `/bell.mp3` via Howler.js. Disabled via `setAudioDisabled` in settings.
- **Timer interval:** `worker-timers` (`setInterval`/`clearInterval`), not native timers.
- **Timezone** passed from client (`Intl.DateTimeFormat().resolvedOptions().timeZone`) via API body/query.
- **`db/users.ts`** is an empty stub. **`tasks.txt`** and **`test.js`** are gitignored dev artifacts.
- **`.env.example`** still lists `MONGODB_URL`/`DATABASE_URL` — stale, unused.
- **Path alias** `@/*` maps to root `./`. Repo/package name is still the v0 default `my-v0-project`, but the product is branded **Focurio**.