import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Clock, Target } from 'lucide-react';

export const PracticeQuestions = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Questions</h1>
          <p className="text-gray-600">Test your knowledge with interactive questions</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Quick Quiz</h3>
            <p className="text-gray-600 mb-4">5-10 questions on recent topics</p>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Start Quiz
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Timed Practice</h3>
            <p className="text-gray-600 mb-4">Challenge yourself with time limits</p>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
              Start Timer
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Focus Areas</h3>
            <p className="text-gray-600 mb-4">Practice your weak points</p>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors">
              Identify Gaps
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};