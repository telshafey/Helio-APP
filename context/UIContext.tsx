import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { ToastMessage, UIContextType, Theme, ConfirmationState } from '../types';

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};

const initialConfirmationState: ConfirmationState = {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
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
    const [confirmation, setConfirmation] = useState<ConfirmationState>(initialConfirmationState);

    const [dismissedNotificationIds, setDismissedNotificationIds] = useState<Set<number>>(() => {
        try {
            const item = window.localStorage.getItem('dismissedNotificationIds');
            return item ? new Set(JSON.parse(item)) : new Set();
        } catch (error) {
            console.error(error);
            return new Set();
        }
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem('dismissedNotificationIds', JSON.stringify(Array.from(dismissedNotificationIds)));
        } catch (error) {
            console.error(error);
        }
    }, [dismissedNotificationIds]);

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

    const showConfirmation = useCallback((title: string, message: string, onConfirm: () => void) => {
        setConfirmation({ isOpen: true, title, message, onConfirm });
    }, []);

    const hideConfirmation = useCallback(() => {
        setConfirmation(initialConfirmationState);
    }, []);

    const dismissNotification = useCallback((id: number) => {
        setDismissedNotificationIds(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    }, []);
    
    const dismissAllNotifications = useCallback((allIds: number[]) => {
        setDismissedNotificationIds(prev => {
            const newSet = new Set(prev);
            allIds.forEach(id => newSet.add(id));
            return newSet;
        });
    }, []);

    const value: UIContextType = {
        theme,
        setTheme,
        isDarkMode,
        toasts,
        showToast,
        dismissToast,
        confirmation,
        showConfirmation,
        hideConfirmation,
        dismissedNotificationIds,
        dismissNotification,
        dismissAllNotifications,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};