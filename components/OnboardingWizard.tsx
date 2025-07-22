import React, { useState, useEffect, useLayoutEffect } from 'react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

interface Step {
    elementId?: string;
    mobileElementId?: string;
    desktopElementId?: string;
    title: string;
    description: string;
}

const onboardingSteps: Step[] = [
  {
    title: 'Welcome to TaskFlow AI!',
    description: 'Let\'s quickly walk through how to make the most of your new smart task manager.',
  },
  {
    elementId: 'add-task-form',
    title: '1. Add Your Tasks',
    description: 'Start by typing a task here. Use natural language like "Plan team meeting for tomorrow morning".',
  },
  {
    elementId: 'task-list',
    title: '2. See The AI Magic',
    description: 'Tasks are automatically categorized and prioritized. We\'ve added a sample task for you to see how it works.',
  },
  {
    desktopElementId: 'desktop-categories',
    mobileElementId: 'mobile-category-filters',
    title: '3. Filter With Ease',
    description: 'Use these filters to focus on what matters most, whether it\'s work, personal tasks, or something else.',
  },
  {
    desktopElementId: 'desktop-intelligence',
    mobileElementId: 'mobile-insight-card',
    title: '4. Get Daily Insights',
    description: 'Each day, our AI provides a tip based on your tasks to help you stay productive. You\'re all set!',
  },
];

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<Position | null>(null);
  const currentStep = onboardingSteps[step];
  const isLastStep = step === onboardingSteps.length - 1;

  const updateHighlight = () => {
    const isMobile = window.innerWidth < 768; // md breakpoint
    let elementId = currentStep.elementId;
    if (isMobile && currentStep.mobileElementId) {
        elementId = currentStep.mobileElementId;
    } else if (!isMobile && currentStep.desktopElementId) {
        elementId = currentStep.desktopElementId;
    }

    if (!elementId) {
        setHighlightStyle(null); // No element to highlight (e.g., welcome step)
        return;
    }

    const element = document.getElementById(elementId);
    if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightStyle({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } else {
        // If element is not found, maybe retry after a short delay
        setTimeout(updateHighlight, 100);
    }
  };

  useLayoutEffect(() => {
    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    return () => window.removeEventListener('resize', updateHighlight);
  }, [step]);


  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };
  
  const getTooltipPosition = (): React.CSSProperties => {
    if (!highlightStyle) { // Center for the welcome step
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    // Position tooltip below the element, but switch to above if not enough space
    const tooltipHeight = 150; // Approximate height of tooltip
    const spaceBelow = window.innerHeight - highlightStyle.top - highlightStyle.height;
    
    if (spaceBelow > tooltipHeight + 20) {
        return { top: `${highlightStyle.top + highlightStyle.height + 16}px`, left: `${highlightStyle.left + highlightStyle.width / 2}px`, transform: 'translateX(-50%)' };
    } else {
        return { top: `${highlightStyle.top - 16}px`, left: `${highlightStyle.left + highlightStyle.width / 2}px`, transform: 'translate(-50%, -100%)' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 transition-opacity animate-fade-in">
        {/* Spotlight effect */}
        <div
            className="fixed inset-0 bg-black/50 transition-all duration-300 ease-in-out"
            style={{
                clipPath: highlightStyle 
                    ? `path(evenodd, "M0 0 H ${window.innerWidth} V ${window.innerHeight} H 0 Z M ${highlightStyle.left - 8} ${highlightStyle.top - 8} H ${highlightStyle.left + highlightStyle.width + 8} V ${highlightStyle.top + highlightStyle.height + 8} H ${highlightStyle.left - 8} Z")`
                    : 'none',
            }}
        />
        
        {/* Tooltip */}
        <div
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm m-auto p-5 space-y-4 z-50 transition-all duration-300 ease-in-out"
            style={getTooltipPosition()}
        >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentStep.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{currentStep.description}</p>
            
            <div className="flex justify-between items-center pt-2">
                <button
                    onClick={onComplete}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    Skip Tour
                </button>
                <div className="flex items-center gap-2">
                    {step > 0 && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-1.5 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className="px-4 py-1.5 rounded-md text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500"
                    >
                        {isLastStep ? 'Get Started!' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

// Simple CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
`;
document.head.append(style);

export default OnboardingWizard;
