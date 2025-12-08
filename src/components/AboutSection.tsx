import { Code, Palette, Terminal, Zap } from "lucide-react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";

const AboutSection = () => {
  const skills = [
    { name: "Web Development", icon: Code },
    { name: "UI/UX Design", icon: Palette },
    { name: "Programming", icon: Terminal },
    { name: "Problem Solving", icon: Zap },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image section */}
          <ScrollAnimationWrapper animation="fade-left" className="flex-1">
            <div className="relative">
              <div className="w-full max-w-md aspect-square bg-primary rounded-2xl overflow-hidden mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-primary to-red-800 flex items-center justify-center">
                  <span className="text-[12rem] font-display text-primary-foreground/20">S</span>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Content section */}
          <div className="flex-1">
            <ScrollAnimationWrapper animation="fade-up">
              <p className="text-primary font-body uppercase tracking-widest mb-2">About Me</p>
              <h2 className="text-5xl md:text-6xl font-display text-foreground mb-6">Who Am I</h2>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                I am SHNWAZX, a passionate developer with a keen interest in creating innovative solutions. 
                My primary focus is on building beautiful and functional applications that provide exceptional user experiences.
                I'm constantly learning and exploring new technologies to stay at the cutting edge of development.
              </p>
            </ScrollAnimationWrapper>

            {/* Skills grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {skills.map((skill, index) => (
                <ScrollAnimationWrapper key={skill.name} animation="scale" delay={200 + index * 100}>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors duration-300">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <skill.icon size={20} className="text-primary" />
                    </div>
                    <span className="text-foreground font-body text-sm">{skill.name}</span>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>

            <ScrollAnimationWrapper animation="fade-up" delay={600}>
              <a
                href="#contact"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground font-body uppercase tracking-wider text-sm rounded hover:glow-primary-strong transition-all duration-300"
              >
                Let's Connect
              </a>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
