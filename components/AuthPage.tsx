import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-cyan-500 dark:text-cyan-400">
                            <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071 1.052A32.11 32.11 0 0 1 12 11.625a32.11 32.11 0 0 1-1.072-8.287.75.75 0 0 0-1.071-1.052A33.61 33.61 0 0 0 7.5 12.75a33.61 33.61 0 0 0 2.322 8.414.75.75 0 0 0 1.408-.588 32.11 32.11 0 0 1-.22-2.625 32.11 32.11 0 0 1 2.046-7.23.75.75 0 0 0-.36-1.018A33.61 33.61 0 0 0 12.963 2.286Z" clipRule="evenodd" />
                            <path d="M16.5 12.75a33.61 33.61 0 0 1-2.322 8.414.75.75 0 0 1-1.408-.588 32.11 32.11 0 0 0 .22-2.625 32.11 32.11 0 0 0-2.046-7.23.75.75 0 0 1 .36-1.018 33.61 33.61 0 0 1 5.212-2.433.75.75 0 0 1 .643 1.285A32.003 32.003 0 0 1 16.5 12.75Z" />
                        </svg>
                        TaskFlow AI
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isLogin ? 'Welcome back! Please sign in.' : 'Create an account to get started.'}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border-2 border-transparent focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all placeholder-gray-500"
                            placeholder="Email address"
                        />
                    </div>
                    <div className="relative">
                         <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border-2 border-transparent focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all placeholder-gray-500"
                            placeholder="Password"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-400 disabled:cursor-not-allowed"
                        >
                            {loading ? <Spinner size="sm"/> : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="ml-2 font-medium text-cyan-600 hover:text-cyan-500">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
