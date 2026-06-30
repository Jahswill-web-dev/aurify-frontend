import { LayoutDashboard } from "lucide-react";
import MotionSection from "../components/MotionSection";
import SectionHeading from "../components/SectionHeading";
import {
  CreateStudyMockup,
  ExamAnalyticsMockup,
  MaterialMockup,
  PracticeMockup,
} from "../mockups";

function MockupShowcase() {
  return (
    <MotionSection className="py-16">
      <SectionHeading
        eyebrow="Product preview"
        icon={LayoutDashboard}
        title="A study workspace that feels practical from the first session."
        description="The page now shows the real learning loop Aurify supports: create, read, practice, test, and track."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <CreateStudyMockup />
        <MaterialMockup />
        <PracticeMockup />
        <ExamAnalyticsMockup />
      </div>
    </MotionSection>
  );
}

export default MockupShowcase;
