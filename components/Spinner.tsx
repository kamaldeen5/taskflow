
import React from 'react';

const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
    };
    return (
        <div
            className={`animate-spin rounded-full ${sizeClasses[size]} border-solid border-blue-500 border-t-transparent`}
            role="status"
            aria-label="Loading..."
        ></div>
    );
};

export default Spinner;
