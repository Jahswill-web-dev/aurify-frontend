import { ChevronRight } from "lucide-react";
import { Badge, Button, Modal } from "@/components/ui";
import { PracticeQuestion } from "./PracticeQuestion";
import { LessonPracticeSummary } from "./LessonPracticeSummary";

export function LessonPracticeModal({
  isOpen,
  onClose,
  module,
  lesson,
  lessonState,
  practiceState,
  moduleCompleted,
  nextItem,
  onSelectAnswer,
  onSubmit,
  onAdvanceQuestion,
  onNextItem,
}) {
  const questions = practiceState.questions || [];
  const activeIndex = practiceState.activeQuestionIndex || 0;
  const question = questions[activeIndex] || null;
  const completed = Boolean(practiceState.completed);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!practiceState.submitting) onClose();
      }}
      title="Lesson practice"
      className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-[860px] sm:p-6 lg:max-w-[920px]"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="accent">Module {module.module_number || "-"}</Badge>
        <Badge variant="neutral">Lesson {lesson.lesson_number || "-"}</Badge>
        <Badge variant={lessonState.variant}>{lessonState.label}</Badge>
        {questions.length ? (
          <Badge variant="neutral">Question {activeIndex + 1} of {questions.length}</Badge>
        ) : null}
      </div>

      {questions.length ? (
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-off-white-50 dark:bg-dark-surface-soft">
          <div
            className="h-full rounded-full bg-primary transition-all duration-350 dark:bg-dark-accent"
            style={{
              width: `${Math.min(
                ((practiceState.practiceProgress?.answered_count || 0) / questions.length) * 100,
                100
              )}%`,
            }}
          />
        </div>
      ) : null}

      {completed ? (
        <LessonPracticeSummary
          summary={practiceState.summary}
          moduleCompleted={moduleCompleted}
        />
      ) : (
        <PracticeQuestion
          question={question}
          selectedAnswer={practiceState.selectedAnswer || ""}
          feedback={practiceState.feedback}
          submitting={practiceState.submitting}
          error={practiceState.error}
          onSelectAnswer={onSelectAnswer}
          onSubmit={onSubmit}
        />
      )}

      {practiceState.feedback && !completed ? (
        <div className="mt-5 flex justify-end border-t border-grey-25 pt-4 dark:border-dark-border">
          <Button variant="primary" size="md" onClick={onAdvanceQuestion}>
            Next question
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      {completed ? (
        <div className="mt-5 flex justify-end border-t border-grey-25 pt-4 dark:border-dark-border">
          {nextItem ? (
            <Button variant="primary" size="md" onClick={onNextItem}>
              {nextItem.type === "revision-checkpoint" ? "Start revision" : "Next lesson"}
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={onClose}>Close</Button>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
