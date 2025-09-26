import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { 
    mockNews, mockNotifications, 
    mockEmergencyContacts, mockServiceGuides,
    mockUsers,
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes,
    mockPublicPagesContent,
    mockAdvertisements,
    mockAdmins,
    mockAuditLogs,
    mockMarketplaceItems,
    mockJobPostings,
    mockServices,
    mockCategories,
    mockProperties
} from '../data/mock-data';
import type { 
    News, Notification,
    EmergencyContact, ServiceGuide, AppUser, AdminUser,
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute,
    PublicPagesContent,
    Advertisement, DataContextType, AuditLog,
    MarketplaceItem, JobPosting, ListingStatus,
    Service, Category, Review, Property
} from '../types';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useUI();
    const { currentPublicUser } = useAuth();

    // Services & Properties State
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [services, setServices] = useState<Service[]>(mockServices);
    const [properties, setProperties] = useState<Property[]>(mockProperties);

    // Other State
    const [news, setNews] = useState<News[]>(mockNews);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(mockAdvertisements);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [users, setUsers] = useState<AppUser[]>(mockUsers);
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(mockPublicPagesContent);
    const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
    const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);
    const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings);

    // Transportation State
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);

    // --- GENERIC HELPERS ---
    const genericSave = <T extends { id?: number }>(
        items: T[],
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        newItemData: Partial<T> & { id?: number },
        defaults: Partial<Omit<T, 'id'>>,
        itemName: string
    ) => {
        if (newItemData.id) {
            setItems(prev => prev.map(item => item.id === newItemData.id ? { ...item, ...newItemData } : item));
            showToast(`تم تحديث ${itemName}.`);
        } else {
            const newItem = {
                ...defaults,
                ...newItemData,
                id: Math.max(0, ...items.map(i => i.id ?? 0)) + 1,
            };
            setItems(prev => [newItem as T, ...prev]);
            showToast(`تمت إضافة ${itemName}.`);
        }
    };
    
    const genericDelete = <T extends {id: number}>(
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        itemId: number,
        itemName: string
    ) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        showToast(`تم حذف ${itemName}.`);
    };

    // --- SERVICES & REVIEWS HANDLERS ---
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

    // --- PROPERTIES HANDLERS ---
     const handleSaveProperty = useCallback((propertyData: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => {
        if (propertyData.id) {
            setProperties(prev => prev.map(p => (p.id === propertyData.id ? { ...p, ...propertyData } : p)));
            showToast('تم تحديث العقار بنجاح!');
        } else {
            const newProperty: Property = {
                id: Math.max(0, ...properties.map(p => p.id)) + 1,
                views: 0,
                creationDate: new Date().toISOString().split('T')[0],
                ...propertyData,
            };
            setProperties(prev => [newProperty, ...prev]);
            showToast('تمت إضافة العقار بنجاح!');
        }
    }, [properties, showToast]);

    const handleDeleteProperty = useCallback((propertyId: number) => {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        showToast('تم حذف العقار.');
    }, [showToast]);
    
    // --- USER & ADMIN HANDLERS ---
    const requestAccountDeletion = useCallback((userId: number) => {
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: 'deletion_requested' } : u)));
        showToast('تم استلام طلب حذف حسابك بنجاح.');
    }, [showToast]);
        
    const handleSaveUser = useCallback((userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => {
        if (userData.id) {
            setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u));
            showToast('تم تحديث بيانات المستخدم.');
        } else {
            const newUser: AppUser = {
                id: Math.max(...users.map(u => u.id), 0) + 1, joinDate: new Date().toISOString().split('T')[0], ...userData
            };
            setUsers(prev => [newUser, ...prev]);
            showToast('تمت إضافة المستخدم.');
        }
    }, [users, showToast]);
    
    const handleDeleteUser = useCallback((userId: number) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        showToast('تم حذف المستخدم.');
    }, [showToast]);

    const handleSaveAdmin = useCallback((adminData: Omit<AdminUser, 'id'> & { id?: number }) => {
        if (adminData.id) {
            setAdmins(prev => prev.map(a => a.id === adminData.id ? { ...a, ...adminData } : a));
            showToast('تم تحديث بيانات المدير.');
        } else {
            const newAdmin: AdminUser = { id: Math.max(...admins.map(a => a.id), 0) + 1, ...adminData };
            setAdmins(prev => [newAdmin, ...prev]);
            showToast('تمت إضافة المدير.');
        }
    }, [admins, showToast]);

    const handleDeleteAdmin = useCallback((adminId: number) => {
        setAdmins(prev => prev.filter(a => a.id !== adminId));
        showToast('تم حذف المدير.');
    }, [showToast]);
    
    // --- OTHER DATA HANDLERS ---
    const handleSaveNews = useCallback((newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => {
        genericSave<News>(news, setNews, newsItem, {author: 'Admin', date: new Date().toISOString().split('T')[0], views: 0 }, 'الخبر');
    }, [news]);

    const handleDeleteNews = useCallback((newsId: number) => genericDelete(setNews, newsId, 'الخبر'), []);

    const handleSaveNotification = useCallback((notification: Omit<Notification, 'id'> & { id?: number }) => genericSave<Notification>(notifications, setNotifications, notification, {}, 'الإشعار'), [notifications]);

    const handleDeleteNotification = useCallback((notificationId: number) => genericDelete(setNotifications, notificationId, 'الإشعار'), []);
    
    const handleSaveAdvertisement = useCallback((ad: Omit<Advertisement, 'id'> & { id?: number }) => genericSave<Advertisement>(advertisements, setAdvertisements, ad, {}, 'الإعلان'), [advertisements]);
    
    const handleDeleteAdvertisement = useCallback((adId: number) => genericDelete(setAdvertisements, adId, 'الإعلان'), []);
    
    const handleSaveEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'> & { id?: number }) => genericSave<EmergencyContact>(emergencyContacts, setEmergencyContacts, contact, {}, 'رقم الطوارئ'), [emergencyContacts]);
    
    const handleDeleteEmergencyContact = useCallback((contactId: number) => genericDelete(setEmergencyContacts, contactId, 'رقم الطوارئ'), []);

    const handleSaveServiceGuide = useCallback((guide: Omit<ServiceGuide, 'id'> & { id?: number }) => genericSave<ServiceGuide>(serviceGuides, setServiceGuides, guide, {}, 'دليل الخدمة'), [serviceGuides]);
    
    const handleDeleteServiceGuide = useCallback((guideId: number) => genericDelete(setServiceGuides, guideId, 'دليل الخدمة'), []);

    const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') setInternalSupervisor(supervisor);
        else setExternalSupervisor(supervisor);
        showToast('تم حفظ بيانات المشرف.');
    }, [showToast]);

    const handleSaveDriver = useCallback((driver: Omit<Driver, 'id'> & { id?: number }) => genericSave<Driver>(internalDrivers, setInternalDrivers, driver, {}, 'السائق'), [internalDrivers]);
    
    const handleDeleteDriver = useCallback((driverId: number) => genericDelete(setInternalDrivers, driverId, 'السائق'), []);

    const handleSaveRoute = useCallback((route: Omit<ExternalRoute, 'id'> & { id?: number }) => genericSave<ExternalRoute>(externalRoutes, setExternalRoutes, route, {}, 'المسار'), [externalRoutes]);

    const handleDeleteRoute = useCallback((routeId: number) => genericDelete(setExternalRoutes, routeId, 'المسار'), []);
    
    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
        showToast('تم حفظ الجدول الأسبوعي.');
    }, [showToast]);

    const handleUpdatePublicPageContent = useCallback(<K extends keyof PublicPagesContent>(page: K, content: PublicPagesContent[K]) => {
        setPublicPagesContent(prev => ({...prev, [page]: content}));
        showToast('تم تحديث محتوى الصفحة بنجاح.');
    }, [showToast]);

    // Marketplace Handlers
    const handleSaveMarketplaceItem = useCallback((item: Omit<MarketplaceItem, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: number, duration: number }) => {
        if (!currentPublicUser) {
            showToast('يجب تسجيل الدخول لإضافة إعلان.', 'error');
            return;
        }
        const creationDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(creationDate.getDate() + item.duration);

        const newItemData = {
            ...item,
            status: 'pending' as ListingStatus,
            creationDate: creationDate.toISOString().split('T')[0],
            expirationDate: expirationDate.toISOString().split('T')[0],
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
        };
        
        genericSave<MarketplaceItem>(marketplaceItems, setMarketplaceItems, newItemData, {}, 'الإعلان');
        showToast('تم إرسال إعلانك للمراجعة.');
    }, [marketplaceItems, currentPublicUser, showToast]);

    const handleDeleteMarketplaceItem = useCallback((itemId: number) => {
        genericDelete(setMarketplaceItems, itemId, 'إعلان البيع');
    }, []);

    const handleUpdateMarketplaceItemStatus = useCallback((itemId: number, status: ListingStatus, rejectionReason?: string) => {
        setMarketplaceItems(prev => prev.map(item => item.id === itemId ? { ...item, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : item));
        showToast(`تم تحديث حالة الإعلان إلى "${status}".`);
    }, [showToast]);
    
    // Job Handlers
    const handleSaveJobPosting = useCallback((job: Omit<JobPosting, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: number, duration: number }) => {
        if (!currentPublicUser) {
            showToast('يجب تسجيل الدخول لإضافة وظيفة.', 'error');
            return;
        }
        const creationDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(creationDate.getDate() + job.duration);
        
        const newJobData = {
             ...job,
            status: 'pending' as ListingStatus,
            creationDate: creationDate.toISOString().split('T')[0],
            expirationDate: expirationDate.toISOString().split('T')[0],
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
        };
        
        genericSave<JobPosting>(jobPostings, setJobPostings, newJobData, {}, 'إعلان الوظيفة');
        showToast('تم إرسال إعلان الوظيفة للمراجعة.');
    }, [jobPostings, currentPublicUser, showToast]);
    
    const handleDeleteJobPosting = useCallback((jobId: number) => {
        genericDelete(setJobPostings, jobId, 'إعلان الوظيفة');
    }, []);
    
    const handleUpdateJobPostingStatus = useCallback((jobId: number, status: ListingStatus, rejectionReason?: string) => {
        setJobPostings(prev => prev.map(job => job.id === jobId ? { ...job, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : job));
        showToast(`تم تحديث حالة الوظيفة إلى "${status}".`);
    }, [showToast]);


    const value: DataContextType = {
        categories, services, properties,
        handleSaveService, handleDeleteService, handleToggleFavorite,
        handleToggleHelpfulReview, addReview, handleUpdateReview, handleDeleteReview, handleReplyToReview,
        handleSaveProperty, handleDeleteProperty,
        news, notifications, advertisements,
        emergencyContacts, serviceGuides, users, admins, auditLogs,
        transportation: {
            internalSupervisor, externalSupervisor, internalDrivers,
            weeklySchedule, externalRoutes,
        },
        publicPagesContent,
        marketplaceItems,
        jobPostings,
        requestAccountDeletion, handleSaveUser, handleDeleteUser,
        handleSaveAdmin, handleDeleteAdmin, handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification, handleSaveAdvertisement, handleDeleteAdvertisement,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide, handleSaveSupervisor,
        handleSaveDriver, handleDeleteDriver, handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleUpdatePublicPageContent,
        handleSaveMarketplaceItem, handleDeleteMarketplaceItem, handleUpdateMarketplaceItemStatus,
        handleSaveJobPosting, handleDeleteJobPosting, handleUpdateJobPostingStatus
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};