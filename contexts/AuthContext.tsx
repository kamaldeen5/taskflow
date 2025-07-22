import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

// Storage keys
const USERS_STORAGE_KEY = 'taskflow_users';
const SESSION_STORAGE_KEY = 'taskflow_session_userId';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for localStorage
const getUsersFromStorage = (): User[] => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsersToStorage = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for a logged-in user session on initial load
        try {
            const userId = localStorage.getItem(SESSION_STORAGE_KEY);
            if (userId) {
                const users = getUsersFromStorage();
                const user = users.find(u => u.id === userId);
                if (user) {
                    // Ensure hasOnboarded exists for backward compatibility
                    if (user.hasOnboarded === undefined) {
                        user.hasOnboarded = true; // Assume existing users are onboarded
                    }
                    setCurrentUser(user);
                }
            }
        } catch (error) {
            console.error("Failed to load user session:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    
    const updateCurrentUser = (updates: Partial<User>) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);

        // Also update the user in the main user list in storage
        const users = getUsersFromStorage();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex > -1) {
            users[userIndex] = updatedUser;
            saveUsersToStorage(users);
        }
    };

    const register = async (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const users = getUsersFromStorage();
                if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
                    return reject(new Error('An account with this email already exists.'));
                }

                const newUser: User = {
                    id: crypto.randomUUID(),
                    email,
                    passwordHash: password, // Not a real hash!
                    hasOnboarded: false, // Mark new user for onboarding
                };

                const updatedUsers = [...users, newUser];
                saveUsersToStorage(updatedUsers);

                // Automatically log in the new user
                localStorage.setItem(SESSION_STORAGE_KEY, newUser.id);
                setCurrentUser(newUser);
                resolve(newUser);
            }, 500);
        });
    };

    const login = async (email: string, password: string): Promise<User> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const users = getUsersFromStorage();
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (!user || user.passwordHash !== password) {
                    return reject(new Error('Invalid email or password.'));
                }

                 // Ensure hasOnboarded exists for backward compatibility
                if (user.hasOnboarded === undefined) {
                    user.hasOnboarded = true; // Assume existing users are onboarded
                }

                localStorage.setItem(SESSION_STORAGE_KEY, user.id);
                setCurrentUser(user);
                resolve(user);
            }, 500);
        });
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
    };

    const value = {
        currentUser,
        loading,
        register,
        login,
        logout,
        updateCurrentUser,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};