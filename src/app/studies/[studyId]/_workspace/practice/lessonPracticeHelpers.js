const asArray = (value) => (Array.isArray(value) ? value : []);

const questionMatchesLesson = (question, lesson) => {
  if (!question || !lesson) return false;
  if (question.lesson_id) return question.lesson_id === lesson.id;

  return Boolean(
    question.source_lesson &&
      lesson.title &&
      question.source_lesson.toLowerCase() === lesson.title.toLowerCase()
  );
};

export const sortPracticeQuestions = (questions) =>
  asArray(questions)
    .map((question, index) => ({ question, index }))
    .sort((first, second) => {
      const firstNumber = Number(first.question?.question_number);
      const secondNumber = Number(second.question?.question_number);

      if (Number.isFinite(firstNumber) && Number.isFinite(secondNumber)) {
        return firstNumber - secondNumber;
      }

      if (Number.isFinite(firstNumber)) return -1;
      if (Number.isFinite(secondNumber)) return 1;
      return first.index - second.index;
    })
    .map(({ question }) => question);

export const normalizeLessonPracticeQuestions = ({
  payload,
  module,
  lesson,
} = {}) => {
  let questions = asArray(payload?.practice_questions);

  if (!questions.length && payload?.practice_question) {
    questions = [payload.practice_question];
  }

  if (!questions.length) {
    const embedded = asArray(module?.practice_questions);
    const matched = embedded.filter((question) =>
      questionMatchesLesson(question, lesson)
    );
    questions = matched.length ? matched : embedded.slice(0, 1);
  }

  const seen = new Set();
  return sortPracticeQuestions(questions).filter((question) => {
    const key = question?.id || question?.question;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getFirstLessonPracticeQuestion = (module, lesson) =>
  normalizeLessonPracticeQuestions({ module, lesson })[0] || null;

const progressModuleMatches = (module, progressModule) =>
  Boolean(
    progressModule &&
      (progressModule.module_id === module?.id ||
        progressModule.id === module?.id ||
        String(progressModule.module_number || "") ===
          String(module?.module_number || ""))
  );

export const mergeLessonPracticeUpdate = (material, update) => {
  const lessonProgress = update?.lesson;
  const moduleProgress = update?.module;

  if (!material || !lessonProgress?.lesson_id) return material;

  return {
    ...material,
    modules: asArray(material.modules).map((module) => {
      const ownsLesson = asArray(module.lessons).some(
        (lesson) => lesson.id === lessonProgress.lesson_id
      );
      const isProgressModule = progressModuleMatches(module, moduleProgress);

      if (!ownsLesson && !isProgressModule) return module;

      const returnedQuestions = normalizeLessonPracticeQuestions({
        payload: update,
        module,
        lesson: asArray(module.lessons).find(
          (item) => item.id === lessonProgress.lesson_id
        ),
      });
      const questionMap = new Map(
        asArray(module.practice_questions).map((question) => [
          question.id || question.question,
          question,
        ])
      );
      returnedQuestions.forEach((question) =>
        questionMap.set(question.id || question.question, question)
      );

      return {
        ...module,
        progress: isProgressModule
          ? {
              ...(module.progress || {}),
              ...moduleProgress,
              module_id: moduleProgress.module_id || module.id,
              completed: Boolean(moduleProgress.completed),
            }
          : module.progress,
        practice_questions: sortPracticeQuestions([...questionMap.values()]),
        lessons: asArray(module.lessons).map((lesson) =>
          lesson.id === lessonProgress.lesson_id
            ? {
                ...lesson,
                progress: {
                  content_completed: false,
                  practice_completed: false,
                  completed: false,
                  status: "not_started",
                  ...(lesson.progress || {}),
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

export const getNextQuestionIndex = (questions, nextQuestion, currentIndex) => {
  if (nextQuestion?.id) {
    const foundIndex = asArray(questions).findIndex(
      (question) => question.id === nextQuestion.id
    );
    if (foundIndex >= 0) return foundIndex;
  }

  return Math.min(currentIndex + 1, Math.max(asArray(questions).length - 1, 0));
};
