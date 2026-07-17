import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui";

export function LessonPracticeSummary({ summary, moduleCompleted }) {
  return (
    <div className="rounded-md border border-success/30 bg-success-light p-4 text-success dark:bg-success/15 dark:text-green-300">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="text-h4 font-semibold poppins-font">Lesson completed</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {typeof summary?.score === "number" ? (
          <Badge variant="success">Score {Math.round(summary.score)}%</Badge>
        ) : null}
        {summary?.scoreLabel ? <Badge variant="neutral">{summary.scoreLabel}</Badge> : null}
        {moduleCompleted ? <Badge variant="success">Module complete</Badge> : null}
      </div>
    </div>
  );
}
