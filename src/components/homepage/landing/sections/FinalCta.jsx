import { CheckCircle2 } from "lucide-react";
import LandingButton from "../components/LandingButton";
import MotionSection from "../components/MotionSection";

function FinalCta() {
  return (
    <MotionSection className="mt-4 rounded-md border border-grey-25 bg-grey-200 px-5 py-8 text-center shadow-panel sm:px-8 dark:border-primary-200/30 dark:bg-dark-surface-soft dark:shadow-none">
      <div className="mx-auto max-w-[720px]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-white dark:bg-dark-accent dark:text-[#16110a]">
          <CheckCircle2 size={24} aria-hidden="true" />
        </div>
        <h2 className="text-h2 font-bold leading-tight text-white poppins-font">
          Start with a topic. Finish with a clearer path forward.
        </h2>
        <p className="mt-4 text-h5 leading-7 text-off-white-50 inter-font">
          Whether you are preparing for school, switching careers, studying for
          a certification, or exploring something new, Aurify gives every
          learner a practical way to move.
        </p>
        <div className="mt-7">
          <LandingButton href="/signup">Sign Up Free</LandingButton>
        </div>
      </div>
    </MotionSection>
  );
}

export default FinalCta;
