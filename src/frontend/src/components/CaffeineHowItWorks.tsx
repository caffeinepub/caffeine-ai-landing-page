import { Cpu, Globe2, MessageSquare } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe",
    desc: "Tell Caffeine what you want to build in plain language — no jargon, no syntax, no special knowledge required.",
    accent: "from-cyan to-cyan-dark",
    glow: "oklch(0.82 0.20 196 / 0.25)",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Build",
    desc: "AI generates your complete app: frontend, backend, and database — all wired together and ready to run.",
    accent: "from-indigo to-cyan-dark",
    glow: "oklch(0.60 0.22 264 / 0.25)",
  },
  {
    number: "03",
    icon: Globe2,
    title: "Deploy",
    desc: "Your app goes live on the Internet Computer blockchain instantly — globally accessible, always available.",
    accent: "from-cyan-dark to-indigo",
    glow: "oklch(0.82 0.20 196 / 0.20)",
  },
];

export function CaffeineHowItWorks() {
  const ref = useScrollReveal();

  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 relative overflow-hidden"
      ref={ref}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, oklch(0.60 0.22 264 / 0.06) 0%, transparent 100%)",
        }}
      />

      <div
        data-ocid="how_it_works.section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section heading */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan mb-4">
            Simple Process
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight tracking-tight">
            Three steps.
            <br />
            <span className="text-gradient-cyan">Infinite possibilities.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector lines (desktop) */}
          <div
            className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-cyan/40 via-indigo/40 to-transparent pointer-events-none"
            style={{ zIndex: 0 }}
          />
          <div
            className="hidden md:block absolute top-16 left-2/3 right-0 h-px bg-gradient-to-r from-indigo/40 to-transparent pointer-events-none"
            style={{ zIndex: 0 }}
          />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal delay-${i * 150 + 100} relative glass-card rounded-3xl p-8 flex flex-col items-start`}
              style={{ zIndex: 1 }}
            >
              {/* Step number */}
              <div className="text-7xl font-display font-black leading-none text-foreground/5 select-none absolute top-4 right-6">
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative"
                style={{
                  background: `radial-gradient(circle, ${step.glow} 0%, transparent 70%)`,
                  border: `1px solid ${step.glow}`,
                }}
              >
                <step.icon className="w-6 h-6 text-cyan" />
              </div>

              {/* Step number pill */}
              <div
                className={`text-xs font-bold tracking-widest uppercase mb-3 bg-gradient-to-r ${step.accent} bg-clip-text text-transparent`}
              >
                Step {i + 1}
              </div>

              <h3 className="font-display font-bold text-2xl text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {step.desc}
              </p>

              {/* Bottom accent */}
              <div
                className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${step.accent} opacity-70`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
