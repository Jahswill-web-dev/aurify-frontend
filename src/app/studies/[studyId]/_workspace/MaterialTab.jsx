import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

export function createHeadingSlug(text, counts) {
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

export function MaterialOutline({ items, activeHeadingId, onItemClick, mobile = false }) {
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

const getSortedModules = (modules) =>
  Array.isArray(modules)
    ? [...modules].sort(
        (first, second) =>
          Number(first?.module_number || 0) - Number(second?.module_number || 0)
      )
    : [];

function ModulePracticeQuestions({ questions }) {
  if (!Array.isArray(questions) || !questions.length) return null;

  return (
    <div className="mt-5 rounded-md border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-surface-soft">
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
        <h4 className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
          Module practice
        </h4>
      </div>
      <div className="grid gap-3">
        {questions.map((question, index) => (
          <div
            key={question.id || `${question.question}-${index}`}
            className="rounded-md border border-grey-25 bg-white p-4 dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="neutral">Question {index + 1}</Badge>
              {question.difficulty ? (
                <Badge variant="accent">{question.difficulty}</Badge>
              ) : null}
              {question.weak_area ? (
                <Badge variant="neutral">{question.weak_area}</Badge>
              ) : null}
            </div>
            <p className="text-h5 font-semibold leading-7 text-grey-200 inter-font dark:text-dark-text">
              {question.question}
            </p>
            {Array.isArray(question.options) && question.options.length ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const isCorrect = option === question.correct_answer;

                  return (
                    <div
                      key={option}
                      className={[
                        "rounded-sm border px-3 py-2 text-h6 inter-font",
                        isCorrect
                          ? "border-success bg-success-light text-success dark:bg-success/15 dark:text-green-300"
                          : "border-grey-25 bg-white text-p-text-darker dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted",
                      ].join(" ")}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            ) : null}
            {question.explanation ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                {question.explanation}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadyModuleCard({ module }) {
  const lessons = Array.isArray(module.lessons) ? module.lessons : [];

  return (
    <Card
      id={`module-${module.module_number || module.id}`}
      variant="default"
      className="scroll-mt-32 p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
            Module {module.module_number || "-"}
          </p>
          <h2 className="mt-1 break-words text-h2 font-bold text-grey-200 poppins-font dark:text-dark-text">
            {module.title || "Untitled module"}
          </h2>
          {module.objective ? (
            <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
              {module.objective}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Badge variant="primary">Ready</Badge>
          {module.estimated_minutes ? (
            <Badge variant="neutral">
              <Clock size={13} aria-hidden="true" />
              {module.estimated_minutes} min
            </Badge>
          ) : null}
        </div>
      </div>

      {Array.isArray(module.key_concepts) && module.key_concepts.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {module.key_concepts.map((concept) => (
            <Badge key={concept} variant="neutral">
              {concept}
            </Badge>
          ))}
        </div>
      ) : null}

      {module.coverage_notes ? (
        <p className="mt-4 rounded-md border border-grey-25 bg-off-white-100 px-4 py-3 text-h5 leading-7 text-p-text-darker inter-font dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted">
          {module.coverage_notes}
        </p>
      ) : null}

      {lessons.length ? (
        <div className="mt-6 grid gap-5">
          {lessons.map((lesson, index) => (
            <section
              key={lesson.id || `${module.id}-lesson-${index}`}
              className="border-t border-grey-25 pt-5 first:border-t-0 first:pt-0 dark:border-dark-border"
            >
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-h6 font-semibold uppercase text-grey-100 poppins-font dark:text-dark-muted">
                    Lesson {lesson.lesson_number || index + 1}
                  </p>
                  <h3 className="mt-1 text-h3 font-semibold leading-7 text-grey-200 poppins-font dark:text-dark-text">
                    {lesson.title || "Untitled lesson"}
                  </h3>
                </div>
                {lesson.estimated_minutes ? (
                  <Badge variant="neutral">{lesson.estimated_minutes} min</Badge>
                ) : null}
              </div>
              <div className="prose prose-neutral max-w-none text-grey-200 prose-p:leading-7 prose-a:text-primary dark:prose-invert dark:text-dark-text">
                <ReactMarkdown>{lesson.content || ""}</ReactMarkdown>
              </div>
              {Array.isArray(lesson.key_takeaways) && lesson.key_takeaways.length ? (
                <div className="mt-4 rounded-md border border-grey-25 bg-white p-4 dark:border-dark-border dark:bg-dark-surface-soft">
                  <h4 className="text-h5 font-semibold text-grey-200 inter-font dark:text-dark-text">
                    Key takeaways
                  </h4>
                  <ul className="mt-2 grid gap-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                    {lesson.key_takeaways.map((takeaway) => (
                      <li key={takeaway} className="flex gap-2">
                        <CheckCircle2
                          className="mt-1 h-4 w-4 shrink-0 text-primary dark:text-primary-25"
                          aria-hidden="true"
                        />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
          This module is marked ready, but no lessons were returned.
        </p>
      )}

      <ModulePracticeQuestions questions={module.practice_questions} />
    </Card>
  );
}

function FailedModulesNotice({ modules, study, onResume, resumeLoading }) {
  if (!modules.length && study?.status !== "modules_failed") return null;

  const title =
    study?.status === "modules_failed"
      ? "Module generation failed"
      : "Some modules need to be regenerated";

  return (
    <Card variant="default" className="border-error bg-error-light p-5 dark:bg-error/15">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
          <div>
            <h2 className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
              {title}
            </h2>
            <p className="mt-1 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
              {study?.generation_error ||
                "Aurify saved the ready modules and can resume generation for the unfinished ones."}
            </p>
          </div>
        </div>
        {onResume ? (
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
        ) : null}
      </div>

      {modules.length ? (
        <div className="mt-4 grid gap-2">
          {modules.map((module) => (
            <div
              key={module.id || module.module_number}
              className="rounded-md border border-error/30 bg-white px-4 py-3 text-h5 text-p-text-darker inter-font dark:bg-dark-surface"
            >
              <span className="font-semibold text-grey-200 dark:text-dark-text">
                Module {module.module_number || "-"}:{" "}
                {module.title || "Untitled module"}
              </span>
              <span> - {module.generation_error || "Generation did not finish."}</span>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function ModuleMaterial({ material, study, onResume, resumeLoading }) {
  const modules = getSortedModules(material?.modules);
  const readyModules = modules.filter((module) => module.status === "ready");
  const failedModules = modules.filter((module) => module.status === "failed");

  return (
    <div className="mx-auto grid max-w-[1180px] gap-5">
      <Card variant="default" className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font dark:text-primary-25">
              Generated modules
            </p>
            <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font dark:text-dark-text">
              {material.title || "Study Material"}
            </h2>
            {material.source_notes ? (
              <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                {material.source_notes}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Badge variant="primary">{readyModules.length} ready</Badge>
            {failedModules.length ? (
              <Badge variant="error">{failedModules.length} failed</Badge>
            ) : null}
          </div>
        </div>

        {readyModules.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {readyModules.map((module) => (
              <a
                key={module.id || module.module_number}
                href={`#module-${module.module_number || module.id}`}
                className="inline-flex items-center gap-2 rounded-sm border border-grey-25 bg-off-white-100 px-3 py-2 text-h6 font-medium text-p-text-darker transition-colors hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-muted dark:hover:border-primary-25 dark:hover:text-primary-25"
              >
                <BookOpen size={14} aria-hidden="true" />
                Module {module.module_number || "-"}
              </a>
            ))}
          </div>
        ) : null}
      </Card>

      <FailedModulesNotice
        modules={failedModules}
        study={study}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />

      {readyModules.length ? (
        <div className="grid gap-5">
          {readyModules.map((module) => (
            <ReadyModuleCard key={module.id || module.module_number} module={module} />
          ))}
        </div>
      ) : (
        <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
          <FileText className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
          <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font dark:text-dark-text">
            No ready modules yet
          </h2>
          <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
            Aurify has module records for this Study, but none are ready to read yet.
          </p>
          {onResume && (study?.status === "modules_failed" || failedModules.length) ? (
            <Button
              variant="primary"
              size="md"
              loading={resumeLoading}
              onClick={onResume}
              className="mt-5"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Resume
            </Button>
          ) : null}
        </Card>
      )}
    </div>
  );
}

export function MaterialTab({ material, study, onResume, resumeLoading }) {
  if (material?.modules?.length) {
    return (
      <ModuleMaterial
        material={material}
        study={study}
        onResume={onResume}
        resumeLoading={resumeLoading}
      />
    );
  }

  return <MarkdownMaterial material={material} />;
}

function MarkdownMaterial({ material }) {
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
