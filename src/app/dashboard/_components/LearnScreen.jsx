"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  Search,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { Button, Dropdown, Input } from "@/components/ui";

const placeholders = [
  "e.g. Photosynthesis for Grade 10",
  "e.g. I want to learn bubble sort",
  "e.g. Teach me system engineering",
  "e.g. Help me prepare for my chemistry exam",
];

const suggestionChips = [
  "Photosynthesis - Grade 10",
  "Bubble Sort - CS",
  "Quadratic Equations - Maths",
  "Atomic Structure - Chemistry",
  "World War II - History",
  "System Engineering - Beginner",
];

const modeOptions = [
  {
    id: "quick",
    label: "Quick Start",
    description: "Describe anything you want to understand.",
  },
  {
    id: "advanced",
    label: "Advanced Setup",
    description: "Add level, subject, and study goal.",
  },
];

const learningStats = [
  { label: "Path", value: "Personalized", icon: Target },
  { label: "Session", value: "~12 min", icon: Clock3 },
  { label: "Practice", value: "Included", icon: BookOpen },
];

const gradeLevelOptions = [
  { value: "Primary School", label: "Primary School" },
  { value: "Middle School", label: "Middle School" },
  { value: "Grade 9", label: "Grade 9" },
  { value: "Grade 10", label: "Grade 10" },
  { value: "Grade 11", label: "Grade 11" },
  { value: "Grade 12", label: "Grade 12" },
  { value: "University - Year 1", label: "University - Year 1" },
  { value: "University - Year 2+", label: "University - Year 2+" },
  { value: "Professional", label: "Professional" },
];

const goalOptions = [
  { value: "Understand deeply", label: "Understand deeply" },
  { value: "Prepare for school exam", label: "Prepare for school exam" },
  { value: "Prepare for interview", label: "Prepare for interview" },
  { value: "Revise quickly", label: "Revise quickly" },
  { value: "Practice only", label: "Practice only" },
  { value: "Generate notes only", label: "Generate notes only" },
];

function LearnScreen({ onSubmit, initialValue = "" }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [activeMode, setActiveMode] = useState("quick");
  const [isGenerating, setIsGenerating] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [advancedFields, setAdvancedFields] = useState({
    subject: "",
    topic: "",
    gradeLevel: "",
    goal: "",
  });

  const inputRef = useRef(null);
  const hasInput = inputValue.trim().length > 0;

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (hasInput) return undefined;

    const interval = window.setInterval(() => {
      setPlaceholderIndex((currentIndex) =>
        currentIndex === placeholders.length - 1 ? 0 : currentIndex + 1
      );
    }, 3000);

    return () => window.clearInterval(interval);
  }, [hasInput]);

  const updateAdvancedField = (fieldName, value) => {
    setAdvancedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: value,
    }));
  };

  const buildAdvancedSummary = () => {
    const { subject, topic, gradeLevel, goal } = advancedFields;
    const hasAdvancedFields = subject || topic || gradeLevel || goal;

    if (!hasAdvancedFields) return "";

    return (
      [subject, topic, gradeLevel].filter(Boolean).join(", ") +
      (goal ? ` - ${goal}` : "")
    );
  };

  const triggerShake = () => {
    setShouldShake(true);
    window.setTimeout(() => setShouldShake(false), 400);
  };

  const handleSubmit = async () => {
    const advancedSummary =
      activeMode === "advanced" ? buildAdvancedSummary() : "";
    const valueToSubmit = advancedSummary || inputValue.trim();

    if (!valueToSubmit) {
      setShowError(true);
      triggerShake();
      inputRef.current?.focus();
      return;
    }

    setShowError(false);

    if (advancedSummary) {
      setInputValue(advancedSummary);
    }

    setIsGenerating(true);

    try {
      await Promise.resolve(onSubmit?.(valueToSubmit));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChipClick = (chip) => {
    setInputValue(chip);
    setShowError(false);
    inputRef.current?.focus();
  };

  return (
    <section className="min-h-screen bg-off-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-25 px-3 py-1.5 text-h6 font-semibold uppercase text-primary-200 poppins-font">
              <Sparkles size={14} aria-hidden="true" />
              Your AI Learning Assistant
            </div>
            <div className="space-y-3">
              <h1 className="max-w-[680px] text-xx-head font-bold leading-tight text-grey-200 poppins-font md:text-xl-head">
                What would you like to learn today?
              </h1>
              <p className="max-w-[620px] text-h5 leading-7 text-p-text-darker inter-font">
                Start with a topic, class, exam, or skill. Aurify will shape it
                into a focused path with notes and practice.
              </p>
            </div>
          </div>

          <div className="hidden rounded-md border border-grey-25 bg-white p-4 shadow-card lg:block">
            <p className="text-h6 font-semibold uppercase text-grey-100 poppins-font">
              Learning plan preview
            </p>
            <div className="mt-4 space-y-3">
              {learningStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-sm bg-off-white-100 px-3 py-2.5"
                >
                  <span className="inline-flex items-center gap-2 text-h6 font-medium text-grey-100">
                    <Icon size={15} aria-hidden="true" />
                    {label}
                  </span>
                  <span className="text-h6 font-semibold text-grey-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-grey-25 bg-white p-4 shadow-panel sm:p-5 md:p-6">
          <div className="mb-5 grid rounded-md border border-grey-25 bg-off-white-100 p-1 sm:grid-cols-2">
            {modeOptions.map((mode) => {
              const isActive = activeMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  aria-pressed={isActive}
                  className={[
                    "rounded-sm px-4 py-3 text-left transition-all duration-175 ease-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isActive
                      ? "bg-white text-grey-200 shadow-card"
                      : "text-grey-100 hover:bg-white/70 hover:text-grey-200",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="block text-h5 font-semibold poppins-font">
                    {mode.label}
                  </span>
                  <span className="mt-1 block text-h6 leading-5 inter-font">
                    {mode.description}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mb-2 flex items-center gap-2 text-h6 font-semibold uppercase text-grey-100 poppins-font">
            <Search size={14} aria-hidden="true" />
            Learning prompt
          </p>
          <div className={shouldShake ? "aurify-shake" : ""}>
            <Input
              variant="textarea"
              placeholder={hasInput ? "" : placeholders[placeholderIndex]}
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                if (showError) setShowError(false);
              }}
              rows={3}
              className="!min-h-[132px] !resize-none !rounded-md !border-2 !border-grey-25 !bg-off-white !px-4 !py-4 !text-h5 !leading-7 !text-grey-200 !shadow-none placeholder:!text-grey-100 focus:!border-primary focus:!bg-white focus:!shadow-input-focus sm:!px-5 sm:!py-5 sm:!text-h4"
              ref={inputRef}
            />
          </div>
          {showError ? (
            <p className="mt-2 rounded-sm bg-error-light px-3 py-2 text-h6 font-medium text-error">
              Please enter something you&apos;d like to learn
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-h6 text-grey-100 inter-font">
              Tip: include your level or goal for a sharper plan.
            </p>
            <Button
              variant="primary"
              size="lg"
              loading={isGenerating}
              disabled={isGenerating}
              onClick={handleSubmit}
              className="w-full sm:w-auto"
            >
              <span>Build My Learning Path</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>

          <div
            className={[
              "transition-all duration-350 ease-smooth",
              activeMode === "advanced"
                ? "mt-5 max-h-[620px] opacity-100"
                : "max-h-0 overflow-hidden opacity-0 pointer-events-none",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="grid grid-cols-1 gap-4 rounded-md border border-accent-200 bg-accent-25 p-4 md:grid-cols-2">
              <Input
                variant="default"
                label="Subject"
                placeholder="Biology"
                value={advancedFields.subject}
                onChange={(event) =>
                  updateAdvancedField("subject", event.target.value)
                }
              />
              <Input
                variant="default"
                label="Topic"
                placeholder="Photosynthesis"
                value={advancedFields.topic}
                onChange={(event) =>
                  updateAdvancedField("topic", event.target.value)
                }
              />
              <Dropdown
                label="Grade Level"
                value={advancedFields.gradeLevel}
                options={gradeLevelOptions}
                onChange={(value) => updateAdvancedField("gradeLevel", value)}
                className="w-full"
                buttonClassName="w-full justify-between !bg-white !border-grey-25 !text-grey-200 !px-4 !py-2.5 hover:!border-primary hover:!bg-white"
                menuClassName="w-full"
              />
              <Dropdown
                label="Learning Goal"
                value={advancedFields.goal}
                options={goalOptions}
                onChange={(value) => updateAdvancedField("goal", value)}
                className="w-full"
                buttonClassName="w-full justify-between !bg-white !border-grey-25 !text-grey-200 !px-4 !py-2.5 hover:!border-primary hover:!bg-white"
                menuClassName="w-full"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-grey-25 bg-white p-4 shadow-card sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-h6 font-semibold uppercase text-grey-100 poppins-font">
              <Wand2 size={14} aria-hidden="true" />
              Try one of these
            </p>
            <GraduationCap
              size={18}
              className="text-primary"
              aria-hidden="true"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="min-h-[44px] rounded-sm border border-grey-25 bg-off-white px-3 py-2 text-left text-h6 font-medium leading-5 text-grey-200 transition-all duration-175 ease-smooth hover:border-primary hover:bg-accent-25 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .aurify-shake {
          animation: aurify-shake 0.35s ease-in-out;
        }

        @keyframes aurify-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          50% {
            transform: translateX(6px);
          }
          75% {
            transform: translateX(-4px);
          }
        }
      `}</style>
    </section>
  );
}

export default LearnScreen;
