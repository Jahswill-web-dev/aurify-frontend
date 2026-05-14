"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card } from "@/components/ui";

const STATIC_EXAM_DURATION = 20;

const buildStaticExam = ({ moduleTitle, topic, subject, level, moduleNumber }) => ({
  examTitle: `${moduleTitle} Exam`,
  duration: STATIC_EXAM_DURATION,
  questions: [
    {
      id: `${moduleNumber}-1`,
      type: "multiple_choice",
      question: `What is the strongest way to begin answering a question about ${moduleTitle}?`,
      options: [
        "Guess quickly and move on",
        "Identify the main concept being tested",
        "Choose the longest answer",
        "Ignore the wording of the question",
      ],
      correctIndex: 1,
      explanation:
        "Finding the main concept first helps you connect the question to what you studied before choosing an answer.",
    },
    {
      id: `${moduleNumber}-2`,
      type: "true_false",
      question: `${moduleTitle} should connect back to the broader topic of ${topic}.`,
      options: ["True", "False"],
      correctIndex: 0,
      explanation:
        "Each module is one part of the larger learning path, so the ideas should connect back to the main topic.",
    },
    {
      id: `${moduleNumber}-3`,
      type: "multiple_choice",
      question: `Which answer best shows understanding at the ${level} level?`,
      options: [
        "Repeating only the title of the module",
        "Explaining the idea in your own words with an example",
        "Skipping all details",
        "Memorizing without checking meaning",
      ],
      correctIndex: 1,
      explanation:
        "A strong answer uses your own words and a concrete example, which shows that the idea is understood rather than only memorized.",
    },
    {
      id: `${moduleNumber}-4`,
      type: "true_false",
      question: `In ${subject}, exam answers are usually stronger when they include clear reasoning.`,
      options: ["True", "False"],
      correctIndex: 0,
      explanation:
        "Clear reasoning shows how the answer was reached and makes it easier to apply the concept to unfamiliar questions.",
    },
    {
      id: `${moduleNumber}-5`,
      type: "multiple_choice",
      question: `What should you review after completing ${moduleTitle}?`,
      options: [
        "Only the questions you answered correctly",
        "The module title and nothing else",
        "Incorrect answers, explanations, and any uncertain choices",
        "A completely unrelated topic",
      ],
      correctIndex: 2,
      explanation:
        "Reviewing incorrect and uncertain answers is the fastest way to find gaps and strengthen recall before the next module.",
    },
    {
      id: `${moduleNumber}-6`,
      type: "multiple_choice",
      question: "Which strategy best supports exam performance?",
      options: [
        "Answering every question before reading the options",
        "Moving freely, answering what you know, and returning to harder questions",
        "Leaving all uncertain questions blank",
        "Changing every answer at the end",
      ],
      correctIndex: 1,
      explanation:
        "Free navigation lets you secure the answers you know first, then use remaining time for questions that need more thought.",
    },
  ],
});

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

function ExamSkeleton() {
  return (
    <div className="mx-auto max-w-[900px] space-y-4 px-4 py-6">
      <div className="h-6 w-64 animate-pulse rounded bg-grey-25" />
      <div className="h-4 w-32 animate-pulse rounded bg-grey-25" />
      <div className="mt-6 flex gap-6">
        <div className="flex w-32 shrink-0 flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-9 w-full animate-pulse rounded-md bg-grey-25"
            />
          ))}
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-24 w-full animate-pulse rounded-md bg-grey-25" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-md bg-grey-25"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExamTab({
  confirmedSetup,
  learningPath,
  activeModuleIndex,
  onModuleChange,
  onTabChange,
}) {
  const [questions, setQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("Exam");
  const [duration, setDuration] = useState(STATIC_EXAM_DURATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimed, setIsTimed] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const modules = useMemo(
    () => (Array.isArray(learningPath?.modules) ? learningPath.modules : []),
    [learningPath?.modules]
  );
  const currentModule = modules[activeModuleIndex] || {};
  const moduleCount = modules.length;
  const moduleTitle = currentModule?.title || `Module ${activeModuleIndex + 1}`;
  const subject = confirmedSetup?.subject || "General";
  const level = confirmedSetup?.level || "Beginner";
  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isDurationAvailable = Number(duration) > 0;
  const isLastModule = activeModuleIndex >= moduleCount - 1;

  const resetExamState = () => {
    setCurrentIndex(0);
    setAnswers({});
    setExamStarted(false);
    setExamSubmitted(false);
    setTimeRemaining(null);
    setShowSubmitConfirm(false);
  };

  const loadStaticExam = () => {
    if (!moduleCount) {
      setQuestions([]);
      setError(new Error("No modules are available for this learning path."));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    resetExamState();

    window.setTimeout(() => {
      const exam = buildStaticExam({
        moduleTitle,
        topic: confirmedSetup?.topic || "this topic",
        subject,
        level,
        moduleNumber: activeModuleIndex + 1,
      });

      setExamTitle(exam.examTitle);
      setDuration(exam.duration);
      setQuestions(exam.questions);
      setIsTimed(Number(exam.duration) > 0);
      setIsLoading(false);
    }, 250);
  };

  useEffect(() => {
    loadStaticExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModuleIndex, moduleCount, moduleTitle]);

  const handleAutoSubmit = () => {
    setShowSubmitConfirm(false);
    setExamSubmitted(true);
  };

  useEffect(() => {
    if (!examStarted || !isTimed || timeRemaining === null || examSubmitted) {
      return undefined;
    }

    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => Math.max((prev || 0) - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted, isTimed, timeRemaining, examSubmitted]);

  const handleStartExam = () => {
    if (isTimed && isDurationAvailable) {
      setTimeRemaining(duration * 60);
    } else {
      setTimeRemaining(null);
    }

    setExamStarted(true);
  };

  const handleOptionSelect = (index) => {
    if (examSubmitted || !question) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: index,
    }));
  };

  const handleRetakeExam = () => {
    setAnswers({});
    setCurrentIndex(0);
    setExamSubmitted(false);
    setExamStarted(false);
    setShowSubmitConfirm(false);
    setTimeRemaining(isTimed && isDurationAvailable ? duration * 60 : null);
  };

  const correctCount = questions.reduce((total, item) => {
    return answers[item.id] === item.correctIndex ? total + 1 : total;
  }, 0);
  const scorePercent = questions.length
    ? Math.round((correctCount / questions.length) * 100)
    : 0;

  if (isLoading) {
    return <ExamSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[680px] px-4 py-12 text-center">
        <Card variant="default">
          <p className="mb-2 text-h4 font-medium text-grey-200 poppins-font">
            Could not load exam questions
          </p>
          <p className="mb-4 text-h5 text-p-text inter-font">
            {error?.message || "Something went wrong loading the exam."}
          </p>
          <Button variant="primary" size="md" onClick={loadStaticExam}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (examSubmitted) {
    return (
      <section className="mx-auto max-w-[900px] px-4 py-6 md:px-8 md:py-8">
        <Card variant="accent">
          <div className="text-center">
            <p className="text-h3 font-bold text-success poppins-font">
              Exam Complete
            </p>
          </div>

          <div className="py-8 text-center">
            <p
              className="text-h1 font-bold poppins-font"
              style={{
                color:
                  scorePercent >= 80
                    ? "var(--color-success)"
                    : scorePercent >= 50
                      ? "var(--color-primary)"
                      : "var(--color-error)",
              }}
            >
              {scorePercent}%
            </p>
            <p className="mt-1 text-h4 font-semibold text-grey-200 poppins-font">
              {correctCount} / {questions.length} Correct
            </p>
          </div>

          <div>
            <p className="text-h4 font-semibold text-grey-200 poppins-font">
              Question breakdown
            </p>

            <div className="mt-4 flex flex-col gap-4">
              {questions.map((item) => {
                const userAnswer = answers[item.id];
                const correct = userAnswer === item.correctIndex;

                return (
                  <div
                    key={item.id}
                    className={[
                      "rounded-md border-2 p-4",
                      correct
                        ? "border-success bg-success-light"
                        : "border-error bg-error-light",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "shrink-0 text-h5 font-bold",
                          correct ? "text-success" : "text-error",
                        ].join(" ")}
                      >
                        {correct ? "\u2713" : "\u2717"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-h5 font-medium text-grey-200 inter-font">
                          {item.question}
                        </p>
                        {!correct ? (
                          <p className="mb-2 text-h6 text-grey-200 inter-font">
                            Your answer:{" "}
                            <span className="font-semibold text-error">
                              {userAnswer !== undefined
                                ? item.options[userAnswer]
                                : "Not answered"}
                            </span>{" "}
                            &middot; Correct answer:{" "}
                            <span className="font-semibold text-success">
                              {item.options[item.correctIndex]}
                            </span>
                          </p>
                        ) : null}
                        <p className="text-h6 leading-relaxed text-p-text inter-font">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="ghost" size="md" onClick={handleRetakeExam}>
              Retake Exam
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
              Next Module &rarr;
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  if (!examStarted) {
    return (
      <section className="mx-auto max-w-[520px] px-4 py-6 md:px-8 md:py-8">
        <Card variant="default">
          <div className="text-center">
            <p className="text-h3 font-bold text-grey-200 poppins-font">
              {examTitle}
            </p>
            <p className="mt-1 text-h5 text-p-text inter-font">
              {level} {subject}
            </p>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <p className="text-h5 text-grey-200 inter-font">
              {questions.length} questions
            </p>
            <p className="text-h5 text-p-text inter-font">
              {isDurationAvailable ? `${duration} minutes` : "No time limit"}
            </p>
          </div>

          <div className="mt-8 rounded-md border border-grey-25 bg-off-white-50 p-4">
            <p className="mb-2 text-h5 font-semibold text-grey-200 poppins-font">
              Instructions
            </p>
            <p className="text-h5 leading-relaxed text-p-text inter-font">
              Answer all questions. You can move between questions freely.
              Results are shown only after you submit.
            </p>
          </div>

          {isDurationAvailable ? (
            <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-grey-25 px-4 py-3">
              <div>
                <p className="text-h5 font-medium text-grey-200 inter-font">
                  Timed mode
                </p>
                {isTimed ? (
                  <p className="text-h6 text-p-text inter-font">
                    {duration} minutes
                  </p>
                ) : (
                  <p className="text-h6 text-p-text inter-font">
                    Timer disabled
                  </p>
                )}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isTimed}
                onClick={() => setIsTimed((current) => !current)}
                className={[
                  "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-175 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isTimed ? "bg-primary" : "bg-grey-25",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute left-1 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-175",
                    isTimed ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </div>
          ) : null}

          <Button
            variant="primary"
            size="md"
            className="mt-8 w-full"
            onClick={handleStartExam}
          >
            Start Exam
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-[900px] px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-grey-200 poppins-font">
            {examTitle}
          </h2>
          <p className="mt-1 text-h6 text-p-text inter-font">
            {answeredCount} of {questions.length} answered
          </p>
        </div>

        {isTimed && timeRemaining !== null ? (
          <div
            className={[
              "flex items-center gap-2 rounded-md border-2 px-4 py-2",
              timeRemaining < 60
                ? "border-error bg-error-light text-error"
                : "border-grey-25 bg-off-white-50 text-grey-200",
            ].join(" ")}
          >
            <span className="text-h4 font-bold poppins-font">
              {formatTime(timeRemaining)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex gap-2 overflow-x-auto pb-2 md:w-32 md:shrink-0 md:flex-col md:overflow-visible md:pb-0">
          {questions.map((item, index) => {
            const isAnswered = answers[item.id] !== undefined;
            const isCurrent = currentIndex === index;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={[
                  "shrink-0 rounded-md border-2 px-4 py-2 text-h6 font-medium transition-all duration-175 inter-font md:w-full",
                  isAnswered
                    ? "border-primary bg-primary text-white"
                    : "border-grey-25 bg-off-white-50 text-grey-100",
                  isCurrent ? "ring-2 ring-primary ring-offset-1" : "",
                ].join(" ")}
              >
                Q{index + 1}
              </button>
            );
          })}

          {answeredCount < questions.length ? (
            <button
              type="button"
              className="hidden text-left text-h6 text-p-text underline underline-offset-2 transition-colors hover:text-primary inter-font md:mt-4 md:block"
              onClick={() => setShowSubmitConfirm(true)}
            >
              Submit with unanswered questions
            </button>
          ) : null}
        </div>

        <Card variant="default" className="min-w-0 flex-1">
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
            {question?.options?.map((option, index) => {
              const isSelected = answers[question.id] === index;

              return (
                <button
                  key={`${question.id}-${option}`}
                  type="button"
                  onClick={() => handleOptionSelect(index)}
                  disabled={examSubmitted}
                  className={[
                    "flex w-full items-center gap-4 rounded-md border-2 px-4 py-3 text-left transition-all duration-175 ease-smooth",
                    isSelected
                      ? "border-primary bg-accent-25 text-primary"
                      : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25",
                    examSubmitted ? "cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-xs text-h6 font-bold",
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-off-white-50 text-grey-100",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-h5 inter-font">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-grey-25 pt-4">
            <Button
              variant="secondary"
              size="md"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
            >
              &larr; Previous
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                Next &rarr;
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowSubmitConfirm(true)}
              >
                Submit Exam &rarr;
              </Button>
            )}
          </div>
        </Card>
      </div>

      {answeredCount < questions.length ? (
        <button
          type="button"
          className="mt-4 text-h6 text-p-text underline underline-offset-2 transition-colors hover:text-primary inter-font md:hidden"
          onClick={() => setShowSubmitConfirm(true)}
        >
          Submit with unanswered questions
        </button>
      ) : null}

      {showSubmitConfirm ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--border-radius-lg)",
            zIndex: 10,
          }}
        >
          <Card variant="default" className="mx-4 w-full max-w-[420px]">
            <p className="mb-2 text-h3 font-bold text-grey-200 poppins-font">
              Submit exam?
            </p>
            <p className="mb-1 text-h5 text-p-text inter-font">
              {answeredCount} of {questions.length} questions answered.
            </p>
            {answeredCount < questions.length ? (
              <p className="mb-4 text-h6 text-error inter-font">
                {questions.length - answeredCount} questions are still
                unanswered.
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  setExamSubmitted(true);
                }}
              >
                Submit
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

export default ExamTab;
