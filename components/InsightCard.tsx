import React from 'react';

interface InsightCardProps {
    insight: string;
    isLoading: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, isLoading }) => {
    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                    </svg>
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">AI Insight</h4>
                     {isLoading ? 
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mt-1 animate-pulse"></div> : 
                        <p className="text-sm text-gray-600 dark:text-gray-300">{insight}</p>
                     }
                </div>
            </div>
        </div>
    );
}

export default InsightCard;