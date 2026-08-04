(function () {
  "use strict";

  const THEME_KEY = "flutter-a11y-theme";
  const toggle = document.getElementById("theme-toggle");
  const toggleIcon = toggle.querySelector(".theme-toggle-icon");
  const toggleLabel = toggle.querySelector(".theme-toggle-label");

  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const isDark =
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    toggle.setAttribute("aria-pressed", String(isDark));
    toggleIcon.textContent = isDark ? "☽" : "☀";
    toggleLabel.textContent = isDark ? "Light mode" : "Dark mode";
  }

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentlyDark = current === "dark" || (!current && prefersDark);
    const next = currentlyDark ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  applyTheme(localStorage.getItem(THEME_KEY));

  const principles = ["Perceivable", "Operable", "Understandable", "Robust"];
  const grid = document.getElementById("issue-grid");
  const resultCount = document.getElementById("result-count");
  const searchInput = document.getElementById("search-input");
  const principleFilters = document.getElementById("principle-filters");
  const platformSelect = document.getElementById("platform-filter");
  const emptyState = document.getElementById("empty-state");

  const state = {
    query: "",
    principle: "All",
    platform: "All",
  };

  function collectPlatforms() {
    const set = new Set();
    ISSUES.forEach((issue) => issue.platforms.forEach((p) => set.add(p)));
    return ["All", ...Array.from(set).sort()];
  }

  function populatePlatformFilter() {
    collectPlatforms().forEach((platform) => {
      const opt = document.createElement("option");
      opt.value = platform;
      opt.textContent = platform;
      platformSelect.appendChild(opt);
    });
  }

  function matches(issue) {
    if (state.principle !== "All" && issue.principle !== state.principle) return false;
    if (state.platform !== "All" && !issue.platforms.includes(state.platform)) return false;
    if (state.query) {
      const haystack = (issue.title + " " + issue.description + " " + issue.solution).toLowerCase();
      if (!haystack.includes(state.query.toLowerCase())) return false;
    }
    return true;
  }

  function renderCard(issue) {
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("data-principle", issue.principle);

    const badge = `<span class="badge badge-${issue.principle.toLowerCase()}">${issue.principle}</span>`;

    card.innerHTML = `
      <header class="card-header">
        ${badge}
        <h3>${issue.title}</h3>
      </header>
      <p class="card-desc">${issue.description}</p>
      <div class="solution">
        <h4>Suggested solution</h4>
        <p>${issue.solution}</p>
      </div>
      <button type="button" class="detail-trigger" data-issue-id="${issue.id}">
        View details <span class="sr-only">for ${issue.title}</span>
      </button>
    `;
    return card;
  }

  function render() {
    grid.innerHTML = "";
    const filtered = ISSUES.filter(matches);

    principles.forEach((principle) => {
      if (state.principle !== "All" && state.principle !== principle) return;
      const group = filtered.filter((i) => i.principle === principle);
      if (group.length === 0) return;

      const section = document.createElement("section");
      section.className = "principle-section";
      section.setAttribute("aria-labelledby", `heading-${principle}`);

      const info = PRINCIPLE_INFO[principle];
      section.innerHTML = `
        <h2 id="heading-${principle}" class="principle-heading">
          <span class="principle-letter">${info.letter}</span> ${principle}
          <span class="principle-count">${group.length}</span>
        </h2>
        <p class="principle-tagline">${info.tagline}</p>
      `;

      const list = document.createElement("div");
      list.className = "card-grid";
      group.forEach((issue) => list.appendChild(renderCard(issue)));
      section.appendChild(list);
      grid.appendChild(section);
    });

    resultCount.textContent = `${filtered.length} issue${filtered.length === 1 ? "" : "s"} shown`;
    emptyState.hidden = filtered.length !== 0;
  }

  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    render();
  });

  platformSelect.addEventListener("change", (e) => {
    state.platform = e.target.value;
    render();
  });

  principleFilters.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-principle]");
    if (!btn) return;
    state.principle = btn.getAttribute("data-principle");
    principleFilters.querySelectorAll("button").forEach((b) => {
      const active = b === btn;
      b.setAttribute("aria-pressed", String(active));
    });
    render();
  });

  populatePlatformFilter();
  render();

  // ---------------------------------------------------------- Detail panel
  const overlay = document.getElementById("detail-overlay");
  const panel = document.getElementById("detail-panel");
  const panelBadge = document.getElementById("detail-badge");
  const panelTitle = document.getElementById("detail-title");
  const panelPlatforms = document.getElementById("detail-platforms");
  const panelWcag = document.getElementById("detail-wcag");
  const panelSources = document.getElementById("detail-sources");
  const panelClose = document.getElementById("detail-close");
  let lastTrigger = null;

  function focusableInPanel() {
    return Array.from(
      panel.querySelectorAll('a[href], button:not([disabled])')
    );
  }

  function openDetail(issue, trigger) {
    lastTrigger = trigger;
    panelBadge.className = `badge badge-${issue.principle.toLowerCase()}`;
    panelBadge.textContent = issue.principle;
    panelTitle.textContent = issue.title;
    panelPlatforms.innerHTML = issue.platforms.map((p) => `<span class="pill">${p}</span>`).join("");
    panelWcag.innerHTML = issue.wcag.map((w) => `<span class="wcag-tag">${w}</span>`).join("");
    panelSources.innerHTML = issue.sources
      .map(
        (s) =>
          `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`
      )
      .join("");

    overlay.hidden = false;
    panel.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      panel.classList.add("is-open");
    });
    document.body.classList.add("detail-open");
    panelClose.focus();
    document.addEventListener("keydown", onPanelKeydown);
  }

  function closeDetail() {
    overlay.classList.remove("is-open");
    panel.classList.remove("is-open");
    document.body.classList.remove("detail-open");
    document.removeEventListener("keydown", onPanelKeydown);
    window.setTimeout(() => {
      overlay.hidden = true;
      panel.hidden = true;
    }, 200);
    if (lastTrigger) lastTrigger.focus();
  }

  function onPanelKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDetail();
      return;
    }
    if (e.key === "Tab") {
      const focusables = focusableInPanel();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  grid.addEventListener("click", (e) => {
    const trigger = e.target.closest(".detail-trigger");
    if (!trigger) return;
    const issue = ISSUES.find((i) => i.id === trigger.getAttribute("data-issue-id"));
    if (issue) openDetail(issue, trigger);
  });

  panelClose.addEventListener("click", closeDetail);
  overlay.addEventListener("click", closeDetail);
})();
