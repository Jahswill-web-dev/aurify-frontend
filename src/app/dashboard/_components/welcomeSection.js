import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export const WelcomeSection = () => {
    const { userName } = useSelector((store) => store.dashboard);
  return (
    <div className="flex items-center justify-between">
      {/* Left Content */}
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-6">
            Create Study
          </button>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold text-gray-900 mb-6"
        >
          Welcome back, {userName}!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 max-w-2xl"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">Latest Score: 85%</h2>
          <p className="text-gray-600 leading-relaxed">
            Keep up the great work! Your dedication is paying off. Review your results for more insights.
          </p>
        </motion.div>
      </div>

      {/* Right Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="ml-8"
      >
        <div className="w-80 h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
          {/* Student illustration placeholder */}
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-green-700 rounded-full"></div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-orange-300 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-orange-400 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};