import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export const WelcomeSection = ({ onCreateStudy }) => {
  const { userName } = useSelector((store) => store.dashboard);
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
      {/* Left Content */}
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateStudy}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-200 transition-colors mb-6 lg:hidden dark:bg-dark-accent dark:text-[#16110a] dark:hover:bg-primary-25"
          >
            Create Study
          </motion.button>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 dark:text-dark-text"
        >
          Welcome back, {userName}!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 max-w-full lg:max-w-2xl dark:border-dark-border dark:bg-dark-surface dark:shadow-none"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 dark:text-dark-text">
            Latest Score: 85%
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed dark:text-dark-muted">
            Keep up the great work! Your dedication is paying off. Review your
            results for more insights.
          </p>
        </motion.div>
      </div>

      {/* Right Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lg:ml-8 flex justify-center lg:justify-end"
      >
        <div className="w-full max-w-sm sm:w-80 h-40 sm:h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center relative overflow-hidden dark:from-dark-surface-soft dark:to-dark-surface">
          {/* Student illustration placeholder */}
          <div className="w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <div className="w-18 sm:w-24 h-18 sm:h-24 bg-green-600 rounded-full flex items-center justify-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-700 rounded-full"></div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 bg-orange-300 rounded-full"></div>
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-400 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};
