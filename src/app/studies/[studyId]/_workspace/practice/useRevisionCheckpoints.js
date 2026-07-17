import { useCallback, useEffect, useMemo, useState } from "react";
import {
  generateLessonRevisionPractice,
  getLessonRevisionPractice,
  getUserFacingError,
  isAuthError,
  submitLessonRevisionPracticeAttempt,
} from "@/app/lib/aurifyApi";
import { demoRevisionSetsByLesson } from "../demoData";
import {
  buildRevisionCheckpoints,
  checkpointIsResolved,
  combineRevisionSets,
  getNextUnansweredRevisionQuestion,
  isModuleLockedByCheckpoints,
} from "./revisionCheckpointHelpers";
import {
  readRevisionCheckpointSkips,
  saveRevisionCheckpointSkip,
} from "./revisionCheckpointStorage";

const emptyRevisionSet = (lessonId) => ({
  id: `empty-${lessonId}`,
  lesson_id: lessonId,
  status: "not_started",
  questions: [],
  revision_progress: {
    answered_count: 0,
    correct_count: 0,
    total_questions: 0,
    remaining_count: 0,
    score: 0,
    completed: true,
  },
});

const getInitiallyAnsweredIds = (checkpoint, setsByLesson) =>
  checkpoint.lessons.flatMap(({ lesson }) => {
    const set = setsByLesson[lesson.id];
    const count = Number(set?.revision_progress?.answered_count || 0);
    return (set?.questions || []).slice(0, count).map((question) => question.id);
  });

export function useRevisionCheckpoints({
  studyId,
  modules,
  isDemo,
  onAuthRequired,
}) {
  const definitions = useMemo(() => buildRevisionCheckpoints(modules), [modules]);
  const [checkpointStates, setCheckpointStates] = useState({});
  const [skipOverrides, setSkipOverrides] = useState({});

  useEffect(() => {
    setSkipOverrides(readRevisionCheckpointSkips(studyId));
  }, [studyId]);

  const loadCheckpoint = useCallback(
    async (checkpoint, { force = false } = {}) => {
      if (!checkpoint?.lessonsComplete) return;

      setCheckpointStates((current) => {
        if (!force && (current[checkpoint.id]?.loading || current[checkpoint.id]?.hasLoaded)) {
          return current;
        }
        return {
          ...current,
          [checkpoint.id]: {
            ...(current[checkpoint.id] || {}),
            loading: true,
            error: "",
          },
        };
      });

      try {
        const entries = await Promise.all(
          checkpoint.lessons.map(async ({ lesson }) => {
            if (isDemo) {
              return [
                lesson.id,
                structuredClone(
                  demoRevisionSetsByLesson[lesson.id] || emptyRevisionSet(lesson.id)
                ),
              ];
            }

            try {
              return [lesson.id, await getLessonRevisionPractice(studyId, lesson.id)];
            } catch (error) {
              if (error?.status === 404) return [lesson.id, emptyRevisionSet(lesson.id)];
              throw error;
            }
          })
        );
        const setsByLesson = Object.fromEntries(entries);
        setCheckpointStates((current) => ({
          ...current,
          [checkpoint.id]: {
            ...(current[checkpoint.id] || {}),
            loading: false,
            retrying: false,
            hasLoaded: true,
            setsByLesson,
            answeredQuestionIds: getInitiallyAnsweredIds(checkpoint, setsByLesson),
            currentQuestionId: "",
            selectedAnswer: "",
            feedback: null,
            error: "",
          },
        }));
      } catch (error) {
        if (isAuthError(error)) onAuthRequired?.();
        setCheckpointStates((current) => ({
          ...current,
          [checkpoint.id]: {
            ...(current[checkpoint.id] || {}),
            loading: false,
            hasLoaded: true,
            error: getUserFacingError(
              error,
              "Could not load this revision checkpoint. Please try again."
            ),
          },
        }));
      }
    },
    [isDemo, onAuthRequired, studyId]
  );

  useEffect(() => {
    definitions.forEach((checkpoint) => {
      if (
        checkpoint.lessonsComplete &&
        !checkpointStates[checkpoint.id]?.hasLoaded &&
        !checkpointStates[checkpoint.id]?.loading
      ) {
        loadCheckpoint(checkpoint);
      }
    });
  }, [checkpointStates, definitions, loadCheckpoint]);

  const revisionCheckpoints = useMemo(
    () =>
      definitions.map((definition) => {
        const state = checkpointStates[definition.id] || {};
        const combined = combineRevisionSets(definition, state.setsByLesson);
        const skipped = Boolean(skipOverrides[definition.id]);
        const currentQuestion =
          combined.questions.find(
            (question) => question.id === state.currentQuestionId
          ) ||
          getNextUnansweredRevisionQuestion(
            combined.questions,
            state.answeredQuestionIds
          );

        return {
          ...combined,
          ...state,
          skipped,
          currentQuestion,
          resolved: checkpointIsResolved({ ...combined, skipped }),
        };
      }),
    [checkpointStates, definitions, skipOverrides]
  );

  useEffect(() => {
    const generating = revisionCheckpoints.filter(
      (checkpoint) => checkpoint.lessonsComplete && checkpoint.isGenerating
    );
    if (!generating.length || isDemo) return undefined;

    const interval = window.setInterval(() => {
      generating.forEach((checkpoint) => loadCheckpoint(checkpoint, { force: true }));
    }, 4000);
    return () => window.clearInterval(interval);
  }, [isDemo, loadCheckpoint, revisionCheckpoints]);

  const selectAnswer = useCallback((checkpointId, answer) => {
    setCheckpointStates((current) => ({
      ...current,
      [checkpointId]: {
        ...(current[checkpointId] || {}),
        selectedAnswer: answer,
        error: "",
      },
    }));
  }, []);

  const submitAnswer = useCallback(
    async (checkpointId) => {
      const checkpoint = revisionCheckpoints.find((item) => item.id === checkpointId);
      const question = checkpoint?.currentQuestion;
      const answer = checkpoint?.selectedAnswer;
      if (!question?.id || !answer) return;

      setCheckpointStates((current) => ({
        ...current,
        [checkpointId]: {
          ...(current[checkpointId] || {}),
          submitting: true,
          error: "",
        },
      }));

      try {
        const result = isDemo
          ? {
              feedback: {
                question_id: question.id,
                question: question.question,
                selected_answer: answer,
                correct_answer: question.correct_answer,
                is_correct: answer === question.correct_answer,
                explanation: question.explanation,
                difficulty: question.difficulty,
                weak_area: question.weak_area,
                original_question_id: question.original_question_id,
              },
            }
          : await submitLessonRevisionPracticeAttempt(
              studyId,
              question.sourceLessonId,
              { question_id: question.id, answer }
            );

        setCheckpointStates((current) => {
          const state = current[checkpointId] || {};
          const answered = [
            ...new Set([...(state.answeredQuestionIds || []), question.id]),
          ];
          const correctQuestionIds = new Set(state.correctQuestionIds || []);
          if (answer === question.correct_answer) correctQuestionIds.add(question.id);
          else correctQuestionIds.delete(question.id);
          const sourceSet = state.setsByLesson?.[question.sourceLessonId];
          const sourceQuestions = sourceSet?.questions || [];
          const sourceAnswered = sourceQuestions.filter((item) =>
            answered.includes(item.id)
          ).length;
          const sourceCorrect = sourceQuestions.filter((item) => {
            return correctQuestionIds.has(item.id);
          }).length;
          const progress = result.revision_progress || {
            answered_count: sourceAnswered,
            correct_count: sourceCorrect,
            total_questions: sourceQuestions.length,
            remaining_count: Math.max(sourceQuestions.length - sourceAnswered, 0),
            score: sourceQuestions.length
              ? (sourceCorrect / sourceQuestions.length) * 100
              : 0,
            completed: sourceQuestions.length > 0 && sourceAnswered === sourceQuestions.length,
          };

          return {
            ...current,
            [checkpointId]: {
              ...state,
              submitting: false,
              answeredQuestionIds: answered,
              correctQuestionIds: [...correctQuestionIds],
              feedback: result.feedback || null,
              setsByLesson: {
                ...(state.setsByLesson || {}),
                [question.sourceLessonId]: {
                  ...sourceSet,
                  revision_progress: progress,
                },
              },
              error: "",
            },
          };
        });
      } catch (error) {
        if (isAuthError(error)) onAuthRequired?.();
        setCheckpointStates((current) => ({
          ...current,
          [checkpointId]: {
            ...(current[checkpointId] || {}),
            submitting: false,
            error: getUserFacingError(
              error,
              "Could not submit this revision answer. Please try again."
            ),
          },
        }));
      }
    },
    [isDemo, onAuthRequired, revisionCheckpoints, studyId]
  );

  const advanceQuestion = useCallback(
    (checkpointId) => {
      const checkpoint = revisionCheckpoints.find((item) => item.id === checkpointId);
      const next = getNextUnansweredRevisionQuestion(
        checkpoint?.questions,
        checkpoint?.answeredQuestionIds
      );
      setCheckpointStates((current) => ({
        ...current,
        [checkpointId]: {
          ...(current[checkpointId] || {}),
          currentQuestionId: next?.id || "",
          selectedAnswer: "",
          feedback: null,
        },
      }));
    },
    [revisionCheckpoints]
  );

  const retryCheckpoint = useCallback(
    async (checkpointId) => {
      const checkpoint = revisionCheckpoints.find((item) => item.id === checkpointId);
      if (!checkpoint) return;
      const failedLessonIds = checkpoint.lessons
        .filter(({ lesson }) => checkpoint.setsByLesson?.[lesson.id]?.status === "failed")
        .map(({ lesson }) => lesson.id);

      setCheckpointStates((current) => ({
        ...current,
        [checkpointId]: {
          ...(current[checkpointId] || {}),
          retrying: true,
          retryAttempted: true,
          error: "",
        },
      }));

      try {
        if (!isDemo) {
          await Promise.all(
            failedLessonIds.map((lessonId) =>
              generateLessonRevisionPractice(studyId, lessonId)
            )
          );
        }
        await loadCheckpoint(checkpoint, { force: true });
      } catch (error) {
        if (isAuthError(error)) onAuthRequired?.();
        setCheckpointStates((current) => ({
          ...current,
          [checkpointId]: {
            ...(current[checkpointId] || {}),
            retrying: false,
            retryAttempted: true,
            error: getUserFacingError(
              error,
              "Revision generation failed again. You can continue without it."
            ),
          },
        }));
      }
    },
    [isDemo, loadCheckpoint, onAuthRequired, revisionCheckpoints, studyId]
  );

  const skipCheckpoint = useCallback(
    (checkpointId) => {
      saveRevisionCheckpointSkip(studyId, checkpointId);
      setSkipOverrides((current) => ({ ...current, [checkpointId]: true }));
    },
    [studyId]
  );

  const isModuleLocked = useCallback(
    (module) => isModuleLockedByCheckpoints(module, revisionCheckpoints),
    [revisionCheckpoints]
  );

  return {
    revisionCheckpoints,
    isModuleLocked,
    loadCheckpoint,
    selectRevisionAnswer: selectAnswer,
    submitRevisionAnswer: submitAnswer,
    advanceRevisionQuestion: advanceQuestion,
    retryCheckpoint,
    skipCheckpoint,
  };
}
