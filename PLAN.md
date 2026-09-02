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
| IxMaOperations | Web | Live web embed | TypeScript, deployed at ixmaoperations.vercel.app |
| Multi-Agent-Clinical-Auditor | Python | Pyodide sandbox | Runs a self-contained synthetic-data demo, **not** the real CrewAI/LiteLLM pipeline (that needs a live API key — never embedded client-side) |
| Mindful | Android | Device preview | Kotlin / Jetpack Compose |
| MindShield | Android | Device preview | Kotlin, Accessibility API |
| codigogt | Web (Full-Stack) | Manual entry | **Private repo** — no live GitHub sync, source, or sandbox is possible; hand-authored description + placeholder screenshots |

**Earlier Work strip** (link-only, no sandbox) — 2021 student projects: `Pro-Ctrl-Back-End`, `Pro-Ctrl-Front-End`, `DBSTermProject`, `GestorDeHoteles`, `torneoDeportes-Back-End`, `VentaOnline`, `Calculator`. (Corrected against the live GitHub API — several were mislabeled "Java" in early planning; they're JavaScript/HTML.)

Other private repos exist but are intentionally excluded until the user finishes polishing them — `projects-data.js`'s arrays are the single place to add a finished project later; no structural change needed.

## Key Constraints (learned during planning — don't re-break these)

1. **No secrets client-side, ever.** The clinical-auditor sandbox runs a trimmed pure-Python demo, not the real LLM pipeline, specifically to avoid needing an API key in browser JS.
2. **Pyodide loads lazily**, only on first "Launch Sandbox" click — not on page load. It's several MB; loading it eagerly would defeat the "fast static site" premise.
3. **All asset/script paths are relative** (`./css/...`, not `/css/...`) — the site serves from a GitHub Pages *project* subpath (`/Portafolio/`), not domain root.
4. **GitHub API calls are cached** in `localStorage` (1hr TTL) before re-hitting the network — unauthenticated rate limit is 60 req/hr.
5. **Private repos get no live sync** — `github-service.js` skips any project with `isPrivate: true` or no `github` URL.
6. **Placeholder screenshots follow a fixed naming convention** (`assets/screenshots/<project-id>-NN.svg`) so swapping in real ones is a pure file replace — see the header comment in `js/projects-data.js`.

## Verification Checklist (re-run this after any structural change)

- [ ] Serve locally (`python -m http.server`), load with zero console errors
- [ ] Category filters + search narrow the grid correctly
- [ ] Every modal type opens: Pyodide sandbox (and actually **runs**, producing stdout), web preview (viewport switcher + fallback), device carousel (tabs + prev/next), manual details (private repo)
- [ ] Modal: `Esc` closes, focus traps inside while open, focus restores to the trigger on close
- [ ] GitHub star/fork sync resolves without blocking first paint
- [ ] Responsive at ~375–390px mobile width and desktop
- [ ] Light and dark theme both readable (contrast, borders)
- [ ] All paths resolve when served from a subpath, not just root

## Branching Workflow

Work happens on `dev`; `main` only receives snapshots from `dev` after the
checklist above passes. See [PHASE.md](PHASE.md) for what's in flight right now.
