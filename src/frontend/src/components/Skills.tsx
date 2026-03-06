import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface Skill {
  name: string;
  level: number;
  icon: string;
}

interface SoftSkill {
  name: string;
  description: string;
  icon: string;
}

const technicalSkills: Skill[] = [
  { name: "React / Next.js", level: 95, icon: "⚛️" },
  { name: "TypeScript", level: 90, icon: "🔷" },
  { name: "Node.js / Express", level: 85, icon: "🟢" },
  { name: "Python / Django", level: 78, icon: "🐍" },
  { name: "PostgreSQL / MongoDB", level: 82, icon: "🗄️" },
  { name: "AWS / Docker", level: 75, icon: "☁️" },
  { name: "GraphQL", level: 70, icon: "🔗" },
  { name: "Tailwind CSS", level: 92, icon: "🎨" },
];

const softSkills: SoftSkill[] = [
  {
    name: "Problem Solving",
    description: "Breaking complex challenges into elegant solutions",
    icon: "🧩",
  },
  {
    name: "Communication",
    description: "Clear technical writing and team collaboration",
    icon: "💬",
  },
  {
    name: "Leadership",
    description: "Mentoring junior devs and leading sprints",
    icon: "🚀",
  },
  {
    name: "Adaptability",
    description: "Quick learner, thrives in fast-paced environments",
    icon: "🌱",
  },
];

function SkillBar({ skill, animate }: { skill: Skill; animate: boolean }) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{skill.icon}</span>
          <span className="text-sm font-medium text-foreground">
            {skill.name}
          </span>
        </div>
        <span className="text-xs font-semibold text-teal">{skill.level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full skill-bar-fill"
          style={{
            width: animate ? `${skill.level}%` : "0%",
            background:
              "linear-gradient(90deg, oklch(0.58 0.18 185), oklch(0.82 0.12 185))",
          }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: barsRef, isVisible: barsVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: softRef, isVisible: softVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  return (
    <section id="skills" className="py-24 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 scroll-hidden ${sectionVisible ? "scroll-visible" : ""}`}
        >
          <span className="text-teal text-sm font-semibold tracking-widest uppercase">
            My Skills
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Tools & Technologies
          </h2>
          <div className="mt-4 w-16 h-1 bg-teal mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Technical Skills */}
          <div
            ref={barsRef}
            className={`scroll-hidden-left ${barsVisible ? "scroll-visible" : ""}`}
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal text-sm">
                ⚡
              </span>
              Technical Skills
            </h3>
            <div className="space-y-5">
              {technicalSkills.map((skill, i) => (
                <div
                  key={skill.name}
                  className={`scroll-hidden ${barsVisible ? "scroll-visible" : ""}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <SkillBar skill={skill} animate={barsVisible} />
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div
            ref={softRef}
            className={`scroll-hidden-right ${softVisible ? "scroll-visible" : ""}`}
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal text-sm">
                🌟
              </span>
              Soft Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {softSkills.map((skill, i) => (
                <div
                  key={skill.name}
                  className={`p-5 rounded-2xl bg-card border border-border hover:border-teal/40 hover:shadow-teal-glow transition-all duration-300 group scroll-hidden ${softVisible ? "scroll-visible" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-3xl mb-3">{skill.icon}</div>
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-teal transition-colors">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional tech badges */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Also familiar with
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Redis",
                  "Kubernetes",
                  "Figma",
                  "Jest",
                  "Cypress",
                  "Prisma",
                  "tRPC",
                  "Rust",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20 hover:bg-teal/20 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
