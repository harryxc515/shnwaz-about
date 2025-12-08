import { Paintbrush, Code2, Smartphone, Globe, Rocket, Users } from "lucide-react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";

const ServicesSection = () => {
  const services = [
    {
      icon: Paintbrush,
      title: "Creative Design",
      description: "Leveraging artistic elements and aesthetic principles to craft visually appealing and engaging user experiences.",
    },
    {
      icon: Code2,
      title: "Clean Code",
      description: "Writing code that is well-structured, readable, and maintainable. It ensures following coding best practices.",
    },
    {
      icon: Smartphone,
      title: "User Interface",
      description: "Creating intuitive and user-friendly designs that prioritize usability, accessibility, and seamless interactions.",
    },
    {
      icon: Globe,
      title: "User Experience",
      description: "Understanding user behaviors, needs, and preferences to create interfaces that are intuitive, efficient, and enjoyable to use.",
    },
    {
      icon: Rocket,
      title: "Fast Support",
      description: "Addressing and resolving any questions or inquiries raised in the website or application quickly and efficiently.",
    },
    {
      icon: Users,
      title: "Branding",
      description: "Creating consistent and compelling experiences through the use of logos, color schemes, typography, and other branding assets.",
    },
  ];

  return (
    <section id="services" className="py-24 bg-card/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animation="fade-up" className="text-center mb-16">
          <p className="text-primary font-body uppercase tracking-widest mb-2">My Services</p>
          <h2 className="text-5xl md:text-6xl font-display text-foreground">What Can I Do</h2>
        </ScrollAnimationWrapper>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ScrollAnimationWrapper
              key={service.title}
              animation="scale"
              delay={index * 100}
            >
              <div className="group p-8 bg-card rounded-xl border border-border hover:border-primary transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:glow-primary transition-all duration-300">
                  <service.icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                
                <h3 className="text-xl font-display text-foreground mb-3 tracking-wide">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
