import { useEffect } from "react";

/**
 * Faz o reflexo especular do liquid glass seguir o cursor,
 * atualizando --mx/--my no elemento de vidro sob o ponteiro.
 */
export function useGlassSpecular() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const el = target.closest<HTMLElement>(".glass, .glass-strong, .glass-pill");
      if (!el) return;

      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}
