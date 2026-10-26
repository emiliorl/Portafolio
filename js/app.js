import { projects, earlierWork, CAPABILITY, localizeProject } from "./projects-data.js";
import { hydrateProjectsWithGitHubData } from "./github-service.js";
import { openModal, buildTabs } from "./modal-manager.js";
import { buildWebPreview, buildDeviceCarousel } from "./device-preview.js";
import { buildPythonSandbox } from "./sandbox-runner.js";
import { getLang, setLang, onLangChange, applyStaticTranslations, t } from "./i18n.js";

const grid = document.getElementById("project-grid");
const earlierWorkList = document.getElementById("earlier-work-list");
const searchInput = document.getElementById("search-input");
const filterTabs = document.getElementById("filter-tabs");
const themeToggle = document.getElementById("theme-toggle");
const langToggle = document.getElementById("lang-toggle");
const langToggleLabel = document.getElementById("lang-toggle-label");
const frameCounter = document.getElementById("frame-counter");

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
  themeToggle.setAttribute("aria-label", dark ? t("switchToLight") : t("switchToDark"));
}

/* ---------------------------------------------------------------------- */
/* Language                                                                 */
/* ---------------------------------------------------------------------- */

function syncLangToggle() {
  const lang = getLang();
  langToggleLabel.textContent = lang === "en" ? "ES" : "EN";
  langToggle.setAttribute("aria-label", t("langToggleLabel"));
}

langToggle.addEventListener("click", () => {
  setLang(getLang() === "en" ? "es" : "en");
});

onLangChange(() => {
  applyStaticTranslations();
  syncLangToggle();
  syncThemeToggleA11y();
  renderGrid();
  renderEarlierWork();
});

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

function requirementsDrawer(requirements) {
  const details = document.createElement("details");
  details.className = "requirements";
  const summary = document.createElement("summary");
  summary.textContent = t("deviceRequirements");
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

/** Sets a button's label followed by an aria-hidden arrow, so screen readers
 * announce just the label. */
function setBtnLabel(btn, label) {
  btn.textContent = label + " ";
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  btn.appendChild(arrow);
}

function launchAction(project) {
  const btn = document.createElement("button");
  btn.className = "btn btn--primary btn--sm";
  btn.type = "button";

  if (project.capability === "sandbox") {
    setBtnLabel(btn, t("launchSandbox"));
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — ${t("modalSandboxSuffix")}`,
        bodyEl: buildPythonSandbox(project),
      });
    });
  } else if (project.capability === "webEmbed") {
    setBtnLabel(btn, t("launchPreview"));
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — ${t("modalPreviewSuffix")}`,
        bodyEl: buildWebPreview(project),
      });
    });
  } else if (project.capability === "devicePreview") {
    setBtnLabel(btn, t("inspect"));
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — ${t("modalDeviceSuffix")}`,
        bodyEl: buildAndroidModalBody(project),
      });
    });
  } else if (project.capability === "notebook") {
    btn.className = "btn btn--ghost btn--sm";
    setBtnLabel(btn, t("viewReport"));
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — ${t("modalReportSuffix")}`,
        bodyEl: buildManualDetailsBody(project),
      });
    });
  } else {
    btn.className = "btn btn--ghost btn--sm";
    setBtnLabel(btn, t("details"));
    btn.addEventListener("click", () => {
      openModal({
        title: `${project.name} — ${t("modalDetailsSuffix")}`,
        bodyEl: buildManualDetailsBody(project),
      });
    });
  }
  return btn;
}

function buildAndroidModalBody(rawProject) {
  const project = localizeProject(rawProject, getLang());
  const wrap = document.createElement("div");
  const carouselPanel = document.createElement("div");
  carouselPanel.appendChild(buildDeviceCarousel(project));

  const detailsPanel = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = project.description;
  detailsPanel.appendChild(p);
  detailsPanel.appendChild(requirementsDrawer(project.requirements));

  const { tabsEl, panelsEl } = buildTabs([
    { id: "screens", label: t("tabScreens"), panel: carouselPanel },
    { id: "details", label: t("tabArchitecture"), panel: detailsPanel },
  ]);

  wrap.append(tabsEl, panelsEl);
  return wrap;
}

function buildManualDetailsBody(rawProject) {
  const project = localizeProject(rawProject, getLang());
  const wrap = document.createElement("div");
  const img = document.createElement("img");
  img.src = project.media[0];
  img.alt = `${project.name} ${t("projectScreenshotAlt")}`;
  img.style.borderRadius = "var(--radius-md)";
  img.style.marginBottom = "var(--space-4)";
  const p = document.createElement("p");
  p.textContent = project.description;
  wrap.append(img, p, requirementsDrawer(project.requirements));
  return wrap;
}

const MODE_TONE = {
  sandbox: "live",
  webEmbed: "live",
  devicePreview: "preview",
  notebook: "preview",
  manual: "simulated",
};

const pad2 = (n) => String(n).padStart(2, "0");

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "exhibit registered";
  card.dataset.id = project.id;

  const exposure = projects.findIndex((p) => p.id === project.id) + 1;
  const capability = CAPABILITY[project.capability];

  const strip = document.createElement("div");
  strip.className = "exhibit__strip";
  const index = document.createElement("span");
  index.innerHTML = `EXP. <b>${pad2(exposure)}</b>`;
  const category = document.createElement("span");
  category.textContent = project.category;
  strip.append(index, category);

  const mode = document.createElement("span");
  mode.className = "mode";
  mode.innerHTML = `<span class="mode__dot mode__dot--${MODE_TONE[project.capability] ?? "preview"}" aria-hidden="true"></span>`;
  mode.append(capability.label[getLang()]);

  const media = document.createElement("div");
  media.className = "exhibit__media";
  const img = document.createElement("img");
  img.src = project.media[0];
  img.alt = `${project.name} ${t("projectPreviewAlt")}`;
  img.loading = "lazy";
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "exhibit__body";

  const title = document.createElement("h3");
  title.className = "exhibit__title";
  title.textContent = project.name;

  const tagline = document.createElement("p");
  tagline.className = "exhibit__tagline";
  tagline.textContent = project.tagline;

  const stack = document.createElement("span");
  stack.className = "stack";
  project.languages.forEach((lang) => {
    const item = document.createElement("span");
    item.className = "stack__item";
    if (lang.icon) {
      const icon = document.createElement("img");
      icon.className = "pill__icon";
      icon.src = `assets/icons/${lang.icon}.svg`;
      icon.alt = "";
      icon.loading = "lazy";
      item.appendChild(icon);
    }
    item.appendChild(document.createTextNode(lang.label));
    stack.appendChild(item);
  });

  const spec = document.createElement("dl");
  spec.className = "spec";
  spec.append(
    specRow(t("specMode"), mode),
    specRow(t("specStack"), stack),
    specRow(t("specSource"), makeGithubMeta(project)),
  );

  const footer = document.createElement("div");
  footer.className = "exhibit__footer";
  footer.appendChild(launchAction(project));

  if (project.github) {
    const codeLink = document.createElement("a");
    codeLink.className = "btn btn--ghost btn--sm";
    codeLink.href = project.github;
    codeLink.target = "_blank";
    codeLink.rel = "noopener";
    codeLink.textContent = t("viewCode") + " ";
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    codeLink.appendChild(arrow);
    footer.appendChild(codeLink);
  }

  body.append(title, tagline, spec, requirementsDrawer(project.requirements), footer);
  card.append(strip, media, body);
  return card;
}

function specRow(label, valueEl) {
  const row = document.createElement("div");
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.appendChild(valueEl);
  row.append(dt, dd);
  return row;
}

function makeGithubMeta(project) {
  const el = document.createElement("span");
  el.dataset.role = "gh-meta";
  el.textContent = project.isPrivate ? t("privateRepository") : t("githubSyncing");
  return el;
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
  const lang = getLang();
  const visible = projects.map((p) => localizeProject(p, lang)).filter(matchesFilter);
  frameCounter.innerHTML = `<strong>${pad2(visible.length)}</strong> / ${pad2(projects.length)} ${t("exposures")}`;
  grid.innerHTML = "";
  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("noMatch");
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

applyStaticTranslations();
syncLangToggle();
initTheme();
renderGrid();
renderEarlierWork();
document.getElementById("viewfinder-total").textContent = pad2(projects.length);
document.getElementById("year").textContent = String(new Date().getFullYear());
hydrateProjectsWithGitHubData(projects, updateCardGithubMeta);
