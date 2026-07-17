const asArray = (value) => (Array.isArray(value) ? value : []);

export const buildRevisionCheckpoints = (modules) => {
  const readyModules = asArray(modules)
    .filter((module) => module?.status === "ready")
    .sort(
      (first, second) =>
        Number(first?.module_number || 0) - Number(second?.module_number || 0)
    );

  const checkpoints = [];
  for (let index = 0; index < readyModules.length; index += 2) {
    const checkpointModules = readyModules.slice(index, index + 2);
    const first = checkpointModules[0];
    const last = checkpointModules[checkpointModules.length - 1];
    const lessons = checkpointModules.flatMap((module) =>
      asArray(module.lessons).map((lesson) => ({ module, lesson }))
    );

    checkpoints.push({
      id: `revision-checkpoint-${first.id || first.module_number}-${
        last.id || last.module_number
      }`,
      type: "revision-checkpoint",
      title:
        checkpointModules.length === 1
          ? `Module ${first.module_number} revision`
          : `Modules ${first.module_number}-${last.module_number} revision`,
      modules: checkpointModules,
      moduleIds: checkpointModules.map((module) => module.id),
      lessons,
      afterModuleNumber: Number(last.module_number || index + checkpointModules.length),
      lessonsComplete:
        lessons.length > 0 &&
        lessons.every(({ lesson }) => Boolean(lesson?.progress?.completed)),
    });
  }

  return checkpoints;
};

export const combineRevisionSets = (checkpoint, setsByLesson = {}) => {
  const entries = checkpoint.lessons.map(({ module, lesson }) => ({
    module,
    lesson,
    set: setsByLesson[lesson.id],
  }));
  const loaded = entries.every(({ set }) => Boolean(set));
  const questions = entries.flatMap(({ module, lesson, set }) =>
    asArray(set?.questions).map((question, index) => ({
      ...question,
      question_number: question.question_number || index + 1,
      sourceLessonId: lesson.id,
      sourceLessonTitle: lesson.title,
      sourceModuleId: module.id,
      sourceModuleNumber: module.module_number,
    }))
  );
  const hasFailed = entries.some(({ set }) => set?.status === "failed");
  const isGenerating = entries.some(({ set }) =>
    ["queued", "generating"].includes(set?.status)
  );
  const retryCount = entries.reduce(
    (highest, { set }) => Math.max(highest, Number(set?.retry_count || 0)),
    0
  );
  const automaticRetriesExhausted = entries.some(
    ({ set }) => set?.status === "failed" && Number(set?.retry_count || 0) >= 3
  );
  const completed =
    loaded &&
    !hasFailed &&
    !isGenerating &&
    entries.every(({ set }) =>
      asArray(set?.questions).length ? Boolean(set?.revision_progress?.completed) : true
    );

  return {
    ...checkpoint,
    loaded,
    questions,
    hasFailed,
    isGenerating,
    retryCount,
    automaticRetriesExhausted,
    empty: loaded && !hasFailed && !isGenerating && questions.length === 0,
    completed,
    answeredCount: entries.reduce(
      (total, { set }) => total + Number(set?.revision_progress?.answered_count || 0),
      0
    ),
    correctCount: entries.reduce(
      (total, { set }) => total + Number(set?.revision_progress?.correct_count || 0),
      0
    ),
  };
};

export const checkpointIsResolved = (checkpoint) =>
  Boolean(checkpoint?.completed || checkpoint?.empty || checkpoint?.skipped);

export const isModuleLockedByCheckpoints = (module, checkpoints) =>
  asArray(checkpoints).some(
    (checkpoint) =>
      checkpoint.afterModuleNumber < Number(module?.module_number || 0) &&
      (!checkpoint.lessonsComplete || !checkpointIsResolved(checkpoint))
  );

export const getNextUnansweredRevisionQuestion = (
  questions,
  answeredQuestionIds = []
) => {
  const answered = new Set(answeredQuestionIds);
  return asArray(questions).find((question) => !answered.has(question.id)) || null;
};
