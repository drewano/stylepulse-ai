import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DashboardSection from "@/components/DashboardSection";
import ContentGenerationSection from "@/components/ContentGenerationSection";
import TrendsSection from "@/components/TrendsSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DashboardSection />
        <ContentGenerationSection />
        <TrendsSection />
        <AnalyticsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
