import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { QuizResultsOverview } from "./quizResultsOverview";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";

const sampleQuestions = [
  {
    id: 1,
    question:
      "Which of the following is NOT a characteristic of a well-designed experiment?",
    options: [
      "Clear Hypothesis",
      "Random Assignment",
      "Control Group",
      "Subjective Data Collection",
    ],
    correctAnswer: 3,
  },
  {
    id: 2,
    question:
      "What is the primary purpose of a control group in an experiment?",
    options: [
      "To increase sample size",
      "To provide a baseline for comparison",
      "To reduce costs",
      "To speed up the experiment",
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question:
      "Which statistical measure is most appropriate for describing the central tendency of a highly skewed distribution?",
    options: ["Mean", "Median", "Mode", "Standard deviation"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "In hypothesis testing, what does a p-value represent?",
    options: [
      "The probability that the null hypothesis is true",
      "The probability of observing the data given the null hypothesis is true",
      "The probability that the alternative hypothesis is true",
      "The probability of making a Type I error",
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What is the main advantage of using random sampling?",
    options: [
      "It guarantees a large sample size",
      "It ensures the sample is representative of the population",
      "It reduces the cost of data collection",
      "It eliminates all sources of bias",
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "Which of the following best describes a Type II error?",
    options: [
      "Rejecting a true null hypothesis",
      "Accepting a false null hypothesis",
      "Using the wrong statistical test",
      "Having too small a sample size",
    ],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "What is the purpose of blinding in experimental design?",
    options: [
      "To reduce sample size",
      "To eliminate bias from participants and researchers",
      "To increase statistical power",
      "To reduce costs",
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    question:
      "Which correlation coefficient indicates the strongest relationship?",
    options: ["r = 0.3", "r = -0.8", "r = 0.6", "r = -0.4"],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "What does statistical significance indicate?",
    options: [
      "The result is practically important",
      "The result is unlikely to have occurred by chance",
      "The sample size is adequate",
      "The effect size is large",
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    question:
      "Which sampling method would be most appropriate for studying a rare disease?",
    options: [
      "Simple random sampling",
      "Stratified sampling",
      "Convenience sampling",
      "Purposive sampling",
    ],
    correctAnswer: 3,
  },
];

export const QuizInterface = ({
  slug,
  onBack,
  quizTitle = "PDF Title",
  quizSubject = "Practice",
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState();

  const router = useRouter();
  const { data, error, loading, refetch } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobook/s/${slug}`
  );

  useEffect(() => {
    if (data) {
      setQuestions(data.data[1]);
      // console.log("Questions set to:", data?.data?.[1]);
    //   console.log(data.data[1]);
    }
  }, [data]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex, option) => {
    if (isSubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }));
    // console.log(optionIndex);
  };

  const handleNext = () => {
    if (currentQuestion < questions?.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setShowResults(true);
  };

  const handleQuit = () => {
    setShowQuitModal(true);
  };

  const confirmQuit = () => {
    // onBack();
    router.push("/dashboard");
  };

  const handleRetakeTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setShowTimer(false);
    setIsSubmitted(false);
    setShowResults(false);
  };

  const toggleTimer = () => {
    if (!showTimer) {
      setShowTimer(true);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const resetTimer = () => {
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

//   useEffect(() => {
//     console.log(answers);
//     console.log(questions)
//   }, [answers, questions]);

  // Show results overview if quiz is completed


  if (questions && showResults) {
    return (
      <QuizResultsOverview
        onBack={onBack}
        onRetakeTest={handleRetakeTest}
        quizTitle={quizTitle}
        quizSubject={quizSubject}
        answers={answers}
        questions={questions}
        timeElapsed={timeElapsed}
        timerUsed={showTimer}
      />
    );
  }
  const progress = ((currentQuestion + 1) / questions?.length) * 100;
  const currentQ = questions && questions[currentQuestion];
  const answeredQuestions = Object.keys(answers).length;

  return (
    questions && (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-primary-100 text-sm font-bold">A</span>
                </div> */}
                <h1 className="text-xl font-bold text-gray-900">Aurify AI</h1>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {/* <a
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </a> */}
              {/* <a href="#" className="text-blue-600 font-medium">
                Practice
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Review
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Resources
              </a> */}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Timer Controls */}
              <div className="flex items-center space-x-2">
                {!showTimer ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Start Timer</span>
                  </motion.button>
                ) : (
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-mono font-medium text-gray-900">
                      {formatTime(timeElapsed)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleTimer}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isTimerRunning ? (
                        <Pause className="w-3 h-3 text-gray-600" />
                      ) : (
                        <Play className="w-3 h-3 text-gray-600" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={resetTimer}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <RotateCcw className="w-3 h-3 text-gray-600" />
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
              <span className="text-sm text-gray-600">
                {answeredQuestions}/{questions.length} answered
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <motion.div
                className="bg-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </p>
          </motion.div>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-gray-600">
              <span className="text-blue-600">{quizSubject}</span> / {quizTitle}
            </p>
          </motion.div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Question {currentQuestion + 1} of {questions.length}
            </h1>

            <p className="text-lg text-gray-800 mb-8 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleAnswerSelect(index, option)}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    answers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${isSubmitted ? "cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-lg ${
                      answers[currentQuestion] === index
                        ? "text-blue-900 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {option}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Left: Previous Button */}
            <div className="flex items-center space-x-4">
              {currentQuestion > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuit}
                className="flex items-center space-x-2 px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Quit</span>
              </motion.button>
            </div>

            {/* Right: Submit/Next Button */}
            <div className="flex items-center space-x-4">
              {currentQuestion === questions.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                    isSubmitted
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isSubmitted ? "Submitted" : "Submit Quiz"}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Question Navigation Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Question Navigation
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {questions.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    index === currentQuestion
                      ? "bg-blue-600 text-white shadow-lg"
                      : answers[index] !== undefined
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-gray-600">Unanswered</span>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Quit Confirmation Modal */}
        <AnimatePresence>
          {showQuitModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowQuitModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Quit Quiz?
                    </h3>
                    <p className="text-gray-600">Your progress will be lost.</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Are you sure you want to quit? You have answered{" "}
                  {answeredQuestions} out of {questions.length} questions.
                </p>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQuitModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Continue Quiz
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmQuit}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Quit Quiz
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
};
