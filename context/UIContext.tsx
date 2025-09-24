import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { ToastMessage, UIContextType } from '../types';

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme ? storedTheme === 'dark' : true; // Default to dark
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value: UIContextType = {
        isDarkMode,
        toggleDarkMode,
        toasts,
        showToast,
        dismissToast,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};
