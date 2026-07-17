import { normalizeLessonPracticeQuestions } from "./lessonPracticeHelpers";

const scoreLabel = (score) => {
  if (score >= 90) return "Strong";
  if (score >= 75) return "Good";
  if (score >= 60) return "Developing";
  if (score >= 40) return "Weak";
  return "Very weak";
};

export const completeDemoLesson = (context) => {
  const questions = normalizeLessonPracticeQuestions({
    module: context.module,
    lesson: context.lesson,
  });
  const lessons = context.module.lessons || [];
  const completedLessons = lessons.filter(
    (lesson) => lesson.id !== context.lesson.id && lesson.progress?.completed
  ).length;

  return {
    lesson: {
      lesson_id: context.lesson.id,
      content_completed: true,
      practice_completed: false,
      completed: false,
      status: "practice_pending",
      practice_score: null,
      practice_score_label: null,
    },
    module: {
      module_id: context.module.id,
      completed_lessons: completedLessons,
      total_lessons: lessons.length,
      percent_complete: lessons.length ? (completedLessons / lessons.length) * 100 : 0,
      completed: false,
    },
    practice_questions: questions,
    practice_question: questions[0] || null,
    practice_progress: {
      answered_count: 0,
      correct_count: 0,
      total_questions: questions.length,
      remaining_count: questions.length,
      score: 0,
      score_label: "Very weak",
      completed: false,
    },
  };
};

export const submitDemoLessonAnswer = ({ context, state, question, answer }) => {
  const questions = state.questions || [];
  const answered = new Set(state.answeredQuestionIds || []);
  const correct = new Set(state.correctQuestionIds || []);
  answered.add(question.id);
  if (answer === question.correct_answer) correct.add(question.id);
  else correct.delete(question.id);

  const total = questions.length;
  const completed = total > 0 && answered.size === total;
  const score = total ? (correct.size / total) * 100 : 0;
  const lessons = context.module.lessons || [];
  const completedLessons = lessons.filter(
    (lesson) => lesson.id === context.lesson.id ? completed : lesson.progress?.completed
  ).length;
  const nextQuestion = questions.find((item) => !answered.has(item.id)) || null;

  return {
    feedback: {
      question_id: question.id,
      question: question.question,
      selected_answer: answer,
      correct_answer: question.correct_answer,
      is_correct: answer === question.correct_answer,
      explanation: question.explanation,
      difficulty: question.difficulty,
      weak_area: question.weak_area,
    },
    lesson: {
      lesson_id: context.lesson.id,
      content_completed: true,
      practice_completed: completed,
      completed,
      status: completed ? "completed" : "practice_pending",
      last_question_id: question.id,
      last_answer: answer,
      last_is_correct: answer === question.correct_answer,
      last_weak_area: question.weak_area,
      practice_score: completed ? score : null,
      practice_score_label: completed ? scoreLabel(score) : null,
    },
    module: {
      module_id: context.module.id,
      completed_lessons: completedLessons,
      total_lessons: lessons.length,
      percent_complete: lessons.length ? (completedLessons / lessons.length) * 100 : 0,
      completed: lessons.length > 0 && completedLessons === lessons.length,
    },
    practice_progress: {
      answered_count: answered.size,
      correct_count: correct.size,
      total_questions: total,
      remaining_count: Math.max(total - answered.size, 0),
      score,
      score_label: scoreLabel(score),
      completed,
    },
    next_question: nextQuestion,
    answeredQuestionIds: [...answered],
    correctQuestionIds: [...correct],
  };
};
