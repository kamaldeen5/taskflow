import React from 'react';
import { Task, TaskStatus } from '../types';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../constants';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete }) => {
  const isCompleted = task.status === TaskStatus.Completed;
  const CategoryIcon = CATEGORY_CONFIG[task.category].icon;

  return (
    <div
      className={`relative flex flex-col justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1 ${
        isCompleted ? 'opacity-50' : ''
      }`}
    >
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${CATEGORY_CONFIG[task.category].color}`}>
                    <CategoryIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{task.category}</p>
                     <h3 className={`font-bold text-gray-900 dark:text-white ${isCompleted ? 'line-through' : ''}`}>
                        {task.title}
                     </h3>
                </div>
            </div>
            <div className={`flex items-center gap-2 text-sm font-semibold ${PRIORITY_CONFIG[task.priority].textColor}`}>
                <div className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[task.priority].color}`}></div>
                {task.priority}
            </div>
        </div>

      {task.reasoning && (
        <p className="mt-3 text-xs text-gray-600 dark:text-gray-500 italic border-l-2 border-gray-200 dark:border-gray-700 pl-2">
            AI: "{task.reasoning}"
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
        <p className="text-xs text-gray-500">
            Added: {task.createdAt.toLocaleDateString()}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`p-2 rounded-full transition-colors ${isCompleted ? 'text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 hover:bg-green-500/20 dark:hover:bg-green-500/30' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'}`}
            aria-label={isCompleted ? "Mark as pending" : "Mark as complete"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-500 dark:text-gray-400 rounded-full transition-colors hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.036C6.91 2.75 6 3.704 6 4.884v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;