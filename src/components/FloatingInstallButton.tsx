import { Download } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingInstallButton = () => {
  return (
    <Link
      to="/install"
      className="fixed bottom-6 right-6 z-50 md:hidden flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      style={{ boxShadow: "0 0 20px hsl(355 70% 55% / 0.4)" }}
      aria-label="Install App"
    >
      <Download size={24} />
    </Link>
  );
};

export default FloatingInstallButton;
