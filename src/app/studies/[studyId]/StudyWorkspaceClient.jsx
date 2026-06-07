"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  RefreshCw,
  Target,
} from "lucide-react";
import { Badge, Button, Card, Tabs } from "@/components/ui";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  getStudy,
  getStudyMaterial,
  resumeStudyGeneration,
} from "@/app/lib/aurifyApi";

const workspaceTabs = [
  { id: "overview", label: "Overview" },
  { id: "material", label: "Material" },
  { id: "practice", label: "Practice" },
  { id: "exam", label: "Exam Mode" },
  { id: "analytics", label: "Analytics" },
];

const pollingStatuses = new Set([
  "queued",
  "generating_research",
  "research_ready",
  "generating_outline",
  "outline_ready",
  "generating_material",
]);

const statusConfig = {
  queued: { label: "Queued", variant: "accent" },
  generating_research: { label: "Researching", variant: "accent" },
  research_ready: { label: "Research ready", variant: "accent" },
  generating_outline: { label: "Outlining", variant: "accent" },
  outline_ready: { label: "Outline ready", variant: "accent" },
  generating_material: { label: "Generating material", variant: "accent" },
  material_ready: { label: "Ready", variant: "primary" },
  failed: { label: "Failed", variant: "error" },
};

const clamp = (value) => Math.max(0, Math.min(100, value));

function getTitle(study) {
  return study?.title || study?.topic || "Untitled Study";
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
    <div className={["h-2 overflow-hidden rounded-full bg-off-white-50", className].join(" ")}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-350 ease-smooth"
        style={{ width: `${clamp(value)}%` }}
      />
    </div>
  );
}

function WorkspaceHeader({ study, progress }) {
  const status = statusConfig[study?.status] || statusConfig.queued;

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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center gap-2 rounded-sm border border-grey-25 bg-off-white-100 px-3 text-h6 font-medium text-p-text-darker transition-colors hover:border-primary hover:text-primary"
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
    <main className="min-h-screen bg-off-white-100 px-4 py-10">
      <Card variant="default" className="mx-auto max-w-[640px] p-8 text-center">
        <p className="text-h4 font-semibold text-grey-200 poppins-font">
          Loading Study...
        </p>
      </Card>
    </main>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-10">
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
            className="inline-flex items-center justify-center rounded-sm border border-primary px-4 py-2 text-h5 font-medium text-primary transition-colors hover:bg-accent-25"
          >
            Back to Studies
          </Link>
        </div>
      </Card>
    </main>
  );
}

function GenerationNotice({ study, polling, onResume, resumeLoading }) {
  if (study.status === "material_ready") return null;

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
                {study.generation_error || "The backend could not finish this Study."}
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

  return (
    <Card variant="accent" className="mb-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h4 font-semibold text-grey-200 poppins-font">
            Building your Study
          </h2>
          <p className="mt-1 text-h5 leading-7 text-p-text-darker inter-font">
            {polling
              ? "This page will update automatically as the backend finishes each generation step."
              : "Refresh to check whether the backend has finished generation."}
          </p>
        </div>
        <Badge variant="accent">
          {statusConfig[study.status]?.label || "Generating"}
        </Badge>
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
              className="mt-3 flex h-28 w-9 items-center justify-center rounded-l-md border border-r-0 border-grey-25 bg-white text-primary shadow-card transition-colors duration-175 ease-smooth hover:border-primary hover:bg-accent-25 focus:border-primary focus:bg-accent-25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group-hover:border-primary group-hover:bg-accent-25 group-focus-within:border-primary group-focus-within:bg-accent-25"
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
              <div className="rounded-md border border-grey-25 bg-white p-4 shadow-modal">
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

function EmptyQuestionTab({ mode }) {
  const isExam = mode === "exam";

  return (
    <Card variant="default" className="mx-auto max-w-[640px] p-6 text-center">
      {isExam ? (
        <ClipboardCheck className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      ) : (
        <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      )}
      <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
        {isExam ? "Exam mode is not ready yet" : "Practice is not ready yet"}
      </h2>
      <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
        {isExam
          ? "Exam questions are a backend child feature for this Study. This tab is ready for those responses when they are available."
          : "Practice questions are a backend child feature for this Study. This tab is ready for those responses when they are available."}
      </p>
    </Card>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  const progress = useMemo(() => getProgressValue(study?.progress), [study]);
  const shouldPoll = study ? pollingStatuses.has(study.status) : false;

  const loadStudy = useCallback(
    async ({ showLoading = false } = {}) => {
      if (showLoading) setLoading(true);
      setError("");

      try {
        const nextStudy = await getStudy(studyId);
        setStudy(nextStudy);

        if (nextStudy.status === "material_ready") {
          try {
            const nextMaterial = await getStudyMaterial(studyId);
            setMaterial(nextMaterial);
          } catch (err) {
            if (err.status !== 404) throw err;
            setMaterial(null);
          }
        }
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          setError("Please log in to view this Study.");
        } else if (err.status === 404) {
          setError("This Study was not found.");
        } else {
          setError(err.message || "Could not load this Study. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [studyId]
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

  const handleResume = async () => {
    setResumeLoading(true);
    setError("");

    try {
      const nextStudy = await resumeStudyGeneration(studyId);
      setStudy(nextStudy);
      setMaterial(null);
    } catch (err) {
      setError(err.message || "Could not resume generation. Please try again.");
    } finally {
      setResumeLoading(false);
    }
  };

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
      case "practice":
        return <EmptyQuestionTab mode="practice" />;
      case "exam":
        return <EmptyQuestionTab mode="exam" />;
      case "analytics":
        return <AnalyticsTab study={study} progress={progress} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-off-white-100">
      <WorkspaceHeader study={study} progress={progress} />
      <div className="sticky top-0 z-20 border-b border-grey-25 bg-white px-4 sm:px-6 lg:px-8">
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
