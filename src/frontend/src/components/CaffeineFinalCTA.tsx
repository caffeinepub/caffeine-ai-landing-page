import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export function CaffeineFinalCTA() {
  const ref = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" ref={ref}>
      {/* Background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.82 0.20 196 / 0.10) 0%, transparent 100%)
          `,
        }}
      />

      {/* Animated rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-64 h-64 rounded-full animate-pulse-ring"
          style={{ border: "1px solid oklch(0.82 0.20 196 / 0.15)" }}
        />
        <div
          className="absolute inset-0 w-64 h-64 rounded-full animate-pulse-ring"
          style={{
            border: "1px solid oklch(0.82 0.20 196 / 0.10)",
            animationDelay: "0.8s",
          }}
        />
        <div
          className="absolute inset-0 w-64 h-64 rounded-full animate-pulse-ring"
          style={{
            border: "1px solid oklch(0.82 0.20 196 / 0.06)",
            animationDelay: "1.6s",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan mb-6 reveal">
          Get Started Today
        </span>

        <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-foreground leading-[0.95] tracking-tight mb-6 reveal delay-100">
          Stop waiting.
          <br />
          <span className="text-gradient-cyan">Start building.</span>
        </h2>

        <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed reveal delay-200">
          Join thousands of entrepreneurs, creators, and businesses who are
          building the future — one conversation at a time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal delay-300">
          <Button
            data-ocid="final_cta.button"
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-cyan to-indigo text-white font-bold text-lg px-10 py-7 rounded-2xl border-0 shadow-cyan-glow-lg hover:shadow-cyan-glow-lg hover:scale-[1.04] transition-all duration-300 min-w-[240px]"
            onClick={() => window.open("https://caffeine.ai", "_blank")}
          >
            <span
              className="absolute inset-y-0 w-16 bg-white/20 skew-x-[-20deg] animate-beam-scan pointer-events-none"
              aria-hidden="true"
            />
            <Zap className="relative w-5 h-5 mr-2.5" strokeWidth={2.5} />
            <span className="relative">Start Building Free</span>
          </Button>
        </div>

        <p className="mt-5 text-xs text-muted-foreground/60 reveal delay-400">
          No credit card required · Free to get started · Deploy in minutes
        </p>
      </div>
    </section>
  );
}
