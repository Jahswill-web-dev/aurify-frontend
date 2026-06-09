import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, ClipboardCheck, Plus, Trophy } from "lucide-react";
import { Card } from "@/components/ui";

const getDisplayName = (user) => {
  const rawName =
    user?.name ||
    user?.username ||
    user?.full_name ||
    user?.fullName ||
    user?.user?.name ||
    user?.user?.username ||
    "";

  if (rawName) return rawName.split(" ")[0];

  const email = user?.email || user?.user?.email || "";
  if (email.includes("@")) return email.split("@")[0];

  return "there";
};

const getProgressValue = (progress) => {
  if (typeof progress === "number") return Math.max(0, Math.min(100, progress));
  if (!progress || typeof progress !== "object") return 0;

  const completed = [
    progress.material_completed,
    progress.practice_completed,
    progress.exam_completed,
  ].filter(Boolean).length;

  return Math.round((completed / 3) * 100);
};

const getLatestScore = (studies) => {
  const scores = studies
    .flatMap((study) => [
      study.progress?.latest_practice_score,
      study.progress?.latest_exam_score,
    ])
    .filter((score) => typeof score === "number");

  if (!scores.length) return null;
  return Math.round(scores[scores.length - 1]);
};

export const WelcomeSection = ({ onCreateStudy, user, studies = [], loading }) => {
  const displayName = getDisplayName(user);
  const totalStudies = studies.length;
  const completedStudies = studies.filter(
    (study) => getProgressValue(study.progress) === 100
  ).length;
  const readyStudies = studies.filter((study) =>
    ["practice_ready", "exam_ready", "completed", "ready"].includes(study.status)
  ).length;
  const latestScore = getLatestScore(studies);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0"
        >
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Dashboard
          </p>
          <h1 className="mt-2 break-words text-xl-head font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 max-w-[640px] text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
            {loading
              ? "Loading your study activity..."
              : totalStudies
                ? "Pick up where you left off and keep your learning moving."
                : "Create your first Study to start building material, practice sets, and exam prep."}
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateStudy}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-h5 font-semibold text-white shadow-btn-primary transition-colors hover:bg-primary-200 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25"
        >
          <Plus size={17} aria-hidden="true" />
          Create Study
        </motion.button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric icon={BookOpen} label="Studies" value={loading ? "..." : totalStudies} />
        <DashboardMetric icon={CheckCircle2} label="Completed" value={loading ? "..." : completedStudies} />
        <DashboardMetric icon={ClipboardCheck} label="Ready to Practice" value={loading ? "..." : readyStudies} />
        <DashboardMetric icon={Trophy} label="Latest Score" value={latestScore == null ? "N/A" : `${latestScore}%`} />
      </div>
    </div>
  );
};

function DashboardMetric({ icon: Icon, label, value }) {
  return (
    <Card variant="default" className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-h6 text-p-text inter-font dark:text-dark-muted">{label}</p>
          <p className="mt-1 text-h2 font-bold text-grey-200 poppins-font dark:text-dark-text">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
