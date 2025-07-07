import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertTriangle,
  MinusCircle
} from 'lucide-react';

export const QuizResultsOverview = ({ 
  onBack, 
  onRetakeTest,
  quizTitle = "Sample Quiz",
  quizSubject = "Practice",
  answers = {},
  questions = [],
  timeElapsed = 0,
  timerUsed = false
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('correct'); // 'correct', 'incorrect', or 'skipped'

  // Calculate results
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const correctAnswers = Object.entries(answers).filter(([questionIndex, answer]) => 
    questions[parseInt(questionIndex)]?.correctAnswer === answer
  ).length;
  const incorrectAnswers = Object.entries(answers).filter(([questionIndex, answer]) => 
    questions[parseInt(questionIndex)]?.correctAnswer !== answer
  ).length;
  const skippedQuestions = totalQuestions - answeredQuestions;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Check if user failed (didn't answer any questions)
  const didNotPass = answeredQuestions === 0;

  // Get correct questions
  const correctQuestionsList = Object.entries(answers)
    .filter(([questionIndex, answer]) => 
      questions[parseInt(questionIndex)]?.correctAnswer === answer
    )
    .map(([questionIndex, userAnswer]) => ({
      index: parseInt(questionIndex),
      question: questions[parseInt(questionIndex)],
      userAnswer,
      correctAnswer: questions[parseInt(questionIndex)]?.correctAnswer
    }));

  // Get incorrect questions
  const incorrectQuestionsList = Object.entries(answers)
    .filter(([questionIndex, answer]) => 
      questions[parseInt(questionIndex)]?.correctAnswer !== answer
    )
    .map(([questionIndex, userAnswer]) => ({
      index: parseInt(questionIndex),
      question: questions[parseInt(questionIndex)],
      userAnswer,
      correctAnswer: questions[parseInt(questionIndex)]?.correctAnswer
    }));

  // Get skipped questions
  const skippedQuestionsList = questions
    .map((question, index) => ({ question, index }))
    .filter(({ index }) => !(index in answers))
    .map(({ question, index }) => ({
      index,
      question,
      correctAnswer: question.correctAnswer
    }));

  // Set default active tab based on available content
  React.useEffect(() => {
    if (correctQuestionsList.length > 0) {
      setActiveTab('correct');
    } else if (incorrectQuestionsList.length > 0) {
      setActiveTab('incorrect');
    } else if (skippedQuestionsList.length > 0) {
      setActiveTab('skipped');
    }
  }, [correctQuestionsList.length, incorrectQuestionsList.length, skippedQuestionsList.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? 's' : ''}${secs > 0 ? ` ${secs} second${secs !== 1 ? 's' : ''}` : ''}`;
  };

  const getAnswerLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const toggleQuestionExpansion = (questionIndex) => {
    setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex);
  };

  return (
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">StudySmart</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
            <a href="#" className="text-blue-600 font-medium">Practice</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Review</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Resources</a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Performance Overview</h1>
            <p className="text-gray-600">{quizSubject} / {quizTitle}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetakeTest}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            Retake Test
          </motion.button>
        </motion.div>

        {/* Fail Message */}
        {didNotPass && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center mb-8"
          >
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">Test Not Completed</h3>
            <p className="text-red-700 mb-4">You did not answer any questions. Please retake the test to receive a score.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetakeTest}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Retake Test Now
            </motion.button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-2">Total Questions</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalQuestions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-2">Correct Answers</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{correctAnswers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-2">Incorrect Answers</h3>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{incorrectAnswers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-sm sm:text-base font-medium text-gray-600 mb-2">Skipped Questions</h3>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">{skippedQuestions}</p>
          </motion.div>
        </div>

        {/* Score Section */}
        {!didNotPass && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Score</h2>
              <div className="text-right">
                <span className={`text-3xl sm:text-4xl font-bold ${
                  score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {score}%
                </span>
                <p className={`text-sm mt-1 ${
                  score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {score >= 70 ? 'Excellent!' : score >= 50 ? 'Good effort!' : 'Needs improvement'}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className={`h-3 rounded-full ${
                  score >= 70 ? 'bg-green-600' : score >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>

            {/* Time Display */}
            {timerUsed && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Time Taken: {formatTime(timeElapsed)}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Questions Review Section */}
        {!didNotPass && (correctQuestionsList.length > 0 || incorrectQuestionsList.length > 0 || skippedQuestionsList.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            {/* Tab Header */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Review Questions</h2>
              <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1">
                {correctQuestionsList.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('correct')}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                      activeTab === 'correct'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Correct ({correctQuestionsList.length})</span>
                    <span className="sm:hidden">✓ {correctQuestionsList.length}</span>
                  </motion.button>
                )}
                {incorrectQuestionsList.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('incorrect')}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                      activeTab === 'incorrect'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Incorrect ({incorrectQuestionsList.length})</span>
                    <span className="sm:hidden">✗ {incorrectQuestionsList.length}</span>
                  </motion.button>
                )}
                {skippedQuestionsList.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('skipped')}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                      activeTab === 'skipped'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MinusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Skipped ({skippedQuestionsList.length})</span>
                    <span className="sm:hidden">- {skippedQuestionsList.length}</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="divide-y divide-gray-200">
              {/* Correct Questions Tab */}
              {activeTab === 'correct' && correctQuestionsList.map((item, index) => (
                <motion.div
                  key={`correct-${item.index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="p-4 sm:p-6"
                >
                  {/* Question Header */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleQuestionExpansion(`correct-${item.index}`)}
                    className="w-full flex items-start space-x-4 text-left group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        Question {item.index + 1}: {item.question.question}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-green-600">
                          Your Answer: {getAnswerLabel(item.userAnswer)} ✓ Correct
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      {expandedQuestion === `correct-${item.index}` ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      )}
                    </div>
                  </motion.button>

                  {/* Expanded Question Details */}
                  <AnimatePresence>
                    {expandedQuestion === `correct-${item.index}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 ml-12 overflow-hidden"
                      >
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                          <h4 className="font-medium text-gray-900 mb-4">All Options:</h4>
                          <div className="space-y-3">
                            {item.question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                                  optionIndex === item.correctAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  optionIndex === item.correctAnswer
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                }`}>
                                  {optionIndex === item.correctAnswer ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <span className="text-xs font-medium text-gray-600">
                                      {getAnswerLabel(optionIndex)}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-sm ${
                                  optionIndex === item.correctAnswer
                                    ? 'text-green-800 font-medium'
                                    : 'text-gray-700'
                                }`}>
                                  {option}
                                </span>
                                {optionIndex === item.correctAnswer && (
                                  <span className="text-xs text-green-600 font-medium ml-auto">Your Correct Answer</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Incorrect Questions Tab */}
              {activeTab === 'incorrect' && incorrectQuestionsList.map((item, index) => (
                <motion.div
                  key={`incorrect-${item.index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="p-4 sm:p-6"
                >
                  {/* Question Header */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleQuestionExpansion(`incorrect-${item.index}`)}
                    className="w-full flex items-start space-x-4 text-left group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        Question {item.index + 1}: {item.question.question}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-red-600">
                          Your Answer: {getAnswerLabel(item.userAnswer)}
                        </p>
                        <p className="text-sm text-green-600">
                          Correct Answer: {getAnswerLabel(item.correctAnswer)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      {expandedQuestion === `incorrect-${item.index}` ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      )}
                    </div>
                  </motion.button>

                  {/* Expanded Question Details */}
                  <AnimatePresence>
                    {expandedQuestion === `incorrect-${item.index}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 ml-12 overflow-hidden"
                      >
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                          <h4 className="font-medium text-gray-900 mb-4">All Options:</h4>
                          <div className="space-y-3">
                            {item.question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                                  optionIndex === item.correctAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : optionIndex === item.userAnswer
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  optionIndex === item.correctAnswer
                                    ? 'border-green-500 bg-green-500'
                                    : optionIndex === item.userAnswer
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300'
                                }`}>
                                  {optionIndex === item.correctAnswer && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                  {optionIndex === item.userAnswer && optionIndex !== item.correctAnswer && (
                                    <XCircle className="w-4 h-4 text-white" />
                                  )}
                                  {optionIndex !== item.correctAnswer && optionIndex !== item.userAnswer && (
                                    <span className="text-xs font-medium text-gray-600">
                                      {getAnswerLabel(optionIndex)}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-sm ${
                                  optionIndex === item.correctAnswer
                                    ? 'text-green-800 font-medium'
                                    : optionIndex === item.userAnswer
                                    ? 'text-red-800 font-medium'
                                    : 'text-gray-700'
                                }`}>
                                  {option}
                                </span>
                                {optionIndex === item.correctAnswer && (
                                  <span className="text-xs text-green-600 font-medium ml-auto">Correct</span>
                                )}
                                {optionIndex === item.userAnswer && optionIndex !== item.correctAnswer && (
                                  <span className="text-xs text-red-600 font-medium ml-auto">Your Answer</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Skipped Questions Tab */}
              {activeTab === 'skipped' && skippedQuestionsList.map((item, index) => (
                <motion.div
                  key={`skipped-${item.index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="p-4 sm:p-6"
                >
                  {/* Question Header */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleQuestionExpansion(`skipped-${item.index}`)}
                    className="w-full flex items-start space-x-4 text-left group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                      <MinusCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        Question {item.index + 1}: {item.question.question}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-orange-600">Not Answered</p>
                        <p className="text-sm text-green-600">
                          Correct Answer: {getAnswerLabel(item.correctAnswer)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      {expandedQuestion === `skipped-${item.index}` ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      )}
                    </div>
                  </motion.button>

                  {/* Expanded Question Details */}
                  <AnimatePresence>
                    {expandedQuestion === `skipped-${item.index}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 ml-12 overflow-hidden"
                      >
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                          <h4 className="font-medium text-gray-900 mb-4">All Options:</h4>
                          <div className="space-y-3">
                            {item.question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                                  optionIndex === item.correctAnswer
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  optionIndex === item.correctAnswer
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                }`}>
                                  {optionIndex === item.correctAnswer ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <span className="text-xs font-medium text-gray-600">
                                      {getAnswerLabel(optionIndex)}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-sm ${
                                  optionIndex === item.correctAnswer
                                    ? 'text-green-800 font-medium'
                                    : 'text-gray-700'
                                }`}>
                                  {option}
                                </span>
                                {optionIndex === item.correctAnswer && (
                                  <span className="text-xs text-green-600 font-medium ml-auto">Correct Answer</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Perfect Score Message */}
        {!didNotPass && incorrectQuestionsList.length === 0 && skippedQuestionsList.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 sm:p-8 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Perfect Score!</h3>
            <p className="text-green-700">Congratulations! You answered all questions correctly.</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        {!didNotPass && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetakeTest}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Test</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Back to Practice
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
};