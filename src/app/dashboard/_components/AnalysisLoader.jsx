"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const statuses = [
  "Detecting subject and topic",
  "Determining the right level",
  "Setting up your learning path",
];

function AnalysisLoader({ input, onComplete }) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusIndex((currentIndex) => (currentIndex + 1) % statuses.length);
    }, 500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const minimumDelay = new Promise((resolve) => {
      window.setTimeout(resolve, 1500);
    });

    const apiCall = fetch("/api/parse-topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    }).then((response) => response.json());

    Promise.all([apiCall, minimumDelay])
      .then(([parsed]) => {
        if (isMounted) onComplete?.(parsed);
      })
      .catch(() => {
        if (isMounted) {
          onComplete?.({
            topic: input,
            subject: "General",
            level: null,
            goal: null,
            specificity: "broad",
            needsClarification: true,
            clarificationQuestion: "What level should I teach this at?",
            clarificationOptions: [
              "Beginner",
              "High School",
              "University",
              "Advanced",
              "Not sure? Start beginner",
            ],
            confidence: "low",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [input, onComplete]);

  return (
    <section className="min-h-screen bg-off-white px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-[680px] items-center justify-center">
        <div className="w-full rounded-lg border border-grey-25 bg-white px-5 py-14 text-center shadow-panel sm:px-8">
          <div
            className="mb-6 flex items-center justify-center gap-2"
            aria-hidden="true"
          >
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="h-3 w-3 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>

          <h2 className="text-h4 font-medium text-grey-200 poppins-font">
            Analysing your topic...
          </h2>

          <div className="mt-3 min-h-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={statuses[statusIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="text-h5 text-p-text inter-font"
              >
                {statuses[statusIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalysisLoader;
