import { createContext, useContext } from "react";

export interface Appearance {
  highContrastDark: boolean;
  toggle: () => void;
  pageClass: string;
  surfaceClass: string;
  mutedTextClass: string;
}

export const buttonClass =
  "rounded-md border-2 border-current px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4";

export const AppearanceContext = createContext<Appearance | null>(null);

export function useAppearance(): Appearance {
  const appearance = useContext(AppearanceContext);

  if (!appearance) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }

  return appearance;
}
