import { generationSteps, latestSetId } from "./constants";

export const getGenerationStepState = (status, step, index) => {
  if (step.readyStatuses.includes(status)) return "done";
  if (status === step.generatingStatus) return "active";
  if (status === "queued" && index === 0) return "active";
  return "waiting";
};

export const getActiveGenerationStep = (status) => {
  if (status === "queued") return generationSteps[0];
  return generationSteps.find((step) => step.generatingStatus === status);
};

export const getNextGenerationStep = (status) =>
  generationSteps.find((step, index) => getGenerationStepState(status, step, index) === "waiting");

export const clamp = (value) => Math.max(0, Math.min(100, value));
export const clampQuestionCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 5;
  return Math.max(5, Math.min(30, parsed));
};

export const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const hasGeneratingSet = (sets) =>
  sets.some((set) => set.status === "queued" || set.status === "generating");

export const getReadySets = (sets) => sets.filter((set) => set.status === "ready");

export const getSetQuestionCount = (set, fallback = 0) =>
  set?.question_count || set?.generated_question_count || set?.questions_count || fallback;

export const getQuestionSetCards = ({ mode, sets, questions }) => {
  const label = mode === "practice" ? "Practice Set" : "Exam Set";
  const readySets = getReadySets(sets);

  if (readySets.length) {
    return readySets.map((set, index) => ({
      ...set,
      title: set.title || `${label} ${index + 1}`,
      questionCount: getSetQuestionCount(set),
      isFallback: false,
    }));
  }

  if (questions.length) {
    return [
      {
        id: latestSetId,
        title: mode === "practice" ? "Latest Practice" : "Latest Exam",
        questionCount: questions.length,
        status: "ready",
        isFallback: true,
      },
    ];
  }

  return [];
};

export function getTitle(study) {
  return study?.title || study?.topic || "Untitled Study";
}

export function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getProgressValue(progress) {
  if (typeof progress === "number") return clamp(progress);
  if (!progress || typeof progress !== "object") return 0;

  const completed = [
    progress.material_completed,
    progress.practice_completed,
    progress.exam_completed,
  ].filter(Boolean).length;

  return Math.round((completed / 3) * 100);
}
