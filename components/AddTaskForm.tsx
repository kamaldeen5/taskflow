import React, { useState } from 'react';
import Spinner from './Spinner';

interface AddTaskFormProps {
  onAddTask: (userInput: string) => Promise<void>;
  isLoading: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, isLoading }) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    await onAddTask(userInput);
    setUserInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="e.g., Finish client proposal by Friday"
        className="w-full pl-4 pr-24 sm:pr-28 py-3 bg-gray-200/80 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-full border-2 border-transparent focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-700 focus:outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !userInput.trim()}
        className="absolute inset-y-0 right-0 m-1.5 px-4 sm:px-6 flex items-center justify-center font-semibold text-white bg-cyan-600 rounded-full hover:bg-cyan-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? <Spinner size="sm" /> : 'Add Task'}
      </button>
    </form>
  );
};

export default AddTaskForm;
