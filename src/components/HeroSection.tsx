import { ArrowDown, Instagram, Github, Youtube, Send } from "lucide-react";
import profileImage from "@/assets/profile.jpg";

const HeroSection = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/shnwazxc", label: "Instagram", username: "@shnwazxc" },
    { icon: Github, href: "https://github.com/SHNWAZX", label: "GitHub", username: "SHNWAZX" },
    { icon: Youtube, href: "https://www.youtube.com/@SHNWAZXC", label: "YouTube", username: "@SHNWAZXC" },
    { icon: Send, href: "https://t.me/SHNWAZX", label: "Telegram", username: "@SHNWAZX" },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      
      {/* Animated circles */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <p className="text-primary font-body uppercase tracking-widest text-sm md:text-base mb-3 md:mb-4 animate-fade-in">
              Hello, My Name Is
            </p>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display text-foreground leading-none mb-4 md:mb-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              SHNWAZX
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 mb-6 md:mb-8 font-body animate-fade-in" style={{ animationDelay: '0.4s' }}>
              A passionate and dedicated developer, driven by the ever-evolving world of technology and its limitless possibilities.
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start mb-8 md:mb-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <a
                href="#contact"
                className="px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground font-body uppercase tracking-wider text-xs md:text-sm rounded hover:glow-primary-strong transition-all duration-300"
              >
                Contact Me
              </a>
              <a
                href="#about"
                className="px-6 md:px-8 py-3 md:py-4 border border-primary text-primary font-body uppercase tracking-wider text-xs md:text-sm rounded hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                About Me
              </a>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.8s' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs md:text-sm font-body hidden sm:inline">{social.username}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right content - Profile Image */}
          <div className="flex-shrink-0 flex justify-center lg:justify-end animate-slide-in-right order-1 lg:order-2" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-2xl overflow-hidden glow-primary animate-pulse-glow border-2 border-primary/30">
                <img 
                  src={profileImage} 
                  alt="SHNWAZX Profile" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-full h-full border-2 border-primary rounded-2xl -z-10" />
              <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-16 h-16 md:w-20 md:h-20 border-2 border-primary/50 rounded-xl -z-10" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ArrowDown className="text-primary" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
