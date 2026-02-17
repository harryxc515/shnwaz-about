import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CustomCursor from "@/components/CustomCursor";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import MusicSection from "@/components/MusicSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="uiverse-bg-container" />
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <PortfolioSection />
        <MusicSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
