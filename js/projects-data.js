/**
 * projects-data.js — project registry
 *
 * PLACEHOLDER ASSET CONVENTION (confirmed with user, 2026-09-02):
 * Every `media` path below points to a generated placeholder SVG under
 * `assets/screenshots/`, named `<project-id>-NN.svg`. Swapping in a real
 * screenshot later is a pure file replace — keep the same filename (or
 * update the path here) and no other code changes are needed.
 * Expected real-asset filenames per project:
 *   - ixmaoperations-01(.png|.jpg)      — desktop screenshot of the live site
 *   - multi-agent-clinical-auditor-01   — dashboard / report screenshot
 *   - codigogt-01                       — hero screenshot (private repo, user-supplied)
 *   - mindful-01 / -02 / -03            — phone screens
 *   - mindshield-01 / -02 / -03         — phone screens
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
      { label: "TypeScript", tone: "brass" },
      { label: "Web", tone: "muted" },
    ],
    capability: "webEmbed",
    github: "https://github.com/emiliorl/IxMaOperations",
    liveUrl: "https://ixmaoperations.vercel.app",
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
      { label: "Python", tone: "olive" },
      { label: "CrewAI", tone: "muted" },
      { label: "AI/Agents", tone: "muted" },
    ],
    capability: "sandbox",
    github: "https://github.com/emiliorl/Multi-Agent-Clinical-Auditor",
    requirements: {
      "Runtime": "Browser with WebAssembly support",
      "Real pipeline": "Python 3.11+, an LLM API key (not required for the sandbox demo)",
      "Sandbox deps": "Pyodide stdlib only — no network calls",
    },
    media: ["assets/screenshots/multi-agent-clinical-auditor-01.svg"],
    sandbox: {
      runtime: "pyodide",
      demoCode: AUDITOR_DEMO_CODE,
    },
    isPrivate: false,
  },
  {
    id: "mindful",
    name: "Mindful",
    tagline: "Mental health & wellbeing companion app — Kotlin, Jetpack Compose.",
    description:
      "An Android app supporting mental health and wellbeing routines, built with Kotlin and modern Jetpack Compose UI.",
    category: "android",
    languages: [
      { label: "Kotlin", tone: "olive" },
      { label: "Jetpack Compose", tone: "muted" },
    ],
    capability: "devicePreview",
    github: "https://github.com/emiliorl/Mindful",
    requirements: {
      "OS": "Android 12+",
      "Memory": "4GB+ device recommended",
      "Permissions": "Notifications (reminders), local storage",
    },
    media: [
      "assets/screenshots/mindful-01.svg",
      "assets/screenshots/mindful-02.svg",
      "assets/screenshots/mindful-03.svg",
    ],
    isPrivate: false,
  },
  {
    id: "mindshield",
    name: "MindShield",
    tagline: "Digital wellness & screen-time guard — Kotlin, Android Accessibility API.",
    description:
      "A digital wellness app that helps curb compulsive engagement patterns, using Android's Accessibility API to detect and gently interrupt problem usage.",
    category: "android",
    languages: [
      { label: "Kotlin", tone: "olive" },
      { label: "Android", tone: "muted" },
    ],
    capability: "devicePreview",
    github: "https://github.com/emiliorl/MindShield",
    requirements: {
      "OS": "Android 12+",
      "Memory": "4GB+ device recommended",
      "Permissions": "Accessibility API, Usage Access",
    },
    media: [
      "assets/screenshots/mindshield-01.svg",
      "assets/screenshots/mindshield-02.svg",
      "assets/screenshots/mindshield-03.svg",
    ],
    isPrivate: false,
  },
  {
    id: "codigogt",
    name: "codigogt",
    tagline: "Full-stack project — private repository.",
    description:
      "A full-stack project demonstrating end-to-end development ability. This repository is private, so its source, live stats, and sandbox aren't fetchable from this static site — details here are entered by hand and screenshots are placeholders until the user supplies real ones.",
    category: "web",
    languages: [{ label: "Full-Stack", tone: "terracotta" }],
    capability: "manual",
    github: null,
    requirements: {
      "Access": "Private repository — code not publicly viewable",
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
  { name: "Pro-Ctrl-Back-End", language: "JavaScript", github: "https://github.com/emiliorl/Pro-Ctrl-Back-End" },
  { name: "Pro-Ctrl-Front-End", language: "HTML", github: "https://github.com/emiliorl/Pro-Ctrl-Front-End" },
  { name: "DBSTermProject", language: "JavaScript", github: "https://github.com/emiliorl/DBSTermProject" },
  { name: "GestorDeHoteles", language: "JavaScript", github: "https://github.com/emiliorl/GestorDeHoteles" },
  { name: "torneoDeportes-Back-End", language: "JavaScript", github: "https://github.com/emiliorl/torneoDeportes-Back-End" },
  { name: "VentaOnline", language: "JavaScript", github: "https://github.com/emiliorl/VentaOnline" },
  { name: "Calculator", language: "Java", github: "https://github.com/emiliorl/Calculator" },
];
