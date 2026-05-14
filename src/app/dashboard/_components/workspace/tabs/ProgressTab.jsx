"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge, Button, Card } from "@/components/ui";

const staticPracticeAnswerKey = {
  1: 1,
  2: 0,
  3: 1,
  4: 0,
  5: 0,
};

const staticExamAnswerKey = {
  1: 1,
  2: 0,
  3: 1,
  4: 0,
  5: 2,
  6: 1,
};

const getModules = (learningPath) => {
  if (Array.isArray(learningPath)) return learningPath;
  if (Array.isArray(learningPath?.modules)) return learningPath.modules;
  return [];
};

const getQuestionSuffix = (questionId) => {
  const suffix = String(questionId).split("-").pop();
  return Number(suffix);
};

const getCorrectIndex = ({ questionId, pathModule, answerKey }) => {
  const question = pathModule?.questions?.find(
    (item) => String(item.id) === String(questionId)
  );

  if (question) return question.correctIndex;
  return answerKey[getQuestionSuffix(questionId)];
};

function StatusBadge({ status }) {
  const config = {
    strong: { label: "Strong", variant: "success" },
    needs_revision: { label: "Needs revision", variant: "accent" },
    weak: { label: "Weak", variant: "error" },
    not_started: { label: "Not started", variant: "neutral" },
  };
  const { label, variant } = config[status] || config.not_started;
  return <Badge variant={variant}>{label}</Badge>;
}

function ProgressTab({
  confirmedSetup,
  learningPath,
  practiceAnswers,
  examAnswers,
  activeModuleIndex,
  onModuleChange,
  onTabChange,
}) {
  const [moduleScores, setModuleScores] = useState([]);
  const [overallScore, setOverallScore] = useState(null);
  const [examScore, setExamScore] = useState(null);

  useEffect(() => {
    const modules = getModules(learningPath);

    if (!modules.length) {
      setModuleScores([]);
      setOverallScore(null);
      setExamScore(null);
      return;
    }

    const scores = modules.map((pathModule, index) => {
      const moduleAnswers = practiceAnswers?.[index];
      if (!moduleAnswers || Object.keys(moduleAnswers).length === 0) {
        return {
          index,
          title: pathModule.title || `Module ${index + 1}`,
          status: "not_started",
          score: null,
          correct: 0,
          total: 0,
        };
      }

      const entries = Object.entries(moduleAnswers);
      const total = entries.length;
      const correct = entries.filter(([questionId, selected]) => {
        const correctIndex = getCorrectIndex({
          questionId,
          pathModule,
          answerKey: staticPracticeAnswerKey,
        });
        return correctIndex !== undefined && selected === correctIndex;
      }).length;

      const score = total > 0 ? Math.round((correct / total) * 100) : 0;
      const status =
        score >= 80 ? "strong" : score >= 50 ? "needs_revision" : "weak";

      return {
        index,
        title: pathModule.title || `Module ${index + 1}`,
        status,
        score,
        correct,
        total,
      };
    });

    setModuleScores(scores);

    const practiced = scores.filter((score) => score.status !== "not_started");
    setOverallScore(
      practiced.length
        ? Math.round(
            practiced.reduce((total, score) => total + score.score, 0) /
              practiced.length
          )
        : null
    );

    if (examAnswers && Object.keys(examAnswers).length > 0) {
      const examEntries = Object.entries(examAnswers);
      const examTotal = examEntries.length;
      const examCorrect = examEntries.filter(([questionId, selected]) => {
        const moduleIndex = Math.max(Number(String(questionId).split("-")[0]) - 1, 0);
        const pathModule = modules[moduleIndex];
        const correctIndex = getCorrectIndex({
          questionId,
          pathModule,
          answerKey: staticExamAnswerKey,
        });
        return correctIndex !== undefined && selected === correctIndex;
      }).length;
      const pct = examTotal > 0 ? Math.round((examCorrect / examTotal) * 100) : 0;
      setExamScore({ correct: examCorrect, total: examTotal, pct });
    } else {
      setExamScore(null);
    }
  }, [practiceAnswers, examAnswers, learningPath]);

  const practicedCount = moduleScores.filter(
    (score) => score.status !== "not_started"
  ).length;
  const totalModules = moduleScores.length;
  const practicedPct = totalModules
    ? Math.round((practicedCount / totalModules) * 100)
    : 0;
  const hasNoProgress =
    moduleScores.length > 0 &&
    moduleScores.every((scoreItem) => scoreItem.status === "not_started") &&
    !examScore;

  const handlePracticeClick = (moduleIndex = activeModuleIndex) => {
    onModuleChange?.(moduleIndex);
    onTabChange?.("practice");
  };

  const handleReviseClick = (moduleIndex) => {
    onModuleChange?.(moduleIndex);
    onTabChange?.("notes");
  };

  if (!moduleScores.length) {
    return (
      <div className="mx-auto max-w-[680px] px-4 py-12 text-center">
        <Card variant="default">
          <p className="mb-2 text-h4 font-medium text-grey-200 poppins-font">
            Could not load progress
          </p>
          <p className="mb-4 text-h5 text-p-text inter-font">
            No learning modules are available for this session.
          </p>
          <Button variant="primary" size="md" onClick={() => onTabChange?.("notes")}>
            Go to Notes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[720px] px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-grey-200 poppins-font">
            Your Progress
          </h2>
          <p className="mt-1 text-h6 text-p-text inter-font">
            {confirmedSetup?.topic || "Current topic"} -{" "}
            {confirmedSetup?.level || "Current level"}
          </p>
        </div>

        {overallScore !== null ? (
          <div
            className={[
              "rounded-md border-2 px-4 py-2 text-center",
              overallScore >= 80
                ? "border-success bg-success-light text-success"
                : overallScore >= 50
                  ? "border-primary bg-accent-25 text-primary"
                  : "border-error bg-error-light text-error",
            ].join(" ")}
          >
            <p className="text-h3 font-bold poppins-font">{overallScore}%</p>
            <p className="text-xs inter-font">overall</p>
          </div>
        ) : null}
      </div>

      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-h6 text-p-text inter-font">
            {practicedCount} of {totalModules} modules practiced
          </span>
          <span className="text-h6 font-medium text-grey-200 inter-font">
            {practicedPct}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-off-white-50">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${practicedPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {hasNoProgress ? (
        <div className="py-12 text-center">
          <Card variant="default" className="mx-auto max-w-[440px]">
            <p className="mb-2 text-h4 font-medium text-grey-200 poppins-font">
              No progress yet
            </p>
            <p className="mb-6 text-h5 text-p-text inter-font">
              Complete some practice questions or take the exam and your results
              will appear here.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => handlePracticeClick()}
              >
                Go to Practice
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => onTabChange?.("exam")}
              >
                Take Exam
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {moduleScores.map((scoreItem, index) => (
            <motion.div
              key={scoreItem.index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Card variant="default">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-h6 text-p-text inter-font">
                        Module {scoreItem.index + 1}
                      </span>
                      <StatusBadge status={scoreItem.status} />
                    </div>
                    <p className="text-h5 font-medium text-grey-200 inter-font">
                      {scoreItem.title}
                    </p>
                  </div>

                  {scoreItem.score !== null ? (
                    <span
                      className={[
                        "shrink-0 text-h4 font-bold poppins-font",
                        scoreItem.score >= 80
                          ? "text-success"
                          : scoreItem.score >= 50
                            ? "text-primary"
                            : "text-error",
                      ].join(" ")}
                    >
                      {scoreItem.score}%
                    </span>
                  ) : null}
                </div>

                <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-off-white-50">
                  <motion.div
                    className={[
                      "h-full rounded-full",
                      scoreItem.status === "not_started"
                        ? "bg-grey-25"
                        : scoreItem.score >= 80
                          ? "bg-success"
                          : scoreItem.score >= 50
                            ? "bg-primary"
                            : "bg-error",
                    ].join(" ")}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        scoreItem.score !== null ? `${scoreItem.score}%` : "0%",
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                  />
                </div>

                {scoreItem.status === "not_started" ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-h6 text-grey-100 inter-font">
                      Not practiced yet
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePracticeClick(scoreItem.index)}
                    >
                      Go to Practice
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-h6 text-p-text inter-font">
                      {scoreItem.correct} of {scoreItem.total} correct
                    </span>
                    {scoreItem.status !== "strong" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReviseClick(scoreItem.index)}
                      >
                        Revise this module
                      </Button>
                    ) : null}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {examScore ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6"
        >
          <Card variant="default">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-h6 text-p-text inter-font">
                  Final Exam
                </p>
                <p className="text-h5 font-medium text-grey-200 inter-font">
                  {examScore.correct} of {examScore.total} correct
                </p>
              </div>
              <div className="text-right">
                <p
                  className={[
                    "text-h3 font-bold poppins-font",
                    examScore.pct >= 80
                      ? "text-success"
                      : examScore.pct >= 50
                        ? "text-primary"
                        : "text-error",
                  ].join(" ")}
                >
                  {examScore.pct}%
                </p>
                <Badge
                  variant={
                    examScore.pct >= 80
                      ? "success"
                      : examScore.pct >= 50
                        ? "accent"
                        : "error"
                  }
                >
                  {examScore.pct >= 80 ? "Passed" : "Needs work"}
                </Badge>
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-off-white-50">
              <motion.div
                className={[
                  "h-full rounded-full",
                  examScore.pct >= 80
                    ? "bg-success"
                    : examScore.pct >= 50
                      ? "bg-primary"
                      : "bg-error",
                ].join(" ")}
                initial={{ width: 0 }}
                animate={{ width: `${examScore.pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </Card>
        </motion.div>
      ) : null}
    </section>
  );
}

export default ProgressTab;
