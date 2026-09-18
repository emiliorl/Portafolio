# Portfolio — Project Plan

Living reference for anyone working on this repo. This is the **resolved** plan —
open questions and back-and-forth from planning live in git history / the
original Antigravity plan doc; this file states what we're actually building.

## Goal

A minimalist, zero-dependency static portfolio for Emilio Ramirez, showcasing
full-stack ability across Python, web (TypeScript/JS), and Kotlin/Android —
with **live, runnable** demos rather than static screenshots wherever feasible.

## Visual Identity — Neo-Classical Retro / Film-Stock

Confirmed direction (2026-09-02), replacing an earlier cyberpunk/glassmorphism draft:

| Token | Light (default) | Dark ("unlit gallery") |
|---|---|---|
| Surface | `#EFE9DD` ivory marble | `#211D1A` charcoal |
| Ink | `#211D1A` | `#F2ECE0` |
| Accent — terracotta | `#B5502E` | same |
| Accent — olive | `#6E7350` | same |
| Accent — brass | `#B08D3E` | same |

- Serif display type (`Playfair Display`) for headings — "carved inscription" feel; `Space Grotesk` body; `JetBrains Mono` for code.
- Grain (SVG turbulence overlay) + vignette instead of neon glow; hover states use a warm halation, not a cyan/purple glow.
- Matte "stone tablet" cards — hairline borders, soft warm shadow, no `backdrop-filter` dependency.
- All tokens live in [css/main.css](css/main.css); components in [css/components.css](css/components.css); modal/sandbox chrome in [css/sandbox.css](css/sandbox.css).

## Architecture

Zero build step — vanilla HTML5 / CSS3 custom properties / ES6 modules, deployable to GitHub Pages directly.

```
index.html
css/{main,components,sandbox}.css
js/
  app.js               bootstrap, render, filter/search, theme toggle
  projects-data.js      project registry (see file header for conventions)
  github-service.js     live GitHub stars/forks + localStorage cache
  sandbox-runner.js     Pyodide Python sandbox (lazy-loaded)
  device-preview.js     web viewport switcher + phone-frame carousel
  modal-manager.js      modal lifecycle, focus trap, tabs
assets/
  icons/                tech-stack medallion icons
  screenshots/           project media (placeholders until swapped)
```

## Project Registry

**Primary Feature grid** (full sandbox/preview treatment) — `js/projects-data.js`:

| Project | Category | Capability | Notes |
|---|---|---|---|
| IxMaOperations | Web | Live web embed | TypeScript, deployed at www.ixmaoperations.com |
| Multi-Agent-Clinical-Auditor | Python | Notebook + Report | No longer a live sandbox (dropped per user request, 2026-09-17) — shown as a real screenshot of the project's own `reports/dashboard.html`, rendered with synthetic sample data, same static-report treatment as the notebook projects below. The real CrewAI/LiteLLM pipeline needs a live LLM API key, so it was never runnable client-side anyway |
| Mindful | Android | Device preview | Kotlin / Jetpack Compose, Accessibility API. Supersedes an earlier project, MindShield (folded into this single entry — no separate MindShield card) |
| Generative Models Trio | Python | Notebook + Report | VAE/DCGAN/Diffusion compared. Card media composited from the notebooks' own real output cells |
| Cat/Dog CNN Comparison | Python | Notebook + Report | Card media is the notebook's actual training-curves output cell |
| Hybrid ALPR | Python | Notebook + Report | No hosted demo yet — "lighter" static-report treatment, same as the two notebook repos above. Card media is a real slide from the project's own report |
| codigogt | Web (Full-Stack) | Live web embed | Deployed at codigogt.vercel.app; **source repo is still private** (no GitHub stats/code link), but the live app embeds the same way as IxMaOperations |

**Earlier Work strip** (link-only, no sandbox) — 2021 student projects: `Pro-Ctrl-Back-End`, `Pro-Ctrl-Front-End`, `DBSTermProject`, `GestorDeHoteles`, `torneoDeportes-Back-End`, `VentaOnline`, `Calculator`. (Corrected against the live GitHub API — several were mislabeled "Java" in early planning; they're JavaScript/HTML.)

Other private repos exist but are intentionally excluded until the user finishes polishing them — `projects-data.js`'s arrays are the single place to add a finished project later; no structural change needed.

## Key Constraints (learned during planning — don't re-break these)

1. **No secrets client-side, ever.** This is why the Pyodide sandbox concept was always a synthetic-data demo, never the real LLM pipeline — an API key can't be embedded in browser JS on a public site. (As of 2026-09-17 no card actually uses the sandbox capability — see #2.)
2. **The Pyodide sandbox (`js/sandbox-runner.js`, `capability: "sandbox"`) is currently unattached from every project**, dropped from the clinical-auditor card per user request in favor of the same static-report treatment as the notebook projects. The infrastructure is intentionally kept, not deleted — lazy-loads only on first click, costs nothing while unused, and is one `capability: "sandbox"` + a `sandbox: { runtime: "pyodide", demoCode }` object away from being reattached to a future Python project. If it's still unused after a few more phases, revisit whether to remove it instead.
3. **All asset/script paths are relative** (`./css/...`, not `/css/...`) — the site serves from a GitHub Pages *project* subpath (`/Portafolio/`), not domain root.
4. **GitHub API calls are cached** in `localStorage` (1hr TTL) before re-hitting the network — unauthenticated rate limit is 60 req/hr.
5. **Private repos get no live GitHub sync** — `github-service.js` skips any project with `isPrivate: true` or no `github` URL. That's independent of whether the *deployed app* can be embedded live: `codigogt` has a private source repo (no stats, no code link) but a public live URL, so it still gets `capability: "webEmbed"` — private source and live-embeddable are separate axes, not one flag.
6. **Placeholder screenshots follow a fixed naming convention** (`assets/screenshots/<project-id>-NN.<ext>`) so swapping in real ones is a pure file replace — see the header comment in `js/projects-data.js` for which projects currently have real assets vs. placeholders.

## Verification Checklist (re-run this after any structural change)

- [ ] Serve locally (`python -m http.server`), load with zero console errors
- [ ] Category filters + search narrow the grid correctly
- [ ] Every modal type currently in use opens correctly: web preview (viewport switcher + fallback, including a private-source-but-public-live project), device carousel (tabs + prev/next), notebook/report details. If any project has `capability: "sandbox"`, also verify it actually **runs** and produces stdout — none does as of 2026-09-17, but the code path isn't deleted (see Key Constraints #2), so re-check this the moment one does.
- [ ] Modal: `Esc` closes, focus traps inside while open, focus restores to the trigger on close
- [ ] GitHub star/fork sync resolves without blocking first paint
- [ ] Responsive at ~375–390px mobile width and desktop
- [ ] Light and dark theme both readable (contrast, borders)
- [ ] All paths resolve when served from a subpath, not just root

## Branching Workflow

Work happens on `dev`; `main` only receives snapshots from `dev` after the
checklist above passes. See [PHASE.md](PHASE.md) for what's in flight right now.
