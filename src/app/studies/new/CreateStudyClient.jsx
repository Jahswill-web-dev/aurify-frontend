"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  LayoutDashboard,
  Send,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import ThemeToggle from "@/components/theme/ThemeToggle";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import { createStudy, isAuthError, parseStudyInput } from "@/app/lib/aurifyApi";

const examplePrompts = [
  "Teach me system design for senior backend interviews. Focus on scaling a chat app, database choices, caching, queues, tradeoffs, and mock interview questions.",
  "Help me learn Photosynthesis for Grade 10 Biology. Focus on light reactions, the Calvin cycle, limiting factors, diagrams, and exam-style questions.",
  "Teach me Bubble Sort as a beginner programmer. Include simple JavaScript examples, time complexity, common mistakes, and practice questions.",
  "Explain calculus limits for a college engineering student.",
];

function ChatBubble({ role, children }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[92%] rounded-md px-4 py-3 shadow-card sm:max-w-[78%]",
          isUser
            ? "bg-primary text-white dark:bg-dark-accent dark:text-[#16110a]"
            : "border border-grey-25 bg-off-white-100 text-grey-200 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error dark:bg-error/15 dark:text-red-300">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="text-h5 leading-6 inter-font">{message}</p>
    </div>
  );
}

function CreateStudyChat({ prompt, onPromptChange, onSubmit, loading }) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const isValid = prompt.trim().length > 0;

  useEffect(() => {
    if (isValid) return undefined;

    const interval = window.setInterval(() => {
      setExampleIndex((current) => (current + 1) % examplePrompts.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [isValid]);

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="rounded-lg border border-grey-25 bg-white p-3 shadow-panel transition-all duration-175 focus-within:border-primary focus-within:shadow-input-focus dark:border-dark-border dark:bg-dark-surface dark:shadow-none dark:focus-within:border-primary-25">
        <div className="relative">
          {!isValid ? (
            <div className="pointer-events-none absolute inset-x-2 top-2 text-h5 leading-7 text-grey-100 inter-font sm:text-h4 dark:text-dark-muted">
              <AnimatePresence mode="wait">
                <motion.p
                  key={examplePrompts[exampleIndex]}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  {examplePrompts[exampleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          ) : null}

          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            rows={5}
            aria-label="Study prompt"
            className="relative z-10 min-h-[152px] w-full resize-none border-0 bg-transparent px-2 py-2 text-h5 leading-7 text-grey-200 outline-none inter-font sm:text-h4 dark:text-dark-text dark:placeholder:text-dark-muted"
          />
        </div>

        <div className="mt-2 flex items-center justify-end border-t border-grey-25 pt-3 dark:border-dark-border">
          <Button
            variant="primary"
            size="md"
            disabled={!isValid}
            loading={loading}
            onClick={onSubmit}
            className="min-w-[132px]"
          >
            Continue
            <Send size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ClarificationCard({
  prompt,
  clarification,
  selectedValue,
  onSelect,
  onContinue,
  onEditPrompt,
  loading,
}) {
  const options = clarification?.options || [];

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="rounded-lg border border-grey-25 bg-white p-3 shadow-panel dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
        <div className="grid gap-4">
          <ChatBubble role="user">
            <p className="text-h5 leading-7 inter-font">{prompt}</p>
          </ChatBubble>

          <ChatBubble role="assistant">
            <p className="text-h5 leading-7 inter-font">
              {clarification?.clarificationQuestion ||
                "Choose the best option for this Study."}
            </p>
          </ChatBubble>

          <div className="rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface-soft dark:shadow-none">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-h4 font-semibold text-grey-200 poppins-font">
                {clarification?.clarificationQuestion || "Clarify your Study"}
              </h2>
              <Badge variant="neutral">Choose one</Badge>
            </div>

            <div className="grid gap-2">
              {options.map((option) => {
                const isSelected = selectedValue === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelect(option)}
                    aria-pressed={isSelected}
                    className={[
                      "flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left text-h5 transition-all duration-175 inter-font",
                      isSelected
                        ? "border-primary bg-accent-25 text-primary dark:border-primary-25 dark:bg-dark-surface dark:text-primary-25"
                        : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:border-primary-25 dark:hover:bg-dark-bg dark:hover:text-primary-25",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-primary bg-primary text-white dark:border-primary-25 dark:bg-dark-accent dark:text-[#16110a]"
                          : "border-grey-25 bg-white dark:border-dark-border dark:bg-dark-surface-soft",
                      ].join(" ")}
                    >
                      {isSelected ? <Check size={13} aria-hidden="true" /> : null}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-3 border-t border-grey-25 pt-3 sm:flex-row sm:justify-between dark:border-dark-border">
          <Button variant="ghost" size="md" onClick={onEditPrompt}>
            Edit Prompt
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!selectedValue}
            loading={loading}
            onClick={onContinue}
            className="min-w-[132px]"
          >
            Create Study
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReadyPreview({ parsedStudy, onCreate, onEditPrompt, loading }) {
  const displayTopic = parsedStudy?.topic || "Untitled Study";
  const badges = [
    parsedStudy?.subject,
    parsedStudy?.level,
    parsedStudy?.goal,
    parsedStudy?.topicType || parsedStudy?.topic_type,
  ].filter(Boolean);

  return (
    <Card variant="accent" className="mx-auto max-w-[760px] p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-h6 font-semibold uppercase text-primary-200 poppins-font">
            Study details
          </p>
          <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
            {displayTopic}
          </h2>
        </div>
        <Badge variant="primary">Ready</Badge>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {badges.length ? (
          badges.map((badge) => (
            <Badge key={badge} variant="neutral">
              {badge}
            </Badge>
          ))
        ) : (
          <Badge variant="neutral">General</Badge>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          loading={loading}
          onClick={onCreate}
          className="flex-1"
        >
          Generate Study
        </Button>
        <Button variant="ghost" size="lg" onClick={onEditPrompt} className="flex-1">
          Edit Prompt
        </Button>
      </div>
    </Card>
  );
}

export default function CreateStudyClient() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [clarification, setClarification] = useState(null);
  const [selectedClarification, setSelectedClarification] = useState("");
  const [parsedStudy, setParsedStudy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  const clarificationPayload = useMemo(() => {
    if (!clarification || !selectedClarification) return null;

    return {
      type: clarification.clarificationType,
      value: selectedClarification,
    };
  }, [clarification, selectedClarification]);

  const runParser = async (nextClarification) => {
    setLoading(true);
    setError("");

    try {
      const result = await parseStudyInput({
        input: prompt.trim(),
        clarification: nextClarification,
      });

      if (result.type === "clarification") {
        setClarification(result.data);
        setSelectedClarification(result.data?.fallback || "");
        setParsedStudy(null);
        return;
      }

      setParsedStudy(result.data);
      setClarification(null);
    } catch (err) {
      setError(err.message || "Could not prepare this Study. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudy = async () => {
    if (!parsedStudy) return;

    setLoading(true);
    setError("");
    setAuthRequired(false);

    try {
      const study = await createStudy(parsedStudy);
      router.push(`/studies/${study.id}`);
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        setError(err.message || "Could not create this Study. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrompt = () => {
    setClarification(null);
    setSelectedClarification("");
    setParsedStudy(null);
    setError("");
  };

  if (authRequired) {
    return (
      <AuthRequiredState
        title="Log in to create a Study"
        message="Study creation is saved to your account. Log in, then return here to generate your workspace."
        returnTo="/studies/new"
        secondaryHref="/studies"
        secondaryLabel="Back to Studies"
      />
    );
  }

  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-8 sm:px-6 lg:px-10 dark:bg-dark-bg">
      <div className="mx-auto max-w-[920px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/studies")}
            className="inline-flex items-center gap-2 text-h6 font-medium text-p-text transition-colors hover:text-primary dark:text-dark-muted dark:hover:text-primary-25"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Studies
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex h-9 items-center gap-2 rounded-sm border border-grey-25 bg-white px-3 text-h6 font-medium text-p-text-darker shadow-card transition-colors hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:shadow-none dark:hover:border-primary-25 dark:hover:text-primary-25"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Dashboard
            </button>
          </div>
        </div>

        <div className="mx-auto mb-6 max-w-[760px] text-center">
          <h1 className="text-xx-head font-bold leading-tight text-grey-200 poppins-font sm:text-xl-head">
            Create a New Study
          </h1>
        </div>

        <div className="mx-auto max-w-[760px]">
          <ErrorMessage message={error} />
        </div>

        {parsedStudy ? (
          <ReadyPreview
            parsedStudy={parsedStudy}
            onCreate={handleCreateStudy}
            onEditPrompt={handleEditPrompt}
            loading={loading}
          />
        ) : clarification ? (
          <ClarificationCard
            prompt={prompt}
            clarification={clarification}
            selectedValue={selectedClarification}
            onSelect={setSelectedClarification}
            onContinue={() => runParser(clarificationPayload)}
            onEditPrompt={handleEditPrompt}
            loading={loading}
          />
        ) : (
          <CreateStudyChat
            prompt={prompt}
            onPromptChange={(value) => {
              setPrompt(value);
              setError("");
            }}
            onSubmit={() => runParser(null)}
            loading={loading}
          />
        )}
      </div>
    </main>
  );
}
