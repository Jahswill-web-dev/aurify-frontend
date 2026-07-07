import { generationSteps, latestSetId } from "./constants";

export const getGenerationStepState = (status, step, index) => {
  if (step.readyStatuses.includes(status)) return "done";
  if (step.activeStatuses?.includes(status)) return "active";
  if (status === step.generatingStatus) return "active";
  if (status === "queued" && index === 0) return "active";
  return "waiting";
};

export const getActiveGenerationStep = (status) => {
  if (status === "queued") return generationSteps[0];
  return generationSteps.find(
    (step) => step.generatingStatus === status || step.activeStatuses?.includes(status)
  );
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

  if (typeof progress.percent_complete === "number") {
    return Math.round(clamp(progress.percent_complete));
  }

  const completed = [
    progress.material_completed,
    progress.practice_completed,
    progress.exam_completed,
  ].filter(Boolean).length;

  return Math.round((completed / 3) * 100);
}

const lessonFallbackProgress = {
  content_completed: false,
  practice_completed: false,
  completed: false,
  status: "not_started",
};

export const getModuleProgress = (module) => {
  const lessons = Array.isArray(module?.lessons) ? module.lessons : [];
  const embedded = module?.progress || {};

  const completedLessons =
    typeof embedded.completed_lessons === "number"
      ? embedded.completed_lessons
      : lessons.filter((lesson) => getLessonProgress(lesson).completed).length;
  const totalLessons =
    typeof embedded.total_lessons === "number"
      ? embedded.total_lessons
      : lessons.length;
  const percentComplete =
    typeof embedded.percent_complete === "number"
      ? embedded.percent_complete
      : totalLessons
        ? (completedLessons / totalLessons) * 100
        : 0;

  return {
    module_id: embedded.module_id || module?.id,
    completed_lessons: completedLessons,
    total_lessons: totalLessons,
    percent_complete: percentComplete,
    completed:
      typeof embedded.completed === "boolean"
        ? embedded.completed
        : totalLessons > 0 && completedLessons === totalLessons,
  };
};

export const getLessonProgress = (lesson) => ({
  ...lessonFallbackProgress,
  ...(lesson?.progress || {}),
  lesson_id: lesson?.progress?.lesson_id || lesson?.id,
});

export const getLessonProgressLabel = (progress) => {
  const status = progress?.status || "not_started";

  if (status === "completed") {
    return { label: "Completed", variant: "success" };
  }

  if (status === "practice_pending") {
    return { label: "Practice pending", variant: "accent" };
  }

  return { label: "Not started", variant: "neutral" };
};

const progressModuleMatches = (module, progressModule) =>
  Boolean(
    progressModule &&
      (progressModule.module_id === module?.id ||
        progressModule.id === module?.id ||
        String(progressModule.module_number || "") ===
          String(module?.module_number || ""))
  );

const progressLessonMatches = (lesson, progressLesson) =>
  Boolean(
    progressLesson &&
      (progressLesson.lesson_id === lesson?.id || progressLesson.id === lesson?.id)
  );

export const getPracticeQuestionForLesson = (module, lesson) => {
  const questions = Array.isArray(module?.practice_questions)
    ? module.practice_questions
    : [];

  return (
    questions.find((question) => question.lesson_id && question.lesson_id === lesson?.id) ||
    questions.find(
      (question) =>
        question.source_lesson &&
        lesson?.title &&
        question.source_lesson.toLowerCase() === lesson.title.toLowerCase()
    ) ||
    questions[0] ||
    null
  );
};

export const buildLessonProgressFromMaterial = (material) => {
  const modules = Array.isArray(material?.modules) ? material.modules : [];
  const progressModules = modules.map((module) => {
    const moduleProgress = getModuleProgress(module);

    return {
      ...moduleProgress,
      lessons: (module.lessons || []).map((lesson) => getLessonProgress(lesson)),
    };
  });

  const completedLessons = progressModules.reduce(
    (total, module) => total + (module.completed_lessons || 0),
    0
  );
  const totalLessons = progressModules.reduce(
    (total, module) => total + (module.total_lessons || 0),
    0
  );
  const completedModules = progressModules.filter((module) => module.completed).length;

  return {
    study_id: material?.study_id,
    completed_lessons: completedLessons,
    total_lessons: totalLessons,
    completed_modules: completedModules,
    total_modules: progressModules.length,
    percent_complete: totalLessons ? (completedLessons / totalLessons) * 100 : 0,
    modules: progressModules,
  };
};

export const mergeProgressIntoMaterial = (material, progressSnapshot) => {
  if (!material || !Array.isArray(material.modules) || !progressSnapshot?.modules) {
    return material;
  }

  return {
    ...material,
    modules: material.modules.map((module) => {
      const progressModule = progressSnapshot.modules.find((item) =>
        progressModuleMatches(module, item)
      );

      if (!progressModule) return module;

      return {
        ...module,
        progress: {
          module_id: progressModule.module_id || module.id,
          completed_lessons: progressModule.completed_lessons || 0,
          total_lessons:
            progressModule.total_lessons ||
            (Array.isArray(module.lessons) ? module.lessons.length : 0),
          percent_complete: progressModule.percent_complete || 0,
          completed: Boolean(progressModule.completed),
        },
        lessons: Array.isArray(module.lessons)
          ? module.lessons.map((lesson) => {
              const progressLesson = (progressModule.lessons || []).find((item) =>
                progressLessonMatches(lesson, item)
              );

              if (!progressLesson) return lesson;

              return {
                ...lesson,
                progress: {
                  ...lessonFallbackProgress,
                  ...progressLesson,
                  lesson_id: progressLesson.lesson_id || lesson.id,
                },
              };
            })
          : module.lessons,
      };
    }),
  };
};

export const mergeLessonCompletionIntoMaterial = (material, update) => {
  const lessonProgress = update?.lesson;
  const moduleProgress = update?.module;
  const practiceQuestion = update?.practice_question;

  if (!material || !lessonProgress?.lesson_id) return material;

  return {
    ...material,
    modules: (material.modules || []).map((module) => {
      const ownsLesson = (module.lessons || []).some(
        (lesson) => lesson.id === lessonProgress.lesson_id
      );
      const isProgressModule = moduleProgress && progressModuleMatches(module, moduleProgress);

      if (!ownsLesson && !isProgressModule) return module;

      const nextQuestions = practiceQuestion
        ? [
            ...(module.practice_questions || []).filter(
              (question) => question.id !== practiceQuestion.id
            ),
            practiceQuestion,
          ]
        : module.practice_questions;

      return {
        ...module,
        progress: isProgressModule
          ? {
              ...getModuleProgress(module),
              module_id: moduleProgress.module_id || module.id,
              completed_lessons: moduleProgress.completed_lessons || 0,
              total_lessons:
                moduleProgress.total_lessons ||
                (Array.isArray(module.lessons) ? module.lessons.length : 0),
              percent_complete: moduleProgress.percent_complete || 0,
              completed: Boolean(moduleProgress.completed),
            }
          : module.progress,
        practice_questions: nextQuestions,
        lessons: (module.lessons || []).map((lesson) =>
          lesson.id === lessonProgress.lesson_id
            ? {
                ...lesson,
                progress: {
                  ...lessonFallbackProgress,
                  ...lesson.progress,
                  ...lessonProgress,
                  lesson_id: lessonProgress.lesson_id,
                },
              }
            : lesson
        ),
      };
    }),
  };
};
