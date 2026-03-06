import { ExternalLink, Github, Tag } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: "CloudSync Dashboard",
    description:
      "A real-time analytics dashboard for cloud infrastructure monitoring with live metrics, alerting, and team collaboration features.",
    image: "/assets/generated/project-thumb-1.dim_600x400.png",
    tags: ["React", "TypeScript", "Node.js", "WebSockets", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://example.com",
    featured: true,
  },
  {
    id: 2,
    title: "DevFlow API Platform",
    description:
      "A developer-first API management platform with auto-generated docs, rate limiting, and usage analytics for teams.",
    image: "/assets/generated/project-thumb-2.dim_600x400.png",
    tags: ["Next.js", "GraphQL", "Prisma", "Docker", "Redis"],
    github: "https://github.com",
    demo: "https://example.com",
    featured: true,
  },
  {
    id: 3,
    title: "Palette AI",
    description:
      "An AI-powered design tool that generates cohesive color palettes and typography pairings from natural language descriptions.",
    image: "/assets/generated/project-thumb-3.dim_600x400.png",
    tags: ["Python", "FastAPI", "React", "OpenAI", "Tailwind"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: 4,
    title: "TaskFlow Pro",
    description:
      "A minimalist project management app with Kanban boards, time tracking, and Slack/GitHub integrations for small teams.",
    image: "/assets/generated/project-thumb-4.dim_600x400.png",
    tags: ["React", "Zustand", "Supabase", "Tailwind", "Vite"],
    github: "https://github.com",
    demo: "https://example.com",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-teal/40 hover:shadow-card-hover transition-all duration-500 scroll-hidden ${isVisible ? "scroll-visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {project.featured && (
        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal text-white">
          Featured
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover overlay links */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-teal hover:text-white transition-all duration-200 text-foreground"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-teal hover:text-white transition-all duration-200 text-foreground"
            aria-label="View live demo"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-teal transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-teal transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            Source Code
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-teal transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 scroll-hidden ${sectionVisible ? "scroll-visible" : ""}`}
        >
          <span className="text-teal text-sm font-semibold tracking-widest uppercase">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Featured Projects
          </h2>
          <div className="mt-4 w-16 h-1 bg-teal mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A selection of projects I've built — from developer tools to
            AI-powered applications.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View more */}
        <div className="text-center mt-12">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-teal/40 text-teal font-semibold text-sm hover:bg-teal/10 transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            View All Projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
