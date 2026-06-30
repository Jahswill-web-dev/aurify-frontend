import { GraduationCap } from "lucide-react";
import { featureCards } from "../data";
import FeatureCard from "../components/FeatureCard";
import MotionSection from "../components/MotionSection";
import SectionHeading from "../components/SectionHeading";

function FeatureSection() {
  return (
    <MotionSection id="features" className="scroll-mt-10 py-16">
      <SectionHeading
        eyebrow="Built for lifelong learning"
        icon={GraduationCap}
        title="Everything you need to study, practice, and improve in one place."
        description="Aurify connects learning material, active recall, timed exams, and progress tracking inside one focused workspace."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </MotionSection>
  );
}

export default FeatureSection;
