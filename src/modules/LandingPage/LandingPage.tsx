import {
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
  PricingSection,
} from '@/components/LandingScreen';
import Navbar from '@/components/Navbar/NavbarNonAuth';
import React, { useEffect, useState } from 'react';

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='bg-background text-foreground min-h-screen'>
      <Navbar scrollToSection={scrollToSection} />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
