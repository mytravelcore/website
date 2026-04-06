import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CopasturVacacionalContent from "./copastur-vacacional-content";

export default function CopasturVacacionalPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CopasturVacacionalContent />
      <Footer />
    </div>
  );
}
