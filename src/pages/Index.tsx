import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import MusicSection from "@/components/MusicSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingInstallButton from "@/components/FloatingInstallButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingInstallButton />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <MusicSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
