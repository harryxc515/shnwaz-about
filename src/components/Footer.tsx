import { Instagram, Github, Youtube, Send } from "lucide-react";
import logo from "@/assets/i-cook-children-logo.png";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/shnwazxc", label: "Instagram" },
    { icon: Github, href: "https://github.com/SHNWAZX", label: "GitHub" },
    { icon: Youtube, href: "https://www.youtube.com/@SHNWAZXC", label: "YouTube" },
    { icon: Send, href: "https://t.me/SHNWAZX", label: "Telegram" },
  ];

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="I Cook Children Logo" className="h-10 w-auto" />
            <p className="text-muted-foreground font-body text-sm">
              © 2024 SHNWAZX. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
