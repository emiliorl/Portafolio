# Build Phase Tracker

Living doc — updated every phase. See [PLAN.md](PLAN.md) for the full project plan.

Legend: ✅ done · 🔄 in progress · ⬜ planned · 🚫 blocked

## Current Phase

⬜ **Phase 7 — Real asset swap-in** (🚫 partially blocked on user)
`ixmaoperations-01`, `codigogt-01`, and `mindful-01/-02/-03` are still
placeholders — no real assets found for these yet (see Phase 8 notes: Mindful
specifically was searched for and confirmed unavailable, not skipped).
Everything else got a real asset in Phase 8.

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
| 7 | Real asset swap-in (placeholder → real screenshots) | 🔄 partial | — |
| 8 | Registry corrections + 3 new notebook projects + real assets | ✅ | — |
| 9 | URL fixes + drop the Clinical Auditor sandbox | ✅ | — |

**Phase 9** (2026-09-17):
- `IxMaOperations` `liveUrl` → `https://www.ixmaoperations.com/` (user-supplied, corrects Phase 8's `ixmaoperations.com` without the `www`).
- `codigogt` `liveUrl` → `https://codigogt.vercel.app/` (root, not `/directorio` — user-supplied).
- Multi-Agent-Clinical-Auditor: dropped `capability: "sandbox"` per user request ("doesn't need the sandbox anymore, let's just use the screenshots same as mindful") — moved to `capability: "notebook"`, the same static-report treatment as the 3 Phase-8 notebook projects (single real screenshot + description + requirements, no interactivity). Removed the now-dead `sandbox: {...}` block and the `AUDITOR_DEMO_CODE` constant it referenced.
- **Judgment call, not explicitly requested — flagging it**: the Pyodide sandbox *infrastructure* (`js/sandbox-runner.js`, `capability: "sandbox"` in the `CAPABILITY` registry, the terminal/code-editor CSS in `css/sandbox.css`) was **not** deleted, even though zero projects use it now. Reasoning: it's a real, tested technical capability (in-browser WASM Python execution) worth keeping available rather than a stale leftover — it lazy-loads and costs nothing while unattached, and reattaching it to a future Python project is a two-field change (`capability: "sandbox"` + a `sandbox: { runtime, demoCode }` object). If you'd rather it were gone entirely, say so and it comes out along with its CSS/import.
- Verified in-browser: the auditor card now shows "📓 View Report" / "📓 Notebook + Report" (not "▶ Launch Sandbox"), and the modal opens the real dashboard screenshot with updated copy — no sandbox UI anywhere.

**Phase 8** (2026-09-17):
- Fixed `IxMaOperations` `liveUrl` (was pointing at the old `.vercel.app`
  domain instead of `ixmaoperations.com`).
- Upgraded `codigogt` from `capability: "manual"` (hand-typed placeholder
  card) to `"webEmbed"` — it's live at `codigogt.vercel.app/directorio`.
  Verified in-browser: the real "Directorio Político" app renders inside the
  preview modal. Source repo is still private (confirmed via the GitHub API —
  no public `codigogt` repo exists), so `github` stays `null` and there's
  still no code link/stats; private-source and live-embeddable turned out to
  be independent, not one flag (see PLAN.md Key Constraints #5).
- Swapped in a **real** screenshot for Multi-Agent-Clinical-Auditor: found the
  project's actual `reports/dashboard.html` in the user's local repo download,
  fed it a small synthetic `patients.json` (schema reverse-engineered from the
  dashboard's own `loadData()`; no real patient data, same no-secrets rule as
  the sandbox demo) and screenshotted the real rendered UI.
- **Mindful**: searched for real screenshots (Downloads root, the MindShield
  source dump, `Mindshield.pdf`) — the PDF is a 4-page text-only report with
  no UI mockups, and no file anywhere is actually named "Mindful". No real
  asset exists yet; still a placeholder, flagged rather than faked.
- Merged `MindShield` into `Mindful` as a single registry entry per the user's
  correction ("only leave mindful and remove mindshield because mindful
  builds on the previous project mindshield") — not a dual v1/v2 card, a
  straight replacement. Deleted the now-orphaned `mindshield-0{1,2,3}.svg`.
- Added 3 new Primary Feature projects — `Generative-Models-Trio`,
  `Cat/Dog-CNN-Comparison`, `Hybrid-ALPR` — all under a new `capability:
  "notebook"` type (📓, static report image, no interactivity; `app.js` now
  has an explicit branch for it instead of falling through to the generic
  "Details" button). All three got **real** card images, not generated
  placeholders:
  - CatDog CNN: the notebook's own training-curves output cell, extracted
    directly from the `.ipynb` JSON (`cell.outputs[].data["image/png"]`).
  - Generative Models Trio: composited from the VAE/GAN/Diffusion notebooks'
    own final-sample output cells (one panel each) — chosen deliberately
    over a placeholder because the real quality progression (blurry VAE →
    crisp diffusion) *is* the point of the project.
  - Hybrid ALPR: pulled from the user's own presentation deck
    (`Hybrid_ALPR_Presentation/`), but the **architecture slide**, not the
    **results slide** — the deck's results slide shows stale numbers
    (91.3%/84.7%) that don't match the repo README's current, correct ones
    (96.1%/80.6%, already what the drafted description cited); using the
    results slide would have put contradicting numbers right next to each
    other on the same card.
  - Both composited/wide images were letterboxed to the card's 16:10 aspect
    so the thumbnail crop doesn't cut into the outer panels.

## Older Phase Notes

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
