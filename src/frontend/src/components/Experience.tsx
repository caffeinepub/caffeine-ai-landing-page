import { Briefcase, Calendar, GraduationCap } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface TimelineEntry {
  id: number;
  type: "work" | "education";
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}

const timeline: TimelineEntry[] = [
  {
    id: 1,
    type: "work",
    role: "Senior Full-Stack Engineer",
    company: "Vercel",
    period: "Jan 2023 – Present",
    location: "San Francisco, CA (Remote)",
    description:
      "Leading development of the Next.js deployment pipeline and developer experience tooling used by millions of developers worldwide.",
    highlights: [
      "Reduced cold start times by 40% through edge runtime optimizations",
      "Architected a new CI/CD pipeline serving 500K+ deployments/day",
      "Mentored a team of 4 junior engineers",
    ],
  },
  {
    id: 2,
    type: "work",
    role: "Full-Stack Developer",
    company: "Stripe",
    period: "Mar 2021 – Dec 2022",
    location: "San Francisco, CA",
    description:
      "Built and maintained core features of the Stripe Dashboard, focusing on the payments analytics and reporting modules.",
    highlights: [
      "Shipped the new Revenue Recognition module used by 10K+ businesses",
      "Improved dashboard load time by 35% via code splitting and lazy loading",
      "Contributed to the internal design system with 20+ new components",
    ],
  },
  {
    id: 3,
    type: "work",
    role: "Frontend Developer",
    company: "Figma",
    period: "Jun 2019 – Feb 2021",
    location: "San Francisco, CA",
    description:
      "Worked on the Figma web editor, implementing new collaboration features and performance improvements for the canvas rendering engine.",
    highlights: [
      "Implemented real-time cursor presence for multiplayer editing",
      "Optimized SVG rendering pipeline, improving frame rate by 25%",
      "Built the plugin marketplace frontend from scratch",
    ],
  },
  {
    id: 4,
    type: "education",
    role: "B.S. Computer Science",
    company: "UC Berkeley",
    period: "2015 – 2019",
    location: "Berkeley, CA",
    description:
      "Graduated with honors, specializing in Human-Computer Interaction and Distributed Systems. Senior thesis on WebAssembly performance optimization.",
    highlights: [
      "GPA: 3.9/4.0 — Dean's List all semesters",
      "President of the Web Development Club",
      "Teaching Assistant for CS61B Data Structures",
    ],
  },
];

function TimelineItem({
  entry,
  index,
}: { entry: TimelineEntry; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 ${
        isLeft ? "scroll-hidden-left" : "scroll-hidden-right"
      } ${isVisible ? "scroll-visible" : ""}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Timeline dot */}
      <div className="relative flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-card border-2 border-teal flex items-center justify-center shadow-teal-glow z-10 relative">
          {entry.type === "work" ? (
            <Briefcase className="w-4 h-4 text-teal" />
          ) : (
            <GraduationCap className="w-4 h-4 text-teal" />
          )}
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 pb-10">
        <div className="bg-card border border-border rounded-2xl p-6 hover:border-teal/40 hover:shadow-teal-glow transition-all duration-300 group">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-teal transition-colors">
                {entry.role}
              </h3>
              <p className="text-teal font-semibold text-sm">{entry.company}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {entry.period}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {entry.location}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {entry.description}
          </p>

          <ul className="space-y-1.5">
            {entry.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

  return (
    <section id="experience" className="py-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 scroll-hidden ${sectionVisible ? "scroll-visible" : ""}`}
        >
          <span className="text-teal text-sm font-semibold tracking-widest uppercase">
            My Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Experience & Education
          </h2>
          <div className="mt-4 w-16 h-1 bg-teal mx-auto rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal via-teal/50 to-transparent" />

          <div className="space-y-0">
            {timeline.map((entry, index) => (
              <TimelineItem key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
