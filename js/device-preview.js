/**
 * device-preview.js — web viewport switcher (with iframe-block fallback)
 * and the mobile device-frame screenshot carousel.
 */

const VIEWPORTS = [
  { id: "desktop", label: "Desktop" },
  { id: "tablet", label: "Tablet" },
  { id: "mobile", label: "Mobile" },
];

/**
 * There is no reliable way to detect an X-Frame-Options/CSP frame-ancestors
 * block from inside the page: a blocked cross-origin iframe and a
 * successfully-loaded one both report `contentDocument === null` and both
 * fire `load` — same-origin policy makes them deliberately indistinguishable
 * (confirmed empirically, see PHASE.md). So this is NOT auto-detected. Set
 * `embeddable: false` on a project once you've confirmed (e.g. `curl -I` for
 * `x-frame-options`/`content-security-policy: frame-ancestors`) that a site
 * blocks framing, and the iframe attempt is skipped entirely in favor of a
 * real screenshot + link out — no broken/blank frame, no guessing.
 *
 * @param {{liveUrl: string, media: string[], name: string, embeddable?: boolean}} project
 */
export function buildWebPreview(project) {
  const wrap = document.createElement("div");

  if (project.embeddable === false) {
    const note = document.createElement("div");
    note.className = "viewport-fallback";
    note.innerHTML = `
      <img src="${project.media[0]}" alt="${project.name} screenshot" style="border-radius: var(--radius-md); margin-bottom: var(--space-4); max-width: 100%;" />
      <p>This site sends <code>X-Frame-Options: DENY</code>, so it can't be embedded in an iframe anywhere, by design — not a bug in this preview. Showing a real screenshot instead.</p>
    `;
    const openBtn = document.createElement("a");
    openBtn.className = "btn btn--primary btn--sm";
    openBtn.href = project.liveUrl;
    openBtn.target = "_blank";
    openBtn.rel = "noopener";
    openBtn.textContent = "Open Live Site ↗";
    openBtn.style.marginTop = "var(--space-4)";
    note.appendChild(openBtn);
    wrap.appendChild(note);
    return wrap;
  }

  const toolbar = document.createElement("div");
  toolbar.className = "sandbox-toolbar";

  const switcher = document.createElement("div");
  switcher.className = "viewport-switcher";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Viewport size");

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "var(--space-2)";
  const refreshBtn = document.createElement("button");
  refreshBtn.className = "btn btn--ghost btn--sm";
  refreshBtn.type = "button";
  refreshBtn.textContent = "Refresh";
  const openBtn = document.createElement("a");
  openBtn.className = "btn btn--primary btn--sm";
  openBtn.href = project.liveUrl;
  openBtn.target = "_blank";
  openBtn.rel = "noopener";
  openBtn.textContent = "Open Live URL ↗";
  actions.append(refreshBtn, openBtn);

  toolbar.append(switcher, actions);

  const frame = document.createElement("div");
  frame.className = "viewport-frame";
  frame.dataset.size = "desktop";

  const iframe = document.createElement("iframe");
  iframe.src = project.liveUrl;
  iframe.title = `Live preview of ${project.name}`;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer";

  const fallback = document.createElement("div");
  fallback.className = "viewport-fallback";
  fallback.hidden = true;
  fallback.innerHTML = `
    <img src="${project.media[0]}" alt="${project.name} screenshot" style="border-radius: var(--radius-md); margin-bottom: var(--space-4);" />
    <p>This site may restrict iframe embedding — showing a screenshot instead.</p>
  `;

  frame.append(iframe, fallback);

  // Best-effort only, for projects with unknown/unverified framing policy
  // (see the doc comment above): if the iframe hasn't fired `load` within a
  // few seconds, assume something's wrong and show the fallback. This does
  // NOT catch a confirmed X-Frame-Options: DENY — that's handled above via
  // the `embeddable` flag instead, since `load` fires either way.
  let loaded = false;
  iframe.addEventListener("load", () => {
    loaded = true;
  });
  setTimeout(() => {
    if (!loaded) {
      iframe.hidden = true;
      fallback.hidden = false;
    }
  }, 4000);

  refreshBtn.addEventListener("click", () => {
    loaded = false;
    iframe.hidden = false;
    fallback.hidden = true;
    iframe.src = project.liveUrl;
    setTimeout(() => {
      if (!loaded) {
        iframe.hidden = true;
        fallback.hidden = false;
      }
    }, 4000);
  });

  VIEWPORTS.forEach((vp, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = vp.label;
    btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      frame.dataset.size = vp.id;
      switcher.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
    });
    switcher.appendChild(btn);
  });

  wrap.append(toolbar, frame);
  return wrap;
}

/** @param {{name: string, media: string[]}} project */
export function buildDeviceCarousel(project) {
  const wrap = document.createElement("div");
  wrap.className = "carousel";

  let index = 0;

  const frame = document.createElement("div");
  frame.className = "device-frame";
  const screen = document.createElement("div");
  screen.className = "device-frame__screen";
  const img = document.createElement("img");
  img.alt = `${project.name} — screen ${index + 1}`;
  screen.appendChild(img);
  frame.appendChild(screen);

  const caption = document.createElement("p");
  caption.className = "carousel__caption";

  const controls = document.createElement("div");
  controls.className = "carousel__controls";
  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.setAttribute("aria-label", "Previous screen");
  prevBtn.textContent = "‹";
  const dots = document.createElement("span");
  dots.style.fontFamily = "var(--font-mono)";
  dots.style.fontSize = "var(--fs-micro)";
  dots.style.color = "var(--ink-2)";
  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.setAttribute("aria-label", "Next screen");
  nextBtn.textContent = "›";
  controls.append(prevBtn, dots, nextBtn);

  function render() {
    img.src = project.media[index];
    img.alt = `${project.name} — screen ${index + 1} of ${project.media.length}`;
    caption.textContent = `Screen ${index + 1} of ${project.media.length}`;
    dots.textContent = `${index + 1} / ${project.media.length}`;
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + project.media.length) % project.media.length;
    render();
  });
  nextBtn.addEventListener("click", () => {
    index = (index + 1) % project.media.length;
    render();
  });

  render();
  wrap.append(frame, controls, caption);
  return wrap;
}
