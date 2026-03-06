import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const navLinks = [
  { label: "Features", href: "#features", ocid: "nav.features.link" },
  {
    label: "How It Works",
    href: "#how-it-works",
    ocid: "nav.how_it_works.link",
  },
  { label: "Use Cases", href: "#use-cases", ocid: "nav.use_cases.link" },
  { label: "FAQ", href: "#faq", ocid: "nav.faq.link" },
];

export function CaffeineNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-border/50 shadow-glass"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan to-indigo opacity-80 group-hover:opacity-100 transition-opacity" />
            <Zap
              className="relative z-10 w-4 h-4 text-white"
              strokeWidth={2.5}
            />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            caffeine
            <span className="text-gradient-cyan">.ai</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.ocid}
              data-ocid={link.ocid}
              onClick={() => handleNavClick(link.href)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-muted/50"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="nav.theme.toggle"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <Button
            type="button"
            data-ocid="nav.cta.button"
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-cyan to-indigo text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-cyan-glow hover:shadow-cyan-glow-lg hover:scale-[1.03] transition-all duration-200 border-0"
            onClick={() => window.open("https://caffeine.ai", "_blank")}
          >
            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
            Start Building
          </Button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/50 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.ocid}
              data-ocid={link.ocid}
              onClick={() => handleNavClick(link.href)}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 text-left"
            >
              {link.label}
            </button>
          ))}
          <Button
            type="button"
            className="mt-2 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan to-indigo text-white font-semibold text-sm px-5 py-2 rounded-xl border-0"
            onClick={() => {
              window.open("https://caffeine.ai", "_blank");
              setMobileOpen(false);
            }}
          >
            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
            Start Building
          </Button>
        </div>
      )}
    </header>
  );
}
