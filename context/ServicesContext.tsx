import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockServices, mockCategories } from '../data/mock-data';
import type { Service, Category, Review, ServicesContextType } from '../types';
import { useUI } from './UIContext';
import { useAuth } from './AuthContext';

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const useServices = (): ServicesContextType => {
    const context = useContext(ServicesContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast, showConfirmation } = useUI();
    const { currentPublicUser } = useAuth();

    const [services, setServices] = useState<Service[]>(mockServices);
    const [categories, setCategories] = useState<Category[]>(mockCategories);

    const genericDelete = useCallback((setItems: React.Dispatch<React.SetStateAction<any[]>>, itemId: number, itemType: string) => {
        showConfirmation(
            `تأكيد حذف ${itemType}`,
            `هل أنت متأكد أنك تريد حذف هذا الـ ${itemType}؟ لا يمكن التراجع عن هذا الإجراء.`,
            () => {
                setItems(prev => prev.filter(item => item.id !== itemId));
                showToast(`تم حذف ${itemType}.`);
            }
        );
    }, [showConfirmation, showToast]);

    const handleSaveService = useCallback((serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => {
        if (serviceData.id) {
            setServices(prev => prev.map(s => s.id === serviceData.id ? { ...s, ...serviceData } : s));
            showToast('تم تحديث الخدمة بنجاح!');
        } else {
            const newService: Service = {
                id: Math.max(...services.map(s => s.id), 0) + 1,
                rating: 0, reviews: [], isFavorite: false, views: 0, creationDate: new Date().toISOString().split('T')[0],
                ...serviceData,
            };
            setServices(prev => [newService, ...prev]);
            showToast('تمت إضافة الخدمة بنجاح!');
        }
    }, [services, showToast]);
    
    const handleDeleteService = useCallback((serviceId: number) => {
        genericDelete(setServices, serviceId, 'الخدمة');
    }, [genericDelete]);

    const handleToggleFavorite = useCallback((serviceId: number) => {
        if (!currentPublicUser) {
            showToast('يرجى تسجيل الدخول أولاً لإضافة الخدمات إلى المفضلة.', 'error');
            return;
        }
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, isFavorite: !s.isFavorite } : s));
    }, [currentPublicUser, showToast]);

    const handleToggleHelpfulReview = useCallback((serviceId: number, reviewId: number) => {
        if (!currentPublicUser) {
            showToast('يرجى تسجيل الدخول أولاً للتفاعل مع التقييمات.', 'error');
            return;
        }
        setServices(prevServices =>
            prevServices.map(s => {
                if (s.id === serviceId) {
                    return {
                        ...s,
                        reviews: s.reviews.map(r =>
                            r.id === reviewId
                                ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } // Simplified toggle to increment
                                : r
                        ),
                    };
                }
                return s;
            })
        );
        showToast('شكراً لملاحظاتك!');
    }, [currentPublicUser, showToast]);

    const addReview = useCallback((serviceId: number, reviewData: Omit<Review, 'id' | 'date' | 'adminReply' | 'username' | 'avatar' | 'userId'>) => {
        if (!currentPublicUser) return;
        const newReview: Review = {
            id: Date.now(),
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
            ...reviewData,
            date: new Date().toISOString().split('T')[0],
        };
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, reviews: [newReview, ...s.reviews] } : s));
        showToast('شكراً لك، تم إضافة تقييمك بنجاح!');
    }, [currentPublicUser, showToast]);

    const handleUpdateReview = useCallback((serviceId: number, reviewId: number, comment: string) => {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, reviews: s.reviews.map(r => r.id === reviewId ? { ...r, comment } : r) } : s));
        showToast('تم تحديث التقييم.');
    }, [showToast]);

    const handleDeleteReview = useCallback((serviceId: number, reviewId: number) => {
        showConfirmation(
            'تأكيد حذف التقييم',
            'هل أنت متأكد من حذف هذا التقييم؟',
            () => {
                setServices(prev => prev.map(s => s.id === serviceId ? { ...s, reviews: s.reviews.filter(r => r.id !== reviewId) } : s));
                showToast('تم حذف التقييم.');
            }
        );
    }, [showConfirmation, showToast]);

    const handleReplyToReview = useCallback((serviceId: number, reviewId: number, reply: string) => {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, reviews: s.reviews.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r) } : s));
        showToast('تم إضافة الرد بنجاح.');
    }, [showToast]);

    const value: ServicesContextType = {
        categories,
        services,
        handleSaveService,
        handleDeleteService,
        handleToggleFavorite,
        handleToggleHelpfulReview,
        addReview,
        handleUpdateReview,
        handleDeleteReview,
        handleReplyToReview,
    };

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    );
};
