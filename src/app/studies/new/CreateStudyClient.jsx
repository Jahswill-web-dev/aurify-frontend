"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LayoutDashboard,
  Send,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  getGeneratedStudyId,
  getStudyPlan,
} from "@/data/mockStudies";

const examplePrompts = [
  "Teach me system design for senior backend interviews. Focus on scaling a chat app, database choices, caching, queues, tradeoffs, and mock interview questions.",
  "Help me learn Photosynthesis for Grade 10 Biology. Focus on light reactions, the Calvin cycle, limiting factors, diagrams, and exam-style questions.",
  "Create a Study for launching a small fashion brand online. Cover positioning, pricing, inventory, Instagram content, and weekly action steps.",
  "Teach me Bubble Sort as a beginner programmer. Include simple JavaScript examples, time complexity, common mistakes, and practice questions.",
  "Help me understand personal finance for a first salary. Cover budgeting, emergency funds, debt, investing basics, and practical scenarios.",
];

const CUSTOM_OPTION_ID = "__custom__";

const mockClarificationQuestions = [
  {
    id: "study-focus",
    question: "What should this Study focus on first?",
    type: "single",
    options: [
      { id: "concepts", label: "Core concepts and simple explanations" },
      { id: "practice", label: "Practice questions and worked answers" },
      { id: "exam", label: "Exam preparation and revision" },
    ],
    allowCustom: true,
    customPlaceholder: "Tell us what you want instead...",
  },
  {
    id: "study-materials",
    question: "What should the AI include in your Study?",
    type: "multiple",
    options: [
      { id: "examples", label: "Real examples" },
      { id: "summary", label: "Short summaries" },
      { id: "quiz", label: "Quiz questions" },
      { id: "steps", label: "Step-by-step explanations" },
    ],
    allowCustom: true,
    customPlaceholder: "Tell us what else to include...",
  },
];

const inferSubject = (prompt) => {
  const text = prompt.toLowerCase();

  if (/biology|photosynthesis|cell|plant|genetics/.test(text)) return "Biology";
  if (/code|program|algorithm|sort|computer|javascript|python/.test(text)) {
    return "Computer Science";
  }
  if (/history|war|empire|civilization|revolution/.test(text)) return "History";
  if (/math|calculus|algebra|equation|geometry/.test(text)) return "Mathematics";
  if (/physics|force|motion|energy|electricity/.test(text)) return "Physics";
  if (/chemistry|atom|reaction|molecule|bond/.test(text)) return "Chemistry";

  return "General";
};

const inferLevel = (prompt) => {
  const text = prompt.toLowerCase();

  if (/grade 10|grade 11|grade 12|high school|secondary/.test(text)) {
    return "High School";
  }
  if (/university|college|undergraduate/.test(text)) return "University";
  if (/advanced|expert|deep/.test(text)) return "Advanced";
  if (/professional|work|career|interview/.test(text)) return "Professional";

  return "Beginner";
};

const inferGoal = (prompt) => {
  const text = prompt.toLowerCase();

  if (/exam|test|quiz|waec|sat|final/.test(text)) return "Prepare for an exam";
  if (/practice|questions|drill/.test(text)) return "Practice questions";
  if (/deep|mastery|master/.test(text)) return "Deep mastery";

  return "Understand the topic";
};

const inferTitle = (prompt) => {
  const cleaned = prompt
    .trim()
    .replace(/^i\s+(want|need|would like)\s+to\s+(learn|study|understand)\s+/i, "")
    .replace(/^teach me\s+/i, "")
    .replace(/^help me\s+(learn|study|understand)\s+/i, "");
  const firstSentence = cleaned.split(/[.!?\n]/)[0]?.trim();
  const beforeFor = firstSentence?.split(/\s+for\s+/i)[0]?.trim();

  return (beforeFor || firstSentence || "Untitled Study").slice(0, 72);
};

const needsClarification = (prompt) => {
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  const text = prompt.toLowerCase();

  return (
    words.length < 8 ||
    /^(learn|study|teach me|help me learn|i want to learn)\s+[a-z\s-]+$/i.test(
      prompt.trim()
    ) ||
    /\b(math|science|coding|business|english|history)\b/.test(text)
  );
};

const getMockClarificationQuestions = (prompt) => {
  return needsClarification(prompt) ? mockClarificationQuestions : [];
};

const createEmptyAnswers = (questions) =>
  questions.reduce((answers, question) => {
    answers[question.id] = {
      questionId: question.id,
      selectedOptionIds: [],
      customText: "",
    };

    return answers;
  }, {});

const getAnswerOptionLabels = (question, answer) => {
  return answer.selectedOptionIds
    .filter((optionId) => optionId !== CUSTOM_OPTION_ID)
    .map((optionId) => question.options.find((option) => option.id === optionId)?.label)
    .filter(Boolean);
};

const hasAnsweredQuestion = (question, answer) => {
  if (!answer) return false;

  return (
    getAnswerOptionLabels(question, answer).length > 0 ||
    answer.customText.trim().length > 0
  );
};

const buildPromptWithClarifications = (prompt, questions, answers) => {
  const clarificationLines = questions
    .map((question) => {
      const answer = answers[question.id];
      if (!hasAnsweredQuestion(question, answer)) return null;

      const selectedLabels = getAnswerOptionLabels(question, answer);
      const values = answer.customText.trim()
        ? [...selectedLabels, answer.customText.trim()]
        : selectedLabels;

      return `${question.question} ${values.join(", ")}`;
    })
    .filter(Boolean);

  if (!clarificationLines.length) return prompt;

  return `${prompt.trim()}\n\nClarifications:\n${clarificationLines.join("\n")}`;
};

function ChatBubble({ role, children }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[92%] rounded-md px-4 py-3 shadow-card sm:max-w-[78%]",
          isUser
            ? "bg-primary text-white"
            : "border border-grey-25 bg-off-white-100 text-grey-200",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function ClarificationQuestionCard({ question, answer, onChange }) {
  const isMultiple = question.type === "multiple";
  const selectedOptionIds = answer?.selectedOptionIds || [];
  const isCustomSelected = selectedOptionIds.includes(CUSTOM_OPTION_ID);

  const handleOptionToggle = (optionId) => {
    if (isMultiple) {
      const nextSelected = selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter((selectedId) => selectedId !== optionId)
        : [...selectedOptionIds, optionId];

      onChange({
        ...answer,
        selectedOptionIds: nextSelected,
        customText:
          optionId === CUSTOM_OPTION_ID && isCustomSelected ? "" : answer.customText,
      });
      return;
    }

    const nextSelected = selectedOptionIds.includes(optionId) ? [] : [optionId];

    onChange({
      ...answer,
      selectedOptionIds: nextSelected,
      customText:
        optionId === CUSTOM_OPTION_ID || nextSelected.includes(CUSTOM_OPTION_ID)
          ? answer.customText
          : "",
    });
  };

  const optionButtonClass = (isSelected) =>
    [
      "flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left text-h5 transition-all duration-175 inter-font",
      isSelected
        ? "border-primary bg-accent-25 text-primary"
        : "border-grey-25 bg-white text-grey-200 hover:border-primary hover:bg-accent-25",
    ].join(" ");

  return (
    <div className="rounded-md border border-grey-25 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-h4 font-semibold text-grey-200 poppins-font">
          {question.question}
        </h2>
        <Badge variant="neutral">
          {isMultiple ? "Choose one or more" : "Choose one"}
        </Badge>
      </div>

      <div className="grid gap-2">
        {question.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionToggle(option.id)}
              className={optionButtonClass(isSelected)}
              aria-pressed={isSelected}
            >
              <span
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border",
                  isMultiple ? "rounded-sm" : "rounded-full",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-grey-25 bg-white",
                ].join(" ")}
              >
                {isSelected ? <Check size={13} aria-hidden="true" /> : null}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}

        {question.allowCustom ? (
          <button
            type="button"
            onClick={() => handleOptionToggle(CUSTOM_OPTION_ID)}
            className={optionButtonClass(isCustomSelected)}
            aria-pressed={isCustomSelected}
          >
            <span
              className={[
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border",
                isMultiple ? "rounded-sm" : "rounded-full",
                isCustomSelected
                  ? "border-primary bg-primary text-white"
                  : "border-grey-25 bg-white",
              ].join(" ")}
            >
              {isCustomSelected ? <Check size={13} aria-hidden="true" /> : null}
            </span>
            <span>Something else</span>
          </button>
        ) : null}
      </div>

      {isCustomSelected ? (
        <textarea
          value={answer.customText}
          onChange={(event) =>
            onChange({
              ...answer,
              customText: event.target.value,
            })
          }
          rows={3}
          aria-label="Custom clarification answer"
          placeholder={question.customPlaceholder}
          className="mt-3 min-h-[96px] w-full resize-none rounded-md border border-grey-25 bg-off-white-100 px-3 py-3 text-h5 leading-7 text-grey-200 outline-none transition-colors focus:border-primary focus:bg-white inter-font"
        />
      ) : null}
    </div>
  );
}

function ClarificationChat({
  prompt,
  questions,
  answers,
  onAnswerChange,
  onContinue,
  onEditPrompt,
}) {
  const canContinue = questions.every((question) =>
    hasAnsweredQuestion(question, answers[question.id])
  );

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="rounded-lg border border-grey-25 bg-white p-3 shadow-panel">
        <div className="grid gap-4">
          <ChatBubble role="user">
            <p className="text-h5 leading-7 inter-font">{prompt}</p>
          </ChatBubble>

          <ChatBubble role="assistant">
            <p className="text-h5 leading-7 inter-font">
              I need a little more detail to shape this Study well.
            </p>
          </ChatBubble>

          {questions.map((question) => (
            <ClarificationQuestionCard
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onChange={(nextAnswer) => onAnswerChange(question.id, nextAnswer)}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-3 border-t border-grey-25 pt-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" size="md" onClick={onEditPrompt}>
            Edit Prompt
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!canContinue}
            onClick={onContinue}
            className="min-w-[132px]"
          >
            Continue
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CreateStudyChat({ prompt, onPromptChange, onSubmit }) {
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
      <div className="rounded-lg border border-grey-25 bg-white p-3 shadow-panel transition-all duration-175 focus-within:border-primary focus-within:shadow-input-focus">
        <div className="relative">
          {!isValid ? (
            <div className="pointer-events-none absolute inset-x-2 top-2 text-h5 leading-7 text-grey-100 inter-font sm:text-h4">
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
            className="relative z-10 min-h-[152px] w-full resize-none border-0 bg-transparent px-2 py-2 text-h5 leading-7 text-grey-200 outline-none inter-font sm:text-h4"
          />
        </div>

        <div className="mt-2 flex items-center justify-end border-t border-grey-25 pt-3">
          <Button
            variant="primary"
            size="md"
            disabled={!isValid}
            onClick={onSubmit}
            className="min-w-[132px]"
          >
            Create
            <Send size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PromptSummary({ prompt }) {
  if (!prompt) return null;

  return (
    <div className="mb-6 rounded-md border border-accent-200 bg-white p-4">
      <p className="mb-1 text-h6 font-semibold uppercase text-primary-200 poppins-font">
        Your prompt
      </p>
      <p className="text-h5 leading-7 text-p-text-darker inter-font">
        {prompt}
      </p>
    </div>
  );
}

function StudyPlanPreview({ plan, prompt, onEdit, onGenerate }) {
  return (
    <Card variant="accent" className="p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-h6 font-semibold uppercase text-primary-200 poppins-font">
            Study Plan Preview
          </p>
          <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
            {plan.title}
          </h2>
        </div>
        <Badge variant="primary">Ready to generate</Badge>
      </div>

      <PromptSummary prompt={prompt} />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="accent">{plan.subject}</Badge>
        <Badge variant="neutral">{plan.level}</Badge>
        <Badge variant="neutral">{plan.goal}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-accent-200 bg-white p-4">
          <p className="text-h3 font-bold text-grey-200 poppins-font">
            {plan.estimatedMinutes}m
          </p>
          <p className="text-h6 text-p-text inter-font">Estimated time</p>
        </div>
        <div className="rounded-md border border-accent-200 bg-white p-4">
          <p className="text-h3 font-bold text-grey-200 poppins-font">
            {plan.practiceQuestionCount}
          </p>
          <p className="text-h6 text-p-text inter-font">Practice questions</p>
        </div>
        <div className="rounded-md border border-accent-200 bg-white p-4">
          <p className="text-h3 font-bold text-grey-200 poppins-font">
            {plan.examQuestionCount}
          </p>
          <p className="text-h6 text-p-text inter-font">Exam questions</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-h4 font-semibold text-grey-200 poppins-font">
          Planned material sections
        </h3>
        <div className="mt-3 grid gap-2">
          {plan.plannedSections.map((section, index) => (
            <div
              key={section}
              className="flex items-center gap-3 rounded-md border border-accent-200 bg-white px-4 py-3"
            >
              <span className="w-7 shrink-0 text-h6 font-bold text-primary poppins-font">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-h5 text-grey-200 inter-font">{section}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" size="lg" onClick={onGenerate} className="flex-1">
          Generate Study
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="lg" onClick={onEdit} className="flex-1">
          Edit Prompt
        </Button>
      </div>
    </Card>
  );
}

export default function CreateStudyClient() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [clarificationQuestions, setClarificationQuestions] = useState([]);
  const [clarificationAnswers, setClarificationAnswers] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const effectivePrompt = useMemo(
    () =>
      buildPromptWithClarifications(
        prompt,
        clarificationQuestions,
        clarificationAnswers
      ),
    [clarificationAnswers, clarificationQuestions, prompt]
  );

  const plan = useMemo(
    () =>
      getStudyPlan({
        topic: inferTitle(effectivePrompt),
        subject: inferSubject(effectivePrompt),
        level: inferLevel(effectivePrompt),
        goal: inferGoal(effectivePrompt),
      }),
    [effectivePrompt]
  );

  const handleGenerate = () => {
    router.push(`/studies/${getGeneratedStudyId(plan.title)}`);
  };

  const handleCreate = () => {
    const questions = getMockClarificationQuestions(prompt);

    if (!questions.length) {
      setShowPreview(true);
      return;
    }

    setClarificationQuestions(questions);
    setClarificationAnswers(createEmptyAnswers(questions));
  };

  const handleAnswerChange = (questionId, nextAnswer) => {
    setClarificationAnswers((current) => ({
      ...current,
      [questionId]: nextAnswer,
    }));
  };

  const handleEditPrompt = () => {
    setShowPreview(false);
    setClarificationQuestions([]);
    setClarificationAnswers({});
  };

  const showClarification =
    !showPreview && clarificationQuestions.length > 0;

  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[920px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/studies")}
            className="inline-flex items-center gap-2 text-h6 font-medium text-p-text transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Studies
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex h-9 items-center gap-2 rounded-sm border border-grey-25 bg-white px-3 text-h6 font-medium text-p-text-darker shadow-card transition-colors hover:border-primary hover:text-primary"
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

        {showPreview ? (
          <StudyPlanPreview
            plan={plan}
            prompt={effectivePrompt}
            onEdit={handleEditPrompt}
            onGenerate={handleGenerate}
          />
        ) : showClarification ? (
          <ClarificationChat
            prompt={prompt}
            questions={clarificationQuestions}
            answers={clarificationAnswers}
            onAnswerChange={handleAnswerChange}
            onContinue={() => setShowPreview(true)}
            onEditPrompt={handleEditPrompt}
          />
        ) : (
          <CreateStudyChat
            prompt={prompt}
            onPromptChange={(value) => {
              setPrompt(value);
              setClarificationQuestions([]);
              setClarificationAnswers({});
            }}
            onSubmit={handleCreate}
          />
        )}
      </div>
    </main>
  );
}
