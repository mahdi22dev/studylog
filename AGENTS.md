# Study Log — Agent Instructions

## Stack
- **Next.js 15** (App Router), **React 19**, TypeScript (strict), **pnpm**
- **Tailwind CSS** + **shadcn/ui** (components in `components/ui/`)
- **Prisma** with **@prisma/adapter-d1**, **Clerk** (auth), **sonner** (toasts), **howler** (sound), **luxon** (timezone), **worker-timers** (timer interval)

## Commands
| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | `next build && npx prisma generate` |
| `pnpm lint` | `next lint` |
| `pnpm seed` | Seed 100 fake study sessions (`tsx db/seed.ts`) |
| `pnpm purge` | Delete all study sessions (`tsx db/purge.ts`) |
| `tsx db/seed-notes.ts` | Seed sample note groups + notes (no npm script) |

- No test framework, no formatter config. `next.config.mjs` ignores ESLint errors **and** TS type errors during build.

## Architecture
- **Pages:** `/` (landing), `/timer` (Pomodoro + stats), `/notes`, `/schedule`, `/admin` (role-gated). `app/home/page.tsx` is an unused older landing page — no route links to it.
- **API routes** in `app/api/*/route.ts` — check `await auth()` from Clerk, return 401 if missing. Exception: `/api/quote` has no auth check (still gated by middleware).
- **DB actions** in `db/actions.ts`, imported by API routes. Always call `prisma.$disconnect()` in `finally`.
- **Admin:** `/api/admin/*` routes check `publicMetadata.role === "admin"` (see `lib/admin.ts`), not just auth.
- **Models:** `StudySession` (work/break), `NoteGroup`, `Note`, `StudySchedule` (weekly JSON). Schema in `prisma/schema.prisma`.

## Key Quirks
- **DB is Cloudflare D1, not local SQLite.** `lib/prisma.ts` always builds `PrismaClient` with the `PrismaD1HTTP` adapter — even `pnpm dev` hits remote D1 via HTTP. Needs `CLOUDFLARE_D1_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID` in `.env`. The `prisma/dev.db` and schema's `sqlite` datasource are essentially vestigial.
- **`prisma.config.ts`** uses a `PrismaD1HTTP` adapter too — only needed for migrations against D1.
- **Stray files inside `prisma/`:** `page.tsx`, `middleware.ts`, `utils.ts`, `package.json` are untracked stale copies of root files — ignore them. Only `schema.prisma` and `dev.db` matter.
- **Two Pomodoro timer components.** Active one imported by `app/timer/page.tsx` is `components/pomodoro/pomodoro-timer.tsx`. The root `components/pomodoro-timer.tsx` is a stale duplicate — don't edit it.
- **Typo in codebase:** DB action `increament` (missing 'e'), route `increament/`. Also `getAvarage` / route `avarge/` (same typo). Keep the misspellings — code references them.
- **localStorage** keys: `pomodoroSettings` (durations + audio), `weeklyGoalHours`, `currentSessionName`.
- **Sound:** `/bell.mp3` via Howler.js. Disabled via `setAudioDisabled` in settings.
- **Timer interval:** `worker-timers` (`setInterval`/`clearInterval`), not native timers.
- **Timezone** passed from client (`Intl.DateTimeFormat().resolvedOptions().timeZone`) via API body/query.
- **`db/users.ts`** is empty (stub). **`tasks.txt`** and **`test.js`** are gitignored dev artifacts.
- **`.env.example`** still lists `MONGODB_URL`/`DATABASE_URL` — stale, unused.
- **Path alias** `@/*` maps to root `./`.
