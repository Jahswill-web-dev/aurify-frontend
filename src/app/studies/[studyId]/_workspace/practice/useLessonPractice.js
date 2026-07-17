import { useCallback, useState } from "react";
import {
  completeLesson as completeLessonRequest,
  getUserFacingError,
  isAuthError,
  submitLessonPracticeAttempt,
} from "@/app/lib/aurifyApi";
import {
  getNextQuestionIndex,
  mergeLessonPracticeUpdate,
  normalizeLessonPracticeQuestions,
} from "./lessonPracticeHelpers";
import { completeDemoLesson, submitDemoLessonAnswer } from "./demoPracticeAdapter";

export function useLessonPractice({
  studyId,
  material,
  isDemo,
  setMaterialAndLessonProgress,
  refreshLessonProgress,
  onAuthRequired,
}) {
  const [lessonPracticeState, setLessonPracticeState] = useState({});

  const patchState = useCallback((lessonId, patch) => {
    setLessonPracticeState((current) => ({
      ...current,
      [lessonId]: {
        ...(current[lessonId] || {}),
        ...patch,
      },
    }));
  }, []);

  const findContext = useCallback(
    (lessonId) => {
      for (const studyModule of material?.modules || []) {
        const lesson = (studyModule.lessons || []).find(
          (item) => item.id === lessonId
        );
        if (lesson) return { module: studyModule, lesson };
      }
      return null;
    },
    [material]
  );

  const completeLesson = useCallback(
    async (lessonId) => {
      const context = findContext(lessonId);
      if (!context) return;

      patchState(lessonId, { completing: true, error: "", feedback: null });

      try {
        const result = isDemo
          ? completeDemoLesson(context)
          : await completeLessonRequest(studyId, lessonId);
        const questions = normalizeLessonPracticeQuestions({
          payload: result,
          module: context.module,
          lesson: context.lesson,
        });
        const nextMaterial = mergeLessonPracticeUpdate(material, result);
        setMaterialAndLessonProgress(nextMaterial);
        patchState(lessonId, {
          completing: false,
          questions,
          activeQuestionIndex: 0,
          selectedAnswer: "",
          feedback: null,
          practiceProgress: result.practice_progress || null,
          answeredQuestionIds: [],
          correctQuestionIds: [],
          nextQuestionId: questions[0]?.id || "",
          sessionId: `${lessonId}-${Date.now()}`,
          error: "",
        });
      } catch (error) {
        if (isAuthError(error)) onAuthRequired?.();
        else {
          patchState(lessonId, {
            completing: false,
            error: getUserFacingError(
              error,
              "Could not complete this lesson. Please try again."
            ),
          });
        }
      }
    }, [
      findContext,
      isDemo,
      material,
      onAuthRequired,
      patchState,
      setMaterialAndLessonProgress,
      studyId,
    ]
  );

  const selectAnswer = useCallback(
    (lessonId, answer) =>
      patchState(lessonId, { selectedAnswer: answer, error: "" }),
    [patchState]
  );

  const submitAnswer = useCallback(
    async (lessonId) => {
      const context = findContext(lessonId);
      const state = lessonPracticeState[lessonId] || {};
      const question = state.questions?.[state.activeQuestionIndex || 0];
      if (!context || !question?.id || !state.selectedAnswer) return;

      patchState(lessonId, { submitting: true, error: "" });

      try {
        const result = isDemo
          ? submitDemoLessonAnswer({
              context,
              state,
              question,
              answer: state.selectedAnswer,
            })
          : await submitLessonPracticeAttempt(studyId, lessonId, {
              question_id: question.id,
              answer: state.selectedAnswer,
            });
        const questions = [...(state.questions || [])];
        if (
          result.next_question?.id &&
          !questions.some((item) => item.id === result.next_question.id)
        ) {
          questions.push(result.next_question);
        }
        const nextMaterial = mergeLessonPracticeUpdate(material, result);
        setMaterialAndLessonProgress(nextMaterial);
        patchState(lessonId, {
          submitting: false,
          questions,
          feedback: result.feedback || null,
          practiceProgress: result.practice_progress || null,
          nextQuestionId: result.next_question?.id || "",
          answeredQuestionIds:
            result.answeredQuestionIds || [
              ...new Set([...(state.answeredQuestionIds || []), question.id]),
            ],
          correctQuestionIds:
            result.correctQuestionIds || state.correctQuestionIds || [],
          completed: Boolean(result.lesson?.completed),
          summary: result.lesson?.completed
            ? {
                score:
                  result.lesson.practice_score ?? result.practice_progress?.score ?? null,
                scoreLabel:
                  result.lesson.practice_score_label ||
                  result.practice_progress?.score_label ||
                  null,
              }
            : null,
          error: "",
        });

        if (!isDemo) await refreshLessonProgress?.(nextMaterial);
      } catch (error) {
        if (isAuthError(error)) onAuthRequired?.();
        else {
          patchState(lessonId, {
            submitting: false,
            error: getUserFacingError(
              error,
              "Could not submit this lesson practice answer. Please try again."
            ),
          });
        }
      }
    }, [
      findContext,
      isDemo,
      lessonPracticeState,
      material,
      onAuthRequired,
      patchState,
      refreshLessonProgress,
      setMaterialAndLessonProgress,
      studyId,
    ]
  );

  const advanceQuestion = useCallback(
    (lessonId) => {
      const state = lessonPracticeState[lessonId] || {};
      const nextIndex = getNextQuestionIndex(
        state.questions,
        { id: state.nextQuestionId },
        state.activeQuestionIndex || 0
      );
      patchState(lessonId, {
        activeQuestionIndex: nextIndex,
        selectedAnswer: "",
        feedback: null,
        error: "",
      });
    },
    [lessonPracticeState, patchState]
  );

  return {
    lessonPracticeState,
    completeLesson,
    selectAnswer,
    submitAnswer,
    advanceQuestion,
  };
}
