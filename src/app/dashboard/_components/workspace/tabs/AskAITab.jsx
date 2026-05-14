"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Card } from "@/components/ui";

const buildMockReply = ({ text, topic, subject, level, goal, activeModule }) => {
  const moduleContext = activeModule
    ? ` while you are on "${activeModule}"`
    : "";

  return `Great question. For ${topic} in ${subject || "this subject"}${moduleContext}, I would focus on the core idea first: ${text}

At the ${level || "current"} level, connect the answer back to your ${goal || "learning"} goal by defining the key term, naming the main process, and checking that you can explain it in your own words.`;
};

function AskAITab({
  confirmedSetup,
  learningPath,
  activeModuleIndex,
  onTabChange,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const requestIdRef = useRef(0);

  const modules = Array.isArray(learningPath?.modules)
    ? learningPath.modules
    : [];
  const activeModule = modules?.[activeModuleIndex]?.title || "";
  const topic = confirmedSetup?.topic || "";

  const suggestedPrompts = useMemo(
    () => [
      `Explain ${topic || "this topic"} in simple terms`,
      `What are the most important points to remember about ${
        topic || "this topic"
      }?`,
      `Give me a real-world analogy for ${topic || "this topic"}`,
      `What exam questions are commonly asked about ${topic || "this topic"}?`,
    ],
    [topic]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (overrideText) => {
    const text = (overrideText || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);
    setError(null);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      await new Promise((resolve) => setTimeout(resolve, 850));
      if (requestId !== requestIdRef.current) return;

      /*
       * TODO: Replace the mock block above with:
       * POST `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL || ""}/learn/ask`
       * using Cookies.get("accessToken") and body:
       * { topic, subject, level, goal, activeModule, messages: updatedMessages }
       */
      const reply = buildMockReply({
        text,
        topic: confirmedSetup.topic,
        subject: confirmedSetup.subject,
        level: confirmedSetup.level,
        goal: confirmedSetup.goal,
        activeModule,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInputValue(prompt);
    handleSend(prompt);
  };

  const handleClearChat = () => {
    requestIdRef.current += 1;
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
    setError(null);
  };

  if (!topic) {
    return (
      <div className="mx-auto max-w-[680px] px-4 py-12 text-center">
        <Card variant="default">
          <p className="mb-2 text-h4 font-medium text-grey-200 poppins-font">
            Could not load Ask AI
          </p>
          <p className="mb-4 text-h5 text-p-text inter-font">
            Topic context is missing. Please go back and reload your learning
            session.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => onTabChange?.("notes")}
          >
            Go to Notes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-[720px] flex-col px-4 py-0 md:px-8">
      <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-grey-200 poppins-font">
            Ask AI
          </h2>
          <p className="mt-1 text-h6 text-p-text inter-font">
            Ask anything about{" "}
            <span className="font-semibold text-primary">
              {confirmedSetup.topic}
            </span>
            {activeModule ? (
              <>
                {" "}
                - currently on{" "}
                <span className="font-medium text-grey-200">
                  {activeModule}
                </span>
              </>
            ) : null}
          </p>
        </div>

        {messages.length > 0 ? (
          <button
            type="button"
            className="shrink-0 text-h6 text-grey-100 underline underline-offset-2 transition-colors hover:text-error inter-font"
            onClick={handleClearChat}
          >
            Clear chat
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              <p className="mb-1 text-h6 text-p-text inter-font">
                Suggested questions
              </p>
              <div className="flex flex-col gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="w-full rounded-md border-2 border-grey-25 bg-white px-4 py-3 text-left text-h5 text-grey-200 transition-all duration-175 ease-smooth hover:border-primary hover:bg-accent-25 hover:text-primary inter-font"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={`${msg.role}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="mt-1 mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
              ) : null}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-md px-4 py-3 text-h5 leading-relaxed inter-font ${
                  msg.role === "user"
                    ? "rounded-br-xs bg-primary text-white"
                    : "rounded-bl-xs border border-grey-25 bg-off-white-50 text-grey-200"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="mt-1 mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-grey-25 bg-off-white-50 px-4 py-3">
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-grey-100"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-grey-100"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-grey-100"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </motion.div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto shrink-0 border-t border-grey-25 pt-4">
        {error ? (
          <p className="mb-2 text-h6 text-error inter-font">
            {error} -{" "}
            <button
              type="button"
              className="underline underline-offset-2 hover:text-primary"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </p>
        ) : null}
        <div className="flex items-end gap-3">
          <textarea
            className="flex-1 resize-none rounded-md border-2 border-grey-25 bg-white px-4 py-3 text-h5 text-grey-200 transition-colors duration-175 placeholder:text-grey-100 focus:border-primary focus:outline-none inter-font"
            rows={2}
            placeholder="Ask a question about this topic..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="shrink-0"
          >
            Send
          </Button>
        </div>
        <p className="mt-2 text-xs text-grey-100 inter-font">
          Press Enter to send - Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default AskAITab;
