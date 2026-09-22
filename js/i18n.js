/**
 * i18n.js — minimal English/Spanish string dictionary + language state.
 *
 * Static markup is translated via `data-i18n` (textContent) / `data-i18n-attr`
 * (a comma-separated list of `attr:key` pairs) attributes, applied by
 * `applyStaticTranslations()`. JS-built DOM (cards, modals, etc.) calls `t()`
 * directly at build time. Modules that need to react to a language switch
 * (app.js re-rendering the grid) subscribe with `onLangChange`.
 */

const STORAGE_KEY = "portfolio:lang";

export const STRINGS = {
  en: {
    skipToContent: "Skip to content",
    navWork: "Work",
    navEarlierWork: "Earlier Work",
    navGithub: "GitHub",
    themeToggleLabel: "Toggle dark mode",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    langToggleLabel: "Switch to Spanish",
    eyebrow: "Full-Stack Developer",
    heroTitle: "Real projects, real code. See how they actually work.",
    heroLede:
      "A working showcase of Python, web, and Android projects. Preview live " +
      "web apps at any viewport, or step through a mobile app's screens. No " +
      "install required.",
    browseProjects: "Browse Projects",
    viewGithubProfile: "View GitHub Profile",
    searchLabel: "Search projects",
    searchPlaceholder: "Search projects…",
    filterAll: "All",
    filterPython: "Python",
    filterWeb: "Web",
    filterAndroid: "Android",
    earlierWorkHeading: "Earlier Work",
    earlierWorkLede: "Early student projects — kept for context, not actively maintained.",
    footerEmail: "Email",

    deviceRequirements: "Device & System Requirements",
    launchSandbox: "Launch Sandbox",
    launchPreview: "Launch Preview",
    inspect: "Inspect",
    viewReport: "View Report",
    details: "Details",
    viewCode: "View Code",
    privateRepository: "🔒 Private repository",
    githubSyncing: "GitHub · syncing…",
    noMatch: "No projects match that search/filter.",
    projectPreviewAlt: "preview",
    projectScreenshotAlt: "screenshot",

    modalSandboxSuffix: "Sandbox",
    modalPreviewSuffix: "Live Preview",
    modalDeviceSuffix: "Device Preview",
    modalReportSuffix: "Report",
    modalDetailsSuffix: "Details",
    tabScreens: "Screens",
    tabArchitecture: "Architecture & Requirements",
    closeDialog: "Close dialog",

    openLiveSite: "Open Live Site ↗",
    openLiveUrl: "Open Live URL ↗",
    viewportLabel: "Viewport size",
    refresh: "Refresh",
    viewportDesktop: "Desktop",
    viewportTablet: "Tablet",
    viewportMobile: "Mobile",
    iframeBlockedNote:
      "This site sends X-Frame-Options: DENY, so it can't be embedded in an iframe anywhere, by design — not a bug in this preview. Showing a real screenshot instead.",
    iframeFallbackNote: "This site may restrict iframe embedding — showing a screenshot instead.",
    livePreviewOf: "Live preview of",

    prevScreen: "Previous screen",
    nextScreen: "Next screen",
    screenOf: (i, n) => `Screen ${i} of ${n}`,

    sandboxIdle: "Idle — click Run",
    runCode: "▶ Run",
    pythonCodeLabel: "Python code — editable",
    sandboxReadyLine: "$ ready. click Run to execute in an in-browser Python runtime (Pyodide/WASM).",
    bootingRuntime: "Booting Python runtime…",
    bootingRuntimeLine: "$ booting pyodide (first run only, cached after)…",
    running: "Running…",
    runningLine: "$ running…",
    doneIn: (ms) => `Done in ${ms}ms`,
    doneInLine: (ms) => `$ done in ${ms}ms`,
    errorSeeOutput: "Error — see output",
  },
  es: {
    skipToContent: "Saltar al contenido",
    navWork: "Proyectos",
    navEarlierWork: "Trabajo Anterior",
    navGithub: "GitHub",
    themeToggleLabel: "Alternar modo oscuro",
    switchToLight: "Cambiar a tema claro",
    switchToDark: "Cambiar a tema oscuro",
    langToggleLabel: "Cambiar a inglés",
    eyebrow: "Desarrollador Full-Stack",
    heroTitle: "Proyectos reales, código real. Descubre cómo funcionan de verdad.",
    heroLede:
      "Una muestra funcional de proyectos en Python, web y Android. Previsualiza " +
      "apps web en vivo en cualquier tamaño de pantalla, o recorre las pantallas " +
      "de una app móvil. Sin necesidad de instalar nada.",
    browseProjects: "Ver Proyectos",
    viewGithubProfile: "Ver Perfil de GitHub",
    searchLabel: "Buscar proyectos",
    searchPlaceholder: "Buscar proyectos…",
    filterAll: "Todos",
    filterPython: "Python",
    filterWeb: "Web",
    filterAndroid: "Android",
    earlierWorkHeading: "Trabajo Anterior",
    earlierWorkLede: "Proyectos universitarios tempranos — conservados como contexto, sin mantenimiento activo.",
    footerEmail: "Correo",

    deviceRequirements: "Requisitos del Dispositivo y del Sistema",
    launchSandbox: "Iniciar Sandbox",
    launchPreview: "Iniciar Vista Previa",
    inspect: "Inspeccionar",
    viewReport: "Ver Informe",
    details: "Detalles",
    viewCode: "Ver Código",
    privateRepository: "🔒 Repositorio privado",
    githubSyncing: "GitHub · sincronizando…",
    noMatch: "Ningún proyecto coincide con esa búsqueda o filtro.",
    projectPreviewAlt: "vista previa",
    projectScreenshotAlt: "captura de pantalla",

    modalSandboxSuffix: "Sandbox",
    modalPreviewSuffix: "Vista Previa en Vivo",
    modalDeviceSuffix: "Vista Previa del Dispositivo",
    modalReportSuffix: "Informe",
    modalDetailsSuffix: "Detalles",
    tabScreens: "Pantallas",
    tabArchitecture: "Arquitectura y Requisitos",
    closeDialog: "Cerrar diálogo",

    openLiveSite: "Abrir Sitio en Vivo ↗",
    openLiveUrl: "Abrir URL en Vivo ↗",
    viewportLabel: "Tamaño de pantalla",
    refresh: "Actualizar",
    viewportDesktop: "Escritorio",
    viewportTablet: "Tableta",
    viewportMobile: "Móvil",
    iframeBlockedNote:
      "Este sitio envía X-Frame-Options: DENY, por lo que no puede incrustarse en un iframe en ningún lugar — así está diseñado, no es un error de esta vista previa. Se muestra una captura de pantalla real en su lugar.",
    iframeFallbackNote: "Este sitio podría restringir la incrustación en iframe — se muestra una captura de pantalla en su lugar.",
    livePreviewOf: "Vista previa en vivo de",

    prevScreen: "Pantalla anterior",
    nextScreen: "Pantalla siguiente",
    screenOf: (i, n) => `Pantalla ${i} de ${n}`,

    sandboxIdle: "Inactivo — clic en Ejecutar",
    runCode: "▶ Ejecutar",
    pythonCodeLabel: "Código Python — editable",
    sandboxReadyLine: "$ listo. clic en Ejecutar para correr en un runtime de Python en el navegador (Pyodide/WASM).",
    bootingRuntime: "Iniciando runtime de Python…",
    bootingRuntimeLine: "$ iniciando pyodide (solo la primera vez, luego queda en caché)…",
    running: "Ejecutando…",
    runningLine: "$ ejecutando…",
    doneIn: (ms) => `Listo en ${ms}ms`,
    doneInLine: (ms) => `$ listo en ${ms}ms`,
    errorSeeOutput: "Error — ver salida",
  },
};

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
  } catch {
    /* localStorage unavailable — fall back to browser language */
  }
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

let currentLang = detectInitialLang();
const listeners = new Set();

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (lang !== "en" && lang !== "es") return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* non-fatal */
  }
  document.documentElement.setAttribute("lang", lang);
  listeners.forEach((cb) => cb(lang));
}

/** @param {(lang: string) => void} cb */
export function onLangChange(cb) {
  listeners.add(cb);
}

/** @param {string} key */
export function t(key, ...args) {
  const entry = STRINGS[currentLang]?.[key] ?? STRINGS.en[key];
  return typeof entry === "function" ? entry(...args) : entry;
}

/** Applies `data-i18n` (textContent) and `data-i18n-attr` (attr:key[,attr:key]) to the document. */
export function applyStaticTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(",").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
  document.documentElement.setAttribute("lang", currentLang);
}
