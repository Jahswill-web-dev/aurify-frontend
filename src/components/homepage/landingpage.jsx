"use client";

import AudienceSection from "./landing/sections/AudienceSection";
import FeatureSection from "./landing/sections/FeatureSection";
import FinalCta from "./landing/sections/FinalCta";
import HeroSection from "./landing/sections/HeroSection";
import MockupShowcase from "./landing/sections/MockupShowcase";
import WorkflowSection from "./landing/sections/WorkflowSection";

function LandingPage() {
  return (
    <div className="pb-12">
      <HeroSection />
      <AudienceSection />
      <WorkflowSection />
      <FeatureSection />
      <MockupShowcase />
      <FinalCta />
    </div>
  );
}

export default LandingPage;
