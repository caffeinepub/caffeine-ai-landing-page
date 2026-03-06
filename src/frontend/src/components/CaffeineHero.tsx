import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

export function CaffeineHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax tilt on mouse move
  useEffect(() => {
    const orbs =
      heroRef.current?.querySelectorAll<HTMLElement>(".parallax-orb");
    if (!orbs) return;

    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPct = (clientX / innerWidth - 0.5) * 2;
      const yPct = (clientY / innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 12;
        orb.style.transform = `translate(${xPct * factor}px, ${yPct * factor}px)`;
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1600x900.jpg)",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

      {/* Atmospheric orbs */}
      <div
        className="parallax-orb absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none transition-transform duration-100 ease-out"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.20 196 / 0.14) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="parallax-orb absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none transition-transform duration-100 ease-out"
        style={{
          background:
            "radial-gradient(circle, oklch(0.60 0.22 264 / 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="parallax-orb absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full pointer-events-none transition-transform duration-100 ease-out"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.20 196 / 0.10) 0%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.82 0.20 196) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(0.82 0.20 196) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm font-medium reveal visible">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-glow-pulse" />
          <span className="text-cyan-bright">
            Built on Internet Computer Blockchain
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 reveal delay-100">
          <span
            className="block"
            style={{
              background:
                "linear-gradient(110deg, oklch(0.97 0.005 250) 0%, oklch(0.88 0.18 196) 55%, oklch(0.96 0.008 250) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Build Any App.
          </span>
          <span className="relative inline-block text-foreground underline-draw">
            Just Chat.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 reveal delay-200">
          Caffeine is the world&apos;s first platform where you create and
          deploy full-stack applications simply by describing what you want. No
          code. No developers. No limits.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 reveal delay-300">
          <Button
            data-ocid="hero.primary.button"
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-cyan to-indigo text-white font-bold text-base px-8 py-6 rounded-2xl border-0 shadow-cyan-glow hover:shadow-cyan-glow-lg hover:scale-[1.03] transition-all duration-200 min-w-[200px]"
            onClick={() => window.open("https://caffeine.ai", "_blank")}
          >
            {/* Beam scan effect */}
            <span
              className="absolute inset-y-0 w-16 bg-white/20 skew-x-[-20deg] animate-beam-scan pointer-events-none"
              aria-hidden="true"
            />
            <Zap className="relative w-4 h-4 mr-2" strokeWidth={2.5} />
            <span className="relative">Start Building Free</span>
          </Button>

          <Button
            data-ocid="hero.secondary.button"
            size="lg"
            variant="outline"
            className="group flex items-center gap-2 glass border-border/60 hover:border-cyan/50 text-foreground font-semibold text-base px-8 py-6 rounded-2xl transition-all duration-200 min-w-[200px] hover:shadow-cyan-glow"
            onClick={() => {
              const el = document.querySelector("#how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See How It Works
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>

        {/* Terminal preview */}
        <div className="max-w-lg mx-auto glass-card rounded-2xl overflow-hidden shadow-glass reveal delay-400">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-muted/30">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan/70" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">
              caffeine.ai
            </span>
          </div>
          <div className="px-5 py-4 text-left">
            <p className="text-muted-foreground text-sm font-mono mb-1">
              <span className="text-cyan mr-2">→</span>
              <span className="text-foreground/70">You:</span>
            </p>
            <p className="text-foreground text-sm font-mono mb-3 leading-relaxed">
              &quot;Build me a SaaS dashboard with user auth, analytics charts,
              and subscription billing&quot;
            </p>
            <p className="text-muted-foreground text-sm font-mono mb-1">
              <span className="text-indigo mr-2">✦</span>
              <span className="text-cyan">Caffeine:</span>
            </p>
            <p className="text-cyan-bright text-sm font-mono">
              ✓ Frontend + Backend + Database generated
              <br />✓ Deployed to Internet Computer
              <br />
              <span className="text-cyan animate-pulse">▊</span>
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 mt-16 text-muted-foreground/50 reveal delay-600">
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
