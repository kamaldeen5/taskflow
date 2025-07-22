import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { analyzeTask, getDailyInsight } from './services/geminiService';
import { Category, Priority, Task, TaskStatus } from './types';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import AddTaskForm from './components/AddTaskForm';
import Spinner from './components/Spinner';
import ThemeToggle from './components/ThemeToggle';
import InsightCard from './components/InsightCard';
import CategoryFilters from './components/CategoryFilters';
import AuthPage from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';
import OnboardingWizard from './components/OnboardingWizard';


const App: React.FC = () => {
    const { currentUser, logout, updateCurrentUser } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [insight, setInsight] = useState<string>('');
    const [isInsightLoading, setIsInsightLoading] = useState<boolean>(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Theme state management
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && localStorage.theme) {
            return localStorage.theme;
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });
    
    // Effect for handling user-specific task storage and onboarding
    useEffect(() => {
        if (currentUser) {
            const savedTasksJson = localStorage.getItem(`tasks_${currentUser.id}`);
            const savedTasks = savedTasksJson ? JSON.parse(savedTasksJson, (key, value) => {
                if (key === 'createdAt') return new Date(value);
                return value;
            }) : [];
            setTasks(savedTasks);

            if (!currentUser.hasOnboarded) {
                setShowOnboarding(true);
                // Add a sample task for the tour if none exist
                if (savedTasks.length === 0) {
                     const sampleTask: Task = {
                        id: 'sample-task-1',
                        title: 'Review onboarding steps',
                        category: Category.Work,
                        priority: Priority.Medium,
                        status: TaskStatus.Pending,
                        createdAt: new Date(),
                        reasoning: "This is a sample task to guide you."
                    };
                    setTasks([sampleTask]);
                }
            }
        } else {
            setTasks([]);
        }
    }, [currentUser]);

    // Effect for saving tasks to localStorage whenever they change
    useEffect(() => {
        if (currentUser) {
            // Don't save the sample task to storage
            const tasksToSave = tasks.filter(t => t.id !== 'sample-task-1');
            localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasksToSave));
        }
    }, [tasks, currentUser]);


    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };


    const fetchInsight = useCallback(async () => {
         if (!currentUser || tasks.filter(t => t.status === TaskStatus.Pending).length === 0) {
            if (!currentUser) setInsight("Log in to get your daily insight.");
            else setInsight("Add a task to get your first insight!");
            setIsInsightLoading(false);
            return;
        }
        
        setIsInsightLoading(true);
        try {
            const newInsight = await getDailyInsight(tasks.filter(t => t.status === TaskStatus.Pending));
            setInsight(newInsight);
        } catch(e) {
            setInsight("Could not retrieve AI insight.");
        } finally {
            setIsInsightLoading(false);
        }
    }, [tasks, currentUser]);

    useEffect(() => {
        fetchInsight();
    }, [fetchInsight]);


    const handleAddTask = async (userInput: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const analysis = await analyzeTask(userInput);
            const newTask: Task = {
                id: crypto.randomUUID(),
                title: userInput,
                category: analysis.category,
                priority: analysis.priority,
                reasoning: analysis.reasoning,
                status: TaskStatus.Pending,
                createdAt: new Date(),
            };
            setTasks(prevTasks => [newTask, ...prevTasks]);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleToggleComplete = (taskId: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, status: task.status === TaskStatus.Pending ? TaskStatus.Completed : TaskStatus.Pending }
                : task
        ));
    };
    
    const handleOnboardingComplete = () => {
        if (currentUser) {
            updateCurrentUser({ hasOnboarded: true });
        }
        setShowOnboarding(false);
        // Remove sample task after tour
        setTasks(prev => prev.filter(t => t.id !== 'sample-task-1'));
    };

    const filteredTasks = useMemo(() => {
        if (activeCategory === 'all') {
            return tasks;
        }
        return tasks.filter(task => task.category === activeCategory);
    }, [tasks, activeCategory]);

    const pendingTasks = useMemo(() => filteredTasks.filter(t => t.status === TaskStatus.Pending), [filteredTasks]);
    const completedTasks = useMemo(() => filteredTasks.filter(t => t.status === TaskStatus.Completed), [filteredTasks]);

    if (!currentUser) {
        return <AuthPage />;
    }

    return (
        <div className="flex h-screen w-full font-sans text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900">
            {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
            <Sidebar 
                activeCategory={activeCategory} 
                onFilterChange={setActiveCategory} 
                insight={insight}
                isInsightLoading={isInsightLoading}
            />
            <main className="flex-1 flex flex-col bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
                 <header className="sticky top-0 z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div id="add-task-form" className="flex-1">
                            <AddTaskForm onAddTask={handleAddTask} isLoading={isLoading} />
                        </div>
                        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
                         <button
                            onClick={logout}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
                            aria-label="Logout"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                        </button>
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 text-center mt-2 text-sm">{error}</p>}
                </header>
                
                {/* --- MOBILE ONLY SECTION --- */}
                <div className="p-6 space-y-6 md:hidden">
                    <div id="mobile-insight-card" className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Intelligence</h3>
                        <InsightCard insight={insight} isLoading={isInsightLoading} />
                    </div>
                    <div id="mobile-category-filters" className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Categories</h3>
                        <CategoryFilters activeCategory={activeCategory} onFilterChange={setActiveCategory} />
                    </div>
                </div>

                <div className="flex-1 px-6 pb-6 md:p-6 space-y-8">
                    {isLoading && tasks.length === 0 && (
                        <div className="flex justify-center items-center h-full">
                            <Spinner />
                        </div>
                    )}

                    <div id="task-list">
                        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-4">In Progress ({pendingTasks.length})</h2>
                        {pendingTasks.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {pendingTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                 <p className="text-gray-500 dark:text-gray-400">
                                    {`Welcome, ${currentUser.email}!`}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">No pending tasks. Add one above to get started!</p>
                            </div>
                        )}
                    </div>
                    
                    {completedTasks.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-4">Completed ({completedTasks.length})</h2>
                             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {completedTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;