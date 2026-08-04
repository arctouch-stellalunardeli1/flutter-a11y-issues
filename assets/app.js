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
    const platforms = issue.platforms
      .map((p) => `<span class="pill">${p}</span>`)
      .join("");
    const wcag = issue.wcag.map((w) => `<span class="wcag-tag">${w}</span>`).join("");
    const sources = issue.sources
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a>`)
      .join(", ");

    card.innerHTML = `
      <header class="card-header">
        ${badge}
        <h3>${issue.title}</h3>
      </header>
      <p class="card-desc">${issue.description}</p>
      <div class="pill-row" aria-label="Affected platforms">${platforms}</div>
      <div class="wcag-row" aria-label="Related WCAG success criteria">${wcag}</div>
      <div class="solution">
        <h4>Suggested solution</h4>
        <p>${issue.solution}</p>
      </div>
      <footer class="card-footer">
        <span class="sources-label">Sources:</span> ${sources}
      </footer>
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
})();
