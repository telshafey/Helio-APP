import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { ToastMessage, UIContextType, Theme } from '../types';

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
    
    const [theme, setThemeState] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
            return storedTheme;
        }
        return 'system'; // Default to system preference
    });
    
    const [isSystemDark, setIsSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const isDarkMode = useMemo(() => {
        if (theme === 'system') return isSystemDark;
        return theme === 'dark';
    }, [theme, isSystemDark]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const setTheme = useCallback((newTheme: Theme) => {
        localStorage.setItem('theme', newTheme);
        setThemeState(newTheme);
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value: UIContextType = {
        theme,
        setTheme,
        isDarkMode,
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