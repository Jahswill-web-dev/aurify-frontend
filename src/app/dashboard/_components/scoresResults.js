import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, BarChart3, BookOpen, ClipboardCheck, Trophy } from "lucide-react";
import { Button, Card, LoadingExperience } from "@/components/ui";

const toScore = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, Math.round(number)));
};

const getScores = (studies) =>
  studies.flatMap((study) => {
    const title = study.title || study.topic || "Untitled Study";
    const updatedAt = study.updated_at || study.created_at;
    const practiceScore = toScore(study.progress?.latest_practice_score);
    const examScore = toScore(study.progress?.latest_exam_score);

    return [
      practiceScore !== null
        ? {
            id: `${study.id}-practice`,
            studyId: study.id,
            title,
            type: "Practice",
            score: practiceScore,
            updatedAt,
          }
        : null,
      examScore !== null
        ? {
            id: `${study.id}-exam`,
            studyId: study.id,
            title,
            type: "Exam",
            score: examScore,
            updatedAt,
          }
        : null,
    ].filter(Boolean);
  });

const formatDate = (date) => {
  if (!date) return "No date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const ScoresResults = ({ studies = [], loading, error, onRetry }) => {
  const scores = getScores(studies).sort(
    (first, second) => new Date(second.updatedAt || 0) - new Date(first.updatedAt || 0)
  );
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length)
    : null;
  const bestScore = scores.length
    ? Math.max(...scores.map((score) => score.score))
    : null;

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Progress
          </p>
          <h1 className="mt-2 text-xl-head font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
            Scores & Results
          </h1>
          <p className="mt-2 max-w-[620px] text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
            Review your latest practice and exam outcomes across your Studies.
          </p>
        </motion.div>

        {loading ? (
          <LoadingExperience
            variant="panel"
            title="Loading your results"
            message="Collecting your latest practice and exam scores."
          />
        ) : error ? (
          <Card variant="default" className="mx-auto max-w-[680px] p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-error" aria-hidden="true" />
            <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
              Results could not load
            </h2>
            <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
              {error}
            </p>
            <Button variant="primary" size="md" onClick={onRetry} className="mt-5">
              Retry
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ScoreMetric
                icon={BarChart3}
                label="Average Score"
                value={averageScore == null ? "N/A" : `${averageScore}%`}
              />
              <ScoreMetric
                icon={Trophy}
                label="Best Score"
                value={bestScore == null ? "N/A" : `${bestScore}%`}
              />
              <ScoreMetric
                icon={ClipboardCheck}
                label="Recorded Scores"
                value={scores.length}
              />
            </div>

            <Card variant="default" className="p-0">
              <div className="border-b border-grey-25 p-5 dark:border-dark-border">
                <h2 className="text-h3 font-semibold text-grey-200 poppins-font">
                  Recent Scores
                </h2>
              </div>

              {scores.length ? (
                <div className="divide-y divide-grey-25 dark:divide-dark-border">
                  {scores.slice(0, 8).map((score, index) => (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {score.type === "Practice" ? (
                            <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                          ) : (
                            <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                          )}
                          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
                            {score.type}
                          </p>
                        </div>
                        <h3 className="mt-1 truncate text-h4 font-semibold text-grey-200 poppins-font dark:text-dark-text">
                          {score.title}
                        </h3>
                        <p className="mt-1 text-h6 text-p-text inter-font dark:text-dark-muted">
                          Updated {formatDate(score.updatedAt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <p className="text-h2 font-bold text-grey-200 poppins-font dark:text-dark-text">
                          {score.score}%
                        </p>
                        <Link
                          href={`/studies/${score.studyId}`}
                          className="inline-flex items-center justify-center rounded-sm border border-primary px-3 py-2 text-h6 font-semibold text-primary transition-colors hover:bg-accent-25 dark:border-primary-25 dark:text-primary-25 dark:hover:bg-dark-surface-soft"
                        >
                          Open
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <h3 className="text-h3 font-semibold text-grey-200 poppins-font">
                    No scores yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-[460px] text-h5 leading-7 text-p-text-darker inter-font">
                    Complete a practice or exam attempt inside a Study to see
                    your results here.
                  </p>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

function ScoreMetric({ icon: Icon, label, value }) {
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
