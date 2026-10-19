import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AppearanceContext } from "../hooks/useAppearance";
import type {
  Appearance,
  FontSizeScale,
  ThemeMode,
  ViewMode,
} from "../hooks/useAppearance";

interface AppearanceProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  highContrast: "nimbus_high_contrast",
  theme: "nimbus_theme",
  viewMode: "nimbus_view_mode",
  fontSize: "nimbus_font_size",
};

export function AppearanceProvider({ children }: AppearanceProviderProps) {
  const [highContrastDark, setHighContrastDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.highContrast) === "true";
    } catch {
      return false;
    }
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEYS.theme,
      ) as ThemeMode | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    } catch {
      // fallback
    }
    return "system";
  });

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEYS.viewMode,
      ) as ViewMode | null;
      if (saved === "simple" || saved === "detailed") {
        return saved;
      }
    } catch {
      // fallback
    }
    return "detailed";
  });

  const [fontSize, setFontSizeState] = useState<FontSizeScale>(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEYS.fontSize,
      ) as FontSizeScale | null;
      if (saved === "sm" || saved === "base" || saved === "lg") {
        return saved;
      }
    } catch {
      // fallback
    }
    return "base";
  });

  const toggle = useCallback(() => {
    setHighContrastDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.highContrast, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, mode);
    } catch {
      // ignore
    }
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.viewMode, mode);
    } catch {
      // ignore
    }
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewModeState((prev) => {
      const next = prev === "detailed" ? "simple" : "detailed";
      try {
        localStorage.setItem(STORAGE_KEYS.viewMode, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setFontSize = useCallback((scale: FontSizeScale) => {
    setFontSizeState(scale);
    try {
      localStorage.setItem(STORAGE_KEYS.fontSize, scale);
    } catch {
      // ignore
    }
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSizeState((prev) => {
      const next = prev === "sm" ? "base" : prev === "base" ? "lg" : "lg";
      try {
        localStorage.setItem(STORAGE_KEYS.fontSize, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSizeState((prev) => {
      const next = prev === "lg" ? "base" : prev === "base" ? "sm" : "sm";
      try {
        localStorage.setItem(STORAGE_KEYS.fontSize, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyDark = () => {
      if (highContrastDark) {
        root.classList.add("dark");
        return;
      }

      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // system
        if (mediaQuery.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyDark();

    const listener = () => {
      if (theme === "system" && !highContrastDark) {
        applyDark();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme, highContrastDark]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "high-contrast",
      highContrastDark,
    );
  }, [highContrastDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === "sm") {
      root.style.fontSize = "14px";
    } else if (fontSize === "lg") {
      root.style.fontSize = "18px";
    } else {
      root.style.fontSize = "16px";
    }
  }, [fontSize]);

  const appearance = useMemo<Appearance>(() => {
    const isGlassEnabled = !highContrastDark;
    if (highContrastDark) {
      return {
        highContrastDark: true,
        toggle,
        pageClass:
          "bg-black text-white selection:bg-white selection:text-black",
        surfaceClass: "border-2 border-white bg-black text-white shadow-none",
        mutedTextClass: "text-slate-100 font-medium",
        theme,
        setTheme,
        viewMode,
        setViewMode,
        toggleViewMode,
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        isGlassEnabled,
        glassSurfaceClass:
          "border-2 border-white bg-black text-white shadow-none",
      };
    }

    return {
      highContrastDark: false,
      toggle,
      pageClass: "text-ink selection:bg-sky-300/60",
      surfaceClass: "glass",
      mutedTextClass: "text-ink-muted",
      theme,
      setTheme,
      viewMode,
      setViewMode,
      toggleViewMode,
      fontSize,
      setFontSize,
      increaseFontSize,
      decreaseFontSize,
      isGlassEnabled,
      glassSurfaceClass: "glass",
    };
  }, [
    highContrastDark,
    toggle,
    theme,
    setTheme,
    viewMode,
    setViewMode,
    toggleViewMode,
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
  ]);

  return (
    <AppearanceContext.Provider value={appearance}>
      {children}
    </AppearanceContext.Provider>
  );
}
