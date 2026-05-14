"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Badge, Button, Card } from "@/components/ui";

const actions = [
  { id: "simplify", label: "Simplify", question: "Simplify this explanation" },
  { id: "deeper", label: "Go Deeper", question: "Give a deeper explanation" },
  { id: "example", label: "Show Example", question: "Give a real world example" },
  { id: "quiz", label: "Quiz Me", question: "Give me a quick quiz on this" },
];

const buildStaticNotesContent = ({
  topic = "this topic",
  subject = "General",
  level = "Beginner",
  goal = "learning",
  moduleTitle = "Core Concept",
  moduleNumber = 1,
}) => `# ${moduleTitle}

This sample lesson shows how Aurify will present markdown notes for **${topic}**. It is static test content for now, so you can inspect the reading layout, typography, spacing, and module navigation without waiting for backend content.

## Big Idea

${moduleTitle} is part of a larger ${subject} learning path. At the ${level} level, the goal is to make the concept feel clear, practical, and easy to recall for ${goal}.

## What To Notice

- Start with the main definition before memorizing details.
- Connect each idea to a concrete example.
- Check whether you can explain the idea in your own words.
- Use practice questions to expose what still feels fuzzy.

## Worked Explanation

Imagine this module as step ${moduleNumber} in a ladder. The previous steps give you vocabulary, and this step helps you use that vocabulary to reason through a problem. A strong understanding means you can identify the concept, explain why it matters, and apply it to a new situation.

> A useful test: if you can teach the idea simply, you probably understand it deeply.

## Quick Recap

By the end of this module, you should be able to summarize **${moduleTitle}**, recognize it in examples, and answer short practice questions with confidence.`;

const buildStaticActionContent = ({ actionId, moduleTitle, topic }) => {
  const actionContent = {
    simplify: `## Simplified Version

Think of **${moduleTitle}** as one important piece of **${topic}**. The main job is to understand what it means, why it matters, and how to spot it in a real example.

In plain language: learn the idea, connect it to something familiar, then test yourself.`,
    deeper: `## Deeper Explanation

At a deeper level, **${moduleTitle}** is not just a fact to memorize. It is a relationship between smaller ideas inside **${topic}**.

When studying it, ask:

- What causes this idea to happen?
- What changes when it is present?
- What would be different if it were missing?
- How does it connect to the next module?`,
    example: `## Real-World Example

Suppose you are explaining **${topic}** to a friend. You could use **${moduleTitle}** as the bridge between the definition and a real situation.

For example, if the topic were photosynthesis, a module about energy conversion would connect sunlight, chlorophyll, glucose, and plant growth into one clear story.`,
    quiz: `## Quick Check

1. What is the central idea of **${moduleTitle}**?
2. Why does it matter when learning **${topic}**?
3. What is one real example where this idea appears?

Try answering out loud before moving to the Practice tab.`,
  };

  return actionContent[actionId] || "No sample content is available for this action.";
};

function NotesSkeleton() {
  return (
    <div className="mx-auto max-w-[720px] space-y-4 px-4 py-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-grey-25" />

      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-grey-25" />
        <div className="h-4 w-full animate-pulse rounded bg-grey-25" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-grey-25" />
      </div>

      <div className="mt-6 h-6 w-48 animate-pulse rounded-md bg-grey-25" />

      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-grey-25" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-grey-25" />
        <div className="h-4 w-full animate-pulse rounded bg-grey-25" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-grey-25" />
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-2 py-2" aria-label="Loading action">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function NotesTab({
  confirmedSetup,
  learningPath,
  activeModuleIndex,
  onModuleChange,
  onModuleComplete,
  completedModules = [],
}) {
  const [notesContent, setNotesContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [actionContent, setActionContent] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const modules = useMemo(
    () => (Array.isArray(learningPath?.modules) ? learningPath.modules : []),
    [learningPath?.modules]
  );
  const currentModule = modules[activeModuleIndex] || {};
  const moduleCount = modules.length;
  const moduleTitle = currentModule?.title || `Module ${activeModuleIndex + 1}`;
  const isFirstModule = activeModuleIndex === 0;
  const isLastModule = activeModuleIndex >= moduleCount - 1;
  const isComplete = completedModules.includes(activeModuleIndex);
  const activeActionLabel =
    actions.find((action) => action.id === activeAction)?.label || "Action";

  const loadStaticNotes = () => {
    if (!moduleCount) {
      setNotesContent(null);
      setError(new Error("No modules are available for this learning path."));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveAction(null);
    setActionContent(null);
    setIsActionLoading(false);

    window.setTimeout(() => {
      setNotesContent(
        buildStaticNotesContent({
          topic: confirmedSetup?.topic,
          subject: confirmedSetup?.subject,
          level: confirmedSetup?.level,
          goal: confirmedSetup?.goal,
          moduleTitle,
          moduleNumber: activeModuleIndex + 1,
        })
      );
      setIsLoading(false);
    }, 250);
  };

  useEffect(() => {
    loadStaticNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModuleIndex, moduleCount, moduleTitle]);

  const handleActionClick = (action) => {
    setActiveAction(action.id);
    setActionContent(null);
    setIsActionLoading(true);

    window.setTimeout(() => {
      setActionContent(
        buildStaticActionContent({
          actionId: action.id,
          moduleTitle,
          topic: confirmedSetup?.topic || "this topic",
        })
      );
      setIsActionLoading(false);
    }, 250);
  };

  const handleModuleChange = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= moduleCount) return;
    onModuleChange?.(nextIndex);
  };

  return (
    <section className="min-h-full bg-white">
      <div className="flex items-center justify-between border-b border-grey-25 bg-white px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={() => handleModuleChange(activeModuleIndex - 1)}
          disabled={isFirstModule}
          className="flex items-center gap-1 text-h6 text-p-text transition-colors duration-175 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          Prev
        </button>

        <div className="min-w-0 px-3 text-center text-h6 text-grey-200 inter-font">
          <span className="font-medium text-primary">
            Module {activeModuleIndex + 1} of {moduleCount || 1}
          </span>
          <span className="px-2 text-p-text">-</span>
          <span className="text-grey-200">{moduleTitle}</span>
          <span className="px-2 text-p-text">-</span>
          <span className="text-p-text">
            {currentModule?.estimatedMinutes || 5} min
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleModuleChange(activeModuleIndex + 1)}
          disabled={isLastModule}
          className="flex items-center gap-1 text-h6 text-p-text transition-colors duration-175 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
        </button>
      </div>

      {isLoading ? <NotesSkeleton /> : null}

      {!isLoading && error ? (
        <div className="mx-auto max-w-[720px] px-4 py-12 text-center">
          <Card variant="default">
            <p className="mb-2 text-h4 font-medium text-grey-200 poppins-font">
              Could not load notes
            </p>
            <p className="mb-4 text-h5 text-p-text inter-font">
              {error?.message || "Something went wrong loading this module."}
            </p>
            <Button variant="primary" size="md" onClick={loadStaticNotes}>
              Try Again
            </Button>
          </Card>
        </div>
      ) : null}

      {!isLoading && !error ? (
        <>
          <motion.div
            key={activeModuleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="markdown mx-auto max-w-[720px] px-4 py-6 md:px-8"
          >
            <ReactMarkdown>{notesContent || ""}</ReactMarkdown>
          </motion.div>

          <div className="mx-auto flex max-w-[720px] flex-wrap items-center gap-2 border-t border-grey-25 px-4 py-4 md:px-8">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={() => handleActionClick(action)}
                className={
                  activeAction === action.id
                    ? "border-primary bg-accent-100 text-primary"
                    : ""
                }
              >
                {action.label}
              </Button>
            ))}
          </div>

          <AnimatePresence>
            {activeAction || actionContent || isActionLoading ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mx-auto max-w-[720px] overflow-hidden px-4 md:px-8"
              >
                <div className="mb-4 rounded-md border border-accent-200 bg-accent-25 p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Badge variant="accent">{activeActionLabel}</Badge>
                    <button
                      type="button"
                      onClick={() => {
                        setActionContent(null);
                        setActiveAction(null);
                        setIsActionLoading(false);
                      }}
                      className="text-h6 text-grey-100 transition-colors duration-175 hover:text-grey-200"
                    >
                      Close
                    </button>
                  </div>

                  {isActionLoading ? (
                    <LoadingDots />
                  ) : (
                    <div className="markdown">
                      <ReactMarkdown>{actionContent || ""}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mx-auto mt-8 max-w-[720px] border-t border-grey-25 px-4 py-6 md:px-8">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="md"
                disabled={isFirstModule}
                onClick={() => handleModuleChange(activeModuleIndex - 1)}
              >
                Previous Module
              </Button>

              <Button
                variant="primary"
                size="md"
                disabled={isLastModule}
                onClick={() => handleModuleChange(activeModuleIndex + 1)}
              >
                Next Module
              </Button>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                variant="text"
                size="sm"
                onClick={() => onModuleComplete?.(activeModuleIndex)}
                className={isComplete ? "text-success hover:text-success" : ""}
              >
                {isComplete ? "Completed" : "Mark as complete"}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default NotesTab;
