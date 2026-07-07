"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import {
  completeLesson,
  generateExamQuestionSet,
  generatePracticeQuestionSet,
  getExamQuestions,
  getExamQuestionSetQuestions,
  getPracticeQuestions,
  getPracticeQuestionSetQuestions,
  getStudy,
  getStudyGlossary,
  getStudyMaterial,
  getStudyProgress,
  getUserFacingError,
  hasAccessToken,
  isAuthError,
  listExamQuestionSets,
  listPracticeQuestionSets,
  regenerateStudyGlossary,
  resumeStudyGeneration,
  submitExamAttempt,
  submitLessonPracticeAttempt,
  submitPracticeAttempt,
} from "@/app/lib/aurifyApi";
import { AnalyticsTab } from "./_workspace/AnalyticsTab";
import {
  glossaryReadyStatuses,
  latestSetId,
  materialReadyStatuses,
  pollingStatuses,
  practiceReadyStatuses,
  workspaceTabs,
} from "./_workspace/constants";
import { CoursePlayerWorkspace } from "./_workspace/CoursePlayerWorkspace";
import { ExamTab } from "./_workspace/ExamTab";
import { GlossaryTab } from "./_workspace/GlossaryTab";
import {
  buildLessonProgressFromMaterial,
  clampQuestionCount,
  getPracticeQuestionForLesson,
  getProgressValue,
  getReadySets,
  hasGeneratingSet,
  mergeLessonCompletionIntoMaterial,
  mergeProgressIntoMaterial,
  normalizeList,
} from "./_workspace/helpers";
import { PracticeTab } from "./_workspace/PracticeTab";
import { ErrorState, GenerationNotice, LoadingState, WorkspaceHeader } from "./_workspace/WorkspaceShell";
import {
  createDemoQuestionSet,
  demoExamQuestionSets,
  demoExamQuestions,
  demoGlossary,
  demoMaterial,
  demoPracticeQuestions,
  demoPracticeQuestionSets,
  demoStudy,
  isDemoStudyId,
} from "./_workspace/demoData";

export default function StudyWorkspaceClient({ studyId }) {
  const isDemo = isDemoStudyId(studyId);
  const [activeTab, setActiveTab] = useState("learn");
  const [study, setStudy] = useState(null);
  const [material, setMaterial] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(null);
  const [lessonPracticeState, setLessonPracticeState] = useState({});
  const [glossary, setGlossary] = useState(null);
  const [glossaryLoading, setGlossaryLoading] = useState(false);
  const [glossaryError, setGlossaryError] = useState("");
  const [practiceQuestionSets, setPracticeQuestionSets] = useState([]);
  const [selectedPracticeSetId, setSelectedPracticeSetId] = useState("");
  const [practiceSetTitle, setPracticeSetTitle] = useState("");
  const [practiceSetCount, setPracticeSetCount] = useState("");
  const [practiceSetGenerating, setPracticeSetGenerating] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceError, setPracticeError] = useState("");
  const [activePracticeIndex, setActivePracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceSubmitLoading, setPracticeSubmitLoading] = useState(false);
  const [practiceSubmitError, setPracticeSubmitError] = useState("");
  const [practiceAttemptResult, setPracticeAttemptResult] = useState(null);
  const [activePracticeView, setActivePracticeView] = useState("sets");
  const [examQuestionSets, setExamQuestionSets] = useState([]);
  const [selectedExamSetId, setSelectedExamSetId] = useState("");
  const [examSetTitle, setExamSetTitle] = useState("");
  const [examSetCount, setExamSetCount] = useState("");
  const [examSetGenerating, setExamSetGenerating] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState("");
  const [activeExamIndex, setActiveExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examStarted, setExamStarted] = useState(false);
  const [selectedExamTimer, setSelectedExamTimer] = useState(0);
  const [examSecondsRemaining, setExamSecondsRemaining] = useState(0);
  const [examTimedOut, setExamTimedOut] = useState(false);
  const [examSubmitLoading, setExamSubmitLoading] = useState(false);
  const [examSubmitError, setExamSubmitError] = useState("");
  const [examAttemptResult, setExamAttemptResult] = useState(null);
  const [activeExamView, setActiveExamView] = useState("sets");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [glossaryRegenerating, setGlossaryRegenerating] = useState(false);

  const progress = useMemo(
    () => getProgressValue(lessonProgress || study?.progress),
    [lessonProgress, study]
  );
  const shouldPoll = study ? pollingStatuses.has(study.status) : false;
  const shouldPollQuestionSets =
    !isDemo &&
    (hasGeneratingSet(practiceQuestionSets) || hasGeneratingSet(examQuestionSets));

  const setMaterialAndLessonProgress = useCallback((nextMaterial, progressSnapshot) => {
    if (!nextMaterial) {
      setMaterial(null);
      setLessonProgress(null);
      return null;
    }

    const nextMaterialWithProgress = progressSnapshot
      ? mergeProgressIntoMaterial(nextMaterial, progressSnapshot)
      : nextMaterial;
    const nextProgress =
      progressSnapshot || buildLessonProgressFromMaterial(nextMaterialWithProgress);

    setMaterial(nextMaterialWithProgress);
    setLessonProgress(nextProgress);
    return nextMaterialWithProgress;
  }, []);

  const refreshLessonProgress = useCallback(
    async (baseMaterial) => {
      if (!baseMaterial) {
        setLessonProgress(null);
        return null;
      }

      if (isDemo) {
        const nextProgress = buildLessonProgressFromMaterial(baseMaterial);
        setMaterialAndLessonProgress(baseMaterial, nextProgress);
        return nextProgress;
      }

      try {
        const nextProgress = await getStudyProgress(studyId);
        setMaterialAndLessonProgress(baseMaterial, nextProgress);
        return nextProgress;
      } catch (err) {
        if (isAuthError(err)) {
          setAuthRequired(true);
          return null;
        }

        console.error("Could not refresh lesson progress", err);
        const fallbackProgress = buildLessonProgressFromMaterial(baseMaterial);
        setMaterialAndLessonProgress(baseMaterial, fallbackProgress);
        return fallbackProgress;
      }
    },
    [isDemo, setMaterialAndLessonProgress, studyId]
  );

  const loadGlossary = useCallback(async () => {
    if (isDemo) {
      setGlossary(demoGlossary);
      setGlossaryError("");
      setGlossaryLoading(false);
      return;
    }

    setGlossaryLoading(true);
    setGlossaryError("");

    try {
      const data = await getStudyGlossary(studyId);
      setGlossary(data);

      if (!Array.isArray(data?.terms) || !data.terms.length) {
        setGlossaryError("No glossary terms were returned for this Study.");
      }
    } catch (err) {
      if (err.status === 404) {
        setGlossary(null);
        setGlossaryError("Glossary terms are not available yet.");
      } else if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not load glossary terms", err);
        setGlossaryError(
          getUserFacingError(err, "Could not load glossary terms. Please try again.")
        );
      }
    } finally {
      setGlossaryLoading(false);
    }
  }, [isDemo, studyId]);

  const loadPracticeQuestions = useCallback(async () => {
    if (isDemo) {
      setPracticeQuestionSets(demoPracticeQuestionSets);
      setSelectedPracticeSetId((current) => current || demoPracticeQuestionSets[0]?.id || "");
      setPracticeQuestions(demoPracticeQuestions);
      setPracticeError("");
      setPracticeLoading(false);
      return;
    }

    setPracticeLoading(true);
    setPracticeError("");

    try {
      try {
        const setsData = await listPracticeQuestionSets(studyId);
        const nextSets = normalizeList(setsData);
        const readySets = getReadySets(nextSets);
        const selectedReadySet = readySets.find(
          (set) => set.id === selectedPracticeSetId
        );
        const nextSelectedSet =
          selectedReadySet ||
          (!selectedPracticeSetId ? readySets[readySets.length - 1] : null);

        setPracticeQuestionSets(nextSets);

        if (nextSelectedSet?.id) {
          const setQuestions = await getPracticeQuestionSetQuestions(
            studyId,
            nextSelectedSet.id
          );
          const nextQuestions = normalizeList(setQuestions);
          setSelectedPracticeSetId(nextSelectedSet.id);
          setPracticeQuestions(nextQuestions);

          if (!nextQuestions.length) {
            setPracticeError("No practice questions were returned for this set.");
          }

          return;
        }
      } catch (setErr) {
        if (isAuthError(setErr)) throw setErr;
      }

      const data = await getPracticeQuestions(studyId);
      const nextQuestions = normalizeList(data);
      setPracticeQuestions(nextQuestions);

      if (!nextQuestions.length) {
        setPracticeError("No practice questions were returned for this Study.");
      }
    } catch (err) {
      if (err.status === 404) {
        setPracticeQuestions([]);
        setPracticeError("Practice questions are not available yet.");
      } else if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not load practice questions", err);
        setPracticeError(
          getUserFacingError(err, "Could not load practice questions. Please try again.")
        );
      }
    } finally {
      setPracticeLoading(false);
    }
  }, [isDemo, selectedPracticeSetId, studyId]);

  const loadExamQuestions = useCallback(async () => {
    if (isDemo) {
      setExamQuestionSets(demoExamQuestionSets);
      setSelectedExamSetId((current) => current || demoExamQuestionSets[0]?.id || "");
      setExamQuestions(demoExamQuestions);
      setExamError("");
      setExamLoading(false);
      return;
    }

    setExamLoading(true);
    setExamError("");

    try {
      try {
        const setsData = await listExamQuestionSets(studyId);
        const nextSets = normalizeList(setsData);
        const readySets = getReadySets(nextSets);
        const selectedReadySet = readySets.find((set) => set.id === selectedExamSetId);
        const nextSelectedSet =
          selectedReadySet ||
          (!selectedExamSetId ? readySets[readySets.length - 1] : null);

        setExamQuestionSets(nextSets);

        if (nextSelectedSet?.id) {
          const setQuestions = await getExamQuestionSetQuestions(
            studyId,
            nextSelectedSet.id
          );
          const nextQuestions = normalizeList(setQuestions);
          setSelectedExamSetId(nextSelectedSet.id);
          setExamQuestions(nextQuestions);

          if (!nextQuestions.length) {
            setExamError("No exam questions were returned for this set.");
          }

          return;
        }
      } catch (setErr) {
        if (isAuthError(setErr)) throw setErr;
      }

      const data = await getExamQuestions(studyId);
      const nextQuestions = normalizeList(data);
      setExamQuestions(nextQuestions);

      if (!nextQuestions.length) {
        setExamError("No exam questions were returned for this Study.");
      }
    } catch (err) {
      if (err.status === 404) {
        setExamQuestions([]);
        setExamError("Exam questions are not available yet.");
      } else if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not load exam questions", err);
        setExamError(
          getUserFacingError(err, "Could not load exam questions. Please try again.")
        );
      }
    } finally {
      setExamLoading(false);
    }
  }, [isDemo, selectedExamSetId, studyId]);

  const loadStudy = useCallback(
    async ({ showLoading = false } = {}) => {
      if (showLoading) setLoading(true);
      setError("");
      setAuthRequired(false);

      if (isDemo) {
        setStudy(demoStudy);
        setMaterialAndLessonProgress(demoMaterial);
        setGlossary(demoGlossary);
        setPracticeQuestionSets(demoPracticeQuestionSets);
        setSelectedPracticeSetId((current) => current || demoPracticeQuestionSets[0]?.id || "");
        setPracticeQuestions(demoPracticeQuestions);
        setExamQuestionSets(demoExamQuestionSets);
        setSelectedExamSetId((current) => current || demoExamQuestionSets[0]?.id || "");
        setExamQuestions(demoExamQuestions);
        setLoading(false);
        return;
      }

      if (!hasAccessToken()) {
        setStudy(null);
        setMaterial(null);
        setLessonProgress(null);
        setGlossary(null);
        setPracticeQuestionSets([]);
        setPracticeQuestions([]);
        setExamQuestionSets([]);
        setExamQuestions([]);
        setAuthRequired(true);
        setLoading(false);
        return;
      }

      try {
        const nextStudy = await getStudy(studyId);
        setStudy(nextStudy);

        if (materialReadyStatuses.has(nextStudy.status)) {
          try {
            const nextMaterial = await getStudyMaterial(studyId);
            setMaterialAndLessonProgress(nextMaterial);
            await refreshLessonProgress(nextMaterial);
          } catch (err) {
            if (err.status !== 404) throw err;
            setMaterial(null);
            setLessonProgress(null);
          }
        } else {
          setMaterial(null);
          setLessonProgress(null);
        }

        if (glossaryReadyStatuses.has(nextStudy.status)) {
          await loadGlossary();
        } else {
          setGlossary(null);
        }

        if (practiceReadyStatuses.has(nextStudy.status)) {
          await loadPracticeQuestions();
        } else {
          setPracticeQuestionSets([]);
          setPracticeQuestions([]);
        }

        if (nextStudy.status === "exam_ready") {
          await loadExamQuestions();
        } else {
          setExamQuestionSets([]);
          setExamQuestions([]);
        }
      } catch (err) {
        if (isAuthError(err)) {
          setStudy(null);
          setMaterial(null);
          setLessonProgress(null);
          setGlossary(null);
          setPracticeQuestionSets([]);
          setPracticeQuestions([]);
          setExamQuestionSets([]);
          setExamQuestions([]);
          setAuthRequired(true);
        } else if (err.status === 404) {
          setError("This Study was not found.");
        } else {
          console.error("Could not load Study workspace", err);
          setError(getUserFacingError(err, "Could not load this Study. Please try again."));
        }
      } finally {
        setLoading(false);
      }
    },
    [
      isDemo,
      loadExamQuestions,
      loadGlossary,
      loadPracticeQuestions,
      refreshLessonProgress,
      setMaterialAndLessonProgress,
      studyId,
    ]
  );

  useEffect(() => {
    loadStudy({ showLoading: true });
  }, [loadStudy]);

  useEffect(() => {
    if (!shouldPoll) return undefined;

    const interval = window.setInterval(() => {
      loadStudy();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [loadStudy, shouldPoll]);

  useEffect(() => {
    if (!shouldPollQuestionSets) return undefined;

    const interval = window.setInterval(() => {
      if (practiceQuestionSets.length) loadPracticeQuestions();
      if (examQuestionSets.length) loadExamQuestions();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [
    examQuestionSets.length,
    loadExamQuestions,
    loadPracticeQuestions,
    practiceQuestionSets.length,
    shouldPollQuestionSets,
  ]);

  useEffect(() => {
    if (
      !examStarted ||
      !selectedExamTimer ||
      examTimedOut ||
      examAttemptResult ||
      examSubmitLoading
    ) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setExamSecondsRemaining((current) => {
        if (current <= 1) {
          setExamTimedOut(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [
    examAttemptResult,
    examStarted,
    examSubmitLoading,
    examTimedOut,
    selectedExamTimer,
  ]);

  const handleResume = async () => {
    setResumeLoading(true);
    setError("");
    setGlossaryError("");
    setPracticeError("");
    setExamError("");
    setAuthRequired(false);

    if (isDemo) {
      window.setTimeout(() => {
        setStudy({
          ...demoStudy,
          status: "exam_ready",
          generation_error: null,
          progress: {
            ...demoStudy.progress,
            practice_completed: true,
          },
        });
        setMaterialAndLessonProgress({
          ...demoMaterial,
          modules: demoMaterial.modules.map((module) =>
            module.status === "failed"
              ? {
                  ...module,
                  status: "ready",
                  generation_error: null,
                  progress: {
                    module_id: "demo-module-3",
                    completed_lessons: 0,
                    total_lessons: 1,
                    percent_complete: 0,
                    completed: false,
                  },
                  lessons: [
                    {
                      id: "demo-lesson-5",
                      lesson_number: 1,
                      title: "Left And Right Limits",
                      content:
                        "One-sided limits ask what happens from only one direction. If the left-hand and right-hand limits match, the two-sided limit exists.",
                      estimated_minutes: 7,
                      key_takeaways: [
                        "Left-hand limits approach from smaller x-values.",
                        "Right-hand limits approach from larger x-values.",
                        "The two-sided limit needs both sides to agree.",
                      ],
                      progress: {
                        lesson_id: "demo-lesson-5",
                        content_completed: false,
                        practice_completed: false,
                        completed: false,
                        status: "not_started",
                      },
                    },
                  ],
                  practice_questions: [
                    {
                      id: "demo-module-question-3",
                      lesson_id: "demo-lesson-5",
                      question: "When does a two-sided limit exist?",
                      options: [
                        "When both one-sided limits match",
                        "When only the left side exists",
                        "When the graph is colorful",
                        "When f(a) is undefined",
                      ],
                      correct_answer: "When both one-sided limits match",
                      explanation:
                        "The left-hand and right-hand limits must approach the same value.",
                      difficulty: "medium",
                      weak_area: "one-sided limits",
                    },
                  ],
                }
              : module
          ),
        });
        setResumeLoading(false);
      }, 700);
      return;
    }

    try {
      const nextStudy = await resumeStudyGeneration(studyId);
      setStudy(nextStudy);
      setMaterial(null);
      setGlossary(null);
      setPracticeQuestionSets([]);
      setPracticeQuestions([]);
      setExamQuestionSets([]);
      setExamQuestions([]);
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not resume Study generation", err);
        setError(getUserFacingError(err, "Could not resume generation. Please try again."));
      }
    } finally {
      setResumeLoading(false);
    }
  };

  const handleRegenerateGlossary = async () => {
    setGlossaryRegenerating(true);
    setError("");
    setGlossaryError("");
    setAuthRequired(false);

    try {
      const nextStudy = await regenerateStudyGlossary(studyId);
      setStudy(nextStudy);
      setGlossary(null);

      if (glossaryReadyStatuses.has(nextStudy?.status)) {
        await loadGlossary();
      }
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not regenerate glossary terms", err);
        setGlossaryError(
          getUserFacingError(
            err,
            "Could not regenerate glossary terms. Please try again."
          )
        );
      }
    } finally {
      setGlossaryRegenerating(false);
    }
  };

  const findLessonContext = useCallback(
    (lessonId) => {
      const modules = Array.isArray(material?.modules) ? material.modules : [];

      for (const studyModule of modules) {
        const lesson = (studyModule.lessons || []).find(
          (item) => item.id === lessonId
        );
        if (lesson) return { module: studyModule, lesson };
      }

      return null;
    },
    [material]
  );

  const patchLessonPracticeState = (lessonId, patch) => {
    setLessonPracticeState((current) => ({
      ...current,
      [lessonId]: {
        ...(current[lessonId] || {}),
        ...patch,
      },
    }));
  };

  const handleCompleteLesson = async (lessonId) => {
    const context = findLessonContext(lessonId);
    if (!context) return;

    patchLessonPracticeState(lessonId, {
      completing: true,
      error: "",
      feedback: null,
    });

    try {
      let result;

      if (isDemo) {
        const question = getPracticeQuestionForLesson(context.module, context.lesson);
        const totalLessons = context.module.lessons?.length || 0;
        const completedLessons = (context.module.lessons || []).filter(
          (lesson) => lesson.id !== lessonId && lesson.progress?.completed
        ).length;

        result = {
          lesson: {
            lesson_id: lessonId,
            content_completed: true,
            practice_completed: false,
            completed: false,
            status: "practice_pending",
          },
          module: {
            module_id: context.module.id,
            completed_lessons: completedLessons,
            total_lessons: totalLessons,
            percent_complete: totalLessons
              ? (completedLessons / totalLessons) * 100
              : 0,
            completed: false,
          },
          practice_question: question
            ? { ...question, lesson_id: question.lesson_id || lessonId }
            : null,
        };
      } else {
        result = await completeLesson(studyId, lessonId);
      }

      const nextMaterial = mergeLessonCompletionIntoMaterial(material, result);
      setMaterialAndLessonProgress(nextMaterial);
      patchLessonPracticeState(lessonId, {
        completing: false,
        question: result.practice_question || null,
        selectedAnswer: "",
        feedback: null,
        error: "",
      });
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not complete lesson", err);
        patchLessonPracticeState(lessonId, {
          completing: false,
          error: getUserFacingError(
            err,
            "Could not complete this lesson. Please try again."
          ),
        });
      }
    }
  };

  const handleSelectLessonPracticeAnswer = (lessonId, answer) => {
    patchLessonPracticeState(lessonId, {
      selectedAnswer: answer,
      error: "",
    });
  };

  const handleSubmitLessonPracticeAnswer = async (lessonId) => {
    const context = findLessonContext(lessonId);
    const state = lessonPracticeState[lessonId] || {};
    const question =
      state.question || getPracticeQuestionForLesson(context?.module, context?.lesson);
    const selectedAnswer = state.selectedAnswer;

    if (!context || !question?.id || !selectedAnswer) return;

    patchLessonPracticeState(lessonId, {
      submitting: true,
      error: "",
    });

    try {
      let result;

      if (isDemo) {
        const isCorrect = selectedAnswer === question.correct_answer;
        const lessons = context.module.lessons || [];
        const completedLessons = lessons.filter(
          (lesson) => lesson.id === lessonId || lesson.progress?.completed
        ).length;
        const totalLessons = lessons.length;
        const moduleCompleted = totalLessons > 0 && completedLessons === totalLessons;

        result = {
          feedback: {
            question_id: question.id,
            question: question.question,
            selected_answer: selectedAnswer,
            correct_answer: question.correct_answer,
            is_correct: isCorrect,
            explanation: question.explanation,
            difficulty: question.difficulty,
            weak_area: question.weak_area,
          },
          lesson: {
            lesson_id: lessonId,
            content_completed: true,
            practice_completed: true,
            completed: true,
            status: "completed",
            last_question_id: question.id,
            last_answer: selectedAnswer,
            last_is_correct: isCorrect,
            last_weak_area: question.weak_area,
          },
          module: {
            module_id: context.module.id,
            completed_lessons: completedLessons,
            total_lessons: totalLessons,
            percent_complete: totalLessons
              ? (completedLessons / totalLessons) * 100
              : 0,
            completed: moduleCompleted,
          },
        };
      } else {
        result = await submitLessonPracticeAttempt(studyId, lessonId, {
          question_id: question.id,
          answer: selectedAnswer,
        });
      }

      const nextMaterial = mergeLessonCompletionIntoMaterial(material, result);
      setMaterialAndLessonProgress(nextMaterial);
      patchLessonPracticeState(lessonId, {
        submitting: false,
        question,
        feedback: result.feedback || null,
        error: "",
      });

      if (!isDemo) {
        await refreshLessonProgress(nextMaterial);
      }
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not submit lesson practice answer", err);
        patchLessonPracticeState(lessonId, {
          submitting: false,
          error: getUserFacingError(
            err,
            "Could not submit this lesson practice answer. Please try again."
          ),
        });
      }
    }
  };

  const resetPracticeAttemptState = () => {
    setActivePracticeIndex(0);
    setPracticeAnswers({});
    setPracticeSubmitError("");
    setPracticeAttemptResult(null);
  };

  const resetExamAttemptState = () => {
    setActiveExamIndex(0);
    setExamAnswers({});
    setExamStarted(false);
    setSelectedExamTimer(0);
    setExamSecondsRemaining(0);
    setExamTimedOut(false);
    setExamSubmitError("");
    setExamAttemptResult(null);
  };

  const handleBackToPracticeSets = () => {
    resetPracticeAttemptState();
    setActivePracticeView("sets");
  };

  const handleBackToExamSets = () => {
    resetExamAttemptState();
    setActiveExamView("sets");
  };

  const handleSelectPracticeSet = (questionSetId) => {
    resetPracticeAttemptState();
    setSelectedPracticeSetId(questionSetId);

    if (isDemo) {
      setPracticeQuestions(demoPracticeQuestions);
      setActivePracticeView("session");
      return;
    }

    if (questionSetId === latestSetId) {
      setActivePracticeView("session");
      return;
    }

    setPracticeLoading(true);
    setPracticeError("");

    getPracticeQuestionSetQuestions(studyId, questionSetId)
      .then((data) => {
        const nextQuestions = normalizeList(data);
        setPracticeQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setPracticeError("No practice questions were returned for this set.");
        }

        setActivePracticeView("session");
      })
      .catch((err) => {
        if (isAuthError(err)) {
          setAuthRequired(true);
        } else {
          console.error("Could not load practice set", err);
          setPracticeError(
            getUserFacingError(err, "Could not load this practice set. Please try again.")
          );
        }
      })
      .finally(() => setPracticeLoading(false));
  };

  const handleSelectExamSet = (questionSetId) => {
    resetExamAttemptState();
    setSelectedExamSetId(questionSetId);

    if (isDemo) {
      setExamQuestions(demoExamQuestions);
      setActiveExamView("session");
      return;
    }

    if (questionSetId === latestSetId) {
      setActiveExamView("session");
      return;
    }

    setExamLoading(true);
    setExamError("");

    getExamQuestionSetQuestions(studyId, questionSetId)
      .then((data) => {
        const nextQuestions = normalizeList(data);
        setExamQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setExamError("No exam questions were returned for this set.");
        }

        setActiveExamView("session");
      })
      .catch((err) => {
        if (isAuthError(err)) {
          setAuthRequired(true);
        } else {
          console.error("Could not load exam set", err);
          setExamError(
            getUserFacingError(err, "Could not load this exam set. Please try again.")
          );
        }
      })
      .finally(() => setExamLoading(false));
  };

  const handleGeneratePracticeSet = async () => {
    const nextTitle =
      practiceSetTitle.trim() || `Practice Set ${practiceQuestionSets.length + 1}`;
    const nextCount = clampQuestionCount(
      practiceSetCount || study?.practice_question_count || 10
    );

    setPracticeSetGenerating(true);
    setPracticeError("");
    setAuthRequired(false);

    if (isDemo) {
      const createdSet = createDemoQuestionSet(
        "practice",
        practiceQuestionSets.length + 1,
        nextCount
      );
      setPracticeQuestionSets((current) => [...current, createdSet]);
      setSelectedPracticeSetId(createdSet.id);
      setPracticeQuestions(demoPracticeQuestions.slice(0, Math.min(nextCount, demoPracticeQuestions.length)));
      setPracticeSetTitle("");
      setPracticeSetCount("");
      resetPracticeAttemptState();
      setActivePracticeView("session");
      setPracticeSetGenerating(false);
      return;
    }

    try {
      const createdSet = await generatePracticeQuestionSet(studyId, {
        title: nextTitle,
        questionCount: nextCount,
      });
      setPracticeSetTitle("");
      setPracticeSetCount("");
      setSelectedPracticeSetId(createdSet?.id || "");
      resetPracticeAttemptState();

      if (createdSet?.id) {
        setPracticeQuestionSets((current) => {
          const withoutCreated = current.filter((set) => set.id !== createdSet.id);
          return [...withoutCreated, createdSet];
        });
        const setQuestions = await getPracticeQuestionSetQuestions(studyId, createdSet.id);
        const nextQuestions = normalizeList(setQuestions);
        setPracticeQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setPracticeError("No practice questions were returned for this set.");
        }

        setActivePracticeView("session");
      } else {
        await loadPracticeQuestions();
        setActivePracticeView("session");
      }
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not generate practice set", err);
        setPracticeError(
          getUserFacingError(err, "Could not generate a practice set. Please try again.")
        );
      }
    } finally {
      setPracticeSetGenerating(false);
    }
  };

  const handleGenerateExamSet = async () => {
    const nextTitle = examSetTitle.trim() || `Exam Set ${examQuestionSets.length + 1}`;
    const nextCount = clampQuestionCount(examSetCount || study?.exam_question_count || 12);

    setExamSetGenerating(true);
    setExamError("");
    setAuthRequired(false);

    if (isDemo) {
      const createdSet = createDemoQuestionSet(
        "exam",
        examQuestionSets.length + 1,
        nextCount
      );
      setExamQuestionSets((current) => [...current, createdSet]);
      setSelectedExamSetId(createdSet.id);
      setExamQuestions(demoExamQuestions.slice(0, Math.min(nextCount, demoExamQuestions.length)));
      setExamSetTitle("");
      setExamSetCount("");
      resetExamAttemptState();
      setActiveExamView("session");
      setExamSetGenerating(false);
      return;
    }

    try {
      const createdSet = await generateExamQuestionSet(studyId, {
        title: nextTitle,
        questionCount: nextCount,
      });
      setExamSetTitle("");
      setExamSetCount("");
      setSelectedExamSetId(createdSet?.id || "");
      resetExamAttemptState();

      if (createdSet?.id) {
        setExamQuestionSets((current) => {
          const withoutCreated = current.filter((set) => set.id !== createdSet.id);
          return [...withoutCreated, createdSet];
        });
        const setQuestions = await getExamQuestionSetQuestions(studyId, createdSet.id);
        const nextQuestions = normalizeList(setQuestions);
        setExamQuestions(nextQuestions);

        if (!nextQuestions.length) {
          setExamError("No exam questions were returned for this set.");
        }

        setActiveExamView("session");
      } else {
        await loadExamQuestions();
        setActiveExamView("session");
      }
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not generate exam set", err);
        setExamError(
          getUserFacingError(err, "Could not generate an exam set. Please try again.")
        );
      }
    } finally {
      setExamSetGenerating(false);
    }
  };

  const handlePracticeAnswer = (questionId, answer) => {
    setPracticeSubmitError("");
    setPracticeAnswers((current) => {
      if (current[questionId]) return current;
      return {
        ...current,
        [questionId]: answer,
      };
    });
  };

  const handlePracticeSubmit = async () => {
    const answers = practiceQuestions
      .map((question) => ({
        question_id: question.id,
        answer: practiceAnswers[question.id],
      }))
      .filter((item) => item.question_id && item.answer);

    if (answers.length !== practiceQuestions.length) return;

    setPracticeSubmitLoading(true);
    setPracticeSubmitError("");

    if (isDemo) {
      const feedback = practiceQuestions.map((question) => {
        const selectedAnswer = practiceAnswers[question.id];
        const isCorrect = selectedAnswer === question.correct_answer;

        return {
          question_id: question.id,
          question: question.question,
          selected_answer: selectedAnswer,
          correct_answer: question.correct_answer,
          is_correct: isCorrect,
          explanation: question.explanation,
          difficulty: question.difficulty,
          weak_area: question.weak_area,
        };
      });
      const correctCount = feedback.filter((item) => item.is_correct).length;
      const score = Math.round((correctCount / practiceQuestions.length) * 100);

      setPracticeAttemptResult({
        id: "demo-practice-attempt",
        study_id: "demo",
        answers,
        score,
        total_questions: practiceQuestions.length,
        correct_count: correctCount,
        weak_areas: feedback.filter((item) => !item.is_correct).map((item) => item.weak_area),
        feedback,
        created_at: new Date().toISOString(),
      });
      setStudy((current) => ({
        ...current,
        progress: {
          ...current.progress,
          practice_completed: true,
          latest_practice_score: score,
          aggregate_weak_areas: feedback
            .filter((item) => !item.is_correct)
            .map((item) => item.weak_area),
        },
      }));
      setPracticeSubmitLoading(false);
      return;
    }

    try {
      const result = await submitPracticeAttempt(studyId, answers);
      setPracticeAttemptResult(result);
      await loadStudy();
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not submit practice attempt", err);
        setPracticeSubmitError(
          getUserFacingError(
            err,
            "Could not submit this practice attempt. Please try again."
          )
        );
      }
    } finally {
      setPracticeSubmitLoading(false);
    }
  };

  const handlePracticeReset = () => {
    resetPracticeAttemptState();
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setExamSubmitError("");
    setExamTimedOut(false);
    setExamSecondsRemaining(selectedExamTimer * 60);
  };

  const handleAddExamTime = (minutes) => {
    setExamSecondsRemaining((current) => current + minutes * 60);
    setExamTimedOut(false);
    setExamSubmitError("");
  };

  const handleExamAnswer = (questionId, answer) => {
    setExamSubmitError("");
    setExamAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  };

  const handleExamSubmit = async () => {
    const answers = examQuestions
      .map((question) => ({
        question_id: question.id,
        answer: examAnswers[question.id],
      }))
      .filter((item) => item.question_id && item.answer);

    if (!answers.length) return;

    setExamSubmitLoading(true);
    setExamSubmitError("");

    if (isDemo) {
      const feedback = examQuestions.map((question) => {
        const selectedAnswer = examAnswers[question.id];
        const isCorrect = selectedAnswer === question.correct_answer;

        return {
          question_id: question.id,
          question: question.question,
          selected_answer: selectedAnswer,
          correct_answer: question.correct_answer,
          is_correct: isCorrect,
          explanation: question.explanation,
          difficulty: question.difficulty,
          weak_area: question.weak_area,
        };
      });
      const correctCount = feedback.filter((item) => item.is_correct).length;
      const score = Math.round((correctCount / examQuestions.length) * 100);

      setExamAttemptResult({
        id: "demo-exam-attempt",
        study_id: "demo",
        answers,
        score,
        total_questions: examQuestions.length,
        correct_count: correctCount,
        weak_areas: feedback.filter((item) => !item.is_correct).map((item) => item.weak_area),
        feedback,
        created_at: new Date().toISOString(),
      });
      setStudy((current) => ({
        ...current,
        progress: {
          ...current.progress,
          exam_completed: true,
          latest_exam_score: score,
          aggregate_weak_areas: feedback
            .filter((item) => !item.is_correct)
            .map((item) => item.weak_area),
        },
      }));
      setExamTimedOut(false);
      setExamSubmitLoading(false);
      return;
    }

    try {
      const result = await submitExamAttempt(studyId, answers);
      setExamAttemptResult(result);
      setExamTimedOut(false);
      await loadStudy();
    } catch (err) {
      if (isAuthError(err)) {
        setAuthRequired(true);
      } else {
        console.error("Could not submit exam attempt", err);
        setExamSubmitError(
          getUserFacingError(err, "Could not submit this exam attempt. Please try again.")
        );
      }
    } finally {
      setExamSubmitLoading(false);
    }
  };

  const handleExamReset = () => {
    resetExamAttemptState();
  };

  if (authRequired) {
    return (
      <AuthRequiredState
        title="Log in to view this Study"
        message="This workspace belongs to your account. Log in to open the material, practice, exam mode, and progress. In local development, you can also open /studies/demo to preview the UI with dummy data."
        returnTo={`/studies/${studyId}`}
        secondaryHref="/studies"
        secondaryLabel="Back to Studies"
      />
    );
  }

  if (loading) return <LoadingState />;
  if (error && !study) return <ErrorState message={error} onRetry={() => loadStudy({ showLoading: true })} />;

  const renderTool = (mode) => {
    switch (mode) {
      case "glossary":
        return (
          <GlossaryTab
            study={study}
            glossary={glossary}
            loading={glossaryLoading}
            error={glossaryError}
            onRetry={() => loadStudy()}
            onResume={handleResume}
            resumeLoading={resumeLoading}
            onRegenerate={handleRegenerateGlossary}
            regenerateLoading={glossaryRegenerating}
          />
        );
      case "practice":
        return (
          <PracticeTab
            study={study}
            questions={practiceQuestions}
            questionSets={practiceQuestionSets}
            selectedSetId={selectedPracticeSetId}
            activeView={activePracticeView}
            setTitle={practiceSetTitle}
            setCount={practiceSetCount}
            setGenerating={practiceSetGenerating}
            loading={practiceLoading}
            error={practiceError}
            activeIndex={activePracticeIndex}
            answers={practiceAnswers}
            submitError={practiceSubmitError}
            submitLoading={practiceSubmitLoading}
            attemptResult={practiceAttemptResult}
            resumeLoading={resumeLoading}
            onRetry={() => loadStudy()}
            onResume={handleResume}
            onSelectSet={handleSelectPracticeSet}
            onBackToSets={handleBackToPracticeSets}
            onSetTitleChange={setPracticeSetTitle}
            onSetCountChange={setPracticeSetCount}
            onGenerateSet={handleGeneratePracticeSet}
            onAnswer={handlePracticeAnswer}
            onActiveIndexChange={setActivePracticeIndex}
            onSubmit={handlePracticeSubmit}
            onReset={handlePracticeReset}
          />
        );
      case "exam":
        return (
          <ExamTab
            study={study}
            questions={examQuestions}
            questionSets={examQuestionSets}
            selectedSetId={selectedExamSetId}
            activeView={activeExamView}
            setTitle={examSetTitle}
            setCount={examSetCount}
            setGenerating={examSetGenerating}
            loading={examLoading}
            error={examError}
            activeIndex={activeExamIndex}
            answers={examAnswers}
            started={examStarted}
            selectedTimer={selectedExamTimer}
            secondsRemaining={examSecondsRemaining}
            timedOut={examTimedOut}
            submitError={examSubmitError}
            submitLoading={examSubmitLoading}
            attemptResult={examAttemptResult}
            resumeLoading={resumeLoading}
            onRetry={() => loadStudy()}
            onResume={handleResume}
            onSelectSet={handleSelectExamSet}
            onBackToSets={handleBackToExamSets}
            onSetTitleChange={setExamSetTitle}
            onSetCountChange={setExamSetCount}
            onGenerateSet={handleGenerateExamSet}
            onTimerChange={setSelectedExamTimer}
            onStart={handleStartExam}
            onAddTime={handleAddExamTime}
            onAnswer={handleExamAnswer}
            onActiveIndexChange={setActiveExamIndex}
            onSubmit={handleExamSubmit}
            onReset={handleExamReset}
          />
        );
      case "analytics":
        return <AnalyticsTab study={study} progress={progress} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-off-white-100 dark:bg-dark-bg">
      <WorkspaceHeader study={study} progress={progress} />
      <CoursePlayerWorkspace
        activeMode={activeTab}
        onModeChange={setActiveTab}
        study={study}
        material={material}
        progress={progress}
        lessonProgress={lessonProgress}
        lessonPracticeState={lessonPracticeState}
        onResume={handleResume}
        resumeLoading={resumeLoading}
        onCompleteLesson={handleCompleteLesson}
        onSelectLessonPracticeAnswer={handleSelectLessonPracticeAnswer}
        onSubmitLessonPracticeAnswer={handleSubmitLessonPracticeAnswer}
        renderTool={renderTool}
        notice={
          <>
            {error ? (
              <div className="mb-5 flex items-start gap-3 rounded-md border border-error bg-error-light px-4 py-3 text-error">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="text-h5 leading-6 inter-font">{error}</p>
              </div>
            ) : null}
            <GenerationNotice
              study={study}
              polling={shouldPoll}
              onResume={handleResume}
              resumeLoading={resumeLoading}
            />
          </>
        }
      />
    </main>
  );
}
