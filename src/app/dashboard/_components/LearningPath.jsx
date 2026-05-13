"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge, Button, Card } from "@/components/ui";

const typeBadgeVariants = {
  introduction: "accent",
  concept: "neutral",
  example: "accent",
  practice: "primary",
  exam: "error",
};

const getDisplayValue = (value, fallback = "Not specified") =>
  value ? value : fallback;

const getFallbackPath = (confirmedSetup = {}) => ({
  title: confirmedSetup.topic || "Untitled topic",
  subject: confirmedSetup.subject || "General",
  level: confirmedSetup.level || "Beginner",
  goal: confirmedSetup.goal || "General learning",
  estimatedMinutes: 5,
  modules: [
    {
      id: 1,
      title: "Introduction",
      type: "introduction",
      estimatedMinutes: 5,
      description: "Start with the core ideas and learning goals for this topic.",
    },
  ],
});

function LearningPathSkeleton({ confirmedSetup, onBack }) {
  return (
    <section className="min-h-screen bg-off-white">
      <div className="mx-auto max-w-[780px] px-4 py-10">
        <button
          type="button"
          onClick={onBack}
          className="text-h6 text-p-text hover:text-primary cursor-pointer transition-colors duration-175"
        >
          &larr; Back to setup
        </button>

        <div className="mt-6 h-8 w-48 animate-pulse rounded-md bg-grey-25" />
        <div className="mt-3 flex items-center gap-2">
          <div className="h-5 w-20 animate-pulse rounded-xs bg-grey-25" />
          <div className="h-5 w-20 animate-pulse rounded-xs bg-grey-25" />
        </div>

        <h2 className="mt-8 text-h3 font-semibold text-grey-200 poppins-font">
          Your Learning Path
        </h2>
        <p className="mt-1 text-h6 text-p-text inter-font">
          Building a path for {getDisplayValue(confirmedSetup?.topic, "your topic")}
        </p>

        <div className="mt-5 grid gap-3">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 w-full animate-pulse rounded-md bg-grey-25"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningPath({ confirmedSetup, initialPath = null, onBack, onStart }) {
  const [path, setPath] = useState(initialPath);
  const [isLoading, setIsLoading] = useState(!initialPath);

  useEffect(() => {
    let isMounted = true;

    const generatePath = async () => {
      if (initialPath) {
        setPath(initialPath);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setPath(null);

      try {
        const response = await fetch("/api/generate-path", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(confirmedSetup),
        });
        const data = await response.json();

        if (isMounted) {
          setPath(data);
        }
      } catch (error) {
        console.error("Learning path request failed:", error.message);
        if (isMounted) {
          setPath(getFallbackPath(confirmedSetup));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generatePath();

    return () => {
      isMounted = false;
    };
  }, [confirmedSetup, initialPath]);

  const modules = useMemo(() => path?.modules || [], [path?.modules]);
  const totalMinutes = useMemo(
    () =>
      modules.reduce(
        (sum, module) => sum + (Number(module.estimatedMinutes) || 0),
        0
      ),
    [modules]
  );

  if (isLoading || !path) {
    return (
      <LearningPathSkeleton confirmedSetup={confirmedSetup} onBack={onBack} />
    );
  }

  return (
    <section className="min-h-screen bg-off-white">
      <div className="mx-auto max-w-[780px] px-4 py-10">
        <button
          type="button"
          onClick={onBack}
          className="text-h6 text-p-text hover:text-primary cursor-pointer transition-colors duration-175"
        >
          &larr; Back to setup
        </button>

        <h1 className="mt-6 text-xl-head font-bold leading-tight text-grey-200 poppins-font">
          {getDisplayValue(path.title)}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="accent">{getDisplayValue(path.subject, "General")}</Badge>
          <Badge variant="primary">{getDisplayValue(path.level)}</Badge>
          <Badge variant="neutral">{getDisplayValue(path.goal)}</Badge>
        </div>

        <h2 className="mt-8 text-h3 font-semibold text-grey-200 poppins-font">
          Your Learning Path
        </h2>
        <p className="mt-1 text-h6 text-p-text inter-font">
          {modules.length} {modules.length === 1 ? "module" : "modules"} - ~
          {totalMinutes} minutes
        </p>

        <div className="mt-5 grid gap-3">
          {modules.map((module, index) => {
            const type = module.type || "concept";
            const typeVariant = typeBadgeVariants[type] || "neutral";

            return (
              <motion.div
                key={module.id || index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.07 }}
              >
                <Card
                  variant="default"
                  className="p-0 hover:border-primary hover:shadow-panel transition-all duration-175"
                >
                  <div className="flex items-start gap-4 p-5">
                    <span className="w-8 shrink-0 text-h5 font-bold text-primary poppins-font">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
                        {module.title}
                      </h3>
                      <p className="mt-0.5 text-h6 capitalize text-p-text inter-font">
                        {type} - {module.estimatedMinutes} min
                      </p>
                      <p className="mt-1 text-h6 text-p-text inter-font">
                        {module.description}
                      </p>
                    </div>

                    <Badge
                      variant={typeVariant}
                      className="shrink-0 capitalize"
                    >
                      {type}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => onStart?.(path)}
          className="mt-8 w-full"
        >
          Start Learning &rarr;
        </Button>
        <p className="mt-2 text-center text-h6 text-p-text inter-font">
          You can switch level or goal anytime during your session
        </p>
      </div>
    </section>
  );
}

export default LearningPath;
