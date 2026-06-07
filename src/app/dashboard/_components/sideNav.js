import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
} from 'lucide-react';

const navigation = [
  { id: 'studies', label: 'Studies', icon: BookOpen, href: '/studies' },
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'scores', label: 'Scores & Results', icon: BarChart3 },
];

export const Sidebar = ({ activeSection, onSectionChange, onCreateStudy, onShowSignup, isCollapsed, setIsCollapsed }) => {
  const router = useRouter();

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64 sm:w-72'} bg-off-white border-r border-grey-25 flex flex-col h-screen transition-all duration-300 fixed left-0 top-0 z-50`}>
      {/* Header */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-b border-grey-25 flex items-center gap-3`}>
        {isCollapsed ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
            <span className="text-h5 font-bold">A</span>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-h4 font-bold text-grey-200 poppins-font">
              Aurify AI
            </h1>
            <p className="truncate text-h6 text-grey-100 inter-font">
              Study workspace
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed((current) => !current)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-sm border border-grey-25 bg-white text-grey-100 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-3'} space-y-1.5`}>
        {navigation.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => {
              if (item.href) {
                router.push(item.href);
                return;
              }
              onSectionChange(item.id);
            }}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3'} rounded-md text-left transition-all ${
              activeSection === item.id
                ? 'bg-accent-25 text-primary font-semibold'
                : 'text-p-text-darker hover:bg-white hover:text-grey-200'
            } text-h5`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </motion.button>
        ))}
      </nav>

      {/* Action Buttons */}
      <div className={`${isCollapsed ? 'p-2' : 'p-3'} border-t border-grey-25`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateStudy}
          className={`w-full bg-primary text-white ${isCollapsed ? 'px-2 py-2.5' : 'gap-2 px-3 py-3'} rounded-md font-semibold hover:bg-primary-200 transition-colors text-h5 flex items-center justify-center`}
          title={isCollapsed ? "Create Study" : undefined}
        >
          {isCollapsed ? (
            <Plus className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Create Study</span>
            </>
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
    </aside>
  );
};
