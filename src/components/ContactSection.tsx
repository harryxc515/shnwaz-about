import { Instagram, Github, Youtube, Send, ArrowRight } from "lucide-react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import ParallaxWrapper from "./ParallaxWrapper";

const ContactSection = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/shnwazxc", label: "Instagram", username: "@shnwazxc" },
    { icon: Github, href: "https://github.com/SHNWAZX", label: "GitHub", username: "SHNWAZX" },
    { icon: Youtube, href: "https://www.youtube.com/@SHNWAZXC", label: "YouTube", username: "@SHNWAZXC" },
    { icon: Send, href: "https://t.me/SHNWAZX", label: "Telegram", username: "@SHNWAZX" },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration with parallax */}
      <ParallaxWrapper speed={0.2} direction="right" className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
        <div className="w-full h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
      </ParallaxWrapper>
      
      <ParallaxWrapper speed={0.15} direction="left" className="absolute bottom-20 left-0">
        <div className="w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </ParallaxWrapper>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <ScrollAnimationWrapper animation="fade-up">
              <p className="text-primary font-body uppercase tracking-widest text-sm mb-2">Get In Touch</p>
            </ScrollAnimationWrapper>
            
            <ParallaxWrapper speed={0.1} direction="up">
              <ScrollAnimationWrapper animation="fade-left" delay={100}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-4 md:mb-6 leading-tight">
                  Let's Work<br className="hidden sm:block" /> Together
                </h2>
              </ScrollAnimationWrapper>
            </ParallaxWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={200}>
              <p className="text-muted-foreground font-body text-sm md:text-lg mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
                Collaboration is key! Let's join forces and combine our skills to tackle your next project together.
              </p>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="fade-up" delay={300}>
              <a
                href="https://t.me/SHNWAZX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground font-body uppercase tracking-wider text-xs md:text-sm rounded hover:glow-primary-strong transition-all duration-300 group"
              >
                Contact Me
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </ScrollAnimationWrapper>
          </div>

          <ParallaxWrapper speed={0.12} direction="up" className="flex-1 w-full max-w-md lg:max-w-none">
            <ScrollAnimationWrapper animation="fade-right" delay={200}>
              <div className="bg-card p-6 md:p-8 rounded-2xl border border-border">
                <h3 className="text-xl md:text-2xl font-display text-foreground mb-4 md:mb-6">Connect With Me</h3>
                
                <div className="space-y-3 md:space-y-4">
                  {socialLinks.map((social, index) => (
                    <ScrollAnimationWrapper key={social.label} animation="fade-up" delay={300 + index * 100}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-secondary rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300 flex-shrink-0">
                          <social.icon size={20} className="text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground font-body font-medium text-sm md:text-base">{social.label}</p>
                          <p className="text-muted-foreground font-body text-xs md:text-sm truncate">{social.username}</p>
                        </div>
                        <ArrowRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </a>
                    </ScrollAnimationWrapper>
                  ))}
                </div>
              </div>
            </ScrollAnimationWrapper>
          </ParallaxWrapper>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
