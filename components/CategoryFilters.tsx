import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface CategoryFiltersProps {
  activeCategory: Category | 'all';
  onFilterChange: (category: Category | 'all') => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ activeCategory, onFilterChange }) => {
  const allCategories: Array<Category | 'all'> = ['all', ...Object.values(Category)];

  return (
    <div className="no-scrollbar -mx-6 px-6">
        <div className="flex items-center space-x-2 pb-2 overflow-x-auto">
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onFilterChange(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                    isActive
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat === 'all' ? 'All Tasks' : cat}
                </button>
              );
            })}
        </div>
    </div>
  );
};

export default CategoryFilters;
