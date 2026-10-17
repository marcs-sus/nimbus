import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AppearanceContext } from "../hooks/useAppearance";
import type { Appearance } from "../hooks/useAppearance";

interface AppearanceProviderProps {
  children: ReactNode;
}

export function AppearanceProvider({ children }: AppearanceProviderProps) {
  const [highContrastDark, setHighContrastDark] = useState(false);

  const appearance = useMemo<Appearance>(
    () => ({
      highContrastDark,
      toggle: () => setHighContrastDark((current) => !current),
      pageClass: highContrastDark
        ? "bg-black text-white"
        : "bg-slate-50 text-slate-950",
      surfaceClass: highContrastDark
        ? "border-white bg-black"
        : "border-slate-200 bg-white",
      mutedTextClass: highContrastDark ? "text-slate-200" : "text-slate-600",
    }),
    [highContrastDark],
  );

  return (
    <AppearanceContext.Provider value={appearance}>
      {children}
    </AppearanceContext.Provider>
  );
}
