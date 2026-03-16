(function() {
  var STORAGE_KEY = "site_theme";
  var LIGHT = "light";
  var DARK = "dark";
  var LIGHT_THEME_COLOR = "#f3f8ff";
  var DARK_THEME_COLOR = "#0f1729";

  function getStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === LIGHT || stored === DARK) {
        return stored;
      }
    } catch (e) {
      return null;
    }

    return null;
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return DARK;
    }
    return LIGHT;
  }

  function setThemeColor(theme) {
    var meta = document.getElementById("theme-color-meta");
    if (!meta) {
      return;
    }
    meta.setAttribute("content", theme === DARK ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  }

  function updateToggleUI(theme) {
    var button = document.getElementById("theme-toggle");
    if (!button) {
      return;
    }

    var icon = button.querySelector(".theme-toggle__icon");
    var text = button.querySelector(".theme-toggle__text");
    var isDark = theme === DARK;

    button.setAttribute("aria-pressed", isDark ? "true" : "false");
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

    if (text) {
      text.textContent = isDark ? "Light" : "Dark";
    }

    if (icon) {
      icon.className = "theme-toggle__icon " + (isDark ? "fas fa-sun" : "fas fa-moon");
    }
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    setThemeColor(theme);
    updateToggleUI(theme);

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        // Ignore storage errors in private mode.
      }
    }
  }

  function onToggleClick() {
    var current = document.documentElement.getAttribute("data-theme") === DARK ? DARK : LIGHT;
    var next = current === DARK ? LIGHT : DARK;
    applyTheme(next, true);
  }

  function handleSystemThemeChange(event) {
    if (getStoredTheme()) {
      return;
    }
    applyTheme(event.matches ? DARK : LIGHT, false);
  }

  function initThemeToggle() {
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.addEventListener("click", onToggleClick);
    }

    var activeTheme = document.documentElement.getAttribute("data-theme");
    if (activeTheme !== LIGHT && activeTheme !== DARK) {
      activeTheme = getStoredTheme() || getSystemTheme();
      applyTheme(activeTheme, false);
    } else {
      updateToggleUI(activeTheme);
      setThemeColor(activeTheme);
    }

    if (window.matchMedia) {
      var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkQuery.addEventListener) {
        darkQuery.addEventListener("change", handleSystemThemeChange);
      } else if (darkQuery.addListener) {
        darkQuery.addListener(handleSystemThemeChange);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
