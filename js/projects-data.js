/**
 * projects-data.js — project registry
 *
 * PLACEHOLDER ASSET CONVENTION (confirmed with user, 2026-09-02):
 * Every `media` path points to `assets/screenshots/<project-id>-NN.<ext>`.
 * Swapping in a real asset is a pure file replace — keep the same filename
 * (or update the path here) and no other code changes are needed.
 * As of 2026-09-17, real assets are in for:
 *   - multi-agent-clinical-auditor-01.png — the project's actual reports/dashboard.html,
 *     rendered with synthetic sample data (no real patient data; API keys are never
 *     involved — see Review Notes #2)
 *   - hybrid-alpr-01.png        — the CRNN architecture slide from the project's own report
 *   - generative-models-trio-01.png — composited from the notebooks' real output cells
 *     (VAE/DCGAN/Diffusion generated samples)
 *   - catdog-cnn-comparison-01.png  — the notebook's actual training-curves output cell
 *   - mindful-01..06.png        — the project's own screenshots/*.png from its GitHub repo
 *   - ixmaoperations-01.png     — real screenshot of the live site (it blocks iframe
 *     embedding — see `embeddable` below — so this is what actually shows in the preview)
 * Still placeholder, pending a real asset from the user:
 *   - codigogt-01
 *
 * `embeddable: false` (webEmbed projects only): there is NO reliable way to
 * detect an X-Frame-Options/CSP frame-ancestors block from inside the page —
 * a blocked iframe and a successfully-loaded one are indistinguishable via
 * JS (confirmed empirically, see PHASE.md). So this is a manually-verified
 * flag, not auto-detected: check with `curl -I <url>` for `x-frame-options`
 * or `content-security-policy: frame-ancestors`, and set it if present. When
 * true (the default), `buildWebPreview` still attempts the iframe with a
 * best-effort timeout fallback. See `js/device-preview.js`.
 *
 * TECH-STACK ICONS: each `languages`/earlierWork entry may carry an `icon`
 * slug matching a file under `assets/icons/<slug>.svg` (medallion-style,
 * generated — see PHASE.md Phase 5). Omit `icon` to render a text-only pill.
 *
 * TIERING (Review Notes #6, confirmed): only finished, recent work is listed
 * as a Primary Feature. Other private repos exist but are still being
 * polished — deliberately out of scope until the user is ready to add them;
 * this array is the single place to append a finished project later.
 */

export const CATEGORIES = {
  python: "Python",
  web: "Web",
  android: "Android",
};

export const CAPABILITY = {
  sandbox: { icon: "🟢", label: { en: "Live Sandbox (WASM)", es: "Sandbox en Vivo (WASM)" } },
  webEmbed: { icon: "🌐", label: { en: "Live Web Embed", es: "Vista Web en Vivo" } },
  devicePreview: { icon: "📱", label: { en: "Mobile Device Preview", es: "Vista Previa Móvil" } },
  manual: { icon: "◆", label: { en: "Private Repo — Details Only", es: "Repo Privado — Solo Detalles" } },
  notebook: { icon: "📓", label: { en: "Notebook + Report", es: "Notebook + Informe" } },
};

/**
 * Every project may carry an `i18n.es` block overriding `tagline`,
 * `description`, and/or `requirements` (same shape as the English fields —
 * only overridden keys need to be present). `localizeProject` returns a
 * shallow-merged view for the given language; `en` (or a project with no
 * `i18n.es`) returns the project unchanged.
 * @param {object} project
 * @param {string} lang
 */
export function localizeProject(project, lang) {
  const override = lang !== "en" && project.i18n?.[lang];
  if (!override) return project;
  return { ...project, ...override };
}

export const projects = [
  {
    id: "ixmaoperations",
    name: "IxMaOperations",
    tagline: "Company operations web platform — TypeScript, deployed live.",
    description:
      "A full-stack operations web app for a real company, built with a modern TypeScript stack and deployed on Vercel.",
    category: "web",
    languages: [
      { label: "TypeScript", tone: "brass", icon: "typescript" },
      { label: "Web", tone: "muted" },
    ],
    capability: "webEmbed",
    github: "https://github.com/emiliorl/IxMaOperations",
    liveUrl: "https://www.ixmaoperations.com/",
    embeddable: false, // confirmed via `curl -I`: sends X-Frame-Options: DENY + frame-ancestors 'none'
    requirements: {
      "Runtime": "Modern web browser",
      "Network": "Required to open the live site (screenshot itself needs no network)",
      "Notes": "This site sends X-Frame-Options: DENY — it can never be iframed, so the preview shows a real screenshot + a link out instead of attempting to embed it.",
    },
    i18n: {
      es: {
        tagline: "Plataforma web de operaciones empresariales — TypeScript, desplegada en vivo.",
        description:
          "Una aplicación web full-stack de operaciones para una empresa real, construida con un stack moderno de TypeScript y desplegada en Vercel.",
        requirements: {
          "Entorno de ejecución": "Navegador web moderno",
          "Red": "Se requiere para abrir el sitio en vivo (la captura de pantalla en sí no necesita red)",
          "Notas":
            "Este sitio envía X-Frame-Options: DENY — nunca puede incrustarse en un iframe, así que la vista previa muestra una captura de pantalla real y un enlace externo en lugar de intentar incrustarlo.",
        },
      },
    },
    media: ["assets/screenshots/ixmaoperations-01.png"],
    isPrivate: false,
  },
  {
    id: "multi-agent-clinical-auditor",
    name: "Multi-Agent-Clinical-Auditor",
    tagline: "Multi-agent clinical record auditor — CrewAI + LiteLLM pipeline.",
    description:
      "A multi-agent system (CrewAI orchestration, LiteLLM-routed LLM calls) that audits clinical records for coding gaps and documentation issues. Shown here as a real screenshot of the project's own dashboard (rendered with synthetic sample data) rather than a live demo — the actual pipeline calls out to an LLM provider with a live API key, which isn't something to run or expose client-side on a public site.",
    category: "python",
    languages: [
      { label: "Python", tone: "olive", icon: "python" },
      { label: "CrewAI", tone: "muted", icon: "crewai" },
      { label: "AI/Agents", tone: "muted", icon: "ai-agents" },
    ],
    capability: "notebook",
    github: "https://github.com/emiliorl/Multi-Agent-Clinical-Auditor",
    requirements: {
      "Runtime": "Python 3.11+, an LLM API key (see repo README)",
      "Dependencies": "crewai, litellm, pandas, scikit-learn, sentence-transformers",
    },
    i18n: {
      es: {
        tagline: "Auditor multiagente de historiales clínicos — pipeline CrewAI + LiteLLM.",
        description:
          "Un sistema multiagente (orquestación con CrewAI, llamadas a LLM enrutadas con LiteLLM) que audita historiales clínicos en busca de vacíos de codificación y problemas de documentación. Se muestra aquí como una captura de pantalla real del propio panel del proyecto (renderizado con datos de ejemplo sintéticos) en lugar de una demo en vivo — el pipeline real llama a un proveedor de LLM con una clave de API activa, algo que no conviene ejecutar ni exponer del lado del cliente en un sitio público.",
        requirements: {
          "Entorno de ejecución": "Python 3.11+, una clave de API de LLM (ver README del repo)",
          "Dependencias": "crewai, litellm, pandas, scikit-learn, sentence-transformers",
        },
      },
    },
    media: ["assets/screenshots/multi-agent-clinical-auditor-01.png"],
    isPrivate: false,
  },
  {
    id: "mindful",
    name: "Mindful",
    tagline: "Digital wellness companion — Kotlin, Jetpack Compose, Android Accessibility API.",
    description:
      "An Android app for mental health and wellbeing, using the Accessibility API to detect compulsive engagement patterns and gently interrupt them, then redirect attention toward real recovery instead of a hard app block. Builds on an earlier project, MindShield, carrying its Accessibility-based usage-guard approach forward into a rebuilt, Jetpack Compose UI.",
    category: "android",
    languages: [
      { label: "Kotlin", tone: "olive", icon: "kotlin" },
      { label: "Jetpack Compose", tone: "muted", icon: "jetpack-compose" },
      { label: "Android", tone: "muted", icon: "android" },
    ],
    capability: "devicePreview",
    github: "https://github.com/emiliorl/Mindful",
    requirements: {
      "OS": "Android 12+",
      "Memory": "4GB+ device recommended",
      "Permissions": "Accessibility API, Usage Access, Notifications, local storage",
    },
    i18n: {
      es: {
        tagline: "Compañero de bienestar digital — Kotlin, Jetpack Compose, API de Accesibilidad de Android.",
        description:
          "Una app de Android para la salud mental y el bienestar, que usa la API de Accesibilidad para detectar patrones de uso compulsivo e interrumpirlos con suavidad, redirigiendo la atención hacia una recuperación real en lugar de un bloqueo total de la app. Se construye sobre un proyecto anterior, MindShield, llevando su enfoque de guardia de uso basado en Accesibilidad hacia una interfaz reconstruida con Jetpack Compose.",
        requirements: {
          "SO": "Android 12+",
          "Memoria": "Se recomienda un dispositivo con 4GB+ de RAM",
          "Permisos": "API de Accesibilidad, Acceso al uso, Notificaciones, almacenamiento local",
        },
      },
    },
    media: [
      "assets/screenshots/mindful-01.png",
      "assets/screenshots/mindful-02.png",
      "assets/screenshots/mindful-03.png",
      "assets/screenshots/mindful-04.png",
      "assets/screenshots/mindful-05.png",
      "assets/screenshots/mindful-06.png",
    ],
    isPrivate: false,
  },
  {
    id: "generative-models-trio",
    name: "Generative Models Trio",
    tagline: "VAE + DCGAN + Diffusion (DDPM), implemented from scratch and compared.",
    description:
      "Three generative modeling paradigms implemented from scratch in PyTorch and compared side by side: a β-VAE (CIFAR-10, exploring latent dimensionality and KL weighting), a spectrally-normalized DCGAN (64×64 cat faces), and a denoising diffusion model (DDPM, via a UNet2DModel from 🤗 diffusers, also on cat faces). Each notebook includes training curves and generated samples.",
    category: "python",
    languages: [
      { label: "Python", tone: "olive", icon: "python" },
      { label: "PyTorch", tone: "muted" },
      { label: "Generative AI", tone: "muted" },
    ],
    capability: "notebook",
    github: "https://github.com/emiliorl/Generative-Models-Trio",
    requirements: {
      "Runtime": "Python 3.x, PyTorch, 🤗 diffusers/datasets (see notebooks for full environment)",
      "Datasets": "CIFAR-10 (auto-downloaded) and huggan/AFHQ (auto-downloaded) — nothing bundled",
      "Notes": "Notebooks were developed and trained on Google Colab (GPU).",
    },
    i18n: {
      es: {
        tagline: "VAE + DCGAN + Difusión (DDPM), implementados desde cero y comparados.",
        description:
          "Tres paradigmas de modelado generativo implementados desde cero en PyTorch y comparados lado a lado: un β-VAE (CIFAR-10, explorando la dimensionalidad latente y la ponderación KL), un DCGAN con normalización espectral (rostros de gatos de 64×64), y un modelo de difusión con eliminación de ruido (DDPM, mediante un UNet2DModel de 🤗 diffusers, también sobre rostros de gatos). Cada notebook incluye curvas de entrenamiento y muestras generadas.",
        requirements: {
          "Entorno de ejecución": "Python 3.x, PyTorch, 🤗 diffusers/datasets (ver notebooks para el entorno completo)",
          "Datasets": "CIFAR-10 (descarga automática) y huggan/AFHQ (descarga automática) — nada incluido",
          "Notas": "Los notebooks fueron desarrollados y entrenados en Google Colab (GPU).",
        },
      },
    },
    media: ["assets/screenshots/generative-models-trio-01.png"],
    isPrivate: false,
  },
  {
    id: "catdog-cnn-comparison",
    name: "Cat/Dog CNN Comparison",
    tagline: "Basic vs. BatchNorm+Dropout CNN for cat/dog classification — 75.98% vs 84.13%.",
    description:
      "A controlled comparison of two CNN architectures for binary cat/dog classification, isolating the effect of BatchNorm + Dropout on generalization. Both models share the same data split, augmentation, optimizer, and early-stopping criteria — only the architecture differs. The enhanced model closes the train/val gap and beats the basic CNN by over 8 points of test accuracy.",
    category: "python",
    languages: [
      { label: "Python", tone: "olive", icon: "python" },
      { label: "PyTorch", tone: "muted" },
      { label: "Computer Vision", tone: "muted" },
    ],
    capability: "notebook",
    github: "https://github.com/emiliorl/CatDog-CNN-Comparison",
    requirements: {
      "Runtime": "Python 3.x, PyTorch (see notebook for full environment)",
      "Dataset": "Kaggle tongpython/cat-and-dog, downloaded at runtime via kagglehub",
    },
    i18n: {
      es: {
        tagline: "CNN básica vs. BatchNorm+Dropout para clasificación de gatos/perros — 75.98% vs 84.13%.",
        description:
          "Una comparación controlada de dos arquitecturas CNN para clasificación binaria de gatos/perros, aislando el efecto de BatchNorm + Dropout sobre la generalización. Ambos modelos comparten la misma partición de datos, aumentación, optimizador y criterio de parada temprana — solo difiere la arquitectura. El modelo mejorado reduce la brecha entre entrenamiento y validación y supera a la CNN básica por más de 8 puntos de precisión en prueba.",
        requirements: {
          "Entorno de ejecución": "Python 3.x, PyTorch (ver notebook para el entorno completo)",
          "Dataset": "Kaggle tongpython/cat-and-dog, descargado en tiempo de ejecución vía kagglehub",
        },
      },
    },
    media: ["assets/screenshots/catdog-cnn-comparison-01.png"],
    isPrivate: false,
  },
  {
    id: "hybrid-alpr",
    name: "Hybrid ALPR",
    tagline: "License plate recognition — homography rectification + CRNN, 96.1% CRR on CCPD.",
    description:
      "An end-to-end Automatic License Plate Recognition pipeline combining classical image processing (homography-based geometric rectification, CLAHE + morphological Top-Hat enhancement) with a lightweight deep sequence model (MobileNetV2 + Bidirectional GRU, trained with CTC loss). Evaluated on the CCPD 2019 dataset, reaching 96.1% character recognition rate and 80.6% full-sequence accuracy.",
    category: "python",
    languages: [
      { label: "Python", tone: "olive", icon: "python" },
      { label: "PyTorch", tone: "muted" },
      { label: "Computer Vision", tone: "muted" },
    ],
    capability: "notebook",
    github: "https://github.com/emiliorl/Hybrid-ALPR",
    requirements: {
      "Runtime": "Python 3.x, PyTorch, OpenCV (see notebook for full environment)",
      "Dataset": "CCPD 2019 (not bundled — see repo README for access)",
      "Notes": "Notebook was developed and trained on Google Colab (GPU).",
    },
    i18n: {
      es: {
        tagline: "Reconocimiento de placas vehiculares — rectificación por homografía + CRNN, 96.1% CRR en CCPD.",
        description:
          "Un pipeline de Reconocimiento Automático de Placas Vehiculares de extremo a extremo que combina procesamiento clásico de imágenes (rectificación geométrica por homografía, realce CLAHE + Top-Hat morfológico) con un modelo de secuencia profundo y liviano (MobileNetV2 + GRU bidireccional, entrenado con pérdida CTC). Evaluado en el dataset CCPD 2019, alcanzando 96.1% de tasa de reconocimiento de caracteres y 80.6% de precisión de secuencia completa.",
        requirements: {
          "Entorno de ejecución": "Python 3.x, PyTorch, OpenCV (ver notebook para el entorno completo)",
          "Dataset": "CCPD 2019 (no incluido — ver README del repo para acceso)",
          "Notas": "El notebook fue desarrollado y entrenado en Google Colab (GPU).",
        },
      },
    },
    media: ["assets/screenshots/hybrid-alpr-01.png"],
    isPrivate: false,
  },
  {
    id: "codigogt",
    name: "codigogt",
    tagline: "Full-stack directory app — deployed live, source private.",
    description:
      "A full-stack project demonstrating end-to-end development ability, live at codigogt.vercel.app. The source repository is still private, so it's previewed here the same way as IxMaOperations — a real live embed of the deployed app — rather than a hand-typed placeholder card; only the GitHub stats/source-viewer are unavailable, since there's no public repo to fetch them from.",
    category: "web",
    languages: [{ label: "Full-Stack", tone: "terracotta", icon: "fullstack" }],
    capability: "webEmbed",
    github: null,
    liveUrl: "https://codigogt.vercel.app/",
    requirements: {
      "Runtime": "Modern web browser",
      "Network": "Required (live deployment)",
      "Access": "Source repository is private — deployed app is public",
    },
    i18n: {
      es: {
        tagline: "Aplicación de directorio full-stack — desplegada en vivo, código fuente privado.",
        description:
          "Un proyecto full-stack que demuestra capacidad de desarrollo de extremo a extremo, en vivo en codigogt.vercel.app. El repositorio fuente todavía es privado, así que se previsualiza aquí de la misma forma que IxMaOperations — una incrustación en vivo real de la app desplegada — en lugar de una tarjeta de marcador de posición escrita a mano; solo las estadísticas de GitHub y el visor de código no están disponibles, ya que no hay un repo público del cual obtenerlas.",
        requirements: {
          "Entorno de ejecución": "Navegador web moderno",
          "Red": "Requerida (despliegue en vivo)",
          "Acceso": "El repositorio fuente es privado — la app desplegada es pública",
        },
      },
    },
    media: ["assets/screenshots/codigogt-01.svg"],
    isPrivate: true,
  },
];

/**
 * Earlier Work — 2021 student projects, link-only (no sandbox/preview build-out).
 * Language values corrected against the live GitHub API — several were
 * mislabeled "Java" in the original plan; they are JavaScript/HTML/CSS.
 */
export const earlierWork = [
  { name: "Pro-Ctrl-Back-End", language: "JavaScript", icon: "javascript", github: "https://github.com/emiliorl/Pro-Ctrl-Back-End" },
  { name: "Pro-Ctrl-Front-End", language: "HTML", icon: "html", github: "https://github.com/emiliorl/Pro-Ctrl-Front-End" },
  { name: "DBSTermProject", language: "JavaScript", icon: "javascript", github: "https://github.com/emiliorl/DBSTermProject" },
  { name: "GestorDeHoteles", language: "JavaScript", icon: "javascript", github: "https://github.com/emiliorl/GestorDeHoteles" },
  { name: "torneoDeportes-Back-End", language: "JavaScript", icon: "javascript", github: "https://github.com/emiliorl/torneoDeportes-Back-End" },
  { name: "VentaOnline", language: "JavaScript", icon: "javascript", github: "https://github.com/emiliorl/VentaOnline" },
  { name: "Calculator", language: "Java", icon: "java", github: "https://github.com/emiliorl/Calculator" },
];
