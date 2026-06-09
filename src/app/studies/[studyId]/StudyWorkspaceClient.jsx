"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  LayoutDashboard,
  Circle,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  RefreshCw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { Badge, Button, Card, LoadingExperience, Tabs } from "@/components/ui";
import ThemeToggle from "@/components/theme/ThemeToggle";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import {
  generateExamQuestionSet,
  generatePracticeQuestionSet,
  getExamQuestions,
  getExamQuestionSetQuestions,
  getPracticeQuestions,
  getPracticeQuestionSetQuestions,
  getStudy,
  getStudyGlossary,
  getStudyMaterial,
  getGenerationFailureMessage,
  getUserFacingError,
  hasAccessToken,
  isAuthError,
  listExamQuestionSets,
  listPracticeQuestionSets,
  regenerateStudyGlossary,
  resumeStudyGeneration,
  submitExamAttempt,
  submitPracticeAttempt,
} from "@/app/lib/aurifyApi";

const workspaceTabs = [
  { id: "overview", label: "Overview" },
  { id: "material", label: "Material" },
  { id: "glossary", label: "Glossary" },
  { id: "practice", label: "Practice" },
  { id: "exam", label: "Exam Mode" },
  { id: "analytics", label: "Analytics" },
];

const pollingStatuses = new Set([
  "queued",
  "generating_research",
  "generating_outline",
  "generating_material",
  "generating_glossary",
  "generating_practice_questions",
  "generating_exam_questions",
]);

const materialReadyStatuses = new Set([
  "material_ready",
  "generating_glossary",
  "glossary_ready",
  "generating_practice_questions",
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

const glossaryReadyStatuses = new Set([
  "glossary_ready",
  "generating_practice_questions",
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

const glossaryRegenerableStatuses = new Set([
  "material_ready",
  "glossary_ready",
  "generating_practice_questions",
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

const practiceReadyStatuses = new Set([
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

const examTimerOptions = [
  { label: "No timer", minutes: 0 },
  { label: "10 min", minutes: 10 },
  { label: "20 min", minutes: 20 },
  { label: "30 min", minutes: 30 },
  { label: "60 min", minutes: 60 },
];

const statusConfig = {
  queued: { label: "Queued", variant: "accent" },
  generating_research: { label: "Researching", variant: "accent" },
  research_ready: { label: "Research ready", variant: "accent" },
  generating_outline: { label: "Outlining", variant: "accent" },
  outline_ready: { label: "Outline ready", variant: "accent" },
  generating_material: { label: "Generating material", variant: "accent" },
  material_ready: { label: "Material ready", variant: "accent" },
  generating_glossary: { label: "Generating glossary", variant: "accent" },
  glossary_ready: { label: "Glossary ready", variant: "primary" },
  generating_practice_questions: { label: "Generating practice", variant: "accent" },
  practice_ready: { label: "Practice ready", variant: "primary" },
  generating_exam_questions: { label: "Generating exam", variant: "accent" },
  exam_ready: { label: "Exam ready", variant: "primary" },
  failed: { label: "Failed", variant: "error" },
};

const generationSteps = [
  {
    id: "research",
    title: "Research context",
    activeLabel: "Generating research context",
    doneLabel: "Research context generation done",
    waitingLabel: "Research context queued",
    generatingStatus: "generating_research",
    readyStatuses: [
      "research_ready",
      "generating_outline",
      "outline_ready",
      "generating_material",
      "material_ready",
      "generating_glossary",
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "outline",
    title: "Study outline",
    activeLabel: "Generating study outline",
    doneLabel: "Study outline generation done",
    waitingLabel: "Study outline queued",
    generatingStatus: "generating_outline",
    readyStatuses: [
      "outline_ready",
      "generating_material",
      "material_ready",
      "generating_glossary",
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "material",
    title: "Study material",
    activeLabel: "Generating study material",
    doneLabel: "Study material generation done",
    waitingLabel: "Study material queued",
    generatingStatus: "generating_material",
    readyStatuses: [
      "material_ready",
      "generating_glossary",
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "glossary",
    title: "Glossary",
    activeLabel: "Generating glossary",
    doneLabel: "Glossary generation done",
    waitingLabel: "Glossary queued",
    generatingStatus: "generating_glossary",
    readyStatuses: [
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "practice",
    title: "Practice questions",
    activeLabel: "Generating practice questions",
    doneLabel: "Practice question generation done",
    waitingLabel: "Practice questions queued",
    generatingStatus: "generating_practice_questions",
    readyStatuses: ["practice_ready", "generating_exam_questions", "exam_ready"],
  },
  {
    id: "exam",
    title: "Exam questions",
    activeLabel: "Generating exam questions",
    doneLabel: "Exam question generation done",
    waitingLabel: "Exam questions queued",
    generatingStatus: "generating_exam_questions",
    readyStatuses: ["exam_ready"],
  },
];

const visibleGenerationStatuses = new Set([
  "queued",
  "research_ready",
  "outline_ready",
  "material_ready",
  "glossary_ready",
  "practice_ready",
  ...pollingStatuses,
]);

const getGenerationStepState = (status, step, index) => {
  if (step.readyStatuses.includes(status)) return "done";
  if (status === step.generatingStatus) return "active";
  if (status === "queued" && index === 0) return "active";
  return "waiting";
};

const getActiveGenerationStep = (status) => {
  if (status === "queued") return generationSteps[0];
  return generationSteps.find((step) => step.generatingStatus === status);
};

const getNextGenerationStep = (status) =>
  generationSteps.find((step, index) => getGenerationStepState(status, step, index) === "waiting");

const clamp = (value) => Math.max(0, Math.min(100, value));
const clampQuestionCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 5;
  return Math.max(5, Math.min(30, parsed));
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const hasGeneratingSet = (sets) =>
  sets.some((set) => set.status === "queued" || set.status === "generating");

const getReadySets = (sets) => sets.filter((set) => set.status === "ready");
const latestSetId = "__latest_questions__";

const getSetQuestionCount = (set, fallback = 0) =>
  set?.question_count || set?.generated_question_count || set?.questions_count || fallback;

const getQuestionSetCards = ({ mode, sets, questions }) => {
  const label = mode === "practice" ? "Practice Set" : "Exam Set";
  const readySets = getReadySets(sets);

  if (readySets.length) {
    return readySets.map((set, index) => ({
      ...set,
      title: set.title || `${label} ${index + 1}`,
      questionCount: getSetQuestionCount(set),
      isFallback: false,
    }));
  }

  if (questions.length) {
    return [
      {
        id: latestSetId,
        title: mode === "practice" ? "Latest Practice" : "Latest Exam",
        questionCount: questions.length,
        status: "ready",
        isFallback: true,
      },
    ];
  }

  return [];
};

function getTitle(study) {
  return study?.title || study?.topic || "Untitled Study";
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getProgressValue(progress) {
  if (typeof progress === "number") return clamp(progress);
  if (!progress || typeof progress !== "object") return 0;

  const completed = [
    progress.material_completed,
    progress.practice_completed,
    progress.exam_completed,
  ].filter(Boolean).length;

  return Math.round((completed / 3) * 100);
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={["h-2 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft", className].join(" ")}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-350 ease-smooth dark:bg-dark-accent"
        style={{ width: `${clamp(value)}%` }}
      />
    </div>
  );
}

function WorkspaceHeader({ study, progress }) {
  const status = statusConfig[study?.status] || statusConfig.queued;

  return (
    <header className="border-b border-grey-25 bg-white px-4 py-4 sm:px-6 lg:px-8 dark:border-dark-border dark:bg-dark-surface">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/studies"
            className="inline-flex items-center gap-2 text-h6 font-medium text-p-text transition-colors hover:text-primary dark:text-dark-muted dark:hover:text-primary-25"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Studies
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center gap-2 rounded-sm border border-grey-25 bg-off-white-100 px-3 text-h6 font-medium text-p-text-darker transition-colors hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:text-primary-25"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-xl-head font-bold leading-tight text-grey-200 poppins-font">
              {getTitle(study)}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{study?.subject || "General"}</Badge>
              {study?.level ? <Badge variant="neutral">{study.level}</Badge> : null}
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>

          <div className="w-full max-w-[360px]">
            <div className="mb-2 flex items-center justify-between text-h6 inter-font">
              <span className="text-p-text">Study progress</span>
              <span className="font-semibold text-grey-200">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>
    </header>
  );
}

function LoadingState() {
  return (
    <LoadingExperience
      title="Loading this Study"
      message="Preparing your material, question sets, and progress."
    />
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-10 dark:bg-dark-bg">
      <Card variant="default" className="mx-auto max-w-[640px] p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-error" aria-hidden="true" />
        <h1 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Study could not load
        </h1>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          {message}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="md" onClick={onRetry}>
            Retry
          </Button>
          <Link
            href="/studies"
            className="inline-flex items-center justify-center rounded-sm border border-primary px-4 py-2 text-h5 font-medium text-primary transition-colors hover:bg-accent-25 dark:border-primary-25 dark:text-primary-25 dark:hover:bg-dark-surface-soft"
          >
            Back to Studies
          </Link>
        </div>
      </Card>
    </main>
  );
}

function GenerationNotice({ study, polling, onResume, resumeLoading }) {
  if (study.status === "failed") {
    return (
      <Card variant="default" className="mb-5 border-error bg-error-light p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
            <div>
              <h2 className="text-h4 font-semibold text-grey-200 poppins-font">
                Generation stopped
              </h2>
              <p className="mt-1 text-h5 leading-7 text-p-text-darker inter-font">
                {getGenerationFailureMessage(study)}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            loading={resumeLoading}
            onClick={onResume}
            className="shrink-0"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Resume
          </Button>
        </div>
      </Card>
    );
  }

  if (!visibleGenerationStatuses.has(study.status) || study.status === "exam_ready") {
    return null;
  }

  const activeStep = getActiveGenerationStep(study.status);
  const nextStep = activeStep ? null : getNextGenerationStep(study.status);
  const completedCount = generationSteps.filter(
    (step, index) => getGenerationStepState(study.status, step, index) === "done"
  ).length;
  const primaryLabel =
    activeStep?.activeLabel ||
    (nextStep ? `${nextStep.title} is up next` : "Finishing your Study");
  const helperLabel = activeStep
    ? "Aurify is working through this step now."
    : "The previous step is ready. Aurify will continue when the next generation step starts.";

  return (
    <Card
      variant="default"
      className="mb-5 overflow-hidden border-primary/30 bg-white p-0 shadow-panel dark:border-primary-25/30 dark:bg-dark-surface"
    >
      <div className="border-b border-grey-25 bg-off-white-100 px-5 py-4 dark:border-dark-border dark:bg-dark-surface-soft sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-accent-100 text-primary dark:border-primary-25/30 dark:bg-dark-surface dark:text-primary-25">
              {activeStep ? (
                <Loader2 className="h-5 w-5 aurify-loader-spin" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
                  Building your Study
                </p>
                <Badge variant="accent">
                  {completedCount}/{generationSteps.length} done
                </Badge>
              </div>
              <h2 className="break-words text-h4 font-semibold leading-7 text-grey-200 poppins-font dark:text-dark-text">
                {primaryLabel}
              </h2>
              <p className="mt-1 text-h5 leading-6 text-p-text-darker inter-font dark:text-dark-muted">
                {helperLabel}
              </p>
            </div>
          </div>
          <Badge variant={polling ? "accent" : "neutral"}>
            {polling ? "Live update" : "Ready"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-2 p-4 sm:p-5" role="list" aria-label="Study generation progress">
        {generationSteps.map((step, index) => {
          const state = getGenerationStepState(study.status, step, index);
          const isDone = state === "done";
          const isActive = state === "active";
          const label = isDone
            ? step.doneLabel
            : isActive
              ? step.activeLabel
              : step.waitingLabel;

          return (
            <div
              key={step.id}
              role="listitem"
              className={[
                "flex items-start gap-3 rounded-md border px-3 py-3 transition-all duration-250 ease-smooth",
                isDone
                  ? "border-success/25 bg-success-light/70 dark:border-success/30 dark:bg-success/10"
                  : "",
                isActive
                  ? "border-primary/40 bg-accent-25 shadow-card dark:border-primary-25/40 dark:bg-dark-surface-soft"
                  : "",
                !isDone && !isActive
                  ? "border-grey-25 bg-white dark:border-dark-border dark:bg-dark-surface"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={[
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  isDone
                    ? "border-success bg-success text-white"
                    : "",
                  isActive
                    ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                    : "",
                  !isDone && !isActive
                    ? "border-grey-25 bg-off-white-100 text-grey-100 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isDone ? (
                  <CheckCircle2 size={15} aria-hidden="true" />
                ) : isActive ? (
                  <Loader2 size={15} className="aurify-loader-spin" aria-hidden="true" />
                ) : (
                  <Circle size={10} aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={[
                      "break-words text-h5 font-semibold leading-6 inter-font",
                      isDone
                        ? "text-grey-200 dark:text-dark-text"
                        : isActive
                          ? "text-primary-200 dark:text-primary-25"
                          : "text-p-text dark:text-dark-muted",
                    ].join(" ")}
                  >
                    {label}
                  </p>
                  <span
                    className={[
                      "shrink-0 text-h6 font-semibold uppercase inter-font",
                      isDone
                        ? "text-success"
                        : isActive
                          ? "text-primary dark:text-primary-25"
                          : "text-grey-100 dark:text-dark-muted",
                    ].join(" ")}
                  >
                    {isDone ? "Done" : isActive ? "Generating" : index === completedCount ? "Up next" : "Queued"}
                  </span>
                </div>
                {isActive ? (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-bg">
                    <div className="h-full w-1/2 rounded-full bg-primary aurify-loader-slide dark:bg-dark-accent" />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Metric({ icon: Icon, label, value }) {
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

function OverviewTab({ study, material, progress, onTabChange }) {
  const weakAreas = study.progress?.aggregate_weak_areas || [];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <Card variant="default" className="p-6">
        <p className="text-h6 font-semibold uppercase text-primary poppins-font">
          Study overview
        </p>
        <h2 className="mt-2 text-h2 font-bold text-grey-200 poppins-font">
          {study.topic || getTitle(study)}
        </h2>
        <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
          {study.goal ||
            material?.source_notes ||
            "Your generated material will appear here when the backend finishes building this Study."}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric icon={FileText} label="Material" value={study.progress?.material_completed ? "Done" : "Pending"} />
          <Metric icon={BookOpen} label="Practice" value={study.progress?.practice_completed ? "Done" : "Pending"} />
          <Metric icon={ClipboardCheck} label="Exam" value={study.progress?.exam_completed ? "Done" : "Pending"} />
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={!material}
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
                {material
                  ? "Read the generated material, then return for practice and exam mode when questions are available."
                  : "Keep this page open while the backend prepares your material."}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
            Weak areas
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {weakAreas.length ? (
              weakAreas.map((area) => (
                <Badge key={area} variant="error">
                  {area}
                </Badge>
              ))
            ) : (
              <span className="text-h5 text-p-text inter-font">
                Complete practice or exam attempts to reveal weak areas.
              </span>
            )}
          </div>
        </Card>

        <Metric icon={BarChart3} label="Overall Progress" value={`${progress}%`} />
      </div>
    </div>
  );
}

function createHeadingSlug(text, counts) {
  const baseSlug =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section";

  const nextCount = (counts.get(baseSlug) || 0) + 1;
  counts.set(baseSlug, nextCount);

  return nextCount === 1 ? baseSlug : `${baseSlug}-${nextCount}`;
}

function MaterialOutline({ items, activeHeadingId, onItemClick, mobile = false }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Study material outline">
      <p className="text-h6 font-semibold uppercase text-grey-100 poppins-font">
        Outline
      </p>
      <div className={mobile ? "mt-3 grid gap-1" : "mt-3 max-h-[calc(100vh-190px)] overflow-y-auto pr-1"}>
        {items.map((item) => {
          const isActive = !item.isFallback && item.id === activeHeadingId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item)}
              className={[
                "group w-full rounded-sm border-l-2 py-2 pr-2 text-left text-h6 leading-5 transition-colors duration-175 ease-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                item.level >= 3 ? "pl-5" : "pl-3",
                isActive
                  ? "border-primary bg-accent-25 text-primary-200"
                  : "border-transparent text-p-text hover:border-accent-200 hover:bg-off-white-50 hover:text-grey-200",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className={mobile ? "line-clamp-2" : "block truncate"}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MaterialTab({ material }) {
  const markdownRef = useRef(null);
  const materialTopRef = useRef(null);
  const [outlineItems, setOutlineItems] = useState([]);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);

  const materialTopId = useMemo(() => {
    const counts = new Map();
    return `material-${createHeadingSlug(material?.id || material?.title || "study-material", counts)}-start`;
  }, [material?.id, material?.title]);

  useEffect(() => {
    setMobileOutlineOpen(false);
  }, [material?.content, material?.id]);

  useEffect(() => {
    const markdownNode = markdownRef.current;
    if (!markdownNode) return undefined;

    const slugCounts = new Map();
    const headings = Array.from(markdownNode.querySelectorAll("h2, h3"));
    const nextOutline = headings
      .map((heading) => {
        const title = heading.textContent?.trim();
        if (!title) return null;

        if (!heading.id) {
          heading.id = createHeadingSlug(title, slugCounts);
        } else {
          const existingId = heading.id;
          const existingCount = (slugCounts.get(existingId) || 0) + 1;
          slugCounts.set(existingId, existingCount);
        }

        return {
          id: heading.id,
          targetId: heading.id,
          title,
          level: Number(heading.tagName.replace("H", "")),
          isFallback: false,
        };
      })
      .filter(Boolean);

    if (!nextOutline.length && Array.isArray(material?.outline)) {
      const fallbackItems = material.outline
        .map((title, index) => {
          const cleanTitle = String(title || "").trim();
          if (!cleanTitle) return null;

          return {
            id: `fallback-outline-${index}`,
            targetId: materialTopId,
            title: cleanTitle,
            level: 2,
            isFallback: true,
          };
        })
        .filter(Boolean);

      setOutlineItems(fallbackItems);
      setActiveHeadingId("");
      return undefined;
    }

    setOutlineItems(nextOutline);
    setActiveHeadingId(nextOutline[0]?.id || "");

    if (!nextOutline.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries[0]?.target?.id) {
          setActiveHeadingId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-130px 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    nextOutline.forEach((item) => {
      const heading = document.getElementById(item.targetId);
      if (heading) observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [material?.content, material?.outline, materialTopId]);

  const handleOutlineClick = useCallback((item) => {
    const target = item.isFallback
      ? materialTopRef.current
      : document.getElementById(item.targetId);

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!item.isFallback) setActiveHeadingId(item.id);
    setMobileOutlineOpen(false);
  }, []);

  if (!material) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <FileText className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Material is not ready yet
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          The backend is still generating this Study. This tab will fill in
          automatically when the Study reaches ready status.
        </p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] lg:relative">
      <article className="mx-auto min-w-0 max-w-[980px] xl:max-w-[1020px]">
        <Card
          variant="default"
          className="scroll-mt-32 p-5 sm:p-7"
          id={materialTopId}
        >
          <div ref={materialTopRef} className="scroll-mt-32">
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Generated material
            </p>
            <h2 className="mt-2 text-h2 font-bold text-grey-200 poppins-font">
              {material.title || "Study Material"}
            </h2>
            {material.source_notes ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                {material.source_notes}
              </p>
            ) : null}
          </div>
          <div
            ref={markdownRef}
            className="prose prose-neutral mt-6 max-w-none text-grey-200 prose-headings:scroll-mt-32 prose-headings:font-bold prose-headings:text-grey-200 prose-p:leading-7 prose-a:text-primary"
          >
            <ReactMarkdown>{material.content || ""}</ReactMarkdown>
          </div>
        </Card>
      </article>

      {outlineItems.length ? (
        <aside className="group fixed right-3 top-[142px] z-30 lg:right-4 lg:top-[168px]">
          <div className="flex items-start justify-end">
            <button
              type="button"
              onClick={() => setMobileOutlineOpen((isOpen) => !isOpen)}
              aria-label="Show material outline"
              aria-expanded={mobileOutlineOpen}
              className="mt-3 flex h-28 w-9 items-center justify-center rounded-l-md border border-r-0 border-grey-25 bg-white text-primary shadow-card transition-colors duration-175 ease-smooth hover:border-primary hover:bg-accent-25 focus:border-primary focus:bg-accent-25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group-hover:border-primary group-hover:bg-accent-25 group-focus-within:border-primary group-focus-within:bg-accent-25 dark:border-dark-border dark:bg-dark-surface dark:text-primary-25 dark:shadow-none dark:hover:border-primary-25 dark:hover:bg-dark-surface-soft dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg dark:group-hover:border-primary-25 dark:group-hover:bg-dark-surface-soft"
            >
              <span className="-rotate-90 whitespace-nowrap text-h6 font-semibold uppercase poppins-font">
                Outline
              </span>
            </button>
            <div
              className={[
                "overflow-hidden transition-all duration-250 ease-smooth",
                mobileOutlineOpen
                  ? "pointer-events-auto w-[calc(100vw-64px)] max-w-[340px] translate-x-0 opacity-100"
                  : "pointer-events-none w-0 max-w-[340px] translate-x-3 opacity-0",
                "lg:pointer-events-none lg:w-0 lg:max-w-none lg:translate-x-3 lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:w-[340px] lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:w-[340px] lg:group-focus-within:translate-x-0 lg:group-focus-within:opacity-100 xl:group-hover:w-[380px] xl:group-focus-within:w-[380px]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="rounded-md border border-grey-25 bg-white p-4 shadow-modal dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
                <MaterialOutline
                  items={outlineItems}
                  activeHeadingId={activeHeadingId}
                  onItemClick={handleOutlineClick}
                />
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

function GlossaryTab({
  study,
  glossary,
  loading,
  error,
  onRetry,
  onResume,
  resumeLoading,
  onRegenerate,
  regenerateLoading,
}) {
  const isReady = glossaryReadyStatuses.has(study?.status);
  const terms = Array.isArray(glossary?.terms) ? glossary.terms : [];
  const isFailed = study?.status === "failed";
  const canGenerateGlossary = glossaryRegenerableStatuses.has(study?.status);
  const glossaryActionLabel =
    study?.status === "material_ready" ? "Generate Glossary" : "Regenerate Glossary";

  if (!isReady) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Glossary is not ready yet
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          Key terms will appear here after the backend finishes generating the glossary.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="md" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </Button>
          {canGenerateGlossary ? (
            <Button
              variant="ghost"
              size="md"
              loading={regenerateLoading}
              onClick={onRegenerate}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {glossaryActionLabel}
            </Button>
          ) : null}
          {isFailed ? (
            <Button
              variant="ghost"
              size="md"
              loading={resumeLoading}
              onClick={onResume}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Resume Generation
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <LoadingExperience
        variant="panel"
        title="Loading glossary"
        message="Organizing key terms and definitions for this Study."
      />
    );
  }

  if (error || !terms.length) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Glossary terms are not available
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          {error || "The backend marked the glossary ready, but no terms were returned."}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="md" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </Button>
          {canGenerateGlossary ? (
            <Button
              variant="ghost"
              size="md"
              loading={regenerateLoading}
              onClick={onRegenerate}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {glossaryActionLabel}
            </Button>
          ) : null}
          {isFailed ? (
            <Button
              variant="ghost"
              size="md"
              loading={resumeLoading}
              onClick={onResume}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Resume Generation
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-5">
      <Card variant="default" className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Terms to know
            </p>
            <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
              {terms.length} glossary terms
            </h2>
            {glossary?.source_notes ? (
              <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
                {glossary.source_notes}
              </p>
            ) : null}
          </div>
          <Badge variant="primary">Glossary ready</Badge>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {terms.map((item, index) => (
          <Card
            key={`${item.term || "term"}-${index}`}
            variant="default"
            className="p-5"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-h3 font-semibold leading-tight text-grey-200 poppins-font">
                {item.term || "Untitled term"}
              </h3>
              {item.difficulty ? <Badge variant="accent">{item.difficulty}</Badge> : null}
            </div>
            <p className="text-h5 leading-7 text-p-text-darker inter-font">
              {item.definition || "No definition was provided."}
            </p>
            {item.simple_explanation ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                <span className="font-semibold text-grey-200">Plain English:</span>{" "}
                {item.simple_explanation}
              </p>
            ) : null}
            {item.analogy ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                <span className="font-semibold text-grey-200">Analogy:</span>{" "}
                {item.analogy}
              </p>
            ) : null}
            {item.why_it_matters ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                <span className="font-semibold text-grey-200">Why it matters:</span>{" "}
                {item.why_it_matters}
              </p>
            ) : null}
            {item.section ? (
              <div className="mt-4">
                <Badge variant="neutral">{item.section}</Badge>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}

function PracticeLoadingState() {
  return (
    <LoadingExperience
      variant="panel"
      title="Loading practice sets"
      message="Preparing questions and checking your saved progress."
    />
  );
}

function PracticeUnavailableState({ study, error, onRetry, onResume, resumeLoading }) {
  const isReady = practiceReadyStatuses.has(study?.status);
  const canResumePractice =
    study?.status === "material_ready" ||
    study?.status === "glossary_ready" ||
    practiceReadyStatuses.has(study?.status);
  const resumeLabel =
    study?.status === "material_ready" || study?.status === "glossary_ready"
      ? "Generate Practice Questions"
      : "Resume Generation";

  return (
    <Card variant="default" className="mx-auto max-w-[680px] p-6 text-center">
      <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
        {isReady ? "Practice questions are not available" : "Practice is not ready yet"}
      </h2>
      <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
        {error ||
          (isReady
            ? "The backend marked this Study ready, but no practice questions were returned."
            : study?.status === "material_ready" || study?.status === "glossary_ready"
              ? "Material is ready, but practice questions have not been generated yet."
            : "The backend is still preparing practice questions for this Study.")}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="primary" size="md" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </Button>
        {canResumePractice ? (
          <Button
            variant="ghost"
            size="md"
            loading={resumeLoading}
            onClick={onResume}
          >
            <RotateCcw size={16} aria-hidden="true" />
            {resumeLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function PracticeResultSummary({ result, onReset }) {
  if (!result) return null;

  const score = Math.round(Number(result.score || 0));
  const weakAreas = result.weak_areas || [];

  return (
    <Card variant="accent" className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Practice submitted
          </p>
          <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
            {score}%
          </h2>
          <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
            {result.correct_count} of {result.total_questions} questions correct.
          </p>
        </div>
        <Button variant="ghost" size="md" onClick={onReset}>
          <RotateCcw size={16} aria-hidden="true" />
          Practice Again
        </Button>
      </div>
      {weakAreas.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {weakAreas.map((area) => (
            <Badge key={area} variant="error">
              {area}
            </Badge>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function QuestionSetLanding({
  mode,
  sets,
  questions,
  title,
  count,
  generating,
  error,
  onSelectSet,
  onTitleChange,
  onCountChange,
  onGenerate,
  onRefresh,
}) {
  const cards = getQuestionSetCards({ mode, sets, questions });
  const label = mode === "practice" ? "Practice set" : "Exam set";
  const titleText = mode === "practice" ? "Practice question sets" : "Exam question sets";
  const actionText = mode === "practice" ? "Start Practice" : "Start Exam";
  const nextNumber = sets.length + 1;

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Question sets
          </p>
          <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
            {titleText}
          </h2>
        </div>
        <Button variant="ghost" size="md" onClick={onRefresh}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-h5 leading-6 inter-font">{error}</p>
        </div>
      ) : null}

      {cards.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((set) => (
            <Card
              key={set.id}
              variant="default"
              onClick={() => onSelectSet(set.id)}
              className="flex min-h-[190px] flex-col justify-between p-5"
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
                    {mode === "practice" ? (
                      <BookOpen size={20} aria-hidden="true" />
                    ) : (
                      <ClipboardCheck size={20} aria-hidden="true" />
                    )}
                  </div>
                  {set.isFallback ? (
                    <Badge variant="neutral">Latest</Badge>
                  ) : set.status && set.status !== "ready" ? (
                    <Badge variant="accent">{set.status}</Badge>
                  ) : null}
                </div>
                <h3 className="break-words text-h3 font-semibold leading-7 text-grey-200 poppins-font">
                  {set.title}
                </h3>
                <p className="mt-3 text-h5 text-p-text-darker inter-font">
                  {set.questionCount || "?"} questions
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-grey-25 pt-4 dark:border-dark-border">
                <span className="text-h5 font-semibold text-primary inter-font">
                  {actionText}
                </span>
                <Play size={17} className="text-primary" aria-hidden="true" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="default" className="p-6 text-center">
          <h3 className="text-h3 font-semibold text-grey-200 poppins-font">
            No ready sets yet
          </h3>
          <p className="mx-auto mt-2 max-w-[560px] text-h5 leading-7 text-p-text-darker inter-font">
            Generate a {label} to start working through questions.
          </p>
        </Card>
      )}

      <Card variant="default" className="p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
          <label className="grid gap-1 text-h6 font-medium text-p-text inter-font">
            <span>New title</span>
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder={`${label} ${nextNumber}`}
              className="min-h-[42px] rounded-sm border border-grey-25 bg-white px-3 text-h5 text-grey-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text"
            />
          </label>
          <label className="grid gap-1 text-h6 font-medium text-p-text inter-font">
            <span>Count</span>
            <input
              value={count}
              min={5}
              max={30}
              type="number"
              onChange={(event) => onCountChange(event.target.value)}
              className="min-h-[42px] rounded-sm border border-grey-25 bg-white px-3 text-h5 text-grey-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text"
            />
          </label>
        </div>

        <Button
          variant="primary"
          size="md"
          loading={generating}
          onClick={onGenerate}
          className="mt-4 w-full sm:w-auto"
        >
          <Plus size={16} aria-hidden="true" />
          Generate Set
        </Button>
      </Card>
    </div>
  );
}

function SessionHeader({ mode, title, answeredCount, totalQuestions, onBack, children }) {
  const progress = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  return (
    <Card variant="default" className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button variant="text" size="sm" onClick={onBack} className="px-0">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sets
          </Button>
          <p className="mt-4 text-h6 font-semibold uppercase text-primary poppins-font">
            {mode === "practice" ? "Practice session" : "Exam session"}
          </p>
          <h2 className="mt-1 break-words text-h3 font-bold text-grey-200 poppins-font">
            {title}
          </h2>
        </div>
        {children}
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-h6 inter-font">
          <span className="text-p-text">Progress</span>
          <span className="font-semibold text-grey-200">
            {answeredCount} of {totalQuestions} answered
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>
    </Card>
  );
}

function QuestionNumberGrid({ questions, answers, activeIndex, onActiveIndexChange, variant = "practice" }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-12">
      {questions.map((item, index) => {
        const isActive = index === activeIndex;
        const isAnswered = Boolean(answers[item.id]);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onActiveIndexChange(index)}
            className={[
              "flex aspect-square min-h-[36px] items-center justify-center rounded-sm border text-h6 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
              isActive
                ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                : isAnswered && variant === "practice"
                  ? "border-success bg-success-light text-success dark:bg-success/15 dark:text-green-300"
                  : isAnswered
                    ? "border-primary bg-accent-25 text-primary dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                    : "border-grey-25 bg-white text-p-text hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted dark:hover:border-primary-25 dark:hover:text-primary-25",
            ].join(" ")}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

function PracticeTab({
  study,
  questions,
  questionSets,
  selectedSetId,
  activeView,
  setTitle,
  setCount,
  setGenerating,
  loading,
  error,
  activeIndex,
  answers,
  submitError,
  submitLoading,
  attemptResult,
  resumeLoading,
  onRetry,
  onResume,
  onSelectSet,
  onBackToSets,
  onSetTitleChange,
  onSetCountChange,
  onGenerateSet,
  onAnswer,
  onActiveIndexChange,
  onSubmit,
  onReset,
}) {
  if (!practiceReadyStatuses.has(study.status)) {
    return (
      <PracticeUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  if (loading) return <PracticeLoadingState />;

  if (activeView === "sets") {
    return (
      <QuestionSetLanding
        mode="practice"
        sets={questionSets}
        questions={questions}
        title={setTitle}
        count={setCount}
        generating={setGenerating}
        error={error}
        onSelectSet={onSelectSet}
        onTitleChange={onSetTitleChange}
        onCountChange={onSetCountChange}
        onGenerate={onGenerateSet}
        onRefresh={onRetry}
      />
    );
  }

  if (error || !questions.length) {
    return (
      <PracticeUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  const safeActiveIndex = Math.min(activeIndex, questions.length - 1);
  const question = questions[safeActiveIndex];
  const selectedAnswer = answers[question.id];
  const correctAnswer = question.correct_answer || question.correctAnswer || question.answer;
  const hasAnswered = Boolean(selectedAnswer);
  const isCorrect = hasAnswered && selectedAnswer === correctAnswer;
  const answeredCount = Object.keys(answers).filter((questionId) =>
    questions.some((item) => item.id === questionId)
  ).length;
  const allAnswered = answeredCount === questions.length;
  const selectedSet = questionSets.find((set) => set.id === selectedSetId);
  const sessionTitle =
    selectedSet?.title || (selectedSetId === latestSetId ? "Latest Practice" : "Practice Set");

  return (
    <div className="grid gap-5">
      <SessionHeader
        mode="practice"
        title={sessionTitle}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onBack={onBackToSets}
      />

      <QuestionNumberGrid
        questions={questions}
        answers={answers}
        activeIndex={safeActiveIndex}
        onActiveIndexChange={onActiveIndexChange}
        variant="practice"
      />

      <div className="grid gap-5">
        <PracticeResultSummary result={attemptResult} onReset={onReset} />

      <Card variant="default" className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Badge variant="neutral">Question {safeActiveIndex + 1}</Badge>
          <div className="flex flex-wrap gap-2">
            {question.difficulty ? (
              <Badge variant="accent">{question.difficulty}</Badge>
            ) : null}
            {question.weak_area ? (
              <Badge variant="neutral">{question.weak_area}</Badge>
            ) : null}
          </div>
        </div>

        <h2 className="text-h3 font-semibold leading-snug text-grey-200 poppins-font">
          {question.question}
        </h2>

        <div className="mt-5 grid gap-3">
          {(question.options || []).map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === correctAnswer;
            const showCorrect = hasAnswered && isCorrectOption;
            const showIncorrect = hasAnswered && isSelected && !isCorrectOption;

            return (
              <button
                key={option}
                type="button"
                disabled={hasAnswered}
                onClick={() => onAnswer(question.id, option)}
                className={[
                  "flex min-h-[52px] w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-h5 leading-6 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-default inter-font dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
                  showCorrect
                    ? "border-success bg-success-light text-success dark:bg-success/15 dark:text-green-300"
                    : showIncorrect
                      ? "border-error bg-error-light text-error dark:bg-error/15 dark:text-red-300"
                      : isSelected
                        ? "border-primary bg-accent-25 text-primary dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                        : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:bg-dark-bg dark:hover:text-primary-25",
                ].join(" ")}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  {showCorrect ? (
                    <CheckCircle2 size={18} aria-hidden="true" />
                  ) : showIncorrect ? (
                    <XCircle size={18} aria-hidden="true" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-current" />
                  )}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {hasAnswered ? (
          <div
            className={[
              "mt-5 rounded-md border px-4 py-3",
              isCorrect
                ? "border-success bg-success-light text-success"
                : "border-error bg-error-light text-error",
            ].join(" ")}
          >
            <p className="text-h5 font-semibold inter-font">
              {isCorrect ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1 text-h5 leading-7 inter-font">
              {question.explanation || `Correct answer: ${correctAnswer}`}
            </p>
          </div>
        ) : null}

        {submitError ? (
          <div className="mt-5 flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="text-h5 leading-6 inter-font">{submitError}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 border-t border-grey-25 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="md"
              disabled={safeActiveIndex === 0}
              onClick={() => onActiveIndexChange(safeActiveIndex - 1)}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="md"
              disabled={safeActiveIndex === questions.length - 1}
              onClick={() => onActiveIndexChange(safeActiveIndex + 1)}
            >
              Next
            </Button>
          </div>
          <Button
            variant="primary"
            size="md"
            disabled={!allAnswered}
            loading={submitLoading}
            onClick={onSubmit}
          >
            Submit Practice
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}

function ExamLoadingState() {
  return (
    <LoadingExperience
      variant="panel"
      title="Loading exam mode"
      message="Preparing your exam set, timer, and attempt state."
    />
  );
}

function ExamUnavailableState({ study, error, onRetry, onResume, resumeLoading }) {
  const canResumeExam =
    study?.status === "practice_ready" ||
    study?.status === "generating_exam_questions" ||
    study?.status === "exam_ready";
  const resumeLabel =
    study?.status === "practice_ready"
      ? "Generate Exam Questions"
      : "Resume Generation";

  return (
    <Card variant="default" className="mx-auto max-w-[680px] p-6 text-center">
      <ClipboardCheck className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
        {study?.status === "exam_ready"
          ? "Exam questions are not available"
          : "Exam mode is not ready yet"}
      </h2>
      <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
        {error ||
          (study?.status === "practice_ready"
            ? "Practice is ready, but exam questions have not been generated yet."
            : study?.status === "generating_exam_questions"
              ? "The backend is preparing exam questions for this Study."
              : "The backend is still preparing this Study for exam mode.")}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="primary" size="md" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </Button>
        {canResumeExam ? (
          <Button
            variant="ghost"
            size="md"
            loading={resumeLoading}
            onClick={onResume}
          >
            <RotateCcw size={16} aria-hidden="true" />
            {resumeLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function ExamSetup({ questions, selectedTimer, onTimerChange, onStart }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
      <Card variant="default" className="p-5">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <ClipboardCheck size={20} aria-hidden="true" />
        </div>
        <p className="text-h6 font-semibold uppercase text-primary poppins-font">
          Exam setup
        </p>
        <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
          {questions.length} questions
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          Choose a timer option, then start when you are ready.
        </p>
      </Card>

      <Card variant="default" className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-h3 font-semibold text-grey-200 poppins-font">
            Timer
          </h2>
        </div>

        <div className="grid gap-2 sm:grid-cols-5">
          {examTimerOptions.map((option) => {
            const isSelected = selectedTimer === option.minutes;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onTimerChange(option.minutes)}
                aria-pressed={isSelected}
                className={[
                  "min-h-[48px] rounded-sm border px-3 py-2 text-h5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inter-font dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
                  isSelected
                    ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                    : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25 hover:text-primary dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:bg-dark-bg dark:hover:text-primary-25",
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <Button variant="primary" size="lg" onClick={onStart} className="mt-6 w-full">
          <Play size={18} aria-hidden="true" />
          Start Exam
        </Button>
      </Card>
    </div>
  );
}

function ExamResultSummary({ result, onReset }) {
  if (!result) return null;

  const score = Math.round(Number(result.score || 0));
  const weakAreas = result.weak_areas || [];
  const feedback = result.feedback || [];

  return (
    <div className="grid gap-5">
      <Card variant="accent" className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Exam submitted
            </p>
            <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
              {score}%
            </h2>
            <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
              {result.correct_count} of {result.total_questions} questions correct.
            </p>
          </div>
          <Button variant="ghost" size="md" onClick={onReset}>
            <RotateCcw size={16} aria-hidden="true" />
            Retake Exam
          </Button>
        </div>
        {weakAreas.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {weakAreas.map((area) => (
              <Badge key={area} variant="error">
                {area}
              </Badge>
            ))}
          </div>
        ) : null}
      </Card>

      {feedback.length ? (
        <div className="grid gap-3">
          {feedback.map((item, index) => (
            <Card key={item.question_id || index} variant="default" className="p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Badge variant="neutral">Question {index + 1}</Badge>
                <Badge variant={item.is_correct ? "success" : "error"}>
                  {item.is_correct ? "Correct" : "Review"}
                </Badge>
              </div>
              <h3 className="text-h4 font-semibold leading-7 text-grey-200 poppins-font">
                {item.question}
              </h3>
              <div className="mt-4 grid gap-2 text-h5 leading-7 inter-font">
                <p className="text-p-text-darker">
                  <span className="font-semibold text-grey-200">Your answer:</span>{" "}
                  {item.selected_answer || "Not answered"}
                </p>
                <p className="text-p-text-darker">
                  <span className="font-semibold text-grey-200">Correct answer:</span>{" "}
                  {item.correct_answer}
                </p>
                {item.explanation ? (
                  <p className="text-p-text-darker">{item.explanation}</p>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ExamTab({
  study,
  questions,
  questionSets,
  selectedSetId,
  activeView,
  setTitle,
  setCount,
  setGenerating,
  loading,
  error,
  activeIndex,
  answers,
  started,
  selectedTimer,
  secondsRemaining,
  timedOut,
  submitError,
  submitLoading,
  attemptResult,
  resumeLoading,
  onRetry,
  onResume,
  onSelectSet,
  onBackToSets,
  onSetTitleChange,
  onSetCountChange,
  onGenerateSet,
  onTimerChange,
  onStart,
  onAddTime,
  onAnswer,
  onActiveIndexChange,
  onSubmit,
  onReset,
}) {
  if (study.status !== "exam_ready") {
    return (
      <ExamUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  if (loading) return <ExamLoadingState />;

  if (activeView === "sets") {
    return (
      <QuestionSetLanding
        mode="exam"
        sets={questionSets}
        questions={questions}
        title={setTitle}
        count={setCount}
        generating={setGenerating}
        error={error}
        onSelectSet={onSelectSet}
        onTitleChange={onSetTitleChange}
        onCountChange={onSetCountChange}
        onGenerate={onGenerateSet}
        onRefresh={onRetry}
      />
    );
  }

  if (error || !questions.length) {
    return (
      <ExamUnavailableState
        study={study}
        error={error}
        onRetry={onRetry}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  const selectedSet = questionSets.find((set) => set.id === selectedSetId);
  const sessionTitle =
    selectedSet?.title || (selectedSetId === latestSetId ? "Latest Exam" : "Exam Set");

  if (attemptResult) {
    return (
      <div className="grid gap-5">
        <Button variant="text" size="sm" onClick={onBackToSets} className="w-fit px-0">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to sets
        </Button>
        <ExamResultSummary result={attemptResult} onReset={onReset} />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="grid gap-5">
        <SessionHeader
          mode="exam"
          title={sessionTitle}
          answeredCount={0}
          totalQuestions={questions.length}
          onBack={onBackToSets}
        />
        <ExamSetup
          questions={questions}
          selectedTimer={selectedTimer}
          onTimerChange={onTimerChange}
          onStart={onStart}
        />
      </div>
    );
  }

  const safeActiveIndex = Math.min(activeIndex, questions.length - 1);
  const question = questions[safeActiveIndex];
  const selectedAnswer = answers[question.id];
  const answeredCount = Object.keys(answers).filter((questionId) =>
    questions.some((item) => item.id === questionId)
  ).length;
  const hasTimer = selectedTimer > 0;
  const isAnsweringLocked = timedOut || submitLoading;

  return (
    <div className="grid gap-5">
      <SessionHeader
        mode="exam"
        title={sessionTitle}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        onBack={onBackToSets}
      >
        <div className="flex min-w-[170px] items-center justify-between rounded-md border border-grey-25 bg-off-white-100 px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
          <div className="flex items-center gap-2 text-h5 font-semibold text-grey-200 inter-font">
            <Clock size={16} aria-hidden="true" />
            {hasTimer ? formatDuration(secondsRemaining) : "No timer"}
          </div>
          {hasTimer ? (
            <Badge variant={timedOut ? "error" : "accent"}>
              {timedOut ? "Time up" : "Running"}
            </Badge>
          ) : null}
        </div>
      </SessionHeader>

      <QuestionNumberGrid
        questions={questions}
        answers={answers}
        activeIndex={safeActiveIndex}
        onActiveIndexChange={onActiveIndexChange}
        variant="exam"
      />

      {timedOut ? (
        <Card variant="default" className="border-error bg-error-light p-5">
          <AlertCircle className="h-6 w-6 text-error" aria-hidden="true" />
          <h3 className="mt-2 text-h4 font-semibold text-grey-200 poppins-font">
            Time is up
          </h3>
          <p className="mt-1 text-h5 leading-7 text-p-text-darker inter-font">
            Add more time to continue this attempt, or submit your selected answers now.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Button variant="ghost" size="md" onClick={() => onAddTime(5)}>
              Add 5 min
            </Button>
            <Button variant="ghost" size="md" onClick={() => onAddTime(10)}>
              Add 10 min
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!answeredCount}
              loading={submitLoading}
              onClick={onSubmit}
            >
              Submit Now
            </Button>
          </div>
        </Card>
      ) : null}

      <Card variant="default" className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Badge variant="neutral">Question {safeActiveIndex + 1}</Badge>
          <div className="flex flex-wrap gap-2">
            {question.difficulty ? (
              <Badge variant="accent">{question.difficulty}</Badge>
            ) : null}
            {question.weak_area ? (
              <Badge variant="neutral">{question.weak_area}</Badge>
            ) : null}
          </div>
        </div>

        <h2 className="text-h3 font-semibold leading-snug text-grey-200 poppins-font">
          {question.question}
        </h2>

        <div className="mt-5 grid gap-3">
          {(question.options || []).map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                disabled={isAnsweringLocked}
                onClick={() => onAnswer(question.id, option)}
                className={[
                  "flex min-h-[52px] w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-h5 leading-6 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed inter-font dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
                  isSelected
                    ? "border-primary bg-accent-25 text-primary dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
                    : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:bg-dark-bg dark:hover:text-primary-25",
                  isAnsweringLocked && !isSelected ? "opacity-60" : "",
                ].join(" ")}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <span
                    className={[
                      "h-4 w-4 rounded-full border",
                      isSelected ? "border-primary bg-primary" : "border-current",
                    ].join(" ")}
                  />
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {submitError ? (
          <div className="mt-5 flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="text-h5 leading-6 inter-font">{submitError}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 border-t border-grey-25 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="md"
              disabled={safeActiveIndex === 0}
              onClick={() => onActiveIndexChange(safeActiveIndex - 1)}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="md"
              disabled={safeActiveIndex === questions.length - 1}
              onClick={() => onActiveIndexChange(safeActiveIndex + 1)}
            >
              Next
            </Button>
          </div>
          <Button
            variant="primary"
            size="md"
            disabled={!answeredCount || timedOut}
            loading={submitLoading}
            onClick={onSubmit}
          >
            <Trophy size={16} aria-hidden="true" />
            Submit Exam
          </Button>
        </div>
      </Card>
    </div>
  );
}

function AnalyticsTab({ study, progress }) {
  const weakAreas = study.progress?.aggregate_weak_areas || [];

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={BarChart3} label="Overall Progress" value={`${progress}%`} />
        <Metric
          icon={FileText}
          label="Material"
          value={study.progress?.material_completed ? "Complete" : "Pending"}
        />
        <Metric
          icon={BookOpen}
          label="Latest Practice"
          value={
            study.progress?.latest_practice_score == null
              ? "Not taken"
              : `${study.progress.latest_practice_score}%`
          }
        />
        <Metric
          icon={ClipboardCheck}
          label="Latest Exam"
          value={
            study.progress?.latest_exam_score == null
              ? "Not taken"
              : `${study.progress.latest_exam_score}%`
          }
        />
      </div>

      <Card variant="default">
        <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
          Weak areas
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {weakAreas.length ? (
            weakAreas.map((area) => (
              <Badge key={area} variant="error">
                {area}
              </Badge>
            ))
          ) : (
            <p className="text-h5 text-p-text inter-font">
              No weak areas yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function StudyWorkspaceClient({ studyId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [study, setStudy] = useState(null);
  const [material, setMaterial] = useState(null);
  const [glossary, setGlossary] = useState(null);
  const [glossaryLoading, setGlossaryLoading] = useState(false);
  const [glossaryError, setGlossaryError] = useState("");
  const [practiceQuestionSets, setPracticeQuestionSets] = useState([]);
  const [selectedPracticeSetId, setSelectedPracticeSetId] = useState("");
  const [practiceSetTitle, setPracticeSetTitle] = useState("");
  const [practiceSetCount, setPracticeSetCount] = useState("");
  const [practiceSetGenerating, setPracticeSetGenerating] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceError, setPracticeError] = useState("");
  const [activePracticeIndex, setActivePracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceSubmitLoading, setPracticeSubmitLoading] = useState(false);
  const [practiceSubmitError, setPracticeSubmitError] = useState("");
  const [practiceAttemptResult, setPracticeAttemptResult] = useState(null);
  const [activePracticeView, setActivePracticeView] = useState("sets");
  const [examQuestionSets, setExamQuestionSets] = useState([]);
  const [selectedExamSetId, setSelectedExamSetId] = useState("");
  const [examSetTitle, setExamSetTitle] = useState("");
  const [examSetCount, setExamSetCount] = useState("");
  const [examSetGenerating, setExamSetGenerating] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState("");
  const [activeExamIndex, setActiveExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examStarted, setExamStarted] = useState(false);
  const [selectedExamTimer, setSelectedExamTimer] = useState(0);
  const [examSecondsRemaining, setExamSecondsRemaining] = useState(0);
  const [examTimedOut, setExamTimedOut] = useState(false);
  const [examSubmitLoading, setExamSubmitLoading] = useState(false);
  const [examSubmitError, setExamSubmitError] = useState("");
  const [examAttemptResult, setExamAttemptResult] = useState(null);
  const [activeExamView, setActiveExamView] = useState("sets");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [glossaryRegenerating, setGlossaryRegenerating] = useState(false);

  const progress = useMemo(() => getProgressValue(study?.progress), [study]);
  const shouldPoll = study ? pollingStatuses.has(study.status) : false;
  const shouldPollQuestionSets =
    hasGeneratingSet(practiceQuestionSets) || hasGeneratingSet(examQuestionSets);

  const loadGlossary = useCallback(async () => {
    setGlossaryLoading(true);
    setGlossaryError("");

    try {
      const data = await getStudyGlossary(studyId);
      setGlossary(data);

      if (!Array.isArray(data?.terms) || !data.terms.length) {
        setGlossaryError("No glossary terms were returned for this Study.");
      }
    } catch (err) {
      if (err.status === 404) {
        setGlossary(null);
        setGlossaryError("Glossary terms are not available yet.");
      } else if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not load glossary terms", err);
        setGlossaryError(
          getUserFacingError(err, "Could not load glossary terms. Please try again.")
        );
      }
    } finally {
      setGlossaryLoading(false);
    }
  }, [studyId]);

  const loadPracticeQuestions = useCallback(async () => {
    setPracticeLoading(true);
    setPracticeError("");

    try {
      try {
        const setsData = await listPracticeQuestionSets(studyId);
        const nextSets = normalizeList(setsData);
        const readySets = getReadySets(nextSets);
        const selectedReadySet = readySets.find(
          (set) => set.id === selectedPracticeSetId
        );
        const nextSelectedSet =
          selectedReadySet ||
          (!selectedPracticeSetId ? readySets[readySets.length - 1] : null);

        setPracticeQuestionSets(nextSets);

        if (nextSelectedSet?.id) {
          const setQuestions = await getPracticeQuestionSetQuestions(
            studyId,
            nextSelectedSet.id
          );
          const nextQuestions = normalizeList(setQuestions);
          setSelectedPracticeSetId(nextSelectedSet.id);
          setPracticeQuestions(nextQuestions);

          if (!nextQuestions.length) {
            setPracticeError("No practice questions were returned for this set.");
          }

          return;
        }
      } catch (setErr) {
        if (isAuthError(setErr)) throw setErr;
      }

      const data = await getPracticeQuestions(studyId);
      const nextQuestions = normalizeList(data);
      setPracticeQuestions(nextQuestions);

      if (!nextQuestions.length) {
        setPracticeError("No practice questions were returned for this Study.");
      }
    } catch (err) {
      if (err.status === 404) {
        setPracticeQuestions([]);
        setPracticeError("Practice questions are not available yet.");
      } else if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not load practice questions", err);
        setPracticeError(
          getUserFacingError(err, "Could not load practice questions. Please try again.")
        );
      }
    } finally {
      setPracticeLoading(false);
    }
  }, [selectedPracticeSetId, studyId]);

  const loadExamQuestions = useCallback(async () => {
    setExamLoading(true);
    setExamError("");

    try {
      try {
        const setsData = await listExamQuestionSets(studyId);
        const nextSets = normalizeList(setsData);
        const readySets = getReadySets(nextSets);
        const selectedReadySet = readySets.find((set) => set.id === selectedExamSetId);
        const nextSelectedSet =
          selectedReadySet ||
          (!selectedExamSetId ? readySets[readySets.length - 1] : null);

        setExamQuestionSets(nextSets);

        if (nextSelectedSet?.id) {
          const setQuestions = await getExamQuestionSetQuestions(
            studyId,
            nextSelectedSet.id
          );
          const nextQuestions = normalizeList(setQuestions);
          setSelectedExamSetId(nextSelectedSet.id);
          setExamQuestions(nextQuestions);

          if (!nextQuestions.length) {
            setExamError("No exam questions were returned for this set.");
          }

          return;
        }
      } catch (setErr) {
        if (isAuthError(setErr)) throw setErr;
      }

      const data = await getExamQuestions(studyId);
      const nextQuestions = normalizeList(data);
      setExamQuestions(nextQuestions);

      if (!nextQuestions.length) {
        setExamError("No exam questions were returned for this Study.");
      }
    } catch (err) {
      if (err.status === 404) {
        setExamQuestions([]);
        setExamError("Exam questions are not available yet.");
      } else if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not load exam questions", err);
        setExamError(
          getUserFacingError(err, "Could not load exam questions. Please try again.")
        );
      }
    } finally {
      setExamLoading(false);
    }
  }, [selectedExamSetId, studyId]);

  const loadStudy = useCallback(
    async ({ showLoading = false } = {}) => {
      if (showLoading) setLoading(true);
      setError("");
      setAuthRequired(false);

      if (!hasAccessToken()) {
        setStudy(null);
        setMaterial(null);
        setGlossary(null);
        setPracticeQuestionSets([]);
        setPracticeQuestions([]);
        setExamQuestionSets([]);
        setExamQuestions([]);
        setAuthRequired(true);
        setLoading(false);
        return;
      }

      try {
        const nextStudy = await getStudy(studyId);
        setStudy(nextStudy);

        if (materialReadyStatuses.has(nextStudy.status)) {
          try {
            const nextMaterial = await getStudyMaterial(studyId);
            setMaterial(nextMaterial);
          } catch (err) {
            if (err.status !== 404) throw err;
            setMaterial(null);
          }
        } else {
          setMaterial(null);
        }

        if (glossaryReadyStatuses.has(nextStudy.status)) {
          await loadGlossary();
        } else {
          setGlossary(null);
        }

        if (practiceReadyStatuses.has(nextStudy.status)) {
          await loadPracticeQuestions();
        } else {
          setPracticeQuestionSets([]);
          setPracticeQuestions([]);
        }

        if (nextStudy.status === "exam_ready") {
          await loadExamQuestions();
        } else {
          setExamQuestionSets([]);
          setExamQuestions([]);
        }
      } catch (err) {
        if (isAuthError(err)) {
          setStudy(null);
          setMaterial(null);
          setGlossary(null);
          setPracticeQuestionSets([]);
          setPracticeQuestions([]);
          setExamQuestionSets([]);
          setExamQuestions([]);
          setAuthRequired(true);
        } else if (err.status === 404) {
          setError("This Study was not found.");
        } else {
          console.error("Could not load Study workspace", err);
          setError(getUserFacingError(err, "Could not load this Study. Please try again."));
        }
      } finally {
        setLoading(false);
      }
    },
    [loadExamQuestions, loadGlossary, loadPracticeQuestions, studyId]
  );

  useEffect(() => {
    loadStudy({ showLoading: true });
  }, [loadStudy]);

  useEffect(() => {
    if (!shouldPoll) return undefined;

    const interval = window.setInterval(() => {
      loadStudy();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [loadStudy, shouldPoll]);

  useEffect(() => {
    if (!shouldPollQuestionSets) return undefined;

    const interval = window.setInterval(() => {
      if (practiceQuestionSets.length) loadPracticeQuestions();
      if (examQuestionSets.length) loadExamQuestions();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [
    examQuestionSets.length,
    loadExamQuestions,
    loadPracticeQuestions,
    practiceQuestionSets.length,
    shouldPollQuestionSets,
  ]);

  useEffect(() => {
    if (
      !examStarted ||
      !selectedExamTimer ||
      examTimedOut ||
      examAttemptResult ||
      examSubmitLoading
    ) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setExamSecondsRemaining((current) => {
        if (current <= 1) {
          setExamTimedOut(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [
    examAttemptResult,
    examStarted,
    examSubmitLoading,
    examTimedOut,
    selectedExamTimer,
  ]);

  const handleResume = async () => {
    setResumeLoading(true);
    setError("");
    setGlossaryError("");
    setPracticeError("");
    setExamError("");
    setAuthRequired(false);

    try {
      const nextStudy = await resumeStudyGeneration(studyId);
      setStudy(nextStudy);
      setMaterial(null);
      setGlossary(null);
      setPracticeQuestionSets([]);
      setPracticeQuestions([]);
      setExamQuestionSets([]);
      setExamQuestions([]);
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not resume Study generation", err);
        setError(getUserFacingError(err, "Could not resume generation. Please try again."));
      }
    } finally {
      setResumeLoading(false);
    }
  };

  const handleRegenerateGlossary = async () => {
    setGlossaryRegenerating(true);
    setError("");
    setGlossaryError("");
    setAuthRequired(false);

    try {
      const nextStudy = await regenerateStudyGlossary(studyId);
      setStudy(nextStudy);
      setGlossary(null);

      if (glossaryReadyStatuses.has(nextStudy?.status)) {
        await loadGlossary();
      }
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not regenerate glossary terms", err);
        setGlossaryError(
          getUserFacingError(
            err,
            "Could not regenerate glossary terms. Please try again."
          )
        );
      }
    } finally {
      setGlossaryRegenerating(false);
    }
  };

  const resetPracticeAttemptState = () => {
    setActivePracticeIndex(0);
    setPracticeAnswers({});
    setPracticeSubmitError("");
    setPracticeAttemptResult(null);
  };

  const resetExamAttemptState = () => {
    setActiveExamIndex(0);
    setExamAnswers({});
    setExamStarted(false);
    setSelectedExamTimer(0);
    setExamSecondsRemaining(0);
    setExamTimedOut(false);
    setExamSubmitError("");
    setExamAttemptResult(null);
  };

  const handleBackToPracticeSets = () => {
    resetPracticeAttemptState();
    setActivePracticeView("sets");
  };

  const handleBackToExamSets = () => {
    resetExamAttemptState();
    setActiveExamView("sets");
  };

  const handleSelectPracticeSet = (questionSetId) => {
    resetPracticeAttemptState();
    setSelectedPracticeSetId(questionSetId);

    if (questionSetId === latestSetId) {
      setActivePracticeView("session");
      return;
    }

    setPracticeLoading(true);
    setPracticeError("");

    getPracticeQuestionSetQuestions(studyId, questionSetId)
      .then((data) => {
        const nextQuestions = normalizeList(data);
        setPracticeQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setPracticeError("No practice questions were returned for this set.");
        }

        setActivePracticeView("session");
      })
      .catch((err) => {
        if (isAuthError(err)) {
          setAuthRequired(true);
        } else {
          console.error("Could not load practice set", err);
          setPracticeError(
            getUserFacingError(err, "Could not load this practice set. Please try again.")
          );
        }
      })
      .finally(() => setPracticeLoading(false));
  };

  const handleSelectExamSet = (questionSetId) => {
    resetExamAttemptState();
    setSelectedExamSetId(questionSetId);

    if (questionSetId === latestSetId) {
      setActiveExamView("session");
      return;
    }

    setExamLoading(true);
    setExamError("");

    getExamQuestionSetQuestions(studyId, questionSetId)
      .then((data) => {
        const nextQuestions = normalizeList(data);
        setExamQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setExamError("No exam questions were returned for this set.");
        }

        setActiveExamView("session");
      })
      .catch((err) => {
        if (isAuthError(err)) {
          setAuthRequired(true);
        } else {
          console.error("Could not load exam set", err);
          setExamError(
            getUserFacingError(err, "Could not load this exam set. Please try again.")
          );
        }
      })
      .finally(() => setExamLoading(false));
  };

  const handleGeneratePracticeSet = async () => {
    const nextTitle =
      practiceSetTitle.trim() || `Practice Set ${practiceQuestionSets.length + 1}`;
    const nextCount = clampQuestionCount(
      practiceSetCount || study?.practice_question_count || 10
    );

    setPracticeSetGenerating(true);
    setPracticeError("");
    setAuthRequired(false);

    try {
      const createdSet = await generatePracticeQuestionSet(studyId, {
        title: nextTitle,
        questionCount: nextCount,
      });
      setPracticeSetTitle("");
      setPracticeSetCount("");
      setSelectedPracticeSetId(createdSet?.id || "");
      resetPracticeAttemptState();

      if (createdSet?.id) {
        setPracticeQuestionSets((current) => {
          const withoutCreated = current.filter((set) => set.id !== createdSet.id);
          return [...withoutCreated, createdSet];
        });
        const setQuestions = await getPracticeQuestionSetQuestions(studyId, createdSet.id);
        const nextQuestions = normalizeList(setQuestions);
        setPracticeQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setPracticeError("No practice questions were returned for this set.");
        }

        setActivePracticeView("session");
      } else {
        await loadPracticeQuestions();
        setActivePracticeView("session");
      }
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not generate practice set", err);
        setPracticeError(
          getUserFacingError(err, "Could not generate a practice set. Please try again.")
        );
      }
    } finally {
      setPracticeSetGenerating(false);
    }
  };

  const handleGenerateExamSet = async () => {
    const nextTitle = examSetTitle.trim() || `Exam Set ${examQuestionSets.length + 1}`;
    const nextCount = clampQuestionCount(examSetCount || study?.exam_question_count || 12);

    setExamSetGenerating(true);
    setExamError("");
    setAuthRequired(false);

    try {
      const createdSet = await generateExamQuestionSet(studyId, {
        title: nextTitle,
        questionCount: nextCount,
      });
      setExamSetTitle("");
      setExamSetCount("");
      setSelectedExamSetId(createdSet?.id || "");
      resetExamAttemptState();

      if (createdSet?.id) {
        setExamQuestionSets((current) => {
          const withoutCreated = current.filter((set) => set.id !== createdSet.id);
          return [...withoutCreated, createdSet];
        });
        const setQuestions = await getExamQuestionSetQuestions(studyId, createdSet.id);
        const nextQuestions = normalizeList(setQuestions);
        setExamQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setExamError("No exam questions were returned for this set.");
        }

        setActiveExamView("session");
      } else {
        await loadExamQuestions();
        setActiveExamView("session");
      }
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not generate exam set", err);
        setExamError(
          getUserFacingError(err, "Could not generate an exam set. Please try again.")
        );
      }
    } finally {
      setExamSetGenerating(false);
    }
  };

  const handlePracticeAnswer = (questionId, answer) => {
    setPracticeSubmitError("");
    setPracticeAnswers((current) => {
      if (current[questionId]) return current;
      return {
        ...current,
        [questionId]: answer,
      };
    });
  };

  const handlePracticeSubmit = async () => {
    const answers = practiceQuestions
      .map((question) => ({
        question_id: question.id,
        answer: practiceAnswers[question.id],
      }))
      .filter((item) => item.question_id && item.answer);

    if (answers.length !== practiceQuestions.length) return;

    setPracticeSubmitLoading(true);
    setPracticeSubmitError("");

    try {
      const result = await submitPracticeAttempt(studyId, answers);
      setPracticeAttemptResult(result);
      await loadStudy();
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not submit practice attempt", err);
        setPracticeSubmitError(
          getUserFacingError(
            err,
            "Could not submit this practice attempt. Please try again."
          )
        );
      }
    } finally {
      setPracticeSubmitLoading(false);
    }
  };

  const handlePracticeReset = () => {
    resetPracticeAttemptState();
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setExamSubmitError("");
    setExamTimedOut(false);
    setExamSecondsRemaining(selectedExamTimer * 60);
  };

  const handleAddExamTime = (minutes) => {
    setExamSecondsRemaining((current) => current + minutes * 60);
    setExamTimedOut(false);
    setExamSubmitError("");
  };

  const handleExamAnswer = (questionId, answer) => {
    setExamSubmitError("");
    setExamAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  };

  const handleExamSubmit = async () => {
    const answers = examQuestions
      .map((question) => ({
        question_id: question.id,
        answer: examAnswers[question.id],
      }))
      .filter((item) => item.question_id && item.answer);

    if (!answers.length) return;

    setExamSubmitLoading(true);
    setExamSubmitError("");

    try {
      const result = await submitExamAttempt(studyId, answers);
      setExamAttemptResult(result);
      setExamTimedOut(false);
      await loadStudy();
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not submit exam attempt", err);
        setExamSubmitError(
          getUserFacingError(err, "Could not submit this exam attempt. Please try again.")
        );
      }
    } finally {
      setExamSubmitLoading(false);
    }
  };

  const handleExamReset = () => {
    resetExamAttemptState();
  };

  if (authRequired) {
    return (
      <AuthRequiredState
        title="Log in to view this Study"
        message="This workspace belongs to your account. Log in to open the material, practice, exam mode, and progress."
        returnTo={`/studies/${studyId}`}
        secondaryHref="/studies"
        secondaryLabel="Back to Studies"
      />
    );
  }

  if (loading) return <LoadingState />;
  if (error && !study) return <ErrorState message={error} onRetry={() => loadStudy({ showLoading: true })} />;

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            study={study}
            material={material}
            progress={progress}
            onTabChange={setActiveTab}
          />
        );
      case "material":
        return <MaterialTab material={material} />;
      case "glossary":
        return (
          <GlossaryTab
            study={study}
            glossary={glossary}
            loading={glossaryLoading}
            error={glossaryError}
            onRetry={() => loadStudy()}
            onResume={handleResume}
            resumeLoading={resumeLoading}
            onRegenerate={handleRegenerateGlossary}
            regenerateLoading={glossaryRegenerating}
          />
        );
      case "practice":
        return (
          <PracticeTab
            study={study}
            questions={practiceQuestions}
            questionSets={practiceQuestionSets}
            selectedSetId={selectedPracticeSetId}
            activeView={activePracticeView}
            setTitle={practiceSetTitle}
            setCount={practiceSetCount}
            setGenerating={practiceSetGenerating}
            loading={practiceLoading}
            error={practiceError}
            activeIndex={activePracticeIndex}
            answers={practiceAnswers}
            submitError={practiceSubmitError}
            submitLoading={practiceSubmitLoading}
            attemptResult={practiceAttemptResult}
            resumeLoading={resumeLoading}
            onRetry={() => loadStudy()}
            onResume={handleResume}
            onSelectSet={handleSelectPracticeSet}
            onBackToSets={handleBackToPracticeSets}
            onSetTitleChange={setPracticeSetTitle}
            onSetCountChange={setPracticeSetCount}
            onGenerateSet={handleGeneratePracticeSet}
            onAnswer={handlePracticeAnswer}
            onActiveIndexChange={setActivePracticeIndex}
            onSubmit={handlePracticeSubmit}
            onReset={handlePracticeReset}
          />
        );
      case "exam":
        return (
          <ExamTab
            study={study}
            questions={examQuestions}
            questionSets={examQuestionSets}
            selectedSetId={selectedExamSetId}
            activeView={activeExamView}
            setTitle={examSetTitle}
            setCount={examSetCount}
            setGenerating={examSetGenerating}
            loading={examLoading}
            error={examError}
            activeIndex={activeExamIndex}
            answers={examAnswers}
            started={examStarted}
            selectedTimer={selectedExamTimer}
            secondsRemaining={examSecondsRemaining}
            timedOut={examTimedOut}
            submitError={examSubmitError}
            submitLoading={examSubmitLoading}
            attemptResult={examAttemptResult}
            resumeLoading={resumeLoading}
            onRetry={() => loadStudy()}
            onResume={handleResume}
            onSelectSet={handleSelectExamSet}
            onBackToSets={handleBackToExamSets}
            onSetTitleChange={setExamSetTitle}
            onSetCountChange={setExamSetCount}
            onGenerateSet={handleGenerateExamSet}
            onTimerChange={setSelectedExamTimer}
            onStart={handleStartExam}
            onAddTime={handleAddExamTime}
            onAnswer={handleExamAnswer}
            onActiveIndexChange={setActiveExamIndex}
            onSubmit={handleExamSubmit}
            onReset={handleExamReset}
          />
        );
      case "analytics":
        return <AnalyticsTab study={study} progress={progress} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-off-white-100 dark:bg-dark-bg">
      <WorkspaceHeader study={study} progress={progress} />
      <div className="sticky top-0 z-20 border-b border-grey-25 bg-white px-4 sm:px-6 lg:px-8 dark:border-dark-border dark:bg-dark-surface">
        <div className="mx-auto max-w-[1180px]">
          <Tabs
            tabs={workspaceTabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="scrollbar-hide overflow-x-auto border-b-0 [&_button]:shrink-0"
          />
        </div>
      </div>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          {error ? (
            <div className="mb-5 flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="text-h5 leading-6 inter-font">{error}</p>
            </div>
          ) : null}
          <GenerationNotice
            study={study}
            polling={shouldPoll}
            onResume={handleResume}
            resumeLoading={resumeLoading}
          />
          {renderTab()}
        </div>
      </section>
    </main>
  );
}
