import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award } from 'lucide-react';

const recentScores = [
  { subject: 'Mathematics', score: 85, date: '2023-08-15', trend: 'up' },
  { subject: 'Biology', score: 92, date: '2023-08-10', trend: 'up' },
  { subject: 'History', score: 78, date: '2023-08-05', trend: 'down' },
  { subject: 'Literature', score: 88, date: '2023-07-30', trend: 'up' },
];

export const ScoresResults = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coming soon...</h1>
          <p className="text-gray-600">Track your progress and achievements</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">85.8%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Improvement</p>
                <p className="text-3xl font-bold text-green-600">+12%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Achievements</p>
                <p className="text-3xl font-bold text-purple-600">7</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Scores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Recent Scores</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentScores.map((score, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{score.subject}</h4>
                  <p className="text-sm text-gray-600">{score.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-2xl font-bold ${
                    score.score >= 90 ? 'text-green-600' :
                    score.score >= 80 ? 'text-blue-600' :
                    score.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {score.score}%
                  </span>
                  <div className={`p-1 rounded-full ${
                    score.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${
                      score.trend === 'up' ? 'text-green-600' : 'text-red-600 rotate-180'
                    }`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};