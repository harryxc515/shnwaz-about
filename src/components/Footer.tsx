import { Instagram, Github, Youtube, Send } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/shnwazxc", label: "Instagram" },
    { icon: Github, href: "https://github.com/SHNWAZX", label: "GitHub" },
    { icon: Youtube, href: "https://www.youtube.com/@SHNWAZXC", label: "YouTube" },
    { icon: Send, href: "https://t.me/SHNWAZX", label: "Telegram" },
  ];

  return (
    <footer className="bg-transparent border-t border-border/20 py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-display text-foreground mb-2">SHNWAZX</h2>
            <p className="text-muted-foreground font-body text-sm max-w-xs">
              A passionate developer creating innovative solutions and exceptional user experiences.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-muted-foreground font-body text-xs mt-2">
              © {new Date().getFullYear()} SHNWAZX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
