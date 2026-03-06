import { useEffect, useRef } from "react";

const phrases = [
  "No Code Required",
  "Deploy in Minutes",
  "Full-Stack Apps",
  "Built on ICP",
  "AI-Generated",
  "Instant Deploy",
  "Frontend + Backend",
  "Web3 Native",
  "Zero Devs Needed",
  "Always Editable",
  "No Servers",
  "Chat to Build",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  // Duplicate for seamless loop — tag each copy for unique keys
  const items = [
    ...phrases.map((p) => ({ phrase: p, id: `a-${p}` })),
    ...phrases.map((p) => ({ phrase: p, id: `b-${p}` })),
  ];

  return (
    <div
      className={`flex items-center gap-0 ${reverse ? "marquee-reverse" : "marquee"}`}
    >
      {items.map(({ phrase, id }) => (
        <span
          key={id}
          className="flex items-center gap-4 px-4 whitespace-nowrap"
        >
          <span className="text-sm font-semibold tracking-wide text-foreground/70">
            {phrase}
          </span>
          <span
            className="w-1 h-1 rounded-full flex-shrink-0"
            style={{ background: "oklch(0.82 0.20 196 / 0.6)" }}
          />
        </span>
      ))}
    </div>
  );
}

export function CaffeineStats() {
  const ref = useRef<HTMLDivElement>(null);

  // Pause on hover
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pause = () => el.style.setProperty("--marquee-play", "paused");
    const play = () => el.style.setProperty("--marquee-play", "running");
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", play);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", play);
    };
  }, []);

  return (
    <section className="relative py-10 overflow-hidden" ref={ref}>
      {/* Separator lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Edge fades */}
      <div
        className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, oklch(var(--background)), transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, oklch(var(--background)), transparent)",
        }}
      />

      {/* Single marquee row */}
      <div className="overflow-hidden">
        <MarqueeRow />
      </div>
    </section>
  );
}
