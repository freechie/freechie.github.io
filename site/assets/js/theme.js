const THEME_KEY = "theme";
const THEME_MODES = ["auto", "light", "dark"];

export function getMedia(query) {
  if (typeof window.matchMedia !== "function") return null;
  return window.matchMedia(query);
}

export function getThemeMode() {
  try {
    const theme = window.localStorage.getItem(THEME_KEY);
    return theme === "light" || theme === "dark" ? theme : "auto";
  } catch (_error) {
    return "auto";
  }
}

function resolveTheme(mode) {
  if (mode !== "auto") return mode;
  const media = getMedia("(prefers-color-scheme: light)");
  return media && media.matches ? "light" : "dark";
}

export function applyThemeMode(mode) {
  const normalizedMode = THEME_MODES.includes(mode) ? mode : "auto";
  document.documentElement.dataset.theme = resolveTheme(normalizedMode);

  try {
    if (normalizedMode === "auto") {
      window.localStorage.removeItem(THEME_KEY);
    } else {
      window.localStorage.setItem(THEME_KEY, normalizedMode);
    }
  } catch (_error) {
    // The resolved theme still applies when storage is unavailable.
  }
}

export function prefersReducedMotion() {
  const media = getMedia("(prefers-reduced-motion: reduce)");
  return Boolean(media && media.matches);
}

export function scrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}

export function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  function updateLabel() {
    const mode = getThemeMode();
    const icons = {
      auto: "\uD83C\uDF17",
      light: "\u2600\uFE0F",
      dark: "\uD83C\uDF19",
    };
    const labels = {
      auto: "Theme: auto (system) - click for light",
      light: "Theme: light - click for dark",
      dark: "Theme: dark - click for auto",
    };
    button.textContent = icons[mode];
    button.setAttribute("aria-label", labels[mode]);
  }

  button.addEventListener("click", () => {
    const current = getThemeMode();
    const next = THEME_MODES[(THEME_MODES.indexOf(current) + 1) % 3];
    applyThemeMode(next);
    updateLabel();
  });

  const colorMedia = getMedia("(prefers-color-scheme: light)");
  if (colorMedia) {
    const handleSystemThemeChange = () => {
      if (getThemeMode() === "auto") applyThemeMode("auto");
      updateLabel();
    };

    if (typeof colorMedia.addEventListener === "function") {
      colorMedia.addEventListener("change", handleSystemThemeChange);
    } else if (typeof colorMedia.addListener === "function") {
      colorMedia.addListener(handleSystemThemeChange);
    }
  }

  updateLabel();
}
