import { Calendar, Heart, MapPin, Zap } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export function About() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({
    threshold: 0.2,
  });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 scroll-hidden ${sectionVisible ? "scroll-visible" : ""}`}
        >
          <span className="text-teal text-sm font-semibold tracking-widest uppercase">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Crafting Digital Experiences
          </h2>
          <div className="mt-4 w-16 h-1 bg-teal mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile image */}
          <div
            ref={imageRef}
            className={`scroll-hidden-left ${imageVisible ? "scroll-visible" : ""} flex justify-center`}
          >
            <div className="relative">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-teal/30 shadow-teal-glow">
                <img
                  src="/assets/generated/avatar-placeholder.dim_400x400.png"
                  alt="Alex Johnson - Full-Stack Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-teal/10 border border-teal/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-lg bg-teal/5 border border-teal/10 -z-10" />
              {/* Status badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-xs whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-foreground">
                  Open to Work
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className={`scroll-hidden-right ${contentVisible ? "scroll-visible" : ""}`}
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Hi, I'm Alex — a developer who loves building things that matter.
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With over 5 years of experience in full-stack development, I
              specialize in building scalable web applications using React,
              Node.js, and cloud technologies. I'm passionate about creating
              intuitive user interfaces and writing clean, maintainable code.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              When I'm not coding, you'll find me contributing to open-source
              projects, writing technical articles, or exploring the latest
              trends in web development and design systems.
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: MapPin, label: "Location", value: "San Francisco, CA" },
                { icon: Calendar, label: "Experience", value: "5+ Years" },
                { icon: Zap, label: "Availability", value: "Immediate Start" },
                {
                  icon: Heart,
                  label: "Interests",
                  value: "OSS, Design, Coffee",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark transition-all duration-200 shadow-teal-glow hover:shadow-teal-glow-lg hover:scale-105"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
