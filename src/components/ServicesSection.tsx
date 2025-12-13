import { Paintbrush, Code2, Smartphone, Globe, Rocket, Users } from "lucide-react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import ParallaxWrapper from "./ParallaxWrapper";

const ServicesSection = () => {
  const services = [
    {
      icon: Paintbrush,
      title: "Creative Design",
      description: "Crafting visually appealing and engaging user experiences with artistic elements.",
    },
    {
      icon: Code2,
      title: "Clean Code",
      description: "Writing well-structured, readable, and maintainable code following best practices.",
    },
    {
      icon: Smartphone,
      title: "User Interface",
      description: "Creating intuitive designs that prioritize usability and seamless interactions.",
    },
    {
      icon: Globe,
      title: "User Experience",
      description: "Building interfaces that are intuitive, efficient, and enjoyable to use.",
    },
    {
      icon: Rocket,
      title: "Fast Support",
      description: "Addressing and resolving inquiries quickly and efficiently.",
    },
    {
      icon: Users,
      title: "Branding",
      description: "Creating consistent experiences through logos, colors, and typography.",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-card/50 relative overflow-hidden">
      {/* Parallax background */}
      <ParallaxWrapper speed={0.25} direction="down" className="absolute top-0 left-1/4">
        <div className="w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </ParallaxWrapper>
      <ParallaxWrapper speed={0.2} direction="up" className="absolute bottom-0 right-1/4">
        <div className="w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </ParallaxWrapper>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollAnimationWrapper animation="fade-up" className="text-center mb-10 md:mb-16">
          <p className="text-primary font-body uppercase tracking-widest text-sm mb-2">My Services</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display text-foreground">What Can I Do</h2>
        </ScrollAnimationWrapper>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <ParallaxWrapper key={service.title} speed={0.05 + (index % 3) * 0.03} direction="up">
              <ScrollAnimationWrapper
                animation="scale"
                delay={index * 100}
              >
                <div className="group p-6 md:p-8 bg-card rounded-xl border border-border hover:border-primary transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:glow-primary transition-all duration-300">
                    <service.icon size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-display text-foreground mb-2 md:mb-3 tracking-wide">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            </ParallaxWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
