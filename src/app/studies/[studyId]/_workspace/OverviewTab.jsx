import { BarChart3, BookOpen, ClipboardCheck, FileText, Target } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { getTitle } from "./helpers";
import { Metric } from "./WorkspaceShell";

export function OverviewTab({ study, material, progress, onTabChange }) {
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
