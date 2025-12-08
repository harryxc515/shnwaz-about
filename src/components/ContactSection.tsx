import { Instagram, Github, Youtube, Send, ArrowRight } from "lucide-react";

const ContactSection = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/shnwazxc", label: "Instagram", username: "@shnwazxc" },
    { icon: Github, href: "https://github.com/SHNWAZX", label: "GitHub", username: "SHNWAZX" },
    { icon: Youtube, href: "https://www.youtube.com/@SHNWAZXC", label: "YouTube", username: "@SHNWAZXC" },
    { icon: Send, href: "https://t.me/SHNWAZX", label: "Telegram", username: "@SHNWAZX" },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-primary font-body uppercase tracking-widest mb-2">Get In Touch</p>
            <h2 className="text-5xl md:text-7xl font-display text-foreground mb-6 leading-tight">
              Let's Work<br />Together On Your<br />Next Project
            </h2>
            
            <p className="text-muted-foreground font-body text-lg mb-8 max-w-lg">
              Collaboration is key! Let's join forces and combine our skills to tackle your next project with a powerful synergy that guarantees success.
            </p>

            <a
              href="https://t.me/SHNWAZX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body uppercase tracking-wider text-sm rounded hover:glow-primary-strong transition-all duration-300 group"
            >
              Contact Me
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-display text-foreground mb-6">Connect With Me</h3>
              
              <div className="space-y-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-secondary rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <social.icon size={24} className="text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="text-foreground font-body font-medium">{social.label}</p>
                      <p className="text-muted-foreground font-body text-sm">{social.username}</p>
                    </div>
                    <ArrowRight size={18} className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
