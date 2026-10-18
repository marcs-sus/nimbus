import { useEffect } from "react";
import { Laptop, Minus, Moon, Plus, Sun, X } from "lucide-react";
import type { ReactNode } from "react";
import { useAppearance } from "../hooks/useAppearance";
import type { ThemeMode } from "../hooks/useAppearance";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES: { value: ThemeMode; label: string; icon: ReactNode }[] = [
  { value: "light", label: "Claro", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Escuro", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "Sistema", icon: <Laptop className="h-4 w-4" /> },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    highContrastDark,
    toggle: toggleHighContrast,
    theme,
    setTheme,
    viewMode,
    toggleViewMode,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    mutedTextClass,
  } = useAppearance();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fontLabel =
    fontSize === "sm" ? "Pequena" : fontSize === "lg" ? "Grande" : "Normal";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[8vh] sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="animate-fade fixed inset-0 bg-sky-950/20 backdrop-blur-sm dark:bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="glass-strong animate-pop relative z-10 max-h-[84vh] w-full max-w-md overflow-y-auto rounded-[32px] p-6">
        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-semibold">
            Opções
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar opções"
            className="glass-pill flex h-9 w-9 items-center justify-center rounded-full"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <section aria-labelledby="a11y-title">
            <h3
              id="a11y-title"
              className={`mb-2 px-1 text-sm font-medium ${mutedTextClass}`}
            >
              Acessibilidade
            </h3>

            <div className="glass divide-glass rounded-3xl px-4">
              <div className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-base font-medium">Alto contraste</p>
                  <p className={`text-sm ${mutedTextClass}`}>
                    Cores sólidas, sem transparência
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={highContrastDark}
                  aria-label="Alto contraste"
                  onClick={toggleHighContrast}
                  className="switch"
                >
                  <span className="switch-thumb" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-base font-medium">Tamanho do texto</p>
                  <p className={`text-sm ${mutedTextClass}`}>{fontLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseFontSize}
                    disabled={fontSize === "sm"}
                    aria-label="Diminuir fonte"
                    className="glass-pill flex h-9 w-9 items-center justify-center rounded-full"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={increaseFontSize}
                    disabled={fontSize === "lg"}
                    aria-label="Aumentar fonte"
                    className="glass-pill flex h-9 w-9 items-center justify-center rounded-full"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="theme-title">
            <h3
              id="theme-title"
              className={`mb-2 px-1 text-sm font-medium ${mutedTextClass}`}
            >
              Tema
            </h3>

            <div
              className="glass grid grid-cols-3 gap-1 rounded-full p-1"
              role="radiogroup"
              aria-labelledby="theme-title"
            >
              {THEMES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={theme === item.value}
                  onClick={() => setTheme(item.value)}
                  className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium transition-all ${
                    theme === item.value ? "glass-active" : "border border-transparent"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="view-title">
            <h3
              id="view-title"
              className={`mb-2 px-1 text-sm font-medium ${mutedTextClass}`}
            >
              Visualização
            </h3>

            <div className="glass flex items-center justify-between gap-4 rounded-3xl px-4 py-3.5">
              <div>
                <p className="text-base font-medium">Visualização detalhada</p>
                <p className={`text-sm ${mutedTextClass}`}>
                  {viewMode === "detailed"
                    ? "Vento, umidade, sol e estação"
                    : "Somente o essencial"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={viewMode === "detailed"}
                aria-label="Visualização detalhada"
                onClick={toggleViewMode}
                className="switch"
              >
                <span className="switch-thumb" />
              </button>
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-primary mt-6 w-full rounded-full py-3 text-base font-semibold"
        >
          Pronto
        </button>
      </div>
    </div>
  );
}
