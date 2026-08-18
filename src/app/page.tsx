"use client";

import { HeroSection } from "@/components/ui/HeroSection";
import { FeaturesSection } from "@/components/ui/FeaturesSection";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { CTASection } from "@/components/ui/CTASection";

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
