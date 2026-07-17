import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, FileText } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { getLessonProgress, getLessonProgressLabel, getModuleProgress } from "./helpers";
import { LessonPracticeModal } from "./practice/LessonPracticeModal";

export function LessonReader({
  item,
  curriculumItems,
  lessonPracticeState,
  onSelectItem,
  onCompleteLesson,
  onSelectLessonPracticeAnswer,
  onSubmitLessonPracticeAnswer,
  onAdvanceLessonPracticeQuestion,
}) {
  const currentIndex = curriculumItems.findIndex((curriculumItem) => curriculumItem.id === item?.id);
  const previous = currentIndex > 0 ? curriculumItems[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < curriculumItems.length - 1
    ? curriculumItems[currentIndex + 1]
    : null;
  const { module, lesson, lessonIndex } = item || {};
  const lessonProgress = getLessonProgress(lesson);
  const lessonState = getLessonProgressLabel(lessonProgress);
  const moduleProgress = getModuleProgress(module);
  const practiceState = lesson?.id ? lessonPracticeState?.[lesson.id] || {} : {};
  const hasQuestions = Boolean(practiceState.questions?.length);
  const canContinue = Boolean(lessonProgress.completed || practiceState.completed);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [lastSessionId, setLastSessionId] = useState("");

  useEffect(() => {
    if (practiceState.sessionId && practiceState.sessionId !== lastSessionId) {
      setPracticeModalOpen(true);
      setLastSessionId(practiceState.sessionId);
    }
  }, [lastSessionId, practiceState.sessionId]);

  if (!lesson) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <FileText className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">Choose a lesson</h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">Select a ready lesson from the course content panel.</p>
      </Card>
    );
  }

  return (
    <article className="mx-auto max-w-[900px]">
      <Card variant="default" className="p-5 sm:p-7">
        <div className="mb-6 flex flex-col gap-3 border-b border-grey-25 pb-5 dark:border-dark-border sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="accent">Module {module.module_number || "-"}</Badge>
              <Badge variant="neutral">Lesson {lesson.lesson_number || lessonIndex + 1}</Badge>
              <Badge variant="neutral"><Clock size={13} aria-hidden="true" />{lesson.estimated_minutes || 7} min</Badge>
              <Badge variant={lessonState.variant}>{lessonState.label}</Badge>
            </div>
            <h1 className="text-xl-head font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">{lesson.title || "Untitled lesson"}</h1>
            <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">{module.objective || "Work through this lesson, then continue to the next item."}</p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none text-grey-200 prose-p:leading-7 prose-a:text-primary dark:prose-invert dark:text-dark-text">
          <ReactMarkdown>{lesson.content || ""}</ReactMarkdown>
        </div>

        {Array.isArray(lesson.key_takeaways) && lesson.key_takeaways.length ? (
          <div className="mt-6 rounded-md border border-grey-25 bg-off-white-100 p-4 dark:border-dark-border dark:bg-dark-surface-soft">
            <h2 className="text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">Key takeaways</h2>
            <ul className="mt-3 grid gap-2">
              {lesson.key_takeaways.map((takeaway) => (
                <li key={takeaway} className="flex gap-2 text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary dark:text-primary-25" aria-hidden="true" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {lessonProgress.status === "not_started" && !hasQuestions ? (
          <div className="mt-6 rounded-md border border-primary/25 bg-accent-25 p-4 dark:border-primary-25/30 dark:bg-dark-surface-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-h5 font-semibold text-grey-200 inter-font dark:text-dark-text">Ready to check this lesson?</p>
                <p className="mt-1 text-h6 leading-5 text-p-text-darker inter-font dark:text-dark-muted">Complete the lesson to unlock its practice questions.</p>
              </div>
              <Button variant="primary" size="md" loading={practiceState.completing} onClick={() => onCompleteLesson(lesson.id)} className="shrink-0">
                <CheckCircle2 size={16} aria-hidden="true" />Complete lesson
              </Button>
            </div>
            {practiceState.error ? <p className="mt-3 rounded-sm border border-error/30 bg-error-light px-3 py-2 text-h6 leading-5 text-error inter-font dark:bg-error/15 dark:text-red-300">{practiceState.error}</p> : null}
          </div>
        ) : null}

        {lessonProgress.status === "practice_pending" || hasQuestions ? (
          <div className="mt-6 rounded-md border border-primary/25 bg-white p-4 dark:border-primary-25/30 dark:bg-dark-surface-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-h5 font-semibold text-grey-200 inter-font dark:text-dark-text">Lesson practice is ready</p>
                <p className="mt-1 text-h6 leading-5 text-p-text-darker inter-font dark:text-dark-muted">
                  Answer every assigned question to complete this lesson.
                </p>
              </div>
              <Button
                variant={canContinue ? "ghost" : "primary"}
                size="md"
                onClick={() => {
                  if (hasQuestions) setPracticeModalOpen(true);
                  else onCompleteLesson(lesson.id);
                }}
                className="shrink-0"
              >
                {canContinue ? "Review results" : "Complete lesson"}
              </Button>
            </div>
          </div>
        ) : null}

        {lessonProgress.completed && !hasQuestions ? (
          <div className="mt-6 rounded-md border border-success/30 bg-success-light p-4 text-success dark:bg-success/15 dark:text-green-300">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /><p className="text-h5 font-semibold inter-font">Lesson completed</p></div>
            {typeof lessonProgress.practice_score === "number" ? <p className="mt-2 text-h6 inter-font">Score {Math.round(lessonProgress.practice_score)}%{lessonProgress.practice_score_label ? ` - ${lessonProgress.practice_score_label}` : ""}</p> : null}
          </div>
        ) : null}

        {moduleProgress.completed && canContinue ? (
          <div className="mt-4 rounded-md border border-success/30 bg-white p-4 dark:border-success/30 dark:bg-dark-surface-soft">
            <div className="flex items-center gap-2 text-success dark:text-green-300"><CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /><p className="text-h5 font-semibold inter-font">Module complete</p></div>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 border-t border-grey-25 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border">
          <Button variant="ghost" size="md" disabled={!previous} onClick={() => previous && onSelectItem(previous)}><ChevronLeft size={16} aria-hidden="true" />Previous lesson</Button>
          {canContinue ? (
            <Button variant="primary" size="md" disabled={!next} onClick={() => next && onSelectItem(next)}>
              {next?.type === "revision-checkpoint" ? "Start revision" : "Next lesson"}
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          ) : (
            <Badge variant={lessonProgress.status === "practice_pending" ? "accent" : "neutral"}>{lessonProgress.status === "practice_pending" ? "Practice pending" : "Complete lesson to continue"}</Badge>
          )}
        </div>
      </Card>

      <LessonPracticeModal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        module={module}
        lesson={lesson}
        lessonState={lessonState}
        practiceState={practiceState}
        moduleCompleted={moduleProgress.completed}
        nextItem={next}
        onSelectAnswer={(answer) => onSelectLessonPracticeAnswer(lesson.id, answer)}
        onSubmit={() => onSubmitLessonPracticeAnswer(lesson.id)}
        onAdvanceQuestion={() => onAdvanceLessonPracticeQuestion(lesson.id)}
        onNextItem={() => { setPracticeModalOpen(false); if (next) onSelectItem(next); }}
      />
    </article>
  );
}
