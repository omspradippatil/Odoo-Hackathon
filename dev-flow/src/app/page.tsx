import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ProblemStory } from "@/components/sections/ProblemStory";
import { TwoWorlds } from "@/components/sections/TwoWorlds";
import { TrustEngine } from "@/components/sections/TrustEngine";
import { DealJourney } from "@/components/sections/DealJourney";
import { ProtectedTransaction } from "@/components/sections/ProtectedTransaction";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemStory />
      <TwoWorlds />
      <TrustEngine />
      <DealJourney />
      <ProtectedTransaction />
      <FinalCTA />
      <Footer />
    </main>
  );
}
