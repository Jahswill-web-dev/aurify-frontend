import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  LineChart,
  PenLine,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";

const audienceBadges = [
  "Students",
  "Professionals",
  "Exam prep",
  "Career growth",
];

const featureCards = [
  {
    icon: Sparkles,
    title: "Turn any goal into a Study",
    description:
      "Describe a class topic, interview target, certification, or skill and Aurify structures the learning path around your level.",
  },
  {
    icon: FileText,
    title: "Generated material",
    description:
      "Get focused explanations, outlines, and study notes that make complex material easier to work through.",
  },
  {
    icon: PenLine,
    title: "Practice questions",
    description:
      "Reinforce what you learned with targeted questions and instant feedback on the concepts that need more attention.",
  },
  {
    icon: Clock,
    title: "Exam and interview mode",
    description:
      "Train under timed conditions for school exams, professional tests, technical interviews, and self-assessment.",
  },
  {
    icon: BarChart3,
    title: "Progress analytics",
    description:
      "See completion, latest scores, weak areas, and the best next step across each learning workspace.",
  },
];

const studySteps = [
  { label: "Material", value: "Done", active: true },
  { label: "Practice", value: "82%", active: true },
  { label: "Exam", value: "Next", active: false },
];

function Pill({ children, variant = "default" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-sm border px-3 py-1 text-h6 font-semibold inter-font",
        variant === "primary"
          ? "border-primary bg-accent-100 text-primary-200 dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
          : "border-grey-25 bg-white text-p-text-darker dark:border-dark-border dark:bg-dark-surface dark:text-dark-text",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function HeroProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] rounded-md border border-grey-25 bg-white p-3 shadow-panel dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-3 flex items-center justify-between border-b border-grey-25 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white dark:bg-dark-accent dark:text-[#16110a]">
            <BookOpen size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Study workspace
            </p>
            <h2 className="text-h5 font-bold text-grey-200 poppins-font">
              System Design Interview Prep
            </h2>
          </div>
        </div>
        <Pill variant="primary">Ready</Pill>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-sm border border-grey-25 bg-off-white-100 p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Pill>Professional</Pill>
            <Pill>Intermediate</Pill>
          </div>
          <h3 className="text-h4 font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
            Learn scalable systems with guided notes, practice, and timed review.
          </h3>
          <div className="mt-5 space-y-3">
            {studySteps.map((step) => (
              <div key={step.label}>
                <div className="mb-2 flex items-center justify-between text-h6 inter-font">
                  <span className="font-semibold text-grey-200">{step.label}</span>
                  <span className="text-p-text-darker">{step.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-dark-surface-soft">
                  <div
                    className={[
                      "h-full rounded-full",
                      step.active ? "bg-primary" : "bg-grey-25",
                    ].join(" ")}
                    style={{ width: step.active ? "82%" : "34%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-sm border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface-soft dark:shadow-none">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Target size={18} aria-hidden="true" />
              <p className="text-h6 font-semibold uppercase poppins-font">
                Next step
              </p>
            </div>
            <p className="text-h5 leading-6 text-grey-200 inter-font">
              Take timed practice on caching, queues, and database tradeoffs.
            </p>
          </div>
          <div className="rounded-sm border border-grey-25 bg-accent-100 p-4">
            <div className="flex items-center justify-between">
              <span className="text-h6 font-semibold text-p-text-darker inter-font">
                Latest score
              </span>
              <span className="text-h3 font-bold text-primary-200 poppins-font">
                82%
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>Queues</Pill>
              <Pill>Indexes</Pill>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateStudyPreview() {
  return (
    <div className="rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Prompt to Study
          </p>
          <h3 className="text-h4 font-bold text-grey-200 poppins-font">
            Create a path from one goal
          </h3>
        </div>
      </div>
      <div className="rounded-sm border border-grey-25 bg-off-white-100 p-4 text-h5 leading-7 text-p-text-darker inter-font dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted">
        Teach me financial modeling for a junior analyst role. Include valuation
        concepts, Excel-style examples, and interview questions.
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill variant="primary">Finance</Pill>
        <Pill>Career prep</Pill>
        <Pill>Beginner friendly</Pill>
      </div>
    </div>
  );
}

function MaterialPreview() {
  const outline = ["Core concept", "Worked example", "Common mistake"];

  return (
    <div className="rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <FileText size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Generated material
          </p>
          <h3 className="text-h4 font-bold text-grey-200 poppins-font">
            Structured notes that stay focused
          </h3>
        </div>
      </div>
      <div className="space-y-3">
        {outline.map((item, index) => (
          <div key={item} className="rounded-sm border border-grey-25 bg-off-white-100 p-3 dark:border-dark-border dark:bg-dark-bg">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-white text-h6 font-bold text-primary dark:bg-dark-surface-soft dark:text-primary-25">
                {index + 1}
              </span>
              <p className="text-h5 font-semibold text-grey-200 inter-font">
                {item}
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-grey-25" />
            <div className="mt-2 h-2 w-4/5 rounded-full bg-grey-25" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticePreview() {
  return (
    <div className="rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Practice
          </p>
          <h3 className="text-h4 font-bold text-grey-200 poppins-font">
            Test understanding as you learn
          </h3>
        </div>
        <Pill>Question 4</Pill>
      </div>
      <p className="text-h5 font-semibold leading-6 text-grey-200 inter-font">
        Which cache strategy best reduces database load for repeated reads?
      </p>
      <div className="mt-4 grid gap-2">
        {["Write-through cache", "Cache-aside pattern", "Round-robin routing"].map(
          (answer, index) => (
            <div
              key={answer}
              className={[
                "flex items-center gap-3 rounded-sm border px-3 py-3 text-h5 inter-font",
                index === 1
                  ? "border-primary bg-accent-100 text-primary-200 dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                  : "border-grey-25 bg-off-white-100 text-p-text-darker dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted",
              ].join(" ")}
            >
              <span
                className={[
                  "h-4 w-4 rounded-full border",
                  index === 1 ? "border-primary bg-primary" : "border-grey-100",
                ].join(" ")}
              />
              {answer}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ExamAnalyticsPreview() {
  return (
    <div className="rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-bg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <PlayCircle size={18} aria-hidden="true" />
              <span className="text-h6 font-semibold uppercase poppins-font">
                Exam mode
              </span>
            </div>
            <Pill>20:00</Pill>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className={[
                  "flex aspect-square items-center justify-center rounded-sm border text-h6 font-bold",
                  index < 7
                    ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                    : "border-grey-25 bg-white text-p-text dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted",
                ].join(" ")}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-grey-25 bg-accent-100 p-4 dark:border-primary-200/40 dark:bg-dark-surface-soft">
          <div className="mb-4 flex items-center gap-2 text-primary-200">
            <LineChart size={18} aria-hidden="true" />
            <span className="text-h6 font-semibold uppercase poppins-font">
              Analytics
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-2 flex justify-between text-h6 inter-font">
                <span className="font-semibold text-grey-200">Overall progress</span>
                <span className="text-p-text-darker">74%</span>
              </div>
              <div className="h-2 rounded-full bg-white dark:bg-dark-surface">
                <div className="h-full w-[74%] rounded-full bg-primary dark:bg-dark-accent" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill>Weak: formulas</Pill>
              <Pill>Review: timing</Pill>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <article className="rounded-md border border-grey-25 bg-white p-5 shadow-card transition-all duration-175 hover:border-primary hover:shadow-panel dark:border-dark-border dark:bg-dark-surface dark:shadow-none dark:hover:border-primary-25">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-h4 font-bold text-grey-200 poppins-font">
        {feature.title}
      </h3>
      <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
        {feature.description}
      </p>
    </article>
  );
}

function LandingPage() {
  return (
    <div className="pb-10">
      <section className="grid min-h-[calc(100vh-140px)] items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-18">
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {audienceBadges.map((badge) => (
              <Pill key={badge}>{badge}</Pill>
            ))}
          </div>

          <h1 className="text-xx-head font-bold leading-tight text-grey-200 poppins-font sm:text-xl-head">
            One learning workspace for school, career, and self-study.
          </h1>
          <p className="mt-5 max-w-[620px] text-h4 leading-8 text-p-text-darker inter-font">
            Aurify helps students, professionals, and self-directed learners turn
            any topic into guided material, practice questions, exam mode, and
            progress insights.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-h5 font-semibold text-white shadow-btn-primary transition-all duration-175 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg"
            >
              Sign Up Free
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-primary px-6 py-3 text-h5 font-semibold text-primary transition-all duration-175 hover:bg-accent-25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-primary-25 dark:text-primary-25 dark:hover:bg-dark-surface-soft dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg"
            >
              See features
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Any level", "Beginner to advanced"],
              ["Every goal", "Exams, interviews, skills"],
              ["Built-in review", "Practice and analytics"],
            ].map(([title, text]) => (
              <div key={title} className="border-l-2 border-primary pl-3">
                <p className="text-h5 font-bold text-grey-200 poppins-font">{title}</p>
                <p className="mt-1 text-h6 leading-5 text-p-text inter-font">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroProductMockup />
      </section>

      <section className="border-y border-grey-25 py-8 dark:border-dark-border">
        <div className="grid gap-5 text-center sm:grid-cols-3">
          {[
            ["Create", "Describe what you want to learn"],
            ["Study", "Read structured material and examples"],
            ["Prove", "Practice, test, and track progress"],
          ].map(([title, text]) => (
            <div key={title} className="px-4">
              <p className="text-h3 font-bold text-primary poppins-font">{title}</p>
              <p className="mt-1 text-h5 text-p-text-darker inter-font">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="scroll-mt-10 py-16">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-primary bg-accent-100 px-3 py-1 text-h6 font-semibold uppercase text-primary-200 poppins-font dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25">
            <GraduationCap size={16} aria-hidden="true" />
            Built for lifelong learning
          </div>
          <h2 className="text-h2 font-bold leading-tight text-grey-200 poppins-font sm:text-xl-head">
            Learn with the same workflow you use to improve.
          </h2>
          <p className="mt-4 text-h5 leading-7 text-p-text-darker inter-font">
            Aurify connects content, active recall, exam practice, and progress
            tracking in one focused Study workspace.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <CreateStudyPreview />
        <MaterialPreview />
        <PracticePreview />
        <ExamAnalyticsPreview />
      </section>

      <section className="mt-16 rounded-md border border-grey-25 bg-grey-200 px-5 py-8 text-center shadow-panel sm:px-8 dark:border-primary-200/30 dark:bg-dark-surface-soft dark:shadow-none">
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
          <Link
            href="/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-h5 font-semibold text-white shadow-btn-primary transition-all duration-175 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg"
          >
            Sign Up Free
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
