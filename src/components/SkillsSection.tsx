import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Skill {
  name: string;
  level: number;
  color?: string;
}

const SkillBar = ({ skill, delay }: { skill: Skill; delay: number }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div ref={ref} className="mb-6" style={{ transitionDelay: `${delay}ms` }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-foreground font-body text-sm font-medium">{skill.name}</span>
        <span className="text-primary font-body text-sm">{skill.level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-red-500 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: isVisible ? `${skill.level}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const technicalSkills: Skill[] = [
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Python", level: 80 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 75 },
    { name: "HTML/CSS", level: 95 },
  ];

  const otherSkills: Skill[] = [
    { name: "UI/UX Design", level: 80 },
    { name: "Git & GitHub", level: 85 },
    { name: "Database Management", level: 70 },
    { name: "API Development", level: 75 },
    { name: "Problem Solving", level: 90 },
    { name: "Communication", level: 85 },
  ];

  return (
    <section id="skills" className="py-24 bg-card/30">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animation="fade-up" className="text-center mb-16">
          <p className="text-primary font-body uppercase tracking-widest mb-2">My Expertise</p>
          <h2 className="text-5xl md:text-6xl font-display text-foreground">Skills & Proficiency</h2>
        </ScrollAnimationWrapper>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Technical Skills */}
          <ScrollAnimationWrapper animation="fade-left">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-display text-foreground mb-8 flex items-center gap-3">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                Technical Skills
              </h3>
              {technicalSkills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} delay={index * 100} />
              ))}
            </div>
          </ScrollAnimationWrapper>

          {/* Other Skills */}
          <ScrollAnimationWrapper animation="fade-right">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-display text-foreground mb-8 flex items-center gap-3">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                Other Skills
              </h3>
              {otherSkills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} delay={index * 100} />
              ))}
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
