import { Instagram, Github, Youtube, Send } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/shnwazxc", label: "@shnwazxc" },
    { icon: Github, href: "https://github.com/SHNWAZX", label: "SHNWAZX" },
    { icon: Youtube, href: "https://www.youtube.com/@SHNWAZXC", label: "@SHNWAZXC" },
    { icon: Send, href: "https://t.me/SHNWAZX", label: "@SHNWAZX" },
  ];

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-6">
        {/* Social links row */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
              aria-label={social.label}
            >
              <social.icon size={16} />
              <span>{social.label}</span>
            </a>
          ))}
        </div>

        {/* Copyright row */}
        <div className="border-t border-border py-4 text-center">
          <p className="text-muted-foreground font-body text-sm">
            © 2026 SHNWAZX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
