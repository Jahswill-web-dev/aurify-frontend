import { BarChart3, BookOpen, ClipboardCheck, FileText } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { Metric } from "./WorkspaceShell";

export function AnalyticsTab({ study, progress }) {
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
