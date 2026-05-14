"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge, Button, Card } from "@/components/ui";

const buildStaticQuestions = ({ moduleTitle, topic, moduleNumber }) => [
  {
    id: `${moduleNumber}-1`,
    type: "multiple_choice",
    question: `What is the best first step when studying ${moduleTitle}?`,
    options: [
      "Memorize every detail immediately",
      "Identify the main idea in simple words",
      "Skip examples and go straight to testing",
      "Only focus on definitions",
    ],
    correctIndex: 1,
    explanation:
      "A clear main idea gives the details somewhere to connect, which makes the rest of the module easier to understand.",
  },
  {
    id: `${moduleNumber}-2`,
    type: "true_false",
    question: `${moduleTitle} should connect back to the broader topic of ${topic}.`,
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Each module should feel like one part of the larger learning path, not an isolated fact.",
  },
  {
    id: `${moduleNumber}-3`,
    type: "multiple_choice",
    question: "Which study move usually makes a concept easier to remember?",
    options: [
      "Reading passively without checking understanding",
      "Connecting the concept to a real example",
      "Avoiding practice questions",
      "Waiting until the final exam to review",
    ],
    correctIndex: 1,
    explanation:
      "Examples make abstract ideas more concrete, so they are easier to recall and apply later.",
  },
  {
    id: `${moduleNumber}-4`,
    type: "true_false",
    question: "Getting a practice question wrong can still improve learning.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Mistakes reveal what needs attention. The explanation helps turn that gap into a stronger understanding.",
  },
  {
    id: `${moduleNumber}-5`,
    type: "multiple_choice",
    question: `What should you be able to do after finishing ${moduleTitle}?`,
    options: [
      "Explain the idea, recognize it in examples, and answer short questions",
      "Repeat the title only",
      "Ignore the module and move on",
      "Avoid using your own words",
    ],
    correctIndex: 0,
    explanation:
      "A good learning checkpoint combines explanation, recognition, and application.",
  },
];

function PracticeSkeleton() {
  return (
    <div className="mx-auto max-w-[680px] space-y-4 px-4 py-6">
      <div className="h-6 w-48 animate-pulse rounded bg-grey-25" />
      <div className="h-2 w-full animate-pulse rounded-full bg-grey-25" />
      <div className="mt-6 h-24 w-full animate-pulse rounded-md bg-grey-25" />
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-12 w-full animate-pulse rounded-md bg-grey-25"
        />
      ))}
    </div>
  );
}

function PracticeTab({
  confirmedSetup,
  learningPath,
  activeModuleIndex,
  onModuleChange,
  onTabChange,
}) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const modules = useMemo(
    () => (Array.isArray(learningPath?.modules) ? learningPath.modules : []),
    [learningPath?.modules]
  );
  const currentModule = modules[activeModuleIndex] || {};
  const moduleCount = modules.length;
  const moduleTitle = currentModule?.title || `Module ${activeModuleIndex + 1}`;
  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressWidth = questions.length
    ? `${(answeredCount / questions.length) * 100}%`
    : "0%";

  const resetPracticeState = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setAnswers({});
    setShowResults(false);
  };

  const loadStaticQuestions = () => {
    if (!moduleCount) {
      setQuestions([]);
      setError(new Error("No modules are available for this learning path."));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    resetPracticeState();

    window.setTimeout(() => {
      setQuestions(
        buildStaticQuestions({
          moduleTitle,
          topic: confirmedSetup?.topic || "this topic",
          moduleNumber: activeModuleIndex + 1,
        })
      );
      setIsLoading(false);
    }, 250);
  };

  useEffect(() => {
    loadStaticQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModuleIndex, moduleCount, moduleTitle]);

  const restoreQuestionState = (index) => {
    const savedAnswer = answers[questions[index]?.id];
    setCurrentIndex(index);
    setSelectedOption(savedAnswer ?? null);
    setHasAnswered(savedAnswer !== undefined);
  };

  const handleOptionSelect = (index) => {
    if (hasAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !question) return;

    setHasAnswered(true);
    setAnswers((current) => ({
      ...current,
      [question.id]: selectedOption,
    }));
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) return;
    restoreQuestionState(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex === 0) return;
    restoreQuestionState(currentIndex - 1);
  };

  const handleTryAgain = () => {
    resetPracticeState();
  };

  const getOptionClassName = (index) => {
    const baseClasses =
      "w-full flex items-center gap-4 px-4 py-3 rounded-md border-2 text-left transition-all duration-175 ease-smooth";

    if (!hasAnswered) {
      return [
        baseClasses,
        "cursor-pointer bg-white text-grey-200 hover:border-primary hover:bg-accent-25",
        selectedOption === index
          ? "border-primary bg-accent-25 text-primary"
          : "border-grey-25",
      ]
        .filter(Boolean)
        .join(" ");
    }

    if (index === question?.correctIndex) {
      return [
        baseClasses,
        "cursor-not-allowed border-success bg-success-light text-success",
      ].join(" ");
    }

    if (index === selectedOption) {
      return [
        baseClasses,
        "cursor-not-allowed border-error bg-error-light text-error",
      ].join(" ");
    }

    return [
      baseClasses,
      "cursor-not-allowed border-grey-25 bg-off-white-50 text-grey-100 opacity-60",
    ].join(" ");
  };

  const getLabelClassName = (index) => {
    const baseClasses =
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-xs text-h6 font-bold";

    if (!hasAnswered && selectedOption === index) {
      return `${baseClasses} bg-primary text-white`;
    }

    if (hasAnswered && index === question?.correctIndex) {
      return `${baseClasses} bg-success text-white`;
    }

    if (hasAnswered && index === selectedOption) {
      return `${baseClasses} bg-error text-white`;
    }

    return `${baseClasses} bg-off-white-50 text-grey-100`;
  };

  const correctCount = questions.reduce((total, item) => {
    return answers[item.id] === item.correctIndex ? total + 1 : total;
  }, 0);
  const scorePercentage = questions.length
    ? Math.round((correctCount / questions.length) * 100)
    : 0;
  const scoreClassName =
    scorePercentage >= 80
      ? "text-success"
      : scorePercentage >= 50
        ? "text-primary"
        : "text-error";
  const isCorrect = selectedOption === question?.correctIndex;
  const isLastQuestion = currentIndex >= questions.length - 1;
  const isLastModule = activeModuleIndex >= moduleCount - 1;

  if (isLoading) {
    return <PracticeSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[680px] px-4 py-12 text-center">
        <Card variant="default">
          <p className="mb-2 text-h4 font-medium text-grey-200 poppins-font">
            Could not load practice questions
          </p>
          <p className="mb-4 text-h5 text-p-text inter-font">
            {error?.message ||
              "Something went wrong loading questions for this module."}
          </p>
          <Button variant="primary" size="md" onClick={loadStaticQuestions}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <section className="mx-auto max-w-[680px] px-4 py-6 md:px-8 md:py-8">
        <Card variant="accent">
          <div className="text-center">
            <p className="text-h3 font-bold text-success poppins-font">
              Practice Complete
            </p>
          </div>

          <div className="py-6 text-center">
            <p className="text-h2 font-bold text-grey-200 poppins-font">
              {correctCount} / {questions.length} Correct
            </p>
            <p
              className={[
                "mt-1 text-h4 font-semibold poppins-font",
                scoreClassName,
              ].join(" ")}
            >
              {scorePercentage}%
            </p>
          </div>

          <div className="flex justify-center gap-2" aria-hidden="true">
            {questions.map((item) => {
              const correct = answers[item.id] === item.correctIndex;
              return (
                <span
                  key={item.id}
                  className={[
                    "h-3 w-3 rounded-full",
                    correct ? "bg-success" : "bg-error-light",
                  ].join(" ")}
                />
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {questions.map((item) => {
              const userAnswer = answers[item.id];
              const correct = userAnswer === item.correctIndex;

              return (
                <div
                  key={item.id}
                  className={[
                    "flex items-center gap-3 rounded-sm p-3",
                    correct ? "bg-success-light" : "bg-error-light",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-h5 font-bold",
                      correct ? "text-success" : "text-error",
                    ].join(" ")}
                  >
                    {correct ? "Correct" : "Wrong"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-h6 text-grey-200 inter-font">
                    {item.question}
                  </span>
                  <Badge variant={correct ? "success" : "error"}>
                    {correct ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button variant="ghost" size="md" onClick={handleTryAgain}>
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onTabChange?.("notes")}
            >
              Go to Notes
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={isLastModule}
              onClick={() => onModuleChange?.(activeModuleIndex + 1)}
            >
              Next Module
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[680px] px-4 py-6 md:px-8 md:py-8">
      <header>
        <p className="text-h6 font-medium text-primary inter-font">
          Practice - Module {activeModuleIndex + 1} of {moduleCount || 1}
        </p>
        <h2 className="mt-1 text-h3 font-semibold text-grey-200 poppins-font">
          {moduleTitle}
        </h2>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-off-white-50">
          <div
            className="h-full rounded-full bg-primary transition-all duration-350 ease-smooth"
            style={{ width: progressWidth }}
          />
        </div>
        <p className="mt-1 text-h6 text-p-text inter-font">
          {answeredCount} of {questions.length} answered
        </p>
      </header>

      <Card variant="default" className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-h6 font-medium text-p-text inter-font">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <Badge variant={question?.type === "true_false" ? "neutral" : "accent"}>
            {question?.type === "true_false" ? "True / False" : "Multiple Choice"}
          </Badge>
        </div>

        <p className="mb-6 text-h4 font-medium leading-snug text-grey-200 poppins-font">
          {question?.question}
        </p>

        <div className="flex flex-col gap-3">
          {question?.options?.map((option, index) => (
            <button
              key={`${question.id}-${option}`}
              type="button"
              onClick={() => handleOptionSelect(index)}
              disabled={hasAnswered}
              className={getOptionClassName(index)}
            >
              <span className={getLabelClassName(index)}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-h5 inter-font">{option}</span>
            </button>
          ))}
        </div>

        {selectedOption !== null && !hasAnswered ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitAnswer}
              className="w-full"
            >
              Submit Answer
            </Button>
          </motion.div>
        ) : null}
      </Card>

      <AnimatePresence>
        {hasAnswered ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-4 overflow-hidden"
          >
            <div
              className={[
                "rounded-md border-2 p-5",
                isCorrect
                  ? "border-success bg-success-light"
                  : "border-error bg-error-light",
              ].join(" ")}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={[
                    "text-h4 font-bold poppins-font",
                    isCorrect ? "text-success" : "text-error",
                  ].join(" ")}
                >
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>

              {!isCorrect ? (
                <p className="mb-2 text-h6 text-grey-200 inter-font">
                  The correct answer was:{" "}
                  <span className="font-semibold text-success">
                    {question?.options?.[question.correctIndex]}
                  </span>
                </p>
              ) : null}

              <p className="text-h5 leading-relaxed text-grey-200 inter-font">
                {question?.explanation}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-grey-25 pt-4">
        <Button
          variant="secondary"
          size="md"
          disabled={currentIndex === 0}
          onClick={handlePrevious}
        >
          Previous
        </Button>

        {!isLastQuestion ? (
          <Button
            variant="primary"
            size="md"
            disabled={!hasAnswered}
            onClick={handleNext}
          >
            Next Question
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            disabled={!hasAnswered}
            onClick={() => setShowResults(true)}
          >
            See Results
          </Button>
        )}
      </div>
    </section>
  );
}

export default PracticeTab;
