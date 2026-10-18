import { useEffect } from "react";
import {
  Aperture,
  Eye,
  LayoutGrid,
  List,
  Minus,
  Moon,
  Plus,
  Sun,
  Laptop,
  X,
} from "lucide-react";
import { useAppearance } from "../hooks/useAppearance";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    highContrastDark,
    toggle: toggleHighContrast,
    theme,
    setTheme,
    viewMode,
    setViewMode,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl p-6 transition-all shadow-2xl ${
          highContrastDark
            ? "border-2 border-white bg-black text-white"
            : "border border-white/30 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl text-slate-900 dark:text-white"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current/15">
          <div className="flex items-center gap-2">
            <Aperture className="w-5 h-5 opacity-80" />
            <h2 id="settings-title" className="text-lg font-bold">
              Configurações & Acessibilidade
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar configurações"
            className="rounded-full p-2 hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Seção Acessibilidade */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 opacity-75" />
              <h3 className="text-sm font-semibold uppercase tracking-wider opacity-75">
                Acessibilidade
              </h3>
            </div>

            {/* Alto Contraste */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10">
              <div>
                <p className="font-medium text-sm">Modo Alto Contraste</p>
                <p className={`text-xs ${mutedTextClass}`}>
                  Desativa transparências e aplica contraste máximo
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={highContrastDark}
                onClick={toggleHighContrast}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  highContrastDark
                    ? "bg-white border-2 border-black"
                    : "bg-slate-400/50 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-transform ${
                    highContrastDark
                      ? "translate-x-6 bg-black"
                      : "translate-x-1 bg-white"
                  }`}
                />
              </button>
            </div>

            {/* Tamanho da Fonte */}
            <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10">
              <div>
                <p className="font-medium text-sm">Tamanho do Texto</p>
                <p className={`text-xs ${mutedTextClass}`}>
                  Tamanho atual: {fontLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decreaseFontSize}
                  disabled={fontSize === "sm"}
                  aria-label="Diminuir fonte"
                  className="rounded-xl border border-current/30 p-2 text-xs font-semibold hover:bg-white/20 dark:hover:bg-black/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-xs font-bold">
                  {fontLabel}
                </span>
                <button
                  type="button"
                  onClick={increaseFontSize}
                  disabled={fontSize === "lg"}
                  aria-label="Aumentar fonte"
                  className="rounded-xl border border-current/30 p-2 text-xs font-semibold hover:bg-white/20 dark:hover:bg-black/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Seção Tema */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-4 h-4 opacity-75" />
              <h3 className="text-sm font-semibold uppercase tracking-wider opacity-75">
                Tema de Cores
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  theme === "light" && !highContrastDark
                    ? "border-sky-500 bg-sky-500/20 text-sky-900 dark:text-sky-200 shadow-sm"
                    : "border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 hover:bg-white/20"
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Claro</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  theme === "dark" && !highContrastDark
                    ? "border-indigo-500 bg-indigo-500/25 text-indigo-900 dark:text-indigo-200 shadow-sm"
                    : "border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 hover:bg-white/20"
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Escuro</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  theme === "system" && !highContrastDark
                    ? "border-purple-500 bg-purple-500/20 text-purple-900 dark:text-purple-200 shadow-sm"
                    : "border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 hover:bg-white/20"
                }`}
              >
                <Laptop className="w-5 h-5" />
                <span>Sistema</span>
              </button>
            </div>
          </div>

          {/* Seção Modo de Visualização */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid className="w-4 h-4 opacity-75" />
              <h3 className="text-sm font-semibold uppercase tracking-wider opacity-75">
                Modo de Visualização
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setViewMode("simple")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  viewMode === "simple"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold"
                    : "border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 hover:bg-white/20"
                }`}
              >
                <List className="w-4 h-4" />
                <span>Simplificada</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("detailed")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  viewMode === "detailed"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold"
                    : "border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 hover:bg-white/20"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Detalhada</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-current/15 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              highContrastDark
                ? "bg-white text-black"
                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow hover:opacity-90"
            }`}
          >
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
}
