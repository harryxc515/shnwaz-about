import { Code, Palette, Terminal, Zap } from "lucide-react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import ParallaxWrapper from "./ParallaxWrapper";
import profileImage from "@/assets/profile.jpg";

const AboutSection = () => {
  const skills = [
    { name: "Web Development", icon: Code },
    { name: "UI/UX Design", icon: Palette },
    { name: "Programming", icon: Terminal },
    { name: "Problem Solving", icon: Zap },
  ];

  return (
    <section id="about" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background parallax elements */}
      <ParallaxWrapper speed={0.15} direction="right" className="absolute top-20 left-10">
        <div className="w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      </ParallaxWrapper>
      <ParallaxWrapper speed={0.2} direction="left" className="absolute bottom-20 right-10">
        <div className="w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
      </ParallaxWrapper>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Image section */}
          <ParallaxWrapper speed={0.15} direction="up" scale className="flex-shrink-0">
            <ScrollAnimationWrapper animation="fade-left">
              <div className="relative">
                <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary rounded-2xl overflow-hidden mx-auto border-2 border-primary/30">
                  <img 
                    src={profileImage} 
                    alt="SHNWAZX Profile" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Decorative corner */}
                <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-lg -z-10" />
              </div>
            </ScrollAnimationWrapper>
          </ParallaxWrapper>

          {/* Content section */}
          <div className="flex-1 text-center lg:text-left">
            <ScrollAnimationWrapper animation="fade-up">
              <p className="text-primary font-body uppercase tracking-widest text-sm mb-2">About Me</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-foreground mb-4 md:mb-6">Who Am I</h2>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={100}>
              <p className="text-muted-foreground font-body leading-relaxed mb-6 md:mb-8 text-sm md:text-base max-w-xl mx-auto lg:mx-0">
                I am SHNWAZX, a passionate developer with a keen interest in creating innovative solutions. 
                My primary focus is on building beautiful and functional applications that provide exceptional user experiences.
                I'm constantly learning and exploring new technologies to stay at the cutting edge of development.
              </p>
            </ScrollAnimationWrapper>

            {/* Skills grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0">
              {skills.map((skill, index) => (
                <ScrollAnimationWrapper key={skill.name} animation="scale" delay={200 + index * 100}>
                  <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <skill.icon size={18} className="text-primary" />
                    </div>
                    <span className="text-foreground font-body text-xs md:text-sm">{skill.name}</span>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>

            <ScrollAnimationWrapper animation="fade-up" delay={600}>
              <a
                href="#contact"
                className="inline-block px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground font-body uppercase tracking-wider text-xs md:text-sm rounded hover:glow-primary-strong transition-all duration-300"
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
