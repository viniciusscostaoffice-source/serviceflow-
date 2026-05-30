import { useState } from 'react';
import { Hero } from '../components/sections/Hero';
import { PainPoints } from '../components/sections/PainPoints';
import { Solution } from '../components/sections/Solution';
import { Differentials } from '../components/sections/Differentials';
import { Pricing } from '../components/sections/Pricing';
import { FAQ } from '../components/sections/FAQ';
import { Testimonials } from '../components/sections/Testimonials';
import { FinalCTA } from '../components/sections/FinalCTA';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { LeadModal } from '../components/LeadModal';
import { Tracking } from '../components/Tracking';
import { ProgressiveBlur } from '../components/ProgressiveBlur';
import { Navbar } from '../components/Navbar';

export function Landing() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary text-offwhite font-sans selection:bg-primary selection:text-secondary">
      <Tracking />
      <Navbar />
      <Hero onOpenModal={() => setIsLeadModalOpen(true)} />
      <div id="como-funciona"><PainPoints /></div>
      <Solution />
      <div id="diferenciais"><Differentials /></div>
      <div id="depoimentos"><Testimonials /></div>
      <div id="precos"><Pricing /></div>
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      <ProgressiveBlur />
    </div>
  );
}
