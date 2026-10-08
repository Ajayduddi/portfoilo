# Project memory and agent guide

## Scope and evidence

This guide documents Ajay Duddi's redesigned portfolio on the `new` branch, and identified `src/data/portfolio.ts` as the authoritative source for personal details such as location and LinkedIn. Ask a focused question when the source and requested behavior conflict. Do not invent deployment details, credentials, API responses, personal facts, or the implementation of linked projects. Continue independent work while waiting for clarification.

### Branch and checkout distinction

- `main` contains the older BootstrapMade iPortfolio site. `new` is the SolidJS redesign described below.
- Preserve existing owner changes; inspect `git diff` before editing. The owner-approved local details include `2K+` students and the optional API field `'Company Logo'`, plus the full-width experience cards and responsive/reveal follow-up.
- Local modifications are not proof of a commit or deployment. The legacy SMTPjs form is intentionally disabled; the redesigned n8n contact form is active. Keep the two implementations distinct.

## What this repository builds

A single-page, client-rendered personal portfolio with eight sections, profile and career information, services, linked projects, coding statistics, and a contact form. Navigation uses section anchors; there is no client router.

The application uses **SolidJS**, TypeScript, Vite, GSAP, Tailwind CSS, and plain component stylesheets. `.tsx` filenames and references to React in portfolio content do not make the application React. Other projects' technology lists describe those external projects; their servers and source code are not part of this repository.

There is no local backend, database schema, authentication system, CMS implementation, server rendering, or n8n workflow export in the selected source tree. Remote webhooks and storage services provide part of the live content.

## Repository structure

```text
AGENTS.md                          Project memory and instructions
index.html                         Vite HTML shell, metadata, fonts, Font Awesome
package.json / package-lock.json   npm scripts, dependencies, locked versions
vite.config.ts                     Solid/Tailwind plugins, environment validation, production security policy
tsconfig*.json                     App/config TypeScript projects
.env.example                      Public API base configuration example
.nvmrc                            Node 24
README.md / SECURITY.md            Setup, checks, security implementation and server follow-up
.github/workflows/check.yml        Read-only CI checks and dependency audits
tests/*.test.ts                   Node regression tests (mocked requests)
.gitignore                        Dependencies, .env, editor and temporary files
public/
  favicon.jpg                     Browser icon
  icons/*.svg                     Local technology and service icons
src/
  main.tsx                        Solid render entry and global CSS import
  App.tsx                         Provider, page composition, shared animations
  vite-env.d.ts                   Vite client type reference
  data/portfolio.ts               DATA and local content interfaces
  context/PortfolioContext.tsx    Remote data signals and initial fetching
  services/portfolioApi.ts        API interfaces, env-based endpoints, contact submission
  services/portfolioValidation.ts Runtime validation of portfolio/coding API responses
  services/githubValidation.ts    GitHub date/count validation
  lib/apiConfig.ts                Public endpoint validation
  lib/request.ts                  Fetch deadlines and caller cancellation
  lib/urls.ts                     Safe navigation/image URLs and accent colors
  lib/contactValidation.ts        Contact input validation and length limits
  lib/securityPolicy.ts           Production CSP and response-header manifest
  lib/utils.ts                   cn(): clsx + tailwind-merge
  components/
    Navbar.tsx / Navbar.css       Fixed navigation and mobile menu
    Footer.tsx / Footer.css       Copyright year and social links
    ImageWithFallback.tsx        Scoped image reveal and accessible failed-image placeholder
    ui/shape-landing-hero.tsx     Current geometric hero and scoped GSAP motion
  sections/
    Hero.tsx                     Wrapper for HeroGeometric; no Hero.css import
    About.tsx / About.css
    Services.tsx / Services.css
    Projects.tsx / Projects.css
    Skills.tsx / Skills.css
    CodingProfile.tsx / CodingProfile.css
    Experience.tsx / Experience.css
    Contact.tsx / Contact.css
  styles/index.css               Tailwind directives, tokens, shared styles
```

`public` files are served from the site root: `public/icons/java.svg` becomes `/icons/java.svg`. They are not imported as TypeScript modules. The redesign does not contain the legacy `assets/` directory or downloadable résumé PDF.

The icon collection includes Angular, CSS3, Express, Figma, Git, HTML5, Java, JavaScript, Laravel, MongoDB, MySQL, n8n, Node.js, Python, React, Sim, Spring, TypeScript, and custom API/web-app/website icons. Several icons may be stored without being used by current content.

## Entry points and section ownership

`index.html` provides `#root` and loads `/src/main.tsx`. `main.tsx` calls Solid's `render`, imports `src/styles/index.css`, and mounts `App`. `App` wraps its children in `PortfolioProvider` and renders the following order:

| Component | Anchor | Responsibility and content source |
| --- | --- | --- |
| Navbar | Links to six sections | Initials from `DATA.profile.name`; menu and scroll state |
| Hero | `#hero` | Local name/title; API student statistic with local fallback; geometric UI component |
| About | `#about` | API bio, image, and statistics with local fallbacks; local email/location/social links |
| Services | `#services` | `DATA.services`; four cards including Training & Workshops |
| Projects | `#projects` | API projects only; no cards while data is absent or empty |
| Skills | `#skills` | `DATA.skills`, category grids, duplicated scrolling marquee |
| CodingProfile | `#coding` | GitHub graph, LeetCode/CodeChef statistics, coding-platform links |
| Experience | `#experience` | API-only full-width glass cards with responsive information columns; explicit loading/empty/error states |
| Contact | `#contact` | Local contact details and active n8n form |
| Footer | None | Local name/social links and current year |

The navbar labels are About, Services, Works, Skills, Experience, and Contact. Hero and CodingProfile exist without dedicated navbar entries. Keep section IDs and all CTA/nav anchors synchronized when editing.

## Content sources and data flow

### Local content

`src/data/portfolio.ts` exports `DATA`, plus `Project`, `Skill`, and `Service` interfaces. Experience uses the API interface. Change owner-approved personal details here, rather than scattering replacements across components or reviving older HTML/PDF details.

- `profile`: name, title, subtitle, bio, email, location, availability, social URLs, and fallback statistics.
- `services`: IDs, icon strings, titles, descriptions, feature lists, and accent colors.
- `skills`: names, icons, and categories `frontend`, `backend`, `tools`, or `languages`.

Projects and experience are fetched from the portfolio API. `DATA` has no `projects` or `experience` fields or local entry lists. The exported content interfaces remain available for typing rendered content.

The local statistic key is currently misspelled `studentsTrainted`. Hero/About already depend on that spelling. An API statistic uses `studentsTrained`, matched case-insensitively. Coordinate all consumers if renaming either key.

### Shared remote context

`PortfolioProvider` exposes **accessor functions**: `loading()`, `portfolioData()`, `leetcodeStats()`, and `codechefData()`. Consume them inside reactive expressions or `createMemo`; do not replace them with React hook patterns or capture nonreactive snapshots accidentally.

On mount, the provider runs three requests with `Promise.allSettled`. Fulfilled non-null portfolio data is stored after sorting projects by ascending `sort` and experience by descending `sort`; missing sort values default to zero. LeetCode and CodeChef results have their own signals. `loading` becomes false after all three settle. Profile and statistics can use local fallbacks. Projects render an empty list without data. Experience shows skeletons while loading, an unavailable message when the settled portfolio response is null, and an empty message when its list is missing or empty. Neither section has hardcoded entry fallbacks; section anchors remain available.

The required public `VITE_PORTFOLIO_API_BASE_URL` configures `BASE` in `.env` or the build environment. `.env.example` documents the current webhook prefix. Production requires HTTPS; localhost HTTP is allowed in development. Configuration is validated at startup/build. Contact shares this base. Do not add a hardcoded fallback.

| Request | URL | Expected handling |
| --- | --- | --- |
| Portfolio | `${BASE}/portfolio` | Array wrapper `[{ data: PortfolioApiResponse }]`; first object's `data` |
| LeetCode | `${BASE}/leetcode-profile` | `{ data: [{ difficulty, count }, ...] }`; normalize All/Easy/Medium/Hard counts |
| CodeChef | `${BASE}/codechef-profile` | Object containing `name`, `data`, and `badges` |

The portfolio interface includes `profile`, `socials`, `projects`, `experience`, `stats`, and `ttl`. Capitalized `Name` fields in profile/social/stat records are part of the declared API contract. TypeScript interfaces alone do not validate JSON. Runtime parsers validate the wrapper, normalize missing lists, filter malformed rows/counts and reject unsafe URL fields. Fetch helpers check HTTP status, use 15-second deadlines including JSON body reads, log a fixed unavailable message and return `null`. The provider aborts pending requests on unmount. There is no implemented TTL cache, polling or automatic retry. Do not describe `ttl` as an active caching mechanism.

Remote profile data does **not** replace every local field. Currently About consumes API bio/image; Hero/About consume API statistics; Projects/Experience consume remote lists; CodingProfile consumes matching API social links and HackerRank badge statistics. Navbar, Footer, Contact, Services, Skills, the hero name/title, and About's email/location/social links still read local `DATA`.

### Projects and experience transformations

`Projects.tsx` uses shared URL helpers to remove surrounding quote/backtick characters, restrict external navigation to HTTP(S) without credentials, and normalize remote image URLs to HTTPS. Supported image-only data URLs pass through; relative API images resolve against `https://rustfs-api.ajayduddi.site`. Invalid or absent project links become empty strings and their actions are hidden. Cards alternate image/content positions, show `longDescription || description`, and open external project/source links in new tabs.

Project images are lazy-loaded and use `referrerpolicy="no-referrer"`. About and Projects use `ImageWithFallback`: absent/failed URLs show an accessible visual placeholder rather than requesting nonexistent local files. A failed source is removed once; changing the source permits a fresh attempt. Experience retains its initials fallback and adaptive logo measurements.

`Experience.tsx` splits remote description strings on `-,` and newlines, trims whitespace, and drops only empty chunks. Each chunk is rendered as a complete plain-text paragraph. Work and education share one journey in the provider's sorted order. The optional `'Company Logo'` uses an adaptive tile: image natural dimensions determine its width, bounded between its height and a responsive maximum. Tile heights are 52.8px at 1024px and above, 48px at 600–1023px, and 43.2px below 600px (20% taller than the previous tiles); maximum widths are 180px, 144px, and 96px respectively. The width calculation includes existing padding and borders, while zero-minimum grid tracks and `object-fit: contain` keep the complete artwork inside the tile without distortion. Unmeasured images and loading skeletons use widths of 76.8px, 67.2px, and 57.6px; absent or failed images show initials in a square tile. Natural dimensions are measured on load or when an image is already complete, and measurements reset when its URL changes. Near-square images (aspect ratios 0.8–1.2) use tiles 15% taller than the base size; width limits and containment still apply. Duration text is displayed unchanged, including Present, without a separate Current status badge. Work/Education appears as an icon badge at the top right of the card header, using the existing Font Awesome resource and `.exp-badge` styling.

Every entry remains in normal document flow as a full-width shared `.glass-card`, using the standard 1200px container, dark section background, 20px card radius, and centered Journey / Experience & Education heading. Cards have a subtle purple surface tint, company headings reduced by 25% from the prior design, and a company/institution logo above a divider. Logo, company name, and type badge align vertically at the center whenever they share a row, including the 480–599px layout. Below 480px, the company name occupies a full header row beneath the logo and type badge to prevent crowding. At widths of 600px or above, the body has two columns in 40/60 proportions after the inter-column gap: the left column stacks duration above labelled position/qualification, and the right column contains descriptions under an Overview label and beside a vertical divider. Position/qualification values are left-aligned with a 16px gap after their uppercase labels. A decorative calendar icon accompanies dates except at 600–767px, where it is hidden to preserve date space. Below 1024px, the work Position label is visually hidden while remaining accessible, its value uses the full left-column width, and tenure-to-role spacing is 16px; the education Qualification label stays visible at 600px and above. Below 600px, Qualification is also visually hidden while remaining accessible, the degree value uses the full row width, and the description stacks beneath the left-column details with a horizontal divider. Loading skeletons use the same grouping, logo dimensions, and badge positions. Card padding is 40px on larger screens and 24px below 600px, with 28px and 24px card gaps respectively. All entries and complete descriptions remain available without chapter controls, overlapping panels, or internal scrolling.

Experience uses the shared `.fade-in` class and App IntersectionObserver for its heading and complete cards, matching the other sections with a once-only 700ms reveal from 40px below. Heading label/title stagger follows the shared styles; there are no separate GSAP heading, card, or content-group reveals. Card hover uses the shared `.glass-card` border and shadow styling from `src/styles/index.css`. Scheduled layout-refresh animation frames are cleaned up with the Solid lifecycle; font readiness refreshes ScrollTrigger only while the entries remain mounted. Logo size changes coalesce ScrollTrigger refreshes through a lifecycle-managed animation frame. Reduced motion keeps content visible and disables movement and skeleton shimmer. No additional API requests or dependencies are introduced.

### Coding statistics

`CodingProfile.tsx` independently fetches `https://github-contributions-api.jogruber.de/v4/Ajayduddi`. It sums valid nonnegative safe-integer yearly totals for the Statistics card and graphs the supplied daily contribution records within the past 365 UTC days, including today. The existing daily SVG line is retained, with weekly markers and five month/year ticks spanning the full time window. Runtime validation excludes malformed/invalid dates, negative/unsafe counts and old/future records; duplicate dates use the last returned valid record; sparse records retain their actual date positions without inventing missing-day counts. Zero-count and single-day data remain valid. The graph has explicit loading, empty, and unavailable states, with scoped GSAP match-media animation, animation-frame cleanup, and a 15-second request deadline with cancellation on unmount. The GitHub username is hardcoded independently of the configurable social URL.

LeetCode and CodeChef statistics come from the shared context. API social names are matched against platform names, otherwise local URLs are used. HackerRank badge statistics accept both `hackerankbadges` and `hackerrankbadges`, with local literal fallback `3`. Missing numeric platform data is displayed as `-` or zero. A failed or malformed GitHub response shows an unavailable message; an empty year window shows an empty message. The four platform link cards retain two columns on mobile and tablet, with smaller padding/type below 481px to fit narrow screens.

## Contact form and external services

The current form in `Contact.tsx` prevents normal submission, reads `user_name`, `user_email`, `subject`, and `message`, and POSTs JSON `{ name, email, subject, message }` through `sendContactMessage` to `${BASE}/portfolioEmail`.

It uses signals for `idle`, `loading`, `success`, and `error`, validates trimmed required strings, email/control characters and lengths, disables inputs/button while loading, prevents duplicate submissions, preserves input on failure and shows fixed safe error messages, resets the form on success, displays an animated success card, and returns to idle after four seconds or via Send Another. The 20-second request deadline, abort controller and reset timer are cleaned up on unmount; Send Another clears the old timer. Success currently means the webhook returned an OK HTTP response; the frontend does not independently verify email delivery.

Do not send a real contact message as part of routine verification. Use mocked responses for submission checks unless the owner explicitly authorizes a live message.

`@emailjs/browser` was removed because the webhook implementation does not use it. Existing ignored legacy email variables are unused and must never be copied into documentation, source, logs or commits. Only public configuration belongs in referenced `VITE_` values; these values become browser-visible at build time.

Production HTML has a resource CSP, no-referrer policy and a verified Font Awesome integrity hash. The build emits `security-headers.json`; Vite preview applies those headers locally, while the production host must apply them explicitly. See SECURITY.md for the server-side requirements.

Other runtime resources include Google Fonts (Inter and Playfair Display), Font Awesome 6.4.0 CSS from cdnjs, RustFS-hosted portfolio images, and Unsplash images. Their presence does not imply their service configuration or implementation is stored here.

## Design and animation conventions

- Global styles live in `src/styles/index.css`; components generally import an adjacent plain `.css` file. CSS is global, not CSS Modules. About and CodingProfile scope their statistic selectors to their sections to prevent shared class names from changing another section's layout or typography.
- Tailwind 4 uses `@tailwindcss/vite`, CSS `@theme` palette values and layered base resets. Keep global type/universal resets in the base layer so utilities remain effective; hero padding is explicitly preserved. Tailwind utilities are used especially in `shape-landing-hero.tsx` and `Hero.tsx`. `cn()` merges conditional class inputs with `clsx` and `tailwind-merge`.
- `.vscode/settings.json` loads `tailwindcss.custom-data.json` to recognize `@theme` in the CSS language service. Keep CSS validation enabled and preserve the Tailwind directive rather than replacing it to silence editor warnings. These two editor configuration files are shared; other local `.vscode` files remain ignored.
- Preserve the dark theme, glass cards, rounded surfaces, purple accent `--accent: #646cff`, restrained gradients, and typography unless the requested change revises the design.
- At tablet widths of 600–1023px, About's Clean Code Advocate badge aligns with the photo's right layout edge. At 600–900px, its right offset accounts for the centered 350px photo; mobile and desktop positioning remains unchanged. Positioning uses `right`, preserving the existing vertical float animation.
- All seven section main headings use the shared `.section-title` serif typography and `.gradient-text` accent, matching Contributions & Stats. About and Contact retain their layout-specific margins and line breaks. About and Contact descriptions share `.section-description` typography (1.1rem, 1.7 line height, secondary text color); both inherit centered alignment in their single-column layouts at 900px and below. About statistics use `space-around` distribution.
- Geometric hero shape dimensions are 55% of their original width and height below 640px, 75% at 640–1023px, and full size at 1024px and above. CSS custom properties and responsive Tailwind utilities change dimensions without competing with GSAP transforms. The hero heading is 36px on mobile, 60px on tablet, and 96px from 1024px; description text is 18px, 20px, and 24px respectively. Tablet spacing follows the compact mobile spacing, with larger heading/badge margins reserved for desktop.
- Base backgrounds are `#0a0a0a`, `#111111`, and `#1a1a1a`; the geometric hero uses `#030303`. Global container width is 1200px; Services expands its container to 1500px. Section padding defaults to 120px and falls to 80px below 768px.
- Important responsive cutoffs include 1100px for service columns, 1024px for skills/coding grids, 900px for the navbar overlay and several single-column sections, and 768/600/480px for smaller layouts. Tailwind hero breakpoints also apply.
- Icon values beginning `img:` mean image paths, e.g. `img:/icons/react.svg`; other values are Font Awesome classes. Keep icon renderers and asset paths compatible when adding content.
- `.fade-in` starts invisible. `App.tsx` uses one shared IntersectionObserver to add `.visible`, then unobserves revealed elements. It also reveals already-visible nodes immediately. New content needs observation or an explicit visible state to avoid staying hidden.
- Experience heading and complete cards use the shared `.fade-in` observer, including re-observation after API loading. Do not add separate GSAP opacity/transform reveals to those elements. Cards remain in normal document flow at every breakpoint; scoped reduced-motion styles keep all Experience content immediately visible and disable movement, transitions, and skeleton shimmer.
- GSAP/ScrollTrigger handle image reveals and geometric hero motion with per-component match-media cleanup. `ImageWithFallback` animates its wrapper once, leaving image hover transforms independent and excluding skill icons/company logos. Reduced motion keeps content visible; hero entrances and completed or viewed image/graph reveals do not replay when preferences change. App registers cleanup synchronously, cancels both deferred frames and disconnects its observer. Do not kill all global ScrollTriggers from one component. After API loading completes, `AnimationRefresher` uses two managed animation frames to reobserve replacement nodes and refresh ScrollTrigger, without resetting images. The shared observer uses threshold zero so very tall cards reveal on viewport entry.
- Navbar owns its scroll listener and reactive visibility: `.scrolled` starts after 50px; `.navbar--hidden` slides it away while scrolling down beyond 100px and scrolling up restores it. Never use Tailwind's `.hidden` for this transition. An open mobile menu keeps the navbar visible, locks body scrolling, focuses the first link in a managed animation frame, and cycles keyboard focus through the links and toggle. Escape returns focus to the toggle; choosing a link or resizing above 900px closes the menu. Cleanup restores the prior body overflow and cancels the focus frame. Menu opacity fades separately from visibility; link transitions target color only so inherited visibility cannot delay focus.
- Service cards use an outer `.service-reveal.fade-in` wrapper with transition staggering and an inner `.service-card.glass-card` for the 15px hover lift. Keep these transforms separate. Project actions wrap on narrow screens, project numbers use two-digit minimum padding, and their hover gradient clears the previous text fill.
- The coding graph's existing two-second draw starts once when its wrapper enters the viewport, including data arriving while visible. The skills marquee uses two equal nonshrinking groups and translates one complete group per 25-second loop; duplicate content is aria-hidden, hover pauses it, and reduced motion stops it.
- LeetCode progress widths are clamped to 0–100% and remain zero until their card reveals when motion is enabled. Reduced motion shows the final widths immediately. A valid zero GitHub total displays `0`; only loading/unavailable totals display `-`. Summary cards use their own platform classes, and icon-only profile links have accessible labels. Contact success is announced through `role="status"`.
- Follow Solid lifecycle patterns (`onMount`, `onCleanup`) for listeners, observers, timers, and animation resources. Existing cleanup is not proof that every animation is cleaned up correctly. Verify cleanup placement when changing delayed callbacks.

## Development and validation

Use npm and preserve `package-lock.json`. Node 24 is configured in `.nvmrc`; the minimum supported version is 22.12. Copy `.env.example` only if no `.env` exists, otherwise add its public key without overwriting private values. Scripts:

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
npm run audit
npm run audit:production
git diff --check
```

`npm run check` runs typechecking, Node regression tests and the build. Build alone only transpiles TypeScript. Tests use built-in Node mocks and perform no network requests/contact messages. There is no separate ESLint configuration. Vite dev/preview bind localhost by default; do not share development servers inadvertently. Tailwind 4 supports Safari 16.4+, Chrome 111+ and Firefox 128+.

The app TS configuration uses strict/no-unused checks, Solid JSX, and `@/* -> ./src/*`; Vite mirrors the alias. Do not introduce React, a router, another package manager, or a replacement build system for routine edits.

After UI/data changes, verify desktop/mobile layout, section anchors, mobile menu, image loads/fallbacks, and visibility after asynchronous content replacement. Exercise usable API data and failure/empty-list fallback behavior. If changing the contact form, check mocked loading/success/error transitions without sending messages. Report which checks ran and any existing failures separately from the change.

### Audit findings and practical limitations

- Security cleanup on 2026-10-06 upgrades the toolchain and patches the dependency tree; full and production-only npm audits report zero known vulnerabilities. Solid's Seroval/Seroval plugins are explicitly overridden to 1.6.8 until its declared ranges include patched releases. Re-run audits regularly.
- Removed unused EmailJS, the previous Hero stylesheet, stale React ESLint configuration, obsolete PostCSS/Tailwind configuration, the unused Experience interface and unused parallax animation. All active sections and public icons remain available.
- Regression tests cover malformed API data, URL schemes/credentials, env configuration, coding counts/dates, contact inputs, request deadlines/body reads, cancellation and production policy generation. Clean installation, build, both app/config typechecks, 13 Node tests and mocked responsive/contact/CSP browser checks pass. Isolated unmount checks confirm no remaining requests, observers, reset timers or element animations. Local dev/preview startup and generated preview response headers also pass.
- Responsive checks include 320, 390, 479, 480, 599, 600, 768, 900, 901, 1023, 1024 and 1440px: badge alignment, mobile Qualification hiding, no Current badge, shared reveals, delayed/empty/missing/failed API data, complete descriptions, logo fallbacks and mobile navigation. Hero migration comparisons additionally cover 639/640px and preserve shape dimensions, heading/description sizes and palette.
- Animation repair checks on 2026-10-07 pass in an isolated Chromium browser with mocked APIs at 320, 390, 768, 1024 and 1440px. Checks cover intermediate navbar/image/graph/card frames, image hover zoom, seamless marquee distance, delayed data, tall cards, empty/error states, broken images, motion preferences and scoped unmount cleanup. No live contact messages are sent.
- Repository follow-up on 2026-10-08 fixes service reveal/hover conflicts, mobile-menu visibility/focus timing and scroll locking, statistic style leakage, overflowing progress widths, zero contribution totals, project number hover fill and narrow action rows. TypeScript checks, 13 Node tests, production build, all 10 stylesheets through the VS Code CSS validator, and `git diff --check` pass. Mocked Chromium checks pass at 14 responsive widths (320–1440px), with intermediate motion checks at 320/390/768/1024/1440px, failure/empty/delayed data, broken images, keyboard navigation, contact states, reduced motion and unmount cleanup. `.nvmrc` and the shared Tailwind editor metadata are present. No new dependencies were added. A fresh npm audit remains pending because automatic approval review requires explicit authorization to send dependency metadata to `registry.npmjs.org`; the zero-vulnerability result above is dated 2026-10-06.
- Missing local fallback paths are removed. About/Projects show accessible placeholders and logo failures show initials. This does not create offline copies of remote portfolio images.
- The API `ttl` remains declared but unused. External uptime, CORS, workflow validation, rate limits, email delivery and production headers need real server/hosting evidence. See SECURITY.md for concrete acceptance steps.
- `.env` variants and generated `dist/` are ignored. README, security notes and a read-only GitHub Actions check workflow now exist. The workflow does not deploy. The exact hosting provider, live URL, deployment trigger and n8n/proxy management location remain unconfirmed; do not infer them from project/API domains.

## Where to make common changes

| Requested change | Start here | Related checks |
| --- | --- | --- |
| Profile/contact details and social URLs | `src/data/portfolio.ts` | Static consumers plus API override behavior |
| Services or skills | `src/data/portfolio.ts` | Icon path, category, card/grid/mobile layout |
| Projects or career entries | Remote portfolio data, API interfaces, consuming section | Sorting, loading/empty/failure behavior |
| Remote endpoint/response shape | `src/services/portfolioApi.ts` | Context accessors and section transformations |
| Page order / global motion | `src/App.tsx` | Section anchors, observers, replacement nodes |
| Hero content / appearance | `Hero.tsx`, `shape-landing-hero.tsx` | Tailwind classes, GSAP, mobile text/CTAs |
| Theme / shared spacing | `src/styles/index.css` | Global selector collisions and all sections |
| Section appearance | Matching section `.tsx` and `.css` | Existing responsive rules and animation classes |
| Coding metrics | `CodingProfile.tsx`, API service/context | Hardcoded username, missing-data states |
| Contact submission | `Contact.tsx` / `Contact.css` | JSON fields, webhook behavior, mocked states |
| Metadata, fonts, favicon | `index.html`, `public/` | Root-relative paths and external resources |

Keep edits scoped to the request and preserve existing user changes. Update this guide when architecture, commands, data contracts, or confirmed deployment details change. Remove resolved findings and obsolete checkout notes after checking the current repository, rather than keeping stale memory indefinitely.
