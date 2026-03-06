import { ExternalLink, Zap } from "lucide-react";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Use Cases", href: "#use-cases" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Technology",
    links: [
      {
        label: "Internet Computer",
        href: "https://internetcomputer.org",
        external: true,
      },
      {
        label: "DFINITY Foundation",
        href: "https://dfinity.org",
        external: true,
      },
      {
        label: "ICP Ecosystem",
        href: "https://internetcomputer.org/ecosystem",
        external: true,
      },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "caffeine.ai", href: "https://caffeine.ai", external: true },
      { label: "Blog", href: "https://caffeine.ai/blog", external: true },
    ],
  },
];

export function CaffeineFooter() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const handleLinkClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, "_blank", "noopener noreferrer");
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-border/50 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.82 0.20 196 / 0.04) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top section */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan to-indigo opacity-80" />
                <Zap
                  className="relative z-10 w-4 h-4 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                caffeine
                <span className="text-gradient-cyan">.ai</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The world&apos;s first AI platform for building and deploying
              full-stack apps through conversation.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="font-display font-semibold text-sm text-foreground mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(link.href, link.external)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/70">
            &copy; {year}. Built with <span className="text-red-400/80">♥</span>{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan/70 hover:text-cyan transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
            <span>Deployed on</span>
            <span className="font-mono font-semibold text-indigo/70 ml-1">
              Internet Computer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
