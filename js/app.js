import { projects, earlierWork, CAPABILITY } from "./projects-data.js";
import { hydrateProjectsWithGitHubData } from "./github-service.js";
import { openModal, buildTabs } from "./modal-manager.js";
import { buildWebPreview, buildDeviceCarousel } from "./device-preview.js";
import { buildPythonSandbox } from "./sandbox-runner.js";

const grid = document.getElementById("project-grid");
const earlierWorkList = document.getElementById("earlier-work-list");
const searchInput = document.getElementById("search-input");
const filterTabs = document.getElementById("filter-tabs");
const themeToggle = document.getElementById("theme-toggle");

let activeFilter = "all";
let activeQuery = "";

/* ---------------------------------------------------------------------- */
/* Theme                                                                   */
/* ---------------------------------------------------------------------- */

function isDarkActive() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit) return explicit === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function syncThemeToggleA11y() {
  const dark = isDarkActive();
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

function initTheme() {
  try {
    const saved = localStorage.getItem("portfolio:theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch {
    /* localStorage unavailable — fall back to system preference, no crash */
  }
  syncThemeToggleA11y();
}

themeToggle.addEventListener("click", () => {
  const next = isDarkActive() ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("portfolio:theme", next);
  } catch {
    /* non-fatal */
  }
  syncThemeToggleA11y();
});

/* ---------------------------------------------------------------------- */
/* Card rendering                                                          */
/* ---------------------------------------------------------------------- */

function pillToneClass(tone) {
  return tone && tone !== "muted" ? `pill--${tone}` : "pill--muted";
}

function requirementsDrawer(requirements) {
  const details = document.createElement("details");
  details.className = "requirements";
  const summary = document.createElement("summary");
  summary.textContent = "Device & System Requirements";
  const dl = document.createElement("dl");
  Object.entries(requirements).forEach(([key, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = key;
    const dd = document.createElement("dd");
    dd.textContent = value;
    dl.append(dt, dd);
  });
  details.append(summary, dl);
  return details;
}

/** Sets a button's label as an aria-hidden decorative icon + real text,
 * so screen readers announce just the label — not the emoji's Unicode
 * name spoken inline ("play button Launch Sandbox"). */
function setBtnLabel(btn, icon, label) {
  btn.innerHTML = "";
  const iconEl = document.createElement("span");
  iconEl.setAttribute("aria-hidden", "true");
  iconEl.textContent = icon;
  btn.append(iconEl, document.createTextNode(" " + label));
}

function launchAction(project) {
  const btn = document.createElement("button");
  btn.className = "btn btn--primary btn--sm";
  btn.type = "button";

  if (project.capability === "sandbox") {
    setBtnLabel(btn, "▶", "Launch Sandbox");
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — Sandbox`,
        bodyEl: buildPythonSandbox(project),
      });
    });
  } else if (project.capability === "webEmbed") {
    setBtnLabel(btn, "🌐", "Launch Preview");
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — Live Preview`,
        bodyEl: buildWebPreview(project),
      });
    });
  } else if (project.capability === "devicePreview") {
    setBtnLabel(btn, "📱", "Inspect");
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — Device Preview`,
        bodyEl: buildAndroidModalBody(project),
      });
    });
  } else if (project.capability === "notebook") {
    btn.className = "btn btn--ghost btn--sm";
    setBtnLabel(btn, "📓", "View Report");
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — Report`,
        bodyEl: buildManualDetailsBody(project),
      });
    });
  } else {
    btn.className = "btn btn--ghost btn--sm";
    setBtnLabel(btn, "◆", "Details");
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — Details`,
        bodyEl: buildManualDetailsBody(project),
      });
    });
  }
  return btn;
}

function buildAndroidModalBody(project) {
  const wrap = document.createElement("div");
  const carouselPanel = document.createElement("div");
  carouselPanel.appendChild(buildDeviceCarousel(project));

  const detailsPanel = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = project.description;
  detailsPanel.appendChild(p);
  detailsPanel.appendChild(requirementsDrawer(project.requirements));

  const { tabsEl, panelsEl } = buildTabs([
    { id: "screens", label: "Screens", panel: carouselPanel },
    { id: "details", label: "Architecture & Requirements", panel: detailsPanel },
  ]);

  wrap.append(tabsEl, panelsEl);
  return wrap;
}

function buildManualDetailsBody(project) {
  const wrap = document.createElement("div");
  const img = document.createElement("img");
  img.src = project.media[0];
  img.alt = `${project.name} screenshot`;
  img.style.borderRadius = "var(--radius-md)";
  img.style.marginBottom = "var(--space-4)";
  const p = document.createElement("p");
  p.textContent = project.description;
  wrap.append(img, p, requirementsDrawer(project.requirements));
  return wrap;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.id = project.id;

  const media = document.createElement("div");
  media.className = "project-card__media";
  const img = document.createElement("img");
  img.src = project.media[0];
  img.alt = `${project.name} preview`;
  img.loading = "lazy";
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "project-card__body";

  const title = document.createElement("h3");
  title.className = "project-card__title";
  title.textContent = project.name;

  const tagline = document.createElement("p");
  tagline.className = "project-card__tagline";
  tagline.textContent = project.tagline;

  const capability = CAPABILITY[project.capability];
  const capabilityEl = document.createElement("span");
  capabilityEl.className = "capability";
  capabilityEl.innerHTML = `<span aria-hidden="true">${capability.icon}</span> ${capability.label}`;

  const pillRow = document.createElement("div");
  pillRow.className = "pill-row";
  project.languages.forEach((lang) => {
    const pill = document.createElement("span");
    pill.className = `pill ${pillToneClass(lang.tone)}`;
    if (lang.icon) {
      const icon = document.createElement("img");
      icon.className = "pill__icon";
      icon.src = `assets/icons/${lang.icon}.svg`;
      icon.alt = "";
      icon.loading = "lazy";
      pill.appendChild(icon);
    }
    pill.appendChild(document.createTextNode(lang.label));
    pillRow.appendChild(pill);
  });

  const metaRow = document.createElement("div");
  metaRow.className = "pill-row";
  metaRow.appendChild(makeGithubMetaPill(project));

  const footer = document.createElement("div");
  footer.className = "project-card__footer";
  footer.appendChild(launchAction(project));

  if (project.github) {
    const codeLink = document.createElement("a");
    codeLink.className = "btn btn--ghost btn--sm";
    codeLink.href = project.github;
    codeLink.target = "_blank";
    codeLink.rel = "noopener";
    codeLink.textContent = "View Code";
    footer.appendChild(codeLink);
  }

  body.append(title, tagline, pillRow, capabilityEl, metaRow, requirementsDrawer(project.requirements), footer);
  card.append(media, body);
  return card;
}

function makeGithubMetaPill(project) {
  const pill = document.createElement("span");
  pill.className = "pill pill--muted";
  pill.dataset.role = "gh-meta";
  pill.textContent = project.isPrivate ? "🔒 Private repository" : "GitHub · syncing…";
  return pill;
}

function updateCardGithubMeta(project) {
  const card = grid.querySelector(`[data-id="${project.id}"]`);
  if (!card) return;
  const pill = card.querySelector('[data-role="gh-meta"]');
  if (!pill || !project.liveMeta) return;
  pill.textContent = `★ ${project.liveMeta.stars} · ⑂ ${project.liveMeta.forks}`;
}

/* ---------------------------------------------------------------------- */
/* Filtering, search, render                                               */
/* ---------------------------------------------------------------------- */

function matchesFilter(project) {
  const byCategory = activeFilter === "all" || project.category === activeFilter;
  const q = activeQuery.trim().toLowerCase();
  const byQuery =
    q === "" ||
    project.name.toLowerCase().includes(q) ||
    project.tagline.toLowerCase().includes(q) ||
    project.languages.some((l) => l.label.toLowerCase().includes(q));
  return byCategory && byQuery;
}

function renderGrid() {
  const visible = projects.filter(matchesFilter);
  grid.innerHTML = "";
  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No projects match that search/filter.";
    grid.appendChild(empty);
    return;
  }
  visible.forEach((project) => grid.appendChild(createProjectCard(project)));
}

function renderEarlierWork() {
  earlierWorkList.innerHTML = "";
  earlierWork.forEach((item) => {
    const a = document.createElement("a");
    a.className = "earlier-work__item";
    a.href = item.github;
    a.target = "_blank";
    a.rel = "noopener";
    const iconTag = item.icon
      ? `<img class="pill__icon" src="assets/icons/${item.icon}.svg" alt="" loading="lazy" />`
      : "";
    a.innerHTML = `<h4>${item.name}</h4><span>${iconTag}${item.language}</span>`;
    earlierWorkList.appendChild(a);
  });
}

filterTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-tab");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  filterTabs.querySelectorAll(".filter-tab").forEach((b) => b.setAttribute("aria-pressed", "false"));
  btn.setAttribute("aria-pressed", "true");
  renderGrid();
});

searchInput.addEventListener("input", (e) => {
  activeQuery = e.target.value;
  renderGrid();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    const tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    searchInput.focus();
  }
});

/* ---------------------------------------------------------------------- */
/* Boot                                                                     */
/* ---------------------------------------------------------------------- */

initTheme();
renderGrid();
renderEarlierWork();
document.getElementById("year").textContent = String(new Date().getFullYear());
hydrateProjectsWithGitHubData(projects, updateCardGithubMeta);
