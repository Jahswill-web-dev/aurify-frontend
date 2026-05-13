"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Badge, Button, Card, Dropdown } from "@/components/ui";

const defaultLevelOptions = [
  { value: "Primary School", label: "Primary School" },
  { value: "Middle School", label: "Middle School" },
  { value: "Grade 9", label: "Grade 9" },
  { value: "Grade 10", label: "Grade 10" },
  { value: "Grade 11", label: "Grade 11" },
  { value: "Grade 12", label: "Grade 12" },
  { value: "University - Year 1", label: "University - Year 1" },
  { value: "University - Year 2+", label: "University - Year 2+" },
  { value: "Professional", label: "Professional" },
];

const entrance = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

const getDisplayValue = (value, fallback = "Not specified") =>
  value ? value : fallback;

function ConfirmationCard({ parsed, onConfirm, onGenerate, onReset, onEditTopic }) {
  const [setup, setSetup] = useState(parsed);
  const [isChangingLevel, setIsChangingLevel] = useState(false);

  const clarificationOptions = useMemo(
    () =>
      setup.clarificationOptions?.length
        ? setup.clarificationOptions
        : [
            "Beginner",
            "High School",
            "University",
            "Advanced",
            "Not sure? Start beginner",
          ],
    [setup.clarificationOptions]
  );

  const needsClarification = Boolean(setup.needsClarification);
  const primaryOptions = clarificationOptions.filter(
    (option) => option !== "Not sure? Start beginner"
  );
  const unsureOption =
    clarificationOptions.find((option) => option === "Not sure? Start beginner") ||
    "Not sure? Start beginner";

  const handleLevelSelection = (level) => {
    const normalizedLevel =
      level === "Not sure? Start beginner" ? "Beginner" : level;

    setSetup((currentSetup) => ({
      ...currentSetup,
      level: normalizedLevel,
      needsClarification: false,
      clarificationQuestion: null,
      confidence: currentSetup.confidence === "low" ? "medium" : currentSetup.confidence,
    }));
  };

  const details = [
    ["Topic", getDisplayValue(setup.topic)],
    ["Subject", getDisplayValue(setup.subject, "General")],
    ["Level", getDisplayValue(setup.level)],
    ["Goal", getDisplayValue(setup.goal)],
  ];

  if (needsClarification) {
    return (
      <section className="min-h-screen bg-off-white px-4 py-8 md:px-6 lg:px-8">
        <motion.div
          {...entrance}
          className="mx-auto flex min-h-[70vh] w-full max-w-[680px] items-center"
        >
          <Card variant="default" className="w-full p-5 sm:p-7">
            <p className="text-h4 font-medium leading-8 text-grey-200 poppins-font">
              {setup.clarificationQuestion ||
                `${getDisplayValue(
                  setup.topic,
                  "This topic"
                )} can be taught at different levels. What level should I use?`}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {primaryOptions.map((option) => (
                <Button
                  key={option}
                  variant="ghost"
                  size="md"
                  onClick={() => handleLevelSelection(option)}
                >
                  {option}
                </Button>
              ))}
            </div>

            <Button
              variant="text"
              size="sm"
              onClick={() => handleLevelSelection(unsureOption)}
              className="mt-4"
            >
              {unsureOption}
            </Button>
          </Card>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-off-white px-4 py-8 md:px-6 lg:px-8">
      <motion.div
        {...entrance}
        className="mx-auto flex min-h-[70vh] w-full max-w-[680px] items-center"
      >
        <Card variant="accent" className="w-full p-5 sm:p-7">
          <h2 className="flex items-center gap-2 text-h5 font-semibold text-primary poppins-font">
            <span aria-hidden="true">✦</span>
            I found this learning setup
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="accent">{getDisplayValue(setup.subject, "General")}</Badge>
            <Badge variant="primary">{getDisplayValue(setup.level)}</Badge>
            <Badge variant="neutral">{getDisplayValue(setup.goal)}</Badge>
          </div>

          <div className="mt-6 grid gap-y-2">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-3"
              >
                <span className="text-h6 font-medium text-p-text inter-font">
                  {label}:
                </span>
                {label === "Level" && isChangingLevel ? (
                  <Dropdown
                    value={setup.level}
                    options={defaultLevelOptions}
                    onChange={(level) => {
                      setSetup((currentSetup) => ({ ...currentSetup, level }));
                      setIsChangingLevel(false);
                    }}
                    className="w-full"
                    buttonClassName="w-full justify-between !bg-white !border-grey-25 !text-grey-200 !px-3 !py-2"
                    menuClassName="w-full"
                  />
                ) : (
                  <span className="min-w-0 text-h5 text-grey-200 inter-font">
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => (onGenerate || onConfirm)?.(setup)}
            className="mt-7 w-full"
          >
            <span>Generate Learning Path</span>
            <ArrowRight size={20} aria-hidden="true" />
          </Button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Button variant="ghost" size="sm" onClick={() => onEditTopic?.(setup)}>
              Edit topic
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChangingLevel((current) => !current)}
            >
              Change level
            </Button>
            <Button variant="text" size="sm" onClick={onReset}>
              Reset
            </Button>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}

export default ConfirmationCard;
