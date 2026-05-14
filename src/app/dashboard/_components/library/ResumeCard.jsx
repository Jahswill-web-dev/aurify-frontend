import { Badge } from "@/components/ui";
import { formatRelativeTime, getSessionProgress } from "./formatRelativeTime";

export default function ResumeCard({ session, onResume }) {
  const progress = getSessionProgress(session);

  return (
    <button
      type="button"
      className="shrink-0 w-64 p-4 rounded-md border-2 border-grey-25 bg-white text-left hover:border-primary hover:shadow-sm transition-all duration-175 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      onClick={onResume}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-h5 font-semibold text-grey-200 inter-font leading-tight truncate">
            {session.topic || "Untitled session"}
          </p>
          <p className="text-h6 text-p-text inter-font mt-0.5 truncate">
            {session.subject || "General"} - {session.level || "Beginner"}
          </p>
        </div>
        <Badge variant="neutral" className="shrink-0">
          {session.goal || "learn"}
        </Badge>
      </div>

      <div className="w-full h-1.5 bg-off-white-50 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary rounded-full transition-all duration-350"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-p-text inter-font">
        {Number(session.modulesCompleted) || 0} of{" "}
        {Number(session.modulesTotal) || 0} modules - {progress}%
      </p>

      <p className="text-xs text-grey-100 inter-font mt-3">
        Last opened {formatRelativeTime(session.lastAccessedAt)}
      </p>
    </button>
  );
}
