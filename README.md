# Ajay Duddi's portfolio

A SolidJS single-page portfolio built with TypeScript, Vite 8, Tailwind CSS 4 and GSAP. Personal details, services and skills live in `src/data/portfolio.ts`; portfolio entries and coding statistics come from public APIs.

## Development

Use npm with Node 24 (see `.nvmrc`; minimum supported Node version is 22.12).

```sh
cp .env.example .env
npm ci
npm run dev
```

If `.env` already exists, add the key from `.env.example` instead of overwriting it. Restart existing development processes after changing configuration or upgrading dependencies. Vite listens on localhost by default. Use `--host` only when intentionally sharing the development server on a trusted network.

```dotenv
VITE_PORTFOLIO_API_BASE_URL=https://url
```

This public base configures portfolio, LeetCode, CodeChef and contact webhooks. Vite reads it at build time. Changing it requires a restart in development or a new production build. Missing or invalid configuration stops startup/build; there is no hardcoded fallback. Production requires HTTPS without credentials, a query or a fragment. Localhost HTTP is permitted during development.

All referenced `VITE_` values are visible in the browser. Keep email tokens, SMTP passwords, n8n credentials and other secrets on the server. `.env` and `.env.*` are ignored, except `.env.example`. See [Vite's environment documentation](https://vite.dev/guide/env-and-mode).

## Checks and production build

```sh
npm run typecheck
npm test
npm run build
npm run audit
npm run audit:production
npm run preview
```

`npm run check` runs typechecking, the security/data-boundary tests and the production build. The build alone does not typecheck. Tests use Node's built-in runner and mocked fetches; they never send contact messages. The GitHub Actions workflow repeats these checks and dependency audits on pushes, pull requests and a weekly schedule. It does not deploy the site.

Deploy the contents of `dist/` using the existing hosting provider. Generated output and local environment files must stay out of Git. The production HTML includes a CSP and a no-referrer policy. The build also generates `dist/security-headers.json`: apply these response headers through the hosting provider or reverse proxy. This JSON file does **not** automatically configure a production server. Vite preview applies them for local checking.

Tailwind 4 requires Safari 16.4+, Chrome 111+ and Firefox 128+. The geometric hero preserves the previous palette and responsive dimensions. See [Tailwind's upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

VS Code workspace settings load `.vscode/tailwindcss.custom-data.json` to recognize Tailwind's `@theme` directive with CSS validation enabled. If the editor still shows an unknown at-rule warning, run **Developer: Reload Window**.

## Animations

Animations are always enabled. There is no animation selector, and system reduced-motion settings or previously saved animation choices do not disable the portfolio's effects. The hero entrance plays on page load; content reveals on scroll, the skills marquee loops, and hover transitions stay active.

CSS and GSAP share the enabled state through `MotionProvider`. Skill cards and content groups reveal separately; hover transforms remain independent. Component cleanup cancels pending animation frames and reverts scoped GSAP animations.

## Data and failure behavior

- The portfolio endpoint returns `[{ data: { profile, projects, experience, socials, stats, ttl } }]`. Runtime validation rejects an invalid wrapper and filters malformed rows. Missing lists become empty lists; the API's `ttl` is not an implemented cache.
- Requests have a 15-second deadline, including JSON-body reads, and abort when their component unmounts. Failed requests use the existing unavailable/empty states and local profile/statistic fallbacks.
- External API links accept HTTP(S) only. Remote images use HTTPS; relative project images resolve against the existing storage host. Missing/failed images display an accessible placeholder; missing/failed company logos display initials.
- The contact form sends `{ name, email, subject, message }` through the same configured API base. It validates input, has a 20-second deadline, prevents duplicate submissions, preserves input after failure and resets after success. An OK HTTP response acknowledges the webhook; it does not independently prove email delivery. Server validation and abuse prevention remain required.

See [SECURITY.md](SECURITY.md) for the completed fixes, verification and remaining deployment work.
