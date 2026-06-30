import { motion, useReducedMotion } from "framer-motion";
import { audienceBadges, heroMetrics } from "../data";
import LandingBadge from "../components/LandingBadge";
import LandingButton from "../components/LandingButton";
import MetricItem from "../components/MetricItem";
import { HeroStudyMockup } from "../mockups";

function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="grid min-h-[calc(100vh-140px)] items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-18">
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap gap-2">
          {audienceBadges.map((badge) => (
            <LandingBadge key={badge}>{badge}</LandingBadge>
          ))}
        </div>

        <h1 className="text-xx-head font-bold leading-tight text-grey-200 poppins-font sm:text-xl-head">
          Study smarter for school, certification exams, and career growth.
        </h1>
        <p className="mt-5 max-w-[640px] text-h4 leading-8 text-p-text-darker inter-font">
          Aurify helps university students, professionals, and self-directed
          learners turn any topic into guided material, practice questions,
          timed exams, and progress insights.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LandingButton href="/signup">Sign Up Free</LandingButton>
          <LandingButton href="#features" variant="secondary">
            See features
          </LandingButton>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {heroMetrics.map((metric) => (
            <MetricItem key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
      >
        <HeroStudyMockup />
      </motion.div>
    </section>
  );
}

export default HeroSection;
