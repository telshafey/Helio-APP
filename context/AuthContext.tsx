import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockUsers, mockAdmins } from '../data/mock-data';
import type { AppUser, AdminUser, AuthContextType } from '../types';
import { useUI } from './UIContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useUI(); // Dependent on UIContext for toasts
    const [users, setUsers] = useState<AppUser[]>(mockUsers); // Keep user list here for auth purposes
    
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [currentPublicUser, setCurrentPublicUser] = useState<AppUser | null>(() => {
        const storedUser = sessionStorage.getItem('currentPublicUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const isAuthenticated = !!currentUser;
    const isPublicAuthenticated = !!currentPublicUser;

    const login = useCallback((user: AdminUser) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null);
    }, []);

    const publicLogin = useCallback((email: string, password?: string): boolean => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            if (user.password && user.password !== password) {
                showToast('كلمة المرور غير صحيحة.', 'error');
                return false;
            }
            sessionStorage.setItem('currentPublicUser', JSON.stringify(user));
            setCurrentPublicUser(user);
            showToast(`أهلاً بعودتك، ${user.name}!`);
            return true;
        }
        showToast('البريد الإلكتروني غير موجود.', 'error');
        return false;
    }, [users, showToast]);

    const publicLogout = useCallback(() => {
        sessionStorage.removeItem('currentPublicUser');
        setCurrentPublicUser(null);
        showToast('تم تسجيل خروجك بنجاح.');
    }, [showToast]);

    const register = useCallback((newUserData: Omit<AppUser, 'id' | 'joinDate' | 'avatar' | 'status'>): boolean => {
        if (users.some(u => u.email.toLowerCase() === newUserData.email.toLowerCase())) {
            showToast('هذا البريد الإلكتروني مسجل بالفعل.', 'error');
            return false;
        }
        const newUser: AppUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            name: newUserData.name,
            email: newUserData.email,
            password: newUserData.password,
            avatar: `https://picsum.photos/200/200?random=${Date.now()}`,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
        };
        setUsers(prev => [newUser, ...prev]);
        sessionStorage.setItem('currentPublicUser', JSON.stringify(newUser));
        setCurrentPublicUser(newUser);
        showToast(`مرحباً بك، ${newUser.name}! تم إنشاء حسابك بنجاح.`);
        return true;
    }, [users, showToast]);

    const updateProfile = useCallback((updatedUser: Omit<AppUser, 'joinDate'>) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
        setCurrentPublicUser(prev => prev ? { ...prev, ...updatedUser } : null);
        if (currentPublicUser) {
            sessionStorage.setItem('currentPublicUser', JSON.stringify({ ...currentPublicUser, ...updatedUser }));
        }
        showToast('تم تحديث ملفك الشخصي بنجاح!');
    }, [currentPublicUser, showToast]);

    const value: AuthContextType = {
        currentUser,
        isAuthenticated,
        login,
        logout,
        currentPublicUser,
        isPublicAuthenticated,
        publicLogin,
        publicLogout,
        register,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * A custom hook to check if the current admin user has the required permissions.
 * @param allowedRoles - An array of roles that are allowed to perform the action.
 * @returns `true` if the user has permission, otherwise `false`.
 * The 'مدير عام' role has all permissions by default.
 */
export const useHasPermission = (allowedRoles: (AdminUser['role'])[]): boolean => {
    const { currentUser } = useAuth();
    
    // No user, no permissions.
    if (!currentUser) {
        return false;
    }
    
    // Super admin ('مدير عام') has all permissions.
    if (currentUser.role === 'مدير عام') {
        return true;
    }
    
    // Check if the user's role is in the allowed list.
    return allowedRoles.includes(currentUser.role);
};
