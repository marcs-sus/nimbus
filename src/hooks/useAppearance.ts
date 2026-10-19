import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ViewMode = "simple" | "detailed";
export type FontSizeScale = "sm" | "base" | "lg";

export interface Appearance {
  highContrastDark: boolean;
  toggle: () => void;
  pageClass: string;
  surfaceClass: string;
  mutedTextClass: string;

  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  isGlassEnabled: boolean;
  glassSurfaceClass: string;
}

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-current px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-95";

export const AppearanceContext = createContext<Appearance | null>(null);

export function useAppearance(): Appearance {
  const appearance = useContext(AppearanceContext);

  if (!appearance) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }

  return appearance;
}
