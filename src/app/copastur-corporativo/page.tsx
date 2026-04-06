import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CopasturCorporativoContent from "./copastur-corporativo-content";

export default function CopasturCorporativoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CopasturCorporativoContent />
      <Footer />
    </div>
  );
}
