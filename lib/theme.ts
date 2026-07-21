import "client-only";

export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "langler-theme";
export const THEME_COLOR_LIGHT = "#f9f7f3";
export const THEME_COLOR_DARK = "#0d0f15";

const listeners = new Set<() => void>();

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  function onStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY) onChange();
  }
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getServerTheme(): ThemePreference {
  return "system";
}

export function getStoredTheme(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") {
      return value;
    }
  } catch {
    // Storage is unavailable (private mode); fall back to the OS preference.
  }
  return "system";
}

function updateThemeColorMeta(preference: ThemePreference) {
  const existing = document.head.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"][data-runtime]',
  );
  if (preference === "system") {
    existing?.remove();
    return;
  }
  const meta = existing ?? document.createElement("meta");
  if (!existing) {
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("data-runtime", "");
    document.head.insertBefore(meta, document.head.firstChild);
  }
  meta.setAttribute(
    "content",
    preference === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT,
  );
}

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === "light" || preference === "dark") {
    root.setAttribute("data-theme", preference);
  } else {
    root.removeAttribute("data-theme");
  }
  updateThemeColorMeta(preference);
}

export function setStoredTheme(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Ignore storage failures; the in-memory preference still applies.
  }
  applyTheme(preference);
  listeners.forEach((listener) => listener());
}
