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
 * Still placeholders, pending real assets from the user:
 *   - ixmaoperations-01, codigogt-01, mindful-01/-02/-03
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
  sandbox: { icon: "🟢", label: "Live Sandbox (WASM)" },
  webEmbed: { icon: "🌐", label: "Live Web Embed" },
  devicePreview: { icon: "📱", label: "Mobile Device Preview" },
  manual: { icon: "◆", label: "Private Repo — Details Only" },
  notebook: { icon: "📓", label: "Notebook + Report" },
};

const AUDITOR_DEMO_CODE = `# Multi-Agent-Clinical-Auditor — self-contained demo
#
# This is a trimmed, pure-Python distillation of the scoring logic used by
# the real project, running here on synthetic sample records so it works
# fully offline in this WASM sandbox. The real pipeline (crewai + litellm,
# calling an LLM provider with a live API key) is not runnable client-side
# — see the code viewer tab for the actual source, and the README for the
# full architecture.

records = [
    {"id": "REC-001", "documented_dx": 3, "coded_dx": 3, "signed": True, "notes_len": 420},
    {"id": "REC-002", "documented_dx": 4, "coded_dx": 2, "signed": True, "notes_len": 95},
    {"id": "REC-003", "documented_dx": 2, "coded_dx": 2, "signed": False, "notes_len": 610},
]

def audit_record(rec):
    findings = []
    score = 100

    if rec["coded_dx"] < rec["documented_dx"]:
        gap = rec["documented_dx"] - rec["coded_dx"]
        findings.append(f"under-coded by {gap} diagnosis(es)")
        score -= gap * 15

    if not rec["signed"]:
        findings.append("missing provider signature")
        score -= 20

    if rec["notes_len"] < 150:
        findings.append("clinical note unusually short — possible incomplete documentation")
        score -= 10

    score = max(score, 0)
    status = "PASS" if score >= 80 else ("REVIEW" if score >= 50 else "FAIL")
    return status, score, findings

print(f"{'ID':<10}{'STATUS':<8}{'SCORE':<7}FINDINGS")
for rec in records:
    status, score, findings = audit_record(rec)
    findings_str = "; ".join(findings) if findings else "none"
    print(f"{rec['id']:<10}{status:<8}{score:<7}{findings_str}")
`;

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
    liveUrl: "https://ixmaoperations.com",
    requirements: {
      "Runtime": "Modern web browser",
      "Network": "Required (live deployment)",
      "Notes": "Some hosts block iframe embedding — a fallback screenshot is shown if so.",
    },
    media: ["assets/screenshots/ixmaoperations-01.svg"],
    isPrivate: false,
  },
  {
    id: "multi-agent-clinical-auditor",
    name: "Multi-Agent-Clinical-Auditor",
    tagline: "Multi-agent clinical record auditor — CrewAI + LiteLLM pipeline.",
    description:
      "A multi-agent system (CrewAI orchestration, LiteLLM-routed LLM calls) that audits clinical records for coding gaps and documentation issues. The sandbox below runs a self-contained, pure-Python distillation of the scoring logic against synthetic sample records — the full agent pipeline requires a live LLM API key and isn't run client-side.",
    category: "python",
    languages: [
      { label: "Python", tone: "olive", icon: "python" },
      { label: "CrewAI", tone: "muted", icon: "crewai" },
      { label: "AI/Agents", tone: "muted", icon: "ai-agents" },
    ],
    capability: "sandbox",
    github: "https://github.com/emiliorl/Multi-Agent-Clinical-Auditor",
    requirements: {
      "Runtime": "Browser with WebAssembly support",
      "Real pipeline": "Python 3.11+, an LLM API key (not required for the sandbox demo)",
      "Sandbox deps": "Pyodide stdlib only — no network calls",
    },
    media: ["assets/screenshots/multi-agent-clinical-auditor-01.png"],
    sandbox: {
      runtime: "pyodide",
      demoCode: AUDITOR_DEMO_CODE,
    },
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
    media: [
      "assets/screenshots/mindful-01.svg",
      "assets/screenshots/mindful-02.svg",
      "assets/screenshots/mindful-03.svg",
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
    media: ["assets/screenshots/hybrid-alpr-01.png"],
    isPrivate: false,
  },
  {
    id: "codigogt",
    name: "codigogt",
    tagline: "Full-stack directory app — deployed live, source private.",
    description:
      "A full-stack project demonstrating end-to-end development ability, live at codigogt.vercel.app/directorio. The source repository is still private, so it's previewed here the same way as IxMaOperations — a real live embed of the deployed app — rather than a hand-typed placeholder card; only the GitHub stats/source-viewer are unavailable, since there's no public repo to fetch them from.",
    category: "web",
    languages: [{ label: "Full-Stack", tone: "terracotta", icon: "fullstack" }],
    capability: "webEmbed",
    github: null,
    liveUrl: "https://codigogt.vercel.app/directorio",
    requirements: {
      "Runtime": "Modern web browser",
      "Network": "Required (live deployment)",
      "Access": "Source repository is private — deployed app is public",
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
