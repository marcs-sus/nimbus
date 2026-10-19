import { useEffect, useRef, useState } from "react";

/**
 * Anima suavemente (ease-out) de um valor para o próximo.
 * Respeita `prefers-reduced-motion`.
 */
export function useEasedValue(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduce ? 0 : duration;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = total === 0 ? 1 : Math.min((now - start) / total, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;

      fromRef.current = next;
      setValue(next);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
