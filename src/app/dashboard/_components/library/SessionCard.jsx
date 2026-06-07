import { Badge, Button } from "@/components/ui";
import { formatRelativeTime, getSessionProgress } from "./formatRelativeTime";

const getScoreClassName = (score) => {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-primary";
  return "text-error";
};

export default function SessionCard({
  session,
  onResume,
  onDelete,
  isDeleting,
}) {
  const progress = getSessionProgress(session);

  return (
    <div className="p-5 rounded-md border-2 border-grey-25 bg-white hover:border-primary transition-all duration-175 dark:border-dark-border dark:bg-dark-surface dark:hover:border-primary-25">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-h4 font-semibold text-grey-200 poppins-font break-words">
              {session.topic || "Untitled session"}
            </p>
            <Badge variant="neutral">{session.level || "Beginner"}</Badge>
            <Badge variant="accent">{session.goal || "learn"}</Badge>
          </div>
          <p className="text-h6 text-p-text inter-font">
            {session.subject || "General"}
          </p>

          <div className="w-full h-1.5 bg-off-white-50 rounded-full overflow-hidden mt-3 mb-1 dark:bg-dark-surface-soft">
            <div
              className="h-full bg-primary rounded-full transition-all duration-350 dark:bg-dark-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-p-text inter-font">
            {Number(session.modulesCompleted) || 0} of{" "}
            {Number(session.modulesTotal) || 0} modules completed
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 md:items-end">
          <div className="flex items-center gap-4 md:justify-end">
            {session.practiceScore !== null &&
            session.practiceScore !== undefined ? (
              <div className="text-left md:text-right">
                <p className="text-xs text-p-text inter-font">Practice</p>
                <p
                  className={`text-h5 font-bold poppins-font ${getScoreClassName(
                    session.practiceScore
                  )}`}
                >
                  {session.practiceScore}%
                </p>
              </div>
            ) : null}
            {session.examScore !== null && session.examScore !== undefined ? (
              <div className="text-left md:text-right">
                <p className="text-xs text-p-text inter-font">Exam</p>
                <p
                  className={`text-h5 font-bold poppins-font ${getScoreClassName(
                    session.examScore
                  )}`}
                >
                  {session.examScore}%
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="!border-grey-25 text-grey-100 hover:text-error hover:!border-error dark:!border-dark-border dark:text-dark-muted"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button variant="primary" size="sm" onClick={onResume}>
              Resume
            </Button>
          </div>

          <p className="text-xs text-grey-100 inter-font">
            {formatRelativeTime(session.lastAccessedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
