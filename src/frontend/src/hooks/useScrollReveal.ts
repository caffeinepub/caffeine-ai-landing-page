import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const targets = root.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right",
    );
    for (const el of targets) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref as React.RefObject<HTMLElement>;
}
