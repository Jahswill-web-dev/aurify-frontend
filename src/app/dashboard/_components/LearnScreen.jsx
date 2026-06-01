"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/ui";

const placeholders = [
  "Photosynthesis for Grade 10",
  "Bubble sort in simple terms",
  "Atomic structure for an exam",
  "System engineering basics",
];

const starterPrompts = [
  "Photosynthesis - Grade 10",
  "Bubble Sort - CS",
  "Quadratic Equations",
  "Atomic Structure",
];

function LearnScreen({ onSubmit, initialValue = "" }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showError, setShowError] = useState(false);
  const inputRef = useRef(null);

  const hasInput = inputValue.trim().length > 0;

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (hasInput) return undefined;

    const interval = window.setInterval(() => {
      setPlaceholderIndex((currentIndex) =>
        currentIndex === placeholders.length - 1 ? 0 : currentIndex + 1
      );
    }, 3200);

    return () => window.clearInterval(interval);
  }, [hasInput]);

  const handleSubmit = async () => {
    const valueToSubmit = inputValue.trim();

    if (!valueToSubmit) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }

    setShowError(false);
    setIsGenerating(true);

    try {
      await Promise.resolve(onSubmit?.(valueToSubmit));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStarterPrompt = (prompt) => {
    setInputValue(prompt);
    setShowError(false);
    inputRef.current?.focus();
  };

  return (
    <section className="min-h-screen bg-off-white-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[920px] items-center">
        <div className="w-full">
          <div className="mb-8 max-w-[680px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-accent-200 bg-accent-25 px-3 py-1.5 text-h6 font-semibold uppercase text-primary-200 poppins-font">
              <Sparkles size={14} aria-hidden="true" />
              Learn
            </div>
            <h1 className="text-xx-head font-bold leading-tight text-grey-200 poppins-font md:text-xl-head">
              What do you want to understand?
            </h1>
            <p className="mt-3 max-w-[560px] text-h5 leading-7 text-p-text-darker inter-font">
              Type a topic, question, class, or exam goal. Aurify will turn it
              into a focused study path.
            </p>
          </div>

          <div className="rounded-lg border border-grey-25 bg-off-white p-4 shadow-card sm:p-5 md:p-6">
            <div className="mb-3 flex items-center gap-2 text-h6 font-semibold uppercase text-grey-100 poppins-font">
              <Search size={14} aria-hidden="true" />
              Learning prompt
            </div>

            <Input
              variant="textarea"
              placeholder={hasInput ? "" : placeholders[placeholderIndex]}
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                if (showError) setShowError(false);
              }}
              rows={5}
              ref={inputRef}
              className="!min-h-[168px] !resize-none !rounded-md !border-grey-25 !bg-white !px-4 !py-4 !text-h4 !leading-7 !text-grey-200 !shadow-none placeholder:!text-grey-100 focus:!border-primary focus:!shadow-input-focus sm:!px-5"
            />

            {showError ? (
              <p className="mt-2 text-h6 font-medium text-error">
                Enter a topic to start your learning path.
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleStarterPrompt(prompt)}
                    className="rounded-sm border border-grey-25 bg-off-white-100 px-3 py-2 text-h6 font-medium text-p-text-darker transition-colors duration-175 hover:border-primary hover:bg-accent-25 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                loading={isGenerating}
                disabled={isGenerating}
                onClick={handleSubmit}
                className="w-full shrink-0 sm:w-auto"
              >
                <BookOpen size={18} aria-hidden="true" />
                <span>Build path</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LearnScreen;
