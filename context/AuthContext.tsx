import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockUsers, mockAdmins } from '../data/mock-data';
import type { AppUser, AuthContextType, AdminUser } from '../types';
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
    
    const [admins] = useState<AdminUser[]>(mockAdmins);
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

    const login = useCallback((email: string, password?: string): boolean => {
        const admin = admins.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (admin) {
            sessionStorage.setItem('currentUser', JSON.stringify(admin));
            setCurrentUser(admin);
            showToast(`أهلاً بعودتك، ${admin.name}!`);
            return true;
        }
        return false;
    }, [admins, showToast]);

    const logout = useCallback(() => {
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null);
        showToast('تم تسجيل خروجك بنجاح.');
    }, [showToast]);

    const hasPermission = useCallback((roles: Array<AdminUser['role']>) => {
        if (!currentUser) return false;
        return roles.includes(currentUser.role);
    }, [currentUser]);


    const publicLogin = useCallback((email: string, password?: string): boolean => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            if (user.password !== password) {
                showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'error');
                return false;
            }
            if (user.status === 'banned') {
                showToast('هذا الحساب محظور ولا يمكنه تسجيل الدخول.', 'error');
                return false;
            }
            sessionStorage.setItem('currentPublicUser', JSON.stringify(user));
            setCurrentPublicUser(user);
            showToast(`أهلاً بعودتك، ${user.name}!`);
            return true;
        }
        showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'error');
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

    const updateProfile = useCallback((updatedUser: Omit<AppUser, 'joinDate' | 'status' | 'password'>) => {
        const userToUpdate = users.find(u => u.id === updatedUser.id);
        if (!userToUpdate) return;
        const finalUser = { ...userToUpdate, ...updatedUser };

        setUsers(prev => prev.map(u => u.id === updatedUser.id ? finalUser : u));
        setCurrentPublicUser(prev => prev ? finalUser : null);
        if (currentPublicUser) {
            sessionStorage.setItem('currentPublicUser', JSON.stringify(finalUser));
        }
        showToast('تم تحديث ملفك الشخصي بنجاح!');
    }, [users, currentPublicUser, showToast]);

    const value: AuthContextType = {
        currentUser,
        isAuthenticated,
        login,
        logout,
        hasPermission,
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