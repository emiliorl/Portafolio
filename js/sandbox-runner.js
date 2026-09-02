/**
 * sandbox-runner.js — Pyodide-backed Python sandbox.
 *
 * Pyodide is NOT loaded on page load (Review Notes #5) — it's several MB
 * and multi-second to initialize, which would contradict the site's
 * "blazing fast" static-first design. It's only injected on the first
 * "Launch Sandbox" click, cached on `window` after that so re-opening the
 * modal (or another Python project) doesn't reinitialize it.
 *
 * Security note (Review Notes #2): the code that runs here is a
 * self-contained synthetic-data demo with no network calls and no API
 * keys — never wire a real API key into anything executed in this sandbox.
 */

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";

let pyodideReadyPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function getPyodide() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = (async () => {
      await loadScript(PYODIDE_CDN);
      return await window.loadPyodide();
    })();
  }
  return pyodideReadyPromise;
}

function appendLine(terminalEl, text, cls) {
  const line = document.createElement("div");
  if (cls) line.className = cls;
  line.textContent = text;
  terminalEl.appendChild(line);
  terminalEl.scrollTop = terminalEl.scrollHeight;
}

/** @param {{sandbox: {demoCode: string}}} project */
export function buildPythonSandbox(project) {
  const wrap = document.createElement("div");

  const toolbar = document.createElement("div");
  toolbar.className = "sandbox-toolbar";

  const status = document.createElement("span");
  status.className = "sandbox-status";
  status.dataset.state = "idle";
  status.innerHTML = `<span class="sandbox-status__dot"></span><span class="sandbox-status__label">Idle — click Run</span>`;

  const runBtn = document.createElement("button");
  runBtn.className = "btn btn--primary btn--sm";
  runBtn.type = "button";
  runBtn.textContent = "▶ Run";

  toolbar.append(status, runBtn);

  const editor = document.createElement("textarea");
  editor.className = "code-editor";
  editor.spellcheck = false;
  editor.value = project.sandbox.demoCode;
  editor.setAttribute("aria-label", "Python code — editable");

  const terminal = document.createElement("div");
  terminal.className = "terminal";
  terminal.setAttribute("role", "log");
  appendLine(terminal, "$ ready. click Run to execute in an in-browser Python runtime (Pyodide/WASM).");

  function setStatus(state, label) {
    status.dataset.state = state;
    status.querySelector(".sandbox-status__label").textContent = label;
  }

  runBtn.addEventListener("click", async () => {
    runBtn.disabled = true;
    terminal.innerHTML = "";
    const start = performance.now();

    try {
      setStatus("loading", "Booting Python runtime…");
      appendLine(terminal, "$ booting pyodide (first run only, cached after)…");
      const pyodide = await getPyodide();

      setStatus("loading", "Running…");
      appendLine(terminal, "$ running…");

      let stdout = "";
      let stderr = "";
      pyodide.setStdout({ batched: (s) => (stdout += s + "\n") });
      pyodide.setStderr({ batched: (s) => (stderr += s + "\n") });

      await pyodide.runPythonAsync(editor.value);

      const ms = Math.round(performance.now() - start);
      if (stdout) appendLine(terminal, stdout.trimEnd(), "ok");
      if (stderr) appendLine(terminal, stderr.trimEnd(), "err");
      appendLine(terminal, `$ done in ${ms}ms`);
      setStatus("ready", `Done in ${ms}ms`);
    } catch (err) {
      appendLine(terminal, String(err), "err");
      setStatus("error", "Error — see output");
    } finally {
      runBtn.disabled = false;
    }
  });

  wrap.append(toolbar, editor, terminal);
  return wrap;
}
