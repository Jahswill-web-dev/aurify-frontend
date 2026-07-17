export const workspaceTabs = [
  { id: "learn", label: "Learn" },
  { id: "glossary", label: "Glossary" },
  { id: "practice", label: "Practice" },
  { id: "exam", label: "Exam Mode" },
  { id: "analytics", label: "Analytics" },
];

export const pollingStatuses = new Set([
  "queued",
  "generating_research",
  "research_ready",
  "generating_outline",
  "outline_ready",
  "modules_pending",
  "generating_material",
  "material_ready",
  "generating_glossary",
  "glossary_ready",
  "generating_practice_questions",
  "practice_ready",
  "generating_exam_questions",
]);

export const materialAvailableStatuses = new Set([
  "generating_material",
  "module_partial_ready",
  "material_ready",
  "generating_glossary",
  "glossary_ready",
  "generating_practice_questions",
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

export const glossaryReadyStatuses = new Set([
  "glossary_ready",
  "generating_practice_questions",
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

export const glossaryRegenerableStatuses = new Set([
  "material_ready",
  "glossary_ready",
  "generating_practice_questions",
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

export const practiceReadyStatuses = new Set([
  "practice_ready",
  "generating_exam_questions",
  "exam_ready",
]);

export const examTimerOptions = [
  { label: "No timer", minutes: 0 },
  { label: "10 min", minutes: 10 },
  { label: "20 min", minutes: 20 },
  { label: "30 min", minutes: 30 },
  { label: "60 min", minutes: 60 },
];

export const statusConfig = {
  queued: { label: "Queued", variant: "accent" },
  generating_research: { label: "Researching", variant: "accent" },
  research_ready: { label: "Research ready", variant: "accent" },
  generating_outline: { label: "Outlining", variant: "accent" },
  outline_ready: { label: "Outline ready", variant: "accent" },
  modules_pending: { label: "Modules queued", variant: "accent" },
  generating_material: { label: "Generating material", variant: "accent" },
  module_partial_ready: { label: "Partially ready", variant: "accent" },
  modules_failed: { label: "Modules failed", variant: "error" },
  material_ready: { label: "Material ready", variant: "accent" },
  generating_glossary: { label: "Generating glossary", variant: "accent" },
  glossary_ready: { label: "Glossary ready", variant: "primary" },
  generating_practice_questions: { label: "Generating practice", variant: "accent" },
  practice_ready: { label: "Practice ready", variant: "primary" },
  generating_exam_questions: { label: "Generating exam", variant: "accent" },
  exam_ready: { label: "Exam ready", variant: "primary" },
  failed: { label: "Failed", variant: "error" },
};

export const generationSteps = [
  {
    id: "research",
    title: "Research context",
    activeLabel: "Generating research context",
    doneLabel: "Research context generation done",
    waitingLabel: "Research context queued",
    generatingStatus: "generating_research",
    readyStatuses: [
      "research_ready",
      "generating_outline",
      "outline_ready",
      "modules_pending",
      "generating_material",
      "module_partial_ready",
      "modules_failed",
      "material_ready",
      "generating_glossary",
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "outline",
    title: "Study outline",
    activeLabel: "Generating study outline",
    doneLabel: "Study outline generation done",
    waitingLabel: "Study outline queued",
    generatingStatus: "generating_outline",
    readyStatuses: [
      "outline_ready",
      "modules_pending",
      "generating_material",
      "module_partial_ready",
      "modules_failed",
      "material_ready",
      "generating_glossary",
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "material",
    title: "Study material",
    activeLabel: "Generating study material",
    doneLabel: "Study material generation done",
    waitingLabel: "Study material queued",
    generatingStatus: "generating_material",
    activeStatuses: ["modules_pending", "generating_material"],
    readyStatuses: [
      "module_partial_ready",
      "material_ready",
      "generating_glossary",
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "glossary",
    title: "Glossary",
    activeLabel: "Generating glossary",
    doneLabel: "Glossary generation done",
    waitingLabel: "Glossary queued",
    generatingStatus: "generating_glossary",
    readyStatuses: [
      "glossary_ready",
      "generating_practice_questions",
      "practice_ready",
      "generating_exam_questions",
      "exam_ready",
    ],
  },
  {
    id: "practice",
    title: "Practice questions",
    activeLabel: "Generating practice questions",
    doneLabel: "Practice question generation done",
    waitingLabel: "Practice questions queued",
    generatingStatus: "generating_practice_questions",
    readyStatuses: ["practice_ready", "generating_exam_questions", "exam_ready"],
  },
  {
    id: "exam",
    title: "Exam questions",
    activeLabel: "Generating exam questions",
    doneLabel: "Exam question generation done",
    waitingLabel: "Exam questions queued",
    generatingStatus: "generating_exam_questions",
    readyStatuses: ["exam_ready"],
  },
];

export const visibleGenerationStatuses = new Set([
  "queued",
  "research_ready",
  "outline_ready",
  "modules_pending",
  "module_partial_ready",
  "modules_failed",
  "material_ready",
  "glossary_ready",
  "practice_ready",
  ...pollingStatuses,
]);

export const latestSetId = "__latest_questions__";
