/**
 * modal-manager.js — modal lifecycle: mount, focus trap, Esc/backdrop close,
 * focus restore. One modal open at a time.
 */

const root = document.getElementById("modal-root");
let activeBackdrop = null;
let lastFocused = null;

function getFocusable(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null);
}

function handleKeydown(e) {
  if (!activeBackdrop) return;
  if (e.key === "Escape") {
    e.preventDefault();
    closeModal();
    return;
  }
  if (e.key === "Tab") {
    const focusable = getFocusable(activeBackdrop);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

document.addEventListener("keydown", handleKeydown);

/**
 * @param {Object} opts
 * @param {string} opts.title
 * @param {HTMLElement} opts.bodyEl - fully built modal body content
 * @param {() => void} [opts.onClose]
 */
export function openModal({ title, bodyEl, onClose }) {
  closeModal(); // enforce single-modal-at-a-time

  lastFocused = document.activeElement;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.addEventListener("mousedown", (e) => {
    if (e.target === backdrop) closeModal();
  });

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", title);

  const header = document.createElement("div");
  header.className = "modal__header";
  header.innerHTML = `<h3 class="modal__title">${title}</h3>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "modal__close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close dialog");
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => closeModal());
  header.appendChild(closeBtn);

  const body = document.createElement("div");
  body.className = "modal__body";
  body.appendChild(bodyEl);

  modal.appendChild(header);
  modal.appendChild(body);
  backdrop.appendChild(modal);
  root.appendChild(backdrop);

  activeBackdrop = backdrop;
  activeBackdrop._onClose = onClose;

  // Animate in on next frame, then move focus into the modal.
  requestAnimationFrame(() => {
    backdrop.classList.add("is-open");
    const focusable = getFocusable(modal);
    (focusable[0] || closeBtn).focus();
  });
}

export function closeModal() {
  if (!activeBackdrop) return;
  const backdrop = activeBackdrop;
  const onClose = backdrop._onClose;
  activeBackdrop = null;

  backdrop.classList.remove("is-open");
  setTimeout(() => backdrop.remove(), 200);

  onClose?.();
  if (lastFocused && typeof lastFocused.focus === "function") {
    lastFocused.focus();
  }
  lastFocused = null;
}

/** Builds a tabbed header inside a modal body; returns {tabsEl, panelsEl, setActive}. */
export function buildTabs(tabs) {
  const tabsEl = document.createElement("div");
  tabsEl.className = "modal__tabs";
  tabsEl.setAttribute("role", "tablist");

  const panels = {};
  const panelsEl = document.createElement("div");

  tabs.forEach((tab, i) => {
    const btn = document.createElement("button");
    btn.className = "modal__tab";
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.textContent = tab.label;
    btn.addEventListener("click", () => setActive(tab.id));
    tabsEl.appendChild(btn);

    tab.panel.hidden = i !== 0;
    panels[tab.id] = { btn, panel: tab.panel };
    panelsEl.appendChild(tab.panel);
  });

  function setActive(id) {
    Object.entries(panels).forEach(([key, { btn, panel }]) => {
      const active = key === id;
      btn.setAttribute("aria-selected", String(active));
      panel.hidden = !active;
    });
  }

  return { tabsEl, panelsEl, setActive };
}
