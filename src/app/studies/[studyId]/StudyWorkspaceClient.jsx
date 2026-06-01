"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Play,
  RotateCcw,
  Target,
} from "lucide-react";
import { Badge, Button, Card, Tabs } from "@/components/ui";

const workspaceTabs = [
  { id: "overview", label: "Overview" },
  { id: "material", label: "Material" },
  { id: "practice", label: "Practice" },
  { id: "exam", label: "Exam Mode" },
  { id: "analytics", label: "Analytics" },
];

const statusConfig = {
  draft: { label: "Draft", variant: "neutral" },
  generating: { label: "Generating", variant: "accent" },
  ready: { label: "Ready", variant: "primary" },
  in_progress: { label: "In progress", variant: "accent" },
  completed: { label: "Completed", variant: "success" },
};

const clamp = (value) => Math.max(0, Math.min(100, value));

function ProgressBar({ value, className = "" }) {
  return (
    <div className={["h-2 overflow-hidden rounded-full bg-off-white-50", className].join(" ")}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-350 ease-smooth"
        style={{ width: `${clamp(value)}%` }}
      />
    </div>
  );
}

function StudyWorkspaceHeader({ study, activeTab, progress }) {
  const status = statusConfig[study.status] || statusConfig.ready;
  const action = {
    overview: "Continue Learning",
    material: "Mark Sections",
    practice: "Answer Practice",
    exam: "Start Exam",
    analytics: "Review Plan",
  }[activeTab];

  return (
    <header className="border-b border-grey-25 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/studies"
            className="inline-flex items-center gap-2 text-h6 font-medium text-p-text transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Studies
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-sm border border-grey-25 bg-off-white-100 px-3 py-2 text-h6 font-medium text-p-text-darker transition-colors hover:border-primary hover:text-primary"
          >
            <LayoutDashboard size={16} aria-hidden="true" />
            Dashboard
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-xl-head font-bold leading-tight text-grey-200 poppins-font">
              {study.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{study.subject || "General"}</Badge>
              <Badge variant="neutral">{study.level || "Beginner"}</Badge>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>

          <div className="w-full max-w-[360px]">
            <div className="mb-2 flex items-center justify-between text-h6 inter-font">
              <span className="text-p-text">Study progress</span>
              <span className="font-semibold text-grey-200">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
            <p className="mt-2 text-right text-h6 font-medium text-primary inter-font">
              {action}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function StudyWorkspaceTabs({ activeTab, onTabChange }) {
  return (
    <div className="sticky top-0 z-20 border-b border-grey-25 bg-white px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <Tabs
          tabs={workspaceTabs}
          activeTab={activeTab}
          onChange={onTabChange}
          className="scrollbar-hide overflow-x-auto border-b-0 [&_button]:shrink-0"
        />
      </div>
    </div>
  );
}

function OverviewTab({ study, progress, onTabChange }) {
  const sectionCount = study.material.sections.length;
  const recommended =
    study.analytics.weakAreas?.[0] ||
    study.material.sections.find((section) => !section.completed)?.title ||
    "Practice questions";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <Card variant="default" className="p-6">
        <p className="text-h6 font-semibold uppercase text-primary poppins-font">
          Study overview
        </p>
        <h2 className="mt-2 text-h2 font-bold text-grey-200 poppins-font">
          {study.topic}
        </h2>
        <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
          {study.material.overview}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Metric label="Material sections" value={sectionCount} />
          <Metric label="Practice" value={study.practiceQuestions.length} />
          <Metric label="Exam" value={study.examQuestions.length} />
          <Metric label="Progress" value={`${progress}%`} />
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => onTabChange("material")}
          className="mt-7"
        >
          Continue Learning
        </Button>
      </Card>

      <div className="grid gap-5">
        <Card variant="accent">
          <div className="flex items-start gap-3">
            <Target className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
                Recommended next step
              </h3>
              <p className="mt-1 text-h5 leading-7 text-p-text-darker inter-font">
                Review {recommended}, then answer a few relaxed practice
                questions before exam mode.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
            Weak areas preview
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {study.analytics.weakAreas.length ? (
              study.analytics.weakAreas.map((area) => (
                <Badge key={area} variant="error">
                  {area}
                </Badge>
              ))
            ) : (
              <span className="text-h5 text-p-text inter-font">
                No weak areas yet.
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md border border-grey-25 bg-off-white-100 p-4">
      <p className="text-h3 font-bold text-grey-200 poppins-font">{value}</p>
      <p className="mt-1 text-h6 text-p-text inter-font">{label}</p>
    </div>
  );
}

function MaterialSectionCard({ section, index, isComplete, onToggle }) {
  return (
    <Card variant="default" className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-h6 font-bold text-primary poppins-font">
              {String(index + 1).padStart(2, "0")}
            </span>
            {isComplete ? <Badge variant="success">Completed</Badge> : null}
          </div>
          <h3 className="text-h3 font-semibold text-grey-200 poppins-font">
            {section.title}
          </h3>
        </div>
        <Button
          variant={isComplete ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onToggle(section.id)}
          className="shrink-0"
        >
          {isComplete ? "Completed" : "Mark as Completed"}
        </Button>
      </div>

      <p className="mt-4 text-h5 leading-7 text-p-text-darker inter-font">
        {section.content}
      </p>

      <div className="mt-4 rounded-md border border-grey-25 bg-off-white-100 p-4">
        <p className="mb-2 text-h6 font-semibold uppercase text-grey-100 poppins-font">
          Key points
        </p>
        <ul className="grid gap-2">
          {section.keyPoints.map((point) => (
            <li key={point} className="flex gap-2 text-h5 text-grey-200 inter-font">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {section.example ? (
        <div className="mt-4 rounded-md border border-accent-200 bg-accent-25 p-4">
          <p className="mb-1 text-h6 font-semibold uppercase text-primary-200 poppins-font">
            Example
          </p>
          <p className="text-h5 leading-7 text-p-text-darker inter-font">
            {section.example}
          </p>
        </div>
      ) : null}
    </Card>
  );
}

function MaterialTab({ study, completedSections, onToggleSection }) {
  const total = study.material.sections.length;
  const completed = completedSections.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="grid gap-4">
        {study.material.sections.map((section, index) => (
          <MaterialSectionCard
            key={section.id}
            section={section}
            index={index}
            isComplete={completedSections.includes(section.id)}
            onToggle={onToggleSection}
          />
        ))}
      </div>

      <aside className="h-fit rounded-md border border-grey-25 bg-white p-5 shadow-card lg:sticky lg:top-20">
        <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
          Material Progress
        </h3>
        <p className="mt-1 text-h6 text-p-text inter-font">
          {completed} of {total} sections completed
        </p>
        <ProgressBar value={pct} className="mt-4" />
        <p className="mt-3 text-h3 font-bold text-primary poppins-font">{pct}%</p>
      </aside>
    </div>
  );
}

function PracticeQuestionCard({
  question,
  selectedAnswer,
  submitted,
  onSelect,
  onSubmit,
}) {
  const isCorrect = submitted && selectedAnswer === question.correctAnswer;

  return (
    <Card variant="default" className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Badge variant="accent">{question.difficulty || "medium"}</Badge>
        {submitted ? (
          <Badge variant={isCorrect ? "success" : "error"}>
            {isCorrect ? "Correct" : "Incorrect"}
          </Badge>
        ) : null}
      </div>

      <h2 className="text-h3 font-semibold leading-snug text-grey-200 poppins-font">
        {question.question}
      </h2>

      <div className="mt-6 grid gap-3">
        {question.options?.map((option, index) => {
          const selected = selectedAnswer === option;
          const correct = submitted && option === question.correctAnswer;
          const wrong = submitted && selected && !correct;

          return (
            <button
              key={option}
              type="button"
              disabled={submitted}
              onClick={() => onSelect(option)}
              className={[
                "flex w-full items-center gap-3 rounded-md border-2 px-4 py-3 text-left text-h5 transition-all duration-175 inter-font",
                selected && !submitted
                  ? "border-primary bg-accent-25 text-primary"
                  : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25",
                correct ? "border-success bg-success-light text-success" : "",
                wrong ? "border-error bg-error-light text-error" : "",
                submitted ? "cursor-not-allowed" : "cursor-pointer",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xs bg-off-white-50 text-h6 font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <Button
          variant="primary"
          size="md"
          disabled={!selectedAnswer}
          onClick={onSubmit}
          className="mt-5 w-full"
        >
          Submit Answer
        </Button>
      ) : (
        <div
          className={[
            "mt-5 rounded-md border-2 p-4",
            isCorrect
              ? "border-success bg-success-light"
              : "border-error bg-error-light",
          ].join(" ")}
        >
          {!isCorrect ? (
            <p className="mb-2 text-h6 text-grey-200 inter-font">
              Correct answer:{" "}
              <span className="font-semibold text-success">
                {question.correctAnswer}
              </span>
            </p>
          ) : null}
          <p className="text-h5 leading-7 text-grey-200 inter-font">
            {question.explanation}
          </p>
        </div>
      )}
    </Card>
  );
}

function PracticeTab({ study, practiceState, setPracticeState }) {
  const questions = study.practiceQuestions;
  const current = questions[practiceState.index] || questions[0];
  const answerRecord = practiceState.answers[current.id] || {};
  const answeredCount = Object.values(practiceState.answers).filter(
    (answer) => answer.submitted
  ).length;

  const handleSelect = (answer) => {
    setPracticeState((state) => ({
      ...state,
      answers: {
        ...state.answers,
        [current.id]: { ...state.answers[current.id], selected: answer },
      },
    }));
  };

  const handleSubmit = () => {
    setPracticeState((state) => ({
      ...state,
      answers: {
        ...state.answers,
        [current.id]: {
          ...state.answers[current.id],
          submitted: true,
        },
      },
    }));
  };

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-h6 inter-font">
          <span className="font-medium text-primary">
            Question {practiceState.index + 1} of {questions.length}
          </span>
          <span className="text-p-text">{answeredCount} answered</span>
        </div>
        <ProgressBar value={(answeredCount / questions.length) * 100} />
      </div>

      <PracticeQuestionCard
        question={current}
        selectedAnswer={answerRecord.selected}
        submitted={answerRecord.submitted}
        onSelect={handleSelect}
        onSubmit={handleSubmit}
      />

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="md"
          disabled={practiceState.index === 0}
          onClick={() =>
            setPracticeState((state) => ({ ...state, index: state.index - 1 }))
          }
        >
          Previous
        </Button>
        <Button
          variant="primary"
          size="md"
          disabled={!answerRecord.submitted || practiceState.index === questions.length - 1}
          onClick={() =>
            setPracticeState((state) => ({ ...state, index: state.index + 1 }))
          }
        >
          Next Question
        </Button>
      </div>
    </div>
  );
}

function ExamModeTab({ study, examState, setExamState }) {
  const questions = study.examQuestions;
  const current = questions[examState.index] || questions[0];
  const answeredCount = Object.keys(examState.answers).length;
  const correctCount = questions.filter(
    (questionItem) => examState.answers[questionItem.id] === questionItem.correctAnswer
  ).length;
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  if (!examState.started) {
    return (
      <div className="mx-auto max-w-[560px]">
        <Card variant="default" className="p-6 text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-h2 font-bold text-grey-200 poppins-font">
            Exam Mode
          </h2>
          <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
            Test your understanding with no hints. Review your score and weak
            areas after submission.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Metric label="Questions" value={questions.length} />
            <Metric label="Estimated time" value={`${Math.max(8, questions.length * 2)}m`} />
          </div>

          <div className="mt-6 rounded-md border border-grey-25 bg-off-white-100 p-4 text-left">
            <p className="text-h5 font-semibold text-grey-200 poppins-font">
              Rules
            </p>
            <p className="mt-1 text-h5 leading-7 text-p-text inter-font">
              No hints during exam mode. You can move between questions and
              review all explanations after submitting.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setExamState((state) => ({ ...state, started: true }))}
            className="mt-7 w-full"
          >
            <Play size={18} aria-hidden="true" />
            Start Exam
          </Button>
        </Card>
      </div>
    );
  }

  if (examState.submitted) {
    const weakSectionIds = questions
      .filter((questionItem) => examState.answers[questionItem.id] !== questionItem.correctAnswer)
      .map((questionItem) => questionItem.relatedSectionId);
    const weakAreas = study.material.sections
      .filter((section) => weakSectionIds.includes(section.id))
      .map((section) => section.title);

    return (
      <div className="mx-auto max-w-[840px]">
        <Card variant="accent" className="p-6">
          <div className="text-center">
            <p className="text-h6 font-semibold uppercase text-primary-200 poppins-font">
              Exam complete
            </p>
            <h2 className="mt-2 text-h1 font-bold text-grey-200 poppins-font">
              {score}%
            </h2>
            <p className="text-h5 text-p-text-darker inter-font">
              {correctCount} of {questions.length} correct
            </p>
          </div>

          <div className="mt-7 grid gap-4">
            {questions.map((questionItem, index) => {
              const selected = examState.answers[questionItem.id];
              const correct = selected === questionItem.correctAnswer;

              return (
                <div
                  key={questionItem.id}
                  className={[
                    "rounded-md border-2 bg-white p-4",
                    correct ? "border-success" : "border-error",
                  ].join(" ")}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant={correct ? "success" : "error"}>
                      {correct ? "Correct" : "Incorrect"}
                    </Badge>
                    <span className="text-h6 text-p-text inter-font">
                      Question {index + 1}
                    </span>
                  </div>
                  <p className="text-h5 font-semibold text-grey-200 inter-font">
                    {questionItem.question}
                  </p>
                  {!correct ? (
                    <p className="mt-2 text-h6 text-grey-200 inter-font">
                      Your answer:{" "}
                      <span className="font-semibold text-error">
                        {selected || "Not answered"}
                      </span>{" "}
                      - Correct answer:{" "}
                      <span className="font-semibold text-success">
                        {questionItem.correctAnswer}
                      </span>
                    </p>
                  ) : null}
                  <p className="mt-2 text-h6 leading-6 text-p-text inter-font">
                    {questionItem.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-md border border-accent-200 bg-white p-4">
            <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
              Recommended sections to review
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(weakAreas.length ? weakAreas : study.analytics.weakAreas).map((area) => (
                <Badge key={area} variant="error">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              setExamState({ started: false, submitted: false, index: 0, answers: {} })
            }
            className="mt-6 w-full"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Retake Exam
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[840px]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-h6 font-medium text-primary inter-font">
            Question {examState.index + 1} of {questions.length}
          </p>
          <p className="text-h6 text-p-text inter-font">
            {answeredCount} answered - Timer preview {Math.max(8, questions.length * 2)}:00
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setExamState((state) => ({ ...state, submitted: true }))}
        >
          Submit Exam
        </Button>
      </div>

      <Card variant="default" className="p-5 sm:p-6">
        <h2 className="text-h3 font-semibold leading-snug text-grey-200 poppins-font">
          {current.question}
        </h2>
        <div className="mt-6 grid gap-3">
          {current.options?.map((option, index) => {
            const selected = examState.answers[current.id] === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setExamState((state) => ({
                    ...state,
                    answers: { ...state.answers, [current.id]: option },
                  }))
                }
                className={[
                  "flex w-full items-center gap-3 rounded-md border-2 px-4 py-3 text-left text-h5 transition-all duration-175 inter-font",
                  selected
                    ? "border-primary bg-accent-25 text-primary"
                    : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25",
                ].join(" ")}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xs bg-off-white-50 text-h6 font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="md"
          disabled={examState.index === 0}
          onClick={() =>
            setExamState((state) => ({ ...state, index: state.index - 1 }))
          }
        >
          Previous
        </Button>
        <Button
          variant="primary"
          size="md"
          disabled={examState.index === questions.length - 1}
          onClick={() =>
            setExamState((state) => ({ ...state, index: state.index + 1 }))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function AnalyticsTab({ study, progress, completedSections, practiceState, examState }) {
  const submittedPractice = study.practiceQuestions.filter(
    (questionItem) => practiceState.answers[questionItem.id]?.submitted
  );
  const correctPractice = submittedPractice.filter(
    (questionItem) =>
      practiceState.answers[questionItem.id]?.selected === questionItem.correctAnswer
  );
  const practiceAccuracy = submittedPractice.length
    ? Math.round((correctPractice.length / submittedPractice.length) * 100)
    : study.analytics.practiceAccuracy;
  const materialPct = study.material.sections.length
    ? Math.round((completedSections.length / study.material.sections.length) * 100)
    : 0;
  const examScore = examState.submitted
    ? Math.round(
        (study.examQuestions.filter(
          (questionItem) => examState.answers[questionItem.id] === questionItem.correctAnswer
        ).length /
          study.examQuestions.length) *
          100
      )
    : study.analytics.examScore;

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard icon={BarChart3} label="Overall Progress" value={`${progress}%`} />
        <AnalyticsCard icon={FileText} label="Material Completed" value={`${materialPct}%`} />
        <AnalyticsCard icon={BookOpen} label="Practice Accuracy" value={`${practiceAccuracy}%`} />
        <AnalyticsCard icon={ClipboardCheck} label="Latest Exam Score" value={examScore ? `${examScore}%` : "Not taken"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card variant="default" className="lg:col-span-1">
          <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
            Strong areas
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {study.analytics.strongAreas.length ? (
              study.analytics.strongAreas.map((area) => (
                <Badge key={area} variant="success">
                  {area}
                </Badge>
              ))
            ) : (
              <p className="text-h5 text-p-text inter-font">
                Complete practice to reveal strong areas.
              </p>
            )}
          </div>
        </Card>

        <Card variant="default" className="lg:col-span-1">
          <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
            Weak areas
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {study.analytics.weakAreas.map((area) => (
              <Badge key={area} variant="error">
                {area}
              </Badge>
            ))}
          </div>
        </Card>

        <Card variant="accent" className="lg:col-span-1">
          <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
            Recommended review
          </h3>
          <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
            Finish incomplete material sections, then retake weak practice areas
            before entering exam mode again.
          </p>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsCard({ icon: Icon, label, value }) {
  return (
    <Card variant="default">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent-100 text-primary">
        <Icon size={20} aria-hidden="true" />
      </div>
      <p className="text-h3 font-bold text-grey-200 poppins-font">{value}</p>
      <p className="mt-1 text-h6 text-p-text inter-font">{label}</p>
    </Card>
  );
}

export default function StudyWorkspaceClient({ study }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [completedSections, setCompletedSections] = useState(() =>
    study.material.sections
      .filter((section) => section.completed)
      .map((section) => section.id)
  );
  const [practiceState, setPracticeState] = useState({ index: 0, answers: {} });
  const [examState, setExamState] = useState({
    started: false,
    submitted: false,
    index: 0,
    answers: {},
  });

  const progress = useMemo(() => {
    const materialWeight = study.material.sections.length
      ? (completedSections.length / study.material.sections.length) * 45
      : 0;
    const submittedPractice = Object.values(practiceState.answers).filter(
      (answer) => answer.submitted
    ).length;
    const practiceWeight = study.practiceQuestions.length
      ? (submittedPractice / study.practiceQuestions.length) * 30
      : 0;
    const examWeight = examState.submitted ? 25 : 0;

    return Math.round(clamp(materialWeight + practiceWeight + examWeight));
  }, [completedSections, examState.submitted, practiceState.answers, study]);

  const handleToggleSection = (sectionId) => {
    setCompletedSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId]
    );
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            study={study}
            progress={progress}
            onTabChange={setActiveTab}
          />
        );
      case "material":
        return (
          <MaterialTab
            study={study}
            completedSections={completedSections}
            onToggleSection={handleToggleSection}
          />
        );
      case "practice":
        return (
          <PracticeTab
            study={study}
            practiceState={practiceState}
            setPracticeState={setPracticeState}
          />
        );
      case "exam":
        return (
          <ExamModeTab
            study={study}
            examState={examState}
            setExamState={setExamState}
          />
        );
      case "analytics":
        return (
          <AnalyticsTab
            study={study}
            progress={progress}
            completedSections={completedSections}
            practiceState={practiceState}
            examState={examState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-off-white-100">
      <StudyWorkspaceHeader
        study={study}
        activeTab={activeTab}
        progress={progress}
      />
      <StudyWorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">{renderTab()}</div>
      </section>
    </main>
  );
}
