import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { 
    mockCategories, mockServices, mockNews, mockNotifications, 
    mockProperties, mockEmergencyContacts, mockServiceGuides,
    mockUsers, mockAdmins, mockPosts,
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes,
    mockPublicPagesContent,
    mockAdvertisements
} from '../data/mock-data';
// FIX: Add missing 'ExternalRoute' type import to resolve compilation errors.
import type { 
    Category, Service, Review, News, Notification, Property, 
    EmergencyContact, ServiceGuide, AppContextType, AppUser, AdminUser,
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute,
    AuditLog, PublicPagesContent, ToastMessage, Post, Comment,
    Advertisement
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

// FIX: Defined and exported useAppContext to be used globally.
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const useHasPermission = (requiredRoles: AdminUser['role'][]) => {
    const { currentUser } = useAppContext();
    if (!currentUser) return false;
    // Super admin can do anything
    if (currentUser.role === 'مدير عام') return true;
    return requiredRoles.includes(currentUser.role);
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [services, setServices] = useState<Service[]>(mockServices);
    const [news, setNews] = useState<News[]>(mockNews);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(mockAdvertisements);
    const [properties, setProperties] = useState<Property[]>(mockProperties);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [users, setUsers] = useState<AppUser[]>(mockUsers);
    const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(mockPublicPagesContent);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);


    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        return true; // Default to dark mode on first visit
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    const login = useCallback((user: AdminUser) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null);
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);


    const logActivity = useCallback((action: string, details: string) => {
        const newLog: AuditLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: currentUser?.name || 'زائر',
            action,
            details,
        };
        setAuditLogs(prevLogs => [newLog, ...prevLogs]);
    }, [currentUser]);

    // Transportation State
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);
    
    // Public User Auth handlers
    const publicLogin = useCallback((email: string, password?: string): boolean => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            // For mock data, only check password if it exists
            if (user.password && user.password !== password) {
                return false;
            }
            sessionStorage.setItem('currentPublicUser', JSON.stringify(user));
            setCurrentPublicUser(user);
            showToast(`أهلاً بعودتك، ${user.name}!`);
            return true;
        }
        return false;
    }, [users, showToast]);

    const publicLogout = useCallback(() => {
        sessionStorage.removeItem('currentPublicUser');
        setCurrentPublicUser(null);
        showToast('تم تسجيل خروجك بنجاح.');
    }, [showToast]);

    const register = useCallback((newUserData: Omit<AppUser, 'id' | 'joinDate' | 'avatar' | 'status'>): boolean => {
        if (users.some(u => u.email.toLowerCase() === newUserData.email.toLowerCase())) {
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
        sessionStorage.setItem('currentPublicUser', JSON.stringify({ ...currentPublicUser, ...updatedUser }));
        showToast('تم تحديث ملفك الشخصي بنجاح!');
    }, [currentPublicUser, showToast]);


    const handleUpdateReview = useCallback((serviceId: number, reviewId: number, newComment: string) => {
        let serviceName = '';
        let reviewUser = '';
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                serviceName = s.name;
                const review = s.reviews.find(r => r.id === reviewId);
                if (review) reviewUser = review.username;
                return {
                    ...s,
                    reviews: s.reviews.map(r => r.id === reviewId ? { ...r, comment: newComment } : r)
                };
            }
            return s;
        }));
        logActivity('تعديل تقييم', `تعديل تقييم المستخدم "${reviewUser}" على خدمة "${serviceName}"`);
        showToast('تم تعديل التقييم بنجاح!');
    }, [logActivity, showToast]);

    const handleDeleteReview = useCallback((serviceId: number, reviewId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
            let serviceName = '';
            let reviewUser = '';
            setServices(prevServices => prevServices.map(s => {
                if (s.id === serviceId) {
                    serviceName = s.name;
                    const review = s.reviews.find(r => r.id === reviewId);
                    if (review) reviewUser = review.username;
                    return { ...s, reviews: s.reviews.filter(r => r.id !== reviewId) };
                }
                return s;
            }));
            logActivity('حذف تقييم', `حذف تقييم المستخدم "${reviewUser}" على خدمة "${serviceName}"`);
            showToast('تم حذف التقييم بنجاح!');
        }
    }, [logActivity, showToast]);

    const handleReplyToReview = useCallback((serviceId: number, reviewId: number, reply: string) => {
        let serviceName = '';
        let reviewUser = '';
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                serviceName = s.name;
                const review = s.reviews.find(r => r.id === reviewId);
                if (review) reviewUser = review.username;
                return { ...s, reviews: s.reviews.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r) };
            }
            return s;
        }));
        logActivity('إضافة رد على تقييم', `إضافة رد على تقييم المستخدم "${reviewUser}" على خدمة "${serviceName}"`);
        showToast('تم إضافة الرد بنجاح!');
    }, [logActivity, showToast]);

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


    // CRUD Handlers for Services
    const handleSaveService = useCallback((serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => {
        if (serviceData.id) { // Update
            setServices(prev => prev.map(s => s.id === serviceData.id ? { ...s, ...serviceData } : s));
            logActivity('تحديث خدمة', `تم تحديث بيانات خدمة: ${serviceData.name}`);
            showToast('تم تحديث الخدمة بنجاح!');
        } else { // Create
            const newService: Service = {
                id: Math.max(...services.map(s => s.id), 0) + 1,
                ...serviceData,
                rating: 0,
                reviews: [],
                isFavorite: false,
                views: 0,
                creationDate: new Date().toISOString().split('T')[0],
            };
            setServices(prev => [newService, ...prev]);
            logActivity('إضافة خدمة', `تم إضافة خدمة جديدة: ${serviceData.name}`);
            showToast('تمت إضافة الخدمة بنجاح!');
        }
    }, [services, logActivity, showToast]);

    const handleDeleteService = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الخدمة وكل ما يتعلق بها؟')) {
            const serviceName = services.find(s => s.id === id)?.name;
            setServices(prev => prev.filter(s => s.id !== id));
            logActivity('حذف خدمة', `تم حذف خدمة: ${serviceName}`);
            showToast('تم حذف الخدمة بنجاح!');
        }
    }, [services, logActivity, showToast]);

    const handleToggleFavorite = useCallback((serviceId: number) => {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, isFavorite: !s.isFavorite } : s));
    }, []);

    // CRUD Handlers for News
    const handleSaveNews = useCallback((newsData: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => {
        if (newsData.id) {
            setNews(prev => prev.map(n => n.id === newsData.id ? { ...n, ...newsData } : n));
            logActivity('تحديث خبر', `تم تحديث خبر: ${newsData.title}`);
            showToast('تم تحديث الخبر بنجاح!');
        } else {
            const newNewsItem: News = {
                id: Math.max(...news.map(n => n.id), 0) + 1,
                ...newsData,
                author: currentUser?.name || 'مدير',
                date: new Date().toISOString().split('T')[0],
                views: 0,
            };
            setNews(prev => [newNewsItem, ...prev]);
            logActivity('إضافة خبر', `تم إضافة خبر جديد: ${newsData.title}`);
            showToast('تم نشر الخبر بنجاح!');
        }
    }, [news, currentUser, logActivity, showToast]);
    
    const handleDeleteNews = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            const newsTitle = news.find(n => n.id === id)?.title;
            setNews(prev => prev.filter(n => n.id !== id));
            logActivity('حذف خبر', `تم حذف خبر: ${newsTitle}`);
            showToast('تم حذف الخبر بنجاح!');
        }
    }, [news, logActivity, showToast]);
    
    // CRUD Handlers for Notifications
    const handleSaveNotification = useCallback((notificationData: Omit<Notification, 'id'> & { id?: number }) => {
        if (notificationData.id) {
            setNotifications(prev => prev.map(n => n.id === notificationData.id ? { ...n, ...notificationData } : n));
            logActivity('تحديث إشعار', `تم تحديث إشعار: ${notificationData.title}`);
            showToast('تم تحديث الإشعار بنجاح!');
        } else {
            const newNotification: Notification = {
                id: Math.max(...notifications.map(n => n.id), 0) + 1,
                ...notificationData,
            };
            setNotifications(prev => [newNotification, ...prev]);
            logActivity('إضافة إشعار', `تم إضافة إشعار جديد: ${notificationData.title}`);
            showToast('تم إضافة الإشعار بنجاح!');
        }
    }, [notifications, logActivity, showToast]);

    const handleDeleteNotification = useCallback((id: number) => {
         if (window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
            const notificationTitle = notifications.find(n => n.id === id)?.title;
            setNotifications(prev => prev.filter(n => n.id !== id));
            logActivity('حذف إشعار', `تم حذف إشعار: ${notificationTitle}`);
            showToast('تم حذف الإشعار بنجاح!');
         }
    }, [notifications, logActivity, showToast]);

    // CRUD Handlers for Advertisements
    const handleSaveAdvertisement = useCallback((adData: Omit<Advertisement, 'id'> & { id?: number }) => {
        if (adData.id) {
            setAdvertisements(prev => prev.map(ad => ad.id === adData.id ? { ...ad, ...adData } : ad));
            logActivity('تحديث إعلان', `تم تحديث إعلان: ${adData.title}`);
            showToast('تم تحديث الإعلان بنجاح!');
        } else {
            const newAd: Advertisement = {
                id: Math.max(...advertisements.map(ad => ad.id), 0) + 1,
                ...adData,
            };
            setAdvertisements(prev => [newAd, ...prev]);
            logActivity('إضافة إعلان', `تم إضافة إعلان جديد: ${adData.title}`);
            showToast('تم إضافة الإعلان بنجاح!');
        }
    }, [advertisements, logActivity, showToast]);

    const handleDeleteAdvertisement = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
            const adTitle = advertisements.find(ad => ad.id === id)?.title;
            setAdvertisements(prev => prev.filter(ad => ad.id !== id));
            logActivity('حذف إعلان', `تم حذف إعلان: ${adTitle}`);
            showToast('تم حذف الإعلان بنجاح!');
        }
    }, [advertisements, logActivity, showToast]);

    // CRUD Handlers for Properties
    const handleSaveProperty = useCallback((propertyData: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => {
        if (propertyData.id) {
            setProperties(prev => prev.map(p => p.id === propertyData.id ? { ...p, ...propertyData } : p));
            logActivity('تحديث عقار', `تم تحديث بيانات عقار: ${propertyData.title}`);
            showToast('تم تحديث العقار بنجاح!');
        } else {
            const newProperty: Property = {
                id: Math.max(...properties.map(p => p.id), 0) + 1,
                ...propertyData,
                views: 0,
                creationDate: new Date().toISOString().split('T')[0],
            };
            setProperties(prev => [newProperty, ...prev]);
            logActivity('إضافة عقار', `تم إضافة عقار جديد: ${propertyData.title}`);
            showToast('تم إضافة العقار بنجاح!');
        }
    }, [properties, logActivity, showToast]);

    const handleDeleteProperty = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            const propTitle = properties.find(p => p.id === id)?.title;
            setProperties(prev => prev.filter(p => p.id !== id));
            logActivity('حذف عقار', `تم حذف عقار: ${propTitle}`);
            showToast('تم حذف العقار بنجاح!');
        }
    }, [properties, logActivity, showToast]);

    // Emergency Contacts
    const handleSaveEmergencyContact = useCallback((contactData: Omit<EmergencyContact, 'id'> & { id?: number }) => {
        if (contactData.id) {
            setEmergencyContacts(prev => prev.map(c => c.id === contactData.id ? { ...c, ...contactData } : c));
            logActivity('تحديث رقم طوارئ', `تم تحديث رقم: ${contactData.title}`);
            showToast('تم تحديث الرقم بنجاح!');
        } else {
            const newContact: EmergencyContact = {
                id: Math.max(...emergencyContacts.map(c => c.id), 0) + 1,
                title: contactData.title,
                number: contactData.number,
                type: contactData.type || 'city',
            };
            setEmergencyContacts(prev => [newContact, ...prev]);
            logActivity('إضافة رقم طوارئ', `تم إضافة رقم جديد: ${contactData.title}`);
            showToast('تم إضافة الرقم بنجاح!');
        }
    }, [emergencyContacts, logActivity, showToast]);

    const handleDeleteEmergencyContact = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
            const contactTitle = emergencyContacts.find(c => c.id === id)?.title;
            setEmergencyContacts(prev => prev.filter(c => c.id !== id));
            logActivity('حذف رقم طوارئ', `تم حذف رقم: ${contactTitle}`);
            showToast('تم حذف الرقم بنجاح!');
        }
    }, [emergencyContacts, logActivity, showToast]);

    // Service Guides
    const handleSaveServiceGuide = useCallback((guideData: Omit<ServiceGuide, 'id'> & { id?: number }) => {
        if (guideData.id) {
            setServiceGuides(prev => prev.map(g => g.id === guideData.id ? { ...g, ...guideData } : g));
            logActivity('تحديث دليل خدمة', `تم تحديث دليل: ${guideData.title}`);
            showToast('تم تحديث الدليل بنجاح!');
        } else {
            const newGuide: ServiceGuide = {
                id: Math.max(...serviceGuides.map(g => g.id), 0) + 1,
                ...guideData,
            };
            setServiceGuides(prev => [newGuide, ...prev]);
            logActivity('إضافة دليل خدمة', `تم إضافة دليل جديد: ${guideData.title}`);
            showToast('تم إضافة الدليل بنجاح!');
        }
    }, [serviceGuides, logActivity, showToast]);

    const handleDeleteServiceGuide = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الدليل؟')) {
            const guideTitle = serviceGuides.find(g => g.id === id)?.title;
            setServiceGuides(prev => prev.filter(g => g.id !== id));
            logActivity('حذف دليل خدمة', `تم حذف دليل: ${guideTitle}`);
            showToast('تم حذف الدليل بنجاح!');
        }
    }, [serviceGuides, logActivity, showToast]);
    
    // Users (AppUser)
    const handleSaveUser = useCallback((userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => {
        if (userData.id) {
            setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u));
            logActivity('تحديث مستخدم', `تم تحديث بيانات المستخدم: ${userData.name}`);
            showToast('تم تحديث المستخدم بنجاح!');
        } else {
            const newUser: AppUser = {
                id: Math.max(...users.map(u => u.id), 0) + 1,
                joinDate: new Date().toISOString().split('T')[0],
                ...userData,
            };
            setUsers(prev => [newUser, ...prev]);
            logActivity('إضافة مستخدم', `تم إضافة مستخدم جديد: ${userData.name}`);
            showToast('تم إضافة المستخدم بنجاح!');
        }
    }, [users, logActivity, showToast]);

    const handleDeleteUser = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            const userName = users.find(u => u.id === id)?.name;
            setUsers(prev => prev.filter(u => u.id !== id));
            logActivity('حذف مستخدم', `تم حذف المستخدم: ${userName}`);
            showToast('تم حذف المستخدم بنجاح!');
        }
    }, [users, logActivity, showToast]);

    // Admins (AdminUser)
    const handleSaveAdmin = useCallback((adminData: Omit<AdminUser, 'id'> & { id?: number }) => {
         if (adminData.id) {
            setAdmins(prev => prev.map(a => a.id === adminData.id ? { ...a, ...adminData } : a));
            logActivity('تحديث مدير', `تم تحديث بيانات المدير: ${adminData.name}`);
            showToast('تم تحديث المدير بنجاح!');
        } else {
            const newAdmin: AdminUser = {
                id: Math.max(...admins.map(a => a.id), 0) + 1,
                ...adminData,
            };
            setAdmins(prev => [newAdmin, ...prev]);
             logActivity('إضافة مدير', `تم إضافة مدير جديد: ${adminData.name}`);
            showToast('تم إضافة المدير بنجاح!');
        }
    }, [admins, logActivity, showToast]);

    const handleDeleteAdmin = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المدير؟')) {
            const adminName = admins.find(a => a.id === id)?.name;
            setAdmins(prev => prev.filter(a => a.id !== id));
            logActivity('حذف مدير', `تم حذف المدير: ${adminName}`);
            showToast('تم حذف المدير بنجاح!');
        }
    }, [admins, logActivity, showToast]);
    
    // Transportation
    const handleSaveDriver = useCallback((driverData: Omit<Driver, 'id'> & { id?: number }) => {
        if (driverData.id) {
            setInternalDrivers(prev => prev.map(d => d.id === driverData.id ? { ...d, ...driverData } : d));
        } else {
            const newDriver = { id: Date.now(), ...driverData };
            setInternalDrivers(prev => [...prev, newDriver]);
        }
        showToast('تم حفظ بيانات السائق بنجاح!');
    }, [showToast]);

    const handleDeleteDriver = useCallback((id: number) => {
        setInternalDrivers(prev => prev.filter(d => d.id !== id));
        showToast('تم حذف السائق بنجاح!');
    }, [showToast]);

    const handleSaveRoute = useCallback((routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        if (routeData.id) {
            setExternalRoutes(prev => prev.map(r => r.id === routeData.id ? { ...r, ...routeData } : r));
        } else {
            const newRoute = { id: Date.now(), ...routeData };
            setExternalRoutes(prev => [...prev, newRoute]);
        }
        showToast('تم حفظ بيانات المسار بنجاح!');
    }, [showToast]);

    const handleDeleteRoute = useCallback((id: number) => {
        setExternalRoutes(prev => prev.filter(r => r.id !== id));
        showToast('تم حذف المسار بنجاح!');
    }, [showToast]);

    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
        showToast('تم تحديث الجدول الأسبوعي بنجاح!');
    }, [showToast]);
    
    const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') {
            setInternalSupervisor(supervisor);
        } else {
            setExternalSupervisor(supervisor);
        }
        showToast('تم تحديث بيانات المشرف بنجاح!');
    }, [showToast]);
    
    // Public Pages Content
    const handleUpdatePublicPageContent = useCallback(<K extends keyof PublicPagesContent>(page: K, newContent: PublicPagesContent[K]) => {
        setPublicPagesContent(prev => ({
            ...prev,
            [page]: newContent
        }));
        showToast(`تم تحديث محتوى صفحة "${page}" بنجاح!`);
    }, [showToast]);
    
    // Community Forum
    const addPost = useCallback((postData: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments'>) => {
        if (!currentPublicUser) return;
        const newPost: Post = {
            id: Date.now(),
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
            date: new Date().toISOString(),
            likes: [],
            comments: [],
            ...postData
        };
        setPosts(prev => [newPost, ...prev]);
        showToast('تم نشر منشورك بنجاح!');
    }, [currentPublicUser, showToast]);

    const deletePost = useCallback((postId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
            setPosts(prev => prev.filter(p => p.id !== postId));
            showToast('تم حذف المنشور.');
        }
    }, [showToast]);

    const addComment = useCallback((postId: number, commentData: Omit<Comment, 'id' | 'date' | 'userId' | 'username' | 'avatar'>) => {
        if (!currentPublicUser) return;
        const newComment: Comment = {
            id: Date.now(),
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
            date: new Date().toISOString(),
            ...commentData
        };
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p));
    }, [currentPublicUser]);

    const toggleLikePost = useCallback((postId: number) => {
        if (!currentPublicUser) return;
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(currentPublicUser.id);
                const newLikes = isLiked
                    ? p.likes.filter(id => id !== currentPublicUser.id)
                    : [...p.likes, currentPublicUser.id];
                return { ...p, likes: newLikes };
            }
            return p;
        }));
    }, [currentPublicUser]);

    const value = useMemo(() => ({
        currentUser, isAuthenticated, login, logout,
        currentPublicUser, isPublicAuthenticated, publicLogin, publicLogout, register, updateProfile,
        categories, services, news, notifications, advertisements, properties, emergencyContacts, serviceGuides, users, admins, posts,
        transportation: { internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes },
        auditLogs,
        publicPagesContent,
        logActivity,
        handleUpdateReview, handleDeleteReview, handleReplyToReview, handleToggleHelpfulReview, addReview,
        handleSaveService, handleDeleteService, handleToggleFavorite,
        handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification,
        handleSaveAdvertisement, handleDeleteAdvertisement,
        handleSaveProperty, handleDeleteProperty,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        handleSaveUser, handleDeleteUser,
        handleSaveAdmin, handleDeleteAdmin,
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule,
        handleSaveSupervisor,
        handleUpdatePublicPageContent,
        addPost, deletePost, addComment, toggleLikePost,
        isDarkMode, toggleDarkMode,
        toasts, showToast, dismissToast,
    }), [
        currentUser, isAuthenticated, login, logout,
        currentPublicUser, isPublicAuthenticated, publicLogin, publicLogout, register, updateProfile,
        categories, services, news, notifications, advertisements, properties, emergencyContacts, serviceGuides, users, admins, posts,
        internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes,
        auditLogs,
        publicPagesContent,
        logActivity,
        handleUpdateReview, handleDeleteReview, handleReplyToReview, handleToggleHelpfulReview, addReview,
        handleSaveService, handleDeleteService, handleToggleFavorite,
        handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification,
        handleSaveAdvertisement, handleDeleteAdvertisement,
        handleSaveProperty, handleDeleteProperty,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        handleSaveUser, handleDeleteUser,
        handleSaveAdmin, handleDeleteAdmin,
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule,
        handleSaveSupervisor,
        handleUpdatePublicPageContent,
        addPost, deletePost, addComment, toggleLikePost,
        isDarkMode, toggleDarkMode,
        toasts, showToast, dismissToast,
    ]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};