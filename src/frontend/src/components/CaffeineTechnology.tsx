import { Globe, Lock, Shield, Zap } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const icpFeatures = [
  {
    icon: Shield,
    title: "Blockchain-Native Hosting",
    desc: "Apps run directly on-chain — no cloud servers, no data centers, no single point of failure.",
  },
  {
    icon: Zap,
    title: "AI-Optimized Stack",
    desc: "ICP is designed from the ground up to host AI-generated apps at massive scale with low latency.",
  },
  {
    icon: Globe,
    title: "Globally Distributed",
    desc: "Deployed across a decentralized network of data centers worldwide for maximum reliability.",
  },
  {
    icon: Lock,
    title: "Motoko Language",
    desc: "A type-safe programming language purpose-built for the Internet Computer and smart contract apps.",
  },
];

export function CaffeineTechnology() {
  const ref = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 80% 50%, oklch(0.60 0.22 264 / 0.08) 0%, transparent 100%),
            radial-gradient(ellipse 40% 50% at 20% 50%, oklch(0.82 0.20 196 / 0.06) 0%, transparent 100%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan mb-4 reveal">
              Technology
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground leading-tight tracking-tight mb-6 reveal delay-100">
              Powered by the
              <br />
              <span className="text-gradient-cyan">Internet Computer</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 reveal delay-200">
              The Internet Computer (ICP) is a third-generation blockchain
              designed to run smart contracts at web speed — making it the ideal
              infrastructure for AI-built, always-on applications. Your Caffeine
              apps don&apos;t just run in the cloud — they live on-chain.
            </p>

            {/* ICP badge */}
            <div className="inline-flex items-center gap-3 glass-card px-5 py-3 rounded-2xl reveal delay-300">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.20 196 / 0.25), oklch(0.60 0.22 264 / 0.15))",
                  border: "1px solid oklch(0.82 0.20 196 / 0.3)",
                  color: "oklch(0.82 0.20 196)",
                }}
              >
                ICP
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Internet Computer Protocol
                </div>
                <div className="text-xs text-muted-foreground">
                  by DFINITY Foundation
                </div>
              </div>
            </div>
          </div>

          {/* Right: feature grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {icpFeatures.map((feat, i) => (
              <div
                key={feat.title}
                className={`reveal delay-${i * 100 + 100} glass-card rounded-2xl p-6 flex flex-col gap-3`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.20 196 / 0.15), oklch(0.60 0.22 264 / 0.08))",
                    border: "1px solid oklch(0.82 0.20 196 / 0.2)",
                  }}
                >
                  <feat.icon className="w-4 h-4 text-cyan" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
