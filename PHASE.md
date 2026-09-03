# Build Phase Tracker

Living doc — updated every phase. See [PLAN.md](PLAN.md) for the full project plan.

Legend: ✅ done · 🔄 in progress · ⬜ planned · 🚫 blocked

## Current Phase

⬜ **Phase 7 — Real asset swap-in** (🚫 blocked on user)
Waiting on real screenshots for the Primary Feature projects and any
finished private repos the user wants added. See the placeholder-asset
convention documented in `js/projects-data.js`.

## Phase Log

| # | Phase | Status | Branch commit |
|---|---|---|---|
| 0 | Repo scaffolding (README, .gitignore) | ✅ | `00616f5` |
| 1 | Design tokens (marble/ivory + terracotta/olive/brass, type, grain/vignette) | ✅ | `fdfc420` |
| 2 | HTML shell + component/sandbox CSS | ✅ | `742f7a9` |
| 3 | Project data layer + placeholder screenshots | ✅ | `6caccf0` |
| 4 | Interactivity — render/filter/search, modal manager, web/device previews, Pyodide sandbox, GitHub live sync | ✅ | `85ac8c0` |
| 5 | Tech-stack icon set (`assets/icons/`, wired into pills + Earlier Work) | ✅ | — |
| 6 | Accessibility & polish pass (contrast, focus order, skip link, reduced-motion) | ✅ | — |
| 7 | Real asset swap-in (placeholder → real screenshots) | 🚫 blocked on user | — |

**Phase 6 findings & fixes** (contrast computed via the WCAG relative-luminance
formula, not eyeballed):
- `.viewport-switcher` pressed button (white text on brass) measured **2.9:1** —
  real AA failure. Fixed by using a fixed dark ink on brass fills instead
  (`--ink-on-accent`), since the brass/olive/terracotta accents don't flip
  between themes but white text on them can fail either way.
- Added `--accent-{terracotta,olive,brass}-text` tokens (theme-aware, ≥4.5:1
  against both surface levels) for every place an accent colors *small running
  text* — eyebrow, nav/footer link hover, pill labels, active modal tab. The
  raw `--accent-*` tokens stay for large/decorative use (buttons, borders, dots)
  where the non-text 3:1 threshold applies instead.
- Darkened `--ink-2` (`#7A7062` → `#71685B`) — was 4.02:1 on surface-0, under
  the 4.5:1 small-text requirement.
- Skip-link was using `.visually-hidden`, which never reappears — added a
  dedicated `.skip-link` class that's off-screen by default and shows on
  `:focus`.
- Theme toggle now reflects state via `aria-pressed` + a state-describing
  `aria-label`, instead of a static "Toggle dark mode".
- Icon-prefixed buttons (Launch Sandbox, Inspect, etc.) had raw emoji in the
  accessible name (e.g. "▶ Launch Sandbox" read as "play button Launch
  Sandbox"); wrapped the icon in `aria-hidden` so only the label is announced.
- Modal tabs now follow the full WAI-ARIA tabs pattern — `role="tabpanel"`,
  `aria-controls`/`aria-labelledby`, roving `tabindex` + arrow-key navigation
  — and the modal's focus-trap query was fixed to actually respect
  `tabindex="-1"` (it previously trapped focus on inactive tab buttons too)
  and to include `<summary>` (natively focusable, wasn't matched before).
- Removed dead `.endpoint-item`/`.endpoint-list` CSS — leftover from the
  original "Backend Simulator" idea that Review Notes #1/#6 retired in favor
  of the Earlier Work strip; no JS ever created these elements.

Verified in a headless browser: contrast fixes render correctly (brass
pressed-button screenshot confirms dark-on-brass), ARIA tabs pattern
(arrow-key nav, roving tabindex, panel wiring) works end to end, theme
toggle's `aria-pressed`/`aria-label` sync on click. The `.skip-link:focus`
CSS rule was verified by direct stylesheet inspection rather than a live
screenshot — headless Puppeteer's page never receives real OS-level focus
(`document.hasFocus()` is false even after `element.focus()`), so `:focus`
never visually engages in that environment regardless of correctness.

Phase 4 was verified in a headless browser before merging to `main`: filtering,
search, modal focus-trap/Esc, device carousel + tabs, web viewport switcher
(against the live `ixmaoperations.vercel.app`), GitHub star/fork sync, and —
the one with real execution risk — the Pyodide sandbox actually ran and
printed real stdout (~2.9s cold boot).

Phase 5 verified: all 16 icon references resolve (11 unique SVGs under
`assets/icons/`), confirmed by screenshot in both the Primary Feature grid
and the Earlier Work strip.

## Workflow Reminder

All work happens on `dev`. Before merging a phase into `main`:
1. Run the Verification Checklist in [PLAN.md](PLAN.md).
2. Update this file's Phase Log row (status + commit) and move "Current Phase" forward.
3. `git checkout main && git merge dev --no-ff` (or fast-forward if trivial), then push both branches.
