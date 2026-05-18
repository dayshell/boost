import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCover from "@/components/ProductCover";
import LibrarySection from "@/components/LibrarySection";
import SearchSection from "@/components/SearchSection";
import FlowsSection from "@/components/FlowsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Testimonials from "@/components/Testimonials";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div style={{ fontFamily: "var(--app-font-sans)", background: "var(--bg-primary)" }}>
      <div style={{ position: "relative" }}>
        <Navbar />
        <Hero />
      </div>
      <ProductCover />
      <LibrarySection />
      <SearchSection />
      <FlowsSection />
      <FeaturesSection />
      <Testimonials />
      <JoinSection />
      <Footer />
    </div>
  );
}
