import { ArrowRight, BarChart3, Lightbulb, Palette } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const useCases = [
  {
    icon: Lightbulb,
    tag: "Entrepreneurs",
    title: "Turn startup ideas into real products",
    desc: "Have an idea for the next great SaaS? Build your MVP in minutes, not months. No developer required, no technical co-founder needed.",
    examples: [
      "SaaS dashboards",
      "Marketplace apps",
      "Booking platforms",
      "Customer portals",
    ],
    gradient: "from-cyan/20 to-transparent",
    border: "oklch(0.82 0.20 196 / 0.3)",
    iconBg: "oklch(0.82 0.20 196 / 0.15)",
  },
  {
    icon: Palette,
    tag: "Creators",
    title: "Build tools and portfolios that stand out",
    desc: "Showcase your work, build digital products, or create tools for your community — all without touching a line of code.",
    examples: [
      "Portfolio sites",
      "Content platforms",
      "Community tools",
      "Digital products",
    ],
    gradient: "from-indigo/20 to-transparent",
    border: "oklch(0.60 0.22 264 / 0.3)",
    iconBg: "oklch(0.60 0.22 264 / 0.15)",
  },
  {
    icon: BarChart3,
    tag: "Businesses",
    title: "Launch products and internal tools fast",
    desc: "Automate workflows, build internal dashboards, or launch customer-facing products — on demand, on budget.",
    examples: [
      "Analytics dashboards",
      "Internal tools",
      "Customer portals",
      "Data pipelines",
    ],
    gradient: "from-cyan-dark/20 to-transparent",
    border: "oklch(0.65 0.24 202 / 0.3)",
    iconBg: "oklch(0.65 0.24 202 / 0.15)",
  },
];

export function CaffeineUseCases() {
  const ref = useScrollReveal();

  return (
    <section
      id="use-cases"
      data-ocid="use_cases.section"
      className="py-24 sm:py-32 relative overflow-hidden"
      ref={ref}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.60 0.22 264 / 0.06) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan mb-4">
            Use Cases
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight tracking-tight">
            Built for every
            <br />
            <span className="text-gradient-cyan">kind of builder.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={uc.tag}
              className={`reveal delay-${i * 150 + 100} group glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden`}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${uc.gradient} opacity-60 pointer-events-none rounded-3xl`}
              />

              {/* Icon */}
              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: uc.iconBg,
                  border: `1px solid ${uc.border}`,
                }}
              >
                <uc.icon className="w-5 h-5 text-cyan" />
              </div>

              {/* Tag */}
              <span
                className="relative inline-block text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "oklch(0.82 0.20 196)" }}
              >
                {uc.tag}
              </span>

              <h3 className="relative font-display font-bold text-xl text-foreground mb-3 leading-tight">
                {uc.title}
              </h3>
              <p className="relative text-muted-foreground text-sm leading-relaxed mb-6">
                {uc.desc}
              </p>

              {/* Examples */}
              <div className="relative flex flex-wrap gap-2 mt-auto">
                {uc.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      background: "oklch(var(--muted) / 0.6)",
                      border: "1px solid oklch(var(--border) / 0.5)",
                      color: "oklch(var(--muted-foreground))",
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                type="button"
                className="relative mt-6 flex items-center gap-1.5 text-sm font-semibold text-cyan hover:text-cyan-bright transition-colors group/btn"
                onClick={() => window.open("https://caffeine.ai", "_blank")}
              >
                Start building
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
