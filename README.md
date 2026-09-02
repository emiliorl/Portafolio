# Portafolio

Emilio Ramirez's personal portfolio — a zero-dependency, static HTML/CSS/ES6 site showcasing
projects across web, Python, and Kotlin/Android, with live client-side sandboxes.

## Stack

- Vanilla HTML5 / CSS3 (custom properties, no build step) / ES6 modules
- [Pyodide](https://pyodide.org) (WASM) for the in-browser Python sandbox, lazy-loaded on demand
- GitHub REST API for live repo stats, with a local fallback registry + `localStorage` cache

## Local development

No build step. Serve the directory with any static file server (ES modules require `http(s)://`,
not `file://`):

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Structure

```
index.html                 Entry point
css/
  main.css                 Design tokens (marble/ivory + terracotta/olive/brass, type, grain)
  components.css           Cards, badges, device frames, modals
  sandbox.css              Terminal/code viewer/viewport-switcher styles
js/
  app.js                   Bootstrap, filtering, search
  projects-data.js         Project registry (see file header for the placeholder-asset convention)
  github-service.js        Live GitHub metadata + cache
  sandbox-runner.js        Pyodide Python sandbox
  device-preview.js        Responsive viewport + phone frame
  modal-manager.js         Modal lifecycle
assets/
  icons/                   Tech stack SVGs
  screenshots/             Project screenshots (placeholders until swapped for real ones)
```

## Branching

Development happens on `dev`; `main` only receives verified, working snapshots from `dev`.
