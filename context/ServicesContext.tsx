import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockCategories, mockServices } from '../data/mock-data';
import type { Category, Service, Review, ServicesContextType } from '../types';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const useServices = (): ServicesContextType => {
    const context = useContext(ServicesContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentPublicUser } = useAuth();
    const { showToast } = useUI();
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [services, setServices] = useState<Service[]>(mockServices);

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
        setServices(prev => prev.filter(s => s.id !== serviceId));
        showToast('تم حذف الخدمة.');
    }, [showToast]);

    const handleToggleFavorite = useCallback((serviceId: number) => {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, isFavorite: !s.isFavorite } : s));
    }, []);

    const handleToggleHelpfulReview = useCallback((serviceId: number, reviewId: number) => {
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
    }, [showToast]);

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
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, reviews: s.reviews.filter(r => r.id !== reviewId) } : s));
        showToast('تم حذف التقييم.');
    }, [showToast]);

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