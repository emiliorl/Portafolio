# Build Phase Tracker

Living doc — updated every phase. See [PLAN.md](PLAN.md) for the full project plan.

Legend: ✅ done · 🔄 in progress · ⬜ planned · 🚫 blocked

## Current Phase

⬜ **Phase 6 — Accessibility & polish pass**
Contrast check against the marble/charcoal palette, keyboard-only walkthrough
(tab order, modal focus trap already built in Phase 4 — verify it end to end),
`prefers-reduced-motion` coverage, and general visual QA.

## Phase Log

| # | Phase | Status | Branch commit |
|---|---|---|---|
| 0 | Repo scaffolding (README, .gitignore) | ✅ | `00616f5` |
| 1 | Design tokens (marble/ivory + terracotta/olive/brass, type, grain/vignette) | ✅ | `fdfc420` |
| 2 | HTML shell + component/sandbox CSS | ✅ | `742f7a9` |
| 3 | Project data layer + placeholder screenshots | ✅ | `6caccf0` |
| 4 | Interactivity — render/filter/search, modal manager, web/device previews, Pyodide sandbox, GitHub live sync | ✅ | `85ac8c0` |
| 5 | Tech-stack icon set (`assets/icons/`, wired into pills + Earlier Work) | ✅ | — |
| 6 | Accessibility & polish pass (contrast, focus order, reduced-motion) | 🔄 | — |
| 7 | Real asset swap-in (placeholder → real screenshots) | 🚫 blocked on user | — |

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
