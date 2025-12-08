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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      
      {/* Animated circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-primary font-body uppercase tracking-widest mb-4 animate-fade-in">
              Hello, My Name Is
            </p>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display text-foreground leading-none mb-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              SHNWAZX
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mb-8 font-body animate-fade-in" style={{ animationDelay: '0.4s' }}>
              A passionate and dedicated developer, driven by the ever-evolving world of technology and its limitless possibilities.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <a
                href="#contact"
                className="px-8 py-4 bg-primary text-primary-foreground font-body uppercase tracking-wider text-sm rounded hover:glow-primary-strong transition-all duration-300"
              >
                Contact Me
              </a>
              <a
                href="#about"
                className="px-8 py-4 border border-primary text-primary font-body uppercase tracking-wider text-sm rounded hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                About Me
              </a>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.8s' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                >
                  <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-body">{social.username}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right content - Profile Image */}
          <div className="flex-1 flex justify-center lg:justify-end animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-primary to-red-700 rounded-2xl overflow-hidden glow-primary animate-pulse-glow">
                <img 
                  src={profileImage} 
                  alt="SHNWAZX Profile" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary rounded-2xl -z-10" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-primary" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
