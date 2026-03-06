import { ArrowDown, Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useRef } from "react";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 210, 200, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 210, 200, ${p.opacity})`;
        ctx.fill();

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy dark:bg-navy">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.13 0.04 240), oklch(0.18 0.06 240), oklch(0.15 0.05 220), oklch(0.12 0.03 260))",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full animate-pulse-slow"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.15 185 / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 border"
            style={{
              background: "oklch(0.72 0.15 185 / 0.1)",
              borderColor: "oklch(0.72 0.15 185 / 0.3)",
              color: "oklch(0.82 0.12 185)",
            }}
          >
            👋 Available for new opportunities
          </span>
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 text-white">
            Alex Johnson
          </h1>
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.35s", animationFillMode: "both" }}
        >
          <p
            className="text-xl sm:text-2xl md:text-3xl font-light mb-6"
            style={{ color: "oklch(0.72 0.15 185)" }}
          >
            Full-Stack Developer & UI/UX Enthusiast
          </p>
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.5s", animationFillMode: "both" }}
        >
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "oklch(0.75 0.02 240)" }}
          >
            I craft beautiful, performant web experiences with modern
            technologies. Passionate about clean code, thoughtful design, and
            solving real-world problems.
          </p>
        </div>

        <div
          className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "0.65s", animationFillMode: "both" }}
        >
          <button
            type="button"
            onClick={scrollToAbout}
            className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-teal-glow-lg"
            style={{
              background: "oklch(0.72 0.15 185)",
              color: "oklch(0.1 0.04 240)",
              boxShadow: "0 0 20px oklch(0.72 0.15 185 / 0.3)",
            }}
          >
            Explore My Work
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3.5 rounded-xl font-semibold text-base border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: "oklch(0.72 0.15 185 / 0.4)",
              color: "oklch(0.82 0.12 185)",
              background: "transparent",
            }}
          >
            Get In Touch
          </button>
        </div>

        {/* Social links */}
        <div
          className="animate-fade-in-up flex items-center justify-center gap-4 mt-10"
          style={{ animationDelay: "0.8s", animationFillMode: "both" }}
        >
          {[
            { icon: Github, href: "https://github.com", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
            { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110"
              style={{
                borderColor: "oklch(0.72 0.15 185 / 0.3)",
                color: "oklch(0.75 0.02 240)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.72 0.15 185)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.72 0.15 185)";
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.72 0.15 185 / 0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.72 0.15 185 / 0.3)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.75 0.02 240)";
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float"
        style={{ color: "oklch(0.72 0.15 185 / 0.6)" }}
        aria-label="Scroll down"
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          Scroll
        </span>
        <ArrowDown className="w-4 h-4" />
      </button>
    </section>
  );
}
