import React from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, HelpCircle, BarChart3, UserPlus } from 'lucide-react';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'summaries', label: 'My Summaries', icon: FileText },
  { id: 'practice', label: 'Practice Questions', icon: HelpCircle },
  { id: 'scores', label: 'Scores & Results', icon: BarChart3 },
];

export const Sidebar = ({ activeSection, onSectionChange, onCreateStudy, onShowSignup, isCollapsed, setIsCollapsed }) => {

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64 sm:w-72 lg:w-80'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 fixed left-0 top-0 z-50`}>
      {/* Header */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4 sm:p-6'} border-b border-gray-200 flex items-center justify-center`}>
        {isCollapsed ? (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
        ) : (
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Aurify AI</h1>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-3 sm:p-4'} space-y-1 sm:space-y-2`}>
        {navigation.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-4 py-3'} rounded-lg text-left transition-all ${
              activeSection === item.id
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } text-sm sm:text-base`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-4 sm:w-5 h-4 sm:h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </motion.button>
        ))}
      </nav>

      {/* Action Buttons */}
      <div className={`${isCollapsed ? 'p-2' : 'p-3 sm:p-4'} border-t border-gray-200 space-y-2 sm:space-y-3`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateStudy}
          className={`w-full bg-primary-100 text-white ${isCollapsed ? 'py-2 px-2' : 'py-2 sm:py-3 px-3 sm:px-4'} rounded-lg font-medium hover:bg-primary-50  transition-colors text-sm sm:text-base flex items-center justify-center`}
          title={isCollapsed ? "Create Study" : undefined}
        >
          {isCollapsed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ) : (
            "Create Study"
          )}
        </motion.button>
        
        {/* <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShowSignup}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'py-2 px-2' : 'space-x-2 py-2 sm:py-3 px-3 sm:px-4'} bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base`}
          title={isCollapsed ? "Sign Up" : undefined}
        >
          <UserPlus className={`${isCollapsed ? 'w-4 h-4' : 'w-3 sm:w-4 h-3 sm:h-4'}`} />
          {!isCollapsed && <span>Sign Up</span>}
        </motion.button> */}
      </div>
    </div>
  );
};