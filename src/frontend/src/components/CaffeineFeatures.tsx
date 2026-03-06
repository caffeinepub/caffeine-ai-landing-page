import { Code2, Cpu, Layers, RefreshCw, Rocket, Wand2 } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

type CodeLine = { text: string; kind: "comment" | "method" | "normal" };

const codeLines: CodeLine[] = [
  { text: "// Describe it. Caffeine builds it.", kind: "comment" },
  { text: "const app = await caffeine.build({", kind: "method" },
  { text: '  prompt: "SaaS dashboard with auth,', kind: "normal" },
  { text: '           analytics + billing",', kind: "normal" },
  { text: '  stack: "fullstack"', kind: "normal" },
  { text: "});", kind: "normal" },
  { text: "", kind: "normal" },
  { text: "app.deploy(); // ✓ Live in < 5 min", kind: "method" },
];

const primaryFeatures = [
  {
    icon: Wand2,
    title: "Self-Writing Apps",
    desc: "Describe your idea in plain language and watch Caffeine write every line of code — from UI components to database schemas.",
    wide: true,
    showCode: true,
  },
  {
    icon: Code2,
    title: "No Code Required",
    desc: "You don't need to know React, Motoko, SQL, or any other technology. If you can describe it, Caffeine can build it.",
    wide: true,
    showCode: false,
  },
];

const secondaryFeatures = [
  {
    icon: Layers,
    title: "Full-Stack Generation",
    desc: "Frontend, backend API, and database — all wired together and optimized automatically.",
  },
  {
    icon: Cpu,
    title: "AI-Native Infrastructure",
    desc: "Built on ICP, a blockchain designed from the ground up to host AI-generated apps.",
  },
  {
    icon: Rocket,
    title: "Instant Deployment",
    desc: "Skip CI/CD and servers. Deploy globally in under 5 minutes.",
  },
  {
    icon: RefreshCw,
    title: "Always Editable",
    desc: "Change your mind? Just chat. Caffeine updates your running app on demand.",
  },
];

export function CaffeineFeatures() {
  const ref = useScrollReveal();

  return (
    <section
      id="features"
      data-ocid="features.section"
      className="py-24 sm:py-32 relative overflow-hidden"
      ref={ref}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.82 0.20 196 / 0.05) 0%, transparent 100%)",
        }}
      />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.82 0.20 196) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(0.82 0.20 196) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan mb-4">
            Platform Features
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight tracking-tight mb-4">
            Everything you need.
            <br />
            <span className="text-gradient-cyan">Nothing you don&apos;t.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Caffeine handles the full stack so you can focus on what matters —
            building something people love.
          </p>
        </div>

        {/* Bento grid — row 1: 2 wide cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {primaryFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`reveal delay-${i * 150 + 100} group glass-card rounded-3xl p-8 sm:p-10 flex flex-col gap-5 relative overflow-hidden`}
            >
              {/* Subtle large bg icon */}
              <feature.icon
                className="absolute top-5 right-6 w-28 h-28 opacity-[0.035] text-cyan pointer-events-none"
                strokeWidth={1}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.20 196 / 0.18), oklch(0.60 0.22 264 / 0.10))",
                  border: "1px solid oklch(0.82 0.20 196 / 0.25)",
                }}
              >
                <feature.icon className="w-5 h-5 text-cyan" />
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                  {feature.desc}
                </p>
              </div>

              {feature.showCode && (
                <div
                  className="mt-1 rounded-xl overflow-hidden text-xs font-mono leading-relaxed"
                  style={{
                    background: "oklch(0.07 0.02 258 / 0.8)",
                    border: "1px solid oklch(0.82 0.20 196 / 0.15)",
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 px-4 py-2 border-b"
                    style={{ borderColor: "oklch(0.82 0.20 196 / 0.12)" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-destructive/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <span className="w-2 h-2 rounded-full bg-cyan/60" />
                    <span className="ml-2 text-muted-foreground/50 text-[10px]">
                      app.ts
                    </span>
                  </div>
                  <pre className="px-4 py-4 text-[11px] leading-5 overflow-x-auto">
                    <code>
                      {codeLines.map(({ text, kind }) => (
                        <div key={text || "empty"}>
                          {kind === "comment" ? (
                            <span style={{ color: "oklch(0.55 0.015 255)" }}>
                              {text}
                            </span>
                          ) : kind === "method" ? (
                            <span style={{ color: "oklch(0.82 0.20 196)" }}>
                              {text}
                            </span>
                          ) : (
                            <span style={{ color: "oklch(0.82 0.008 255)" }}>
                              {text || "\u00A0"}
                            </span>
                          )}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bento grid — row 2: 4 standard cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {secondaryFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`reveal delay-${i * 100 + 300} group glass-card rounded-2xl p-6 flex flex-col gap-4`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.20 196 / 0.15), oklch(0.60 0.22 264 / 0.08))",
                  border: "1px solid oklch(0.82 0.20 196 / 0.2)",
                }}
              >
                <feature.icon className="w-4 h-4 text-cyan" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
