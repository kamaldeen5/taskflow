import React from 'react';
import { Category } from '../types';
import { CATEGORY_CONFIG, ALL_CATEGORIES_CONFIG } from '../constants';
import InsightCard from './InsightCard';

interface SidebarProps {
  activeCategory: Category | 'all';
  onFilterChange: (category: Category | 'all') => void;
  insight: string;
  isInsightLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onFilterChange, insight, isInsightLoading }) => {
  const AllIcon = ALL_CATEGORIES_CONFIG.icon;

  return (
    <aside className="w-64 flex-shrink-0 p-6 space-y-8 hidden md:block border-r border-gray-200 dark:border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-cyan-500 dark:text-cyan-400">
                <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071 1.052A32.11 32.11 0 0 1 12 11.625a32.11 32.11 0 0 1-1.072-8.287.75.75 0 0 0-1.071-1.052A33.61 33.61 0 0 0 7.5 12.75a33.61 33.61 0 0 0 2.322 8.414.75.75 0 0 0 1.408-.588 32.11 32.11 0 0 1-.22-2.625 32.11 32.11 0 0 1 2.046-7.23.75.75 0 0 0-.36-1.018A33.61 33.61 0 0 0 12.963 2.286Z" clipRule="evenodd" />
                <path d="M16.5 12.75a33.61 33.61 0 0 1-2.322 8.414.75.75 0 0 1-1.408-.588 32.11 32.11 0 0 0 .22-2.625 32.11 32.11 0 0 0-2.046-7.23.75.75 0 0 1 .36-1.018 33.61 33.61 0 0 1 5.212-2.433.75.75 0 0 1 .643 1.285A32.003 32.003 0 0 1 16.5 12.75Z" />
            </svg>
            TaskFlow AI
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your smart task manager</p>
      </div>
      
      <div id="desktop-categories" className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onFilterChange('all')}
              className={`w-full flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <AllIcon className="w-5 h-5" /> All Tasks
            </button>
          </li>
          {Object.values(Category).map((cat) => {
            const Config = CATEGORY_CONFIG[cat];
            const IsActive = activeCategory === cat;
            return (
              <li key={cat}>
                <button
                  onClick={() => onFilterChange(cat)}
                  className={`w-full flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors ${
                    IsActive
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Config.icon className="w-5 h-5" /> {cat}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div id="desktop-intelligence" className="space-y-4">
         <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Intelligence</h3>
         <InsightCard insight={insight} isLoading={isInsightLoading} />
      </div>
    </aside>
  );
};

export default Sidebar;