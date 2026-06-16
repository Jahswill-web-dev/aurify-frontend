"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Tabs } from "@/components/ui";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import {
  generateExamQuestionSet,
  generatePracticeQuestionSet,
  getExamQuestions,
  getExamQuestionSetQuestions,
  getPracticeQuestions,
  getPracticeQuestionSetQuestions,
  getStudy,
  getStudyGlossary,
  getStudyMaterial,
  getUserFacingError,
  hasAccessToken,
  isAuthError,
  listExamQuestionSets,
  listPracticeQuestionSets,
  regenerateStudyGlossary,
  resumeStudyGeneration,
  submitExamAttempt,
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
import { ExamTab } from "./_workspace/ExamTab";
import { GlossaryTab } from "./_workspace/GlossaryTab";
import { clampQuestionCount, getProgressValue, getReadySets, hasGeneratingSet, normalizeList } from "./_workspace/helpers";
import { MaterialTab } from "./_workspace/MaterialTab";
import { OverviewTab } from "./_workspace/OverviewTab";
import { PracticeTab } from "./_workspace/PracticeTab";
import { ErrorState, GenerationNotice, LoadingState, WorkspaceHeader } from "./_workspace/WorkspaceShell";

export default function StudyWorkspaceClient({ studyId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [study, setStudy] = useState(null);
  const [material, setMaterial] = useState(null);
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

  const progress = useMemo(() => getProgressValue(study?.progress), [study]);
  const shouldPoll = study ? pollingStatuses.has(study.status) : false;
  const shouldPollQuestionSets =
    hasGeneratingSet(practiceQuestionSets) || hasGeneratingSet(examQuestionSets);

  const loadGlossary = useCallback(async () => {
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
  }, [studyId]);

  const loadPracticeQuestions = useCallback(async () => {
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
  }, [selectedPracticeSetId, studyId]);

  const loadExamQuestions = useCallback(async () => {
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
  }, [selectedExamSetId, studyId]);

  const loadStudy = useCallback(
    async ({ showLoading = false } = {}) => {
      if (showLoading) setLoading(true);
      setError("");
      setAuthRequired(false);

      if (!hasAccessToken()) {
        setStudy(null);
        setMaterial(null);
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
            setMaterial(nextMaterial);
          } catch (err) {
            if (err.status !== 404) throw err;
            setMaterial(null);
          }
        } else {
          setMaterial(null);
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
    [loadExamQuestions, loadGlossary, loadPracticeQuestions, studyId]
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
        message="This workspace belongs to your account. Log in to open the material, practice, exam mode, and progress."
        returnTo={`/studies/${studyId}`}
        secondaryHref="/studies"
        secondaryLabel="Back to Studies"
      />
    );
  }

  if (loading) return <LoadingState />;
  if (error && !study) return <ErrorState message={error} onRetry={() => loadStudy({ showLoading: true })} />;

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            study={study}
            material={material}
            progress={progress}
            onTabChange={setActiveTab}
          />
        );
      case "material":
        return <MaterialTab material={material} />;
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
      <div className="sticky top-0 z-20 border-b border-grey-25 bg-white px-4 sm:px-6 lg:px-8 dark:border-dark-border dark:bg-dark-surface">
        <div className="mx-auto max-w-[1180px]">
          <Tabs
            tabs={workspaceTabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="scrollbar-hide overflow-x-auto border-b-0 [&_button]:shrink-0"
          />
        </div>
      </div>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
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
          {renderTab()}
        </div>
      </section>
    </main>
  );
}
