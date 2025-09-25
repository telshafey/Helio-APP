import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { 
    mockCategories, mockServices, mockNews, mockNotifications, 
    mockProperties, mockEmergencyContacts, mockServiceGuides,
    mockUsers, mockAdmins, mockPosts,
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes,
    mockPublicPagesContent,
    mockAdvertisements
} from '../data/mock-data';
import type { 
    Category, Service, Review, News, Notification, Property, 
    EmergencyContact, ServiceGuide, AppUser, AdminUser,
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute,
    AuditLog, PublicPagesContent, Post, Comment,
    Advertisement, DataContextType, PollOption
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
    const { currentUser, currentPublicUser } = useAuth();
    const { showToast } = useUI();

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
    
    // Transportation State
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);

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
    const addPost = useCallback((postData: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => {
        if (!currentPublicUser) return;
        const newPost: Post = {
            id: Date.now(),
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
            date: new Date().toISOString(),
            likes: [],
            comments: [],
            isPinned: false,
            ...postData,
            pollOptions: postData.pollOptions ? postData.pollOptions.map(opt => ({ option: opt.option, votes: [] })) : undefined
        };
        setPosts(prev => [newPost, ...prev]);
        showToast('تم نشر منشورك بنجاح!');
    }, [currentPublicUser, showToast]);
    
    const editPost = useCallback((postId: number, postData: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => {
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const updatedPost = { ...p, ...postData };

                // Preserve votes when editing poll options
                if (postData.pollOptions && p.pollOptions) {
                    updatedPost.pollOptions = postData.pollOptions.map((newOpt, index) => {
                        const oldOpt = p.pollOptions?.[index];
                        return {
                            option: newOpt.option,
                            votes: oldOpt ? oldOpt.votes : [] // Preserve votes for existing options at the same index
                        };
                    });
                } else if (postData.pollOptions && !p.pollOptions) {
                     // Adding poll to a non-poll post (category changed)
                     updatedPost.pollOptions = postData.pollOptions.map(opt => ({ option: opt.option, votes: [] }));
                } else if (!postData.pollOptions && p.pollOptions) {
                    // Removing poll from a post (category changed)
                    updatedPost.pollOptions = undefined;
                }

                return updatedPost;
            }
            return p;
        }));
        logActivity('تعديل منشور', `تم تعديل منشور: "${postData.title || `منشور #${postId}`}"`);
        showToast('تم تعديل المنشور بنجاح!');
    }, [logActivity, showToast]);

    const deletePost = useCallback((postId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
            const postTitle = posts.find(p => p.id === postId)?.title || 'منشور بدون عنوان';
            setPosts(prev => prev.filter(p => p.id !== postId));
            logActivity('حذف منشور مجتمع', `تم حذف منشور: ${postTitle}`);
            showToast('تم حذف المنشور.');
        }
    }, [posts, logActivity, showToast]);

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

    const deleteComment = useCallback((postId: number, commentId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
            let postTitle = '';
            let commentContent = '';
            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    postTitle = p.title || 'منشور بدون عنوان';
                    commentContent = p.comments.find(c => c.id === commentId)?.content || '';
                    return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
                }
                return p;
            }));
            logActivity('حذف تعليق', `حذف تعليق "${commentContent.substring(0, 20)}..." من منشور "${postTitle}"`);
            showToast('تم حذف التعليق.');
        }
    }, [logActivity, showToast]);

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

    const requestAccountDeletion = useCallback((userId: number) => {
        let userName = '';
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                userName = u.name;
                return { ...u, status: 'deletion_requested' };
            }
            return u;
        }));
        logActivity('طلب حذف حساب', `المستخدم "${userName}" طلب حذف حسابه.`);
        showToast('تم استلام طلب حذف حسابك بنجاح.');
    }, [logActivity, showToast]);
    
    const togglePinPost = useCallback((postId: number) => {
        let postTitle = '';
        let isPinned: boolean | undefined = false;
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                postTitle = p.title || `منشور بواسطة ${p.username}`;
                isPinned = !p.isPinned;
                return { ...p, isPinned: !p.isPinned };
            }
            return p;
        }));
        logActivity(isPinned ? 'تثبيت منشور' : 'إلغاء تثبيت منشور', `تم ${isPinned ? 'تثبيت' : 'إلغاء تثبيت'} منشور: ${postTitle}`);
        showToast(isPinned ? 'تم تثبيت المنشور بنجاح' : 'تم إلغاء تثبيت المنشور');
    }, [logActivity, showToast]);
    
    const voteOnPoll = useCallback((postId: number, optionIndex: number) => {
        if (!currentPublicUser) return;
        const userId = currentPublicUser.id;
        
        setPosts(prev => prev.map(p => {
            if (p.id !== postId || !p.pollOptions) {
                return p;
            }

            const alreadyVotedForOption = p.pollOptions[optionIndex]?.votes.includes(userId);

            const newPollOptions = p.pollOptions.map((option, idx) => {
                // First, remove the user's vote from all options.
                const newVotes = option.votes.filter(vId => vId !== userId);

                // If this is the clicked option and the user wasn't already voting for it, add the vote back.
                // This creates the toggle effect.
                if (idx === optionIndex && !alreadyVotedForOption) {
                    newVotes.push(userId);
                }

                return { ...option, votes: newVotes };
            });

            return { ...p, pollOptions: newPollOptions };
        }));
    }, [currentPublicUser]);

    const value: DataContextType = useMemo(() => ({
        categories,
        services,
        news,
        notifications,
        advertisements,
        properties,
        emergencyContacts,
        serviceGuides,
        users,
        admins,
        posts,
        transportation: {
            internalSupervisor,
            externalSupervisor,
            internalDrivers,
            weeklySchedule,
            externalRoutes,
        },
        auditLogs,
        publicPagesContent,
        logActivity,
        handleUpdateReview,
        handleDeleteReview,
        handleReplyToReview,
        handleToggleHelpfulReview,
        addReview,
        handleSaveService,
        handleDeleteService,
        handleToggleFavorite,
        handleSaveNews,
        handleDeleteNews,
        handleSaveNotification,
        handleDeleteNotification,
        handleSaveAdvertisement,
        handleDeleteAdvertisement,
        handleSaveProperty,
        handleDeleteProperty,
        handleSaveEmergencyContact,
        handleDeleteEmergencyContact,
        handleSaveServiceGuide,
        handleDeleteServiceGuide,
        handleSaveUser,
        handleDeleteUser,
        handleSaveAdmin,
        handleDeleteAdmin,
        handleSaveDriver,
        handleDeleteDriver,
        handleSaveRoute,
        handleDeleteRoute,
        handleSaveSchedule,
        handleSaveSupervisor,
        handleUpdatePublicPageContent,
        addPost,
        editPost,
        deletePost,
        addComment,
        deleteComment,
        toggleLikePost,
        requestAccountDeletion,
        togglePinPost,
        voteOnPoll,
    }), [
        categories, services, news, notifications, advertisements, properties, emergencyContacts,
        serviceGuides, users, admins, posts, internalSupervisor, externalSupervisor,
        internalDrivers, weeklySchedule, externalRoutes, auditLogs, publicPagesContent,
        logActivity, handleUpdateReview, handleDeleteReview, handleReplyToReview, handleToggleHelpfulReview, addReview,
        handleSaveService, handleDeleteService, handleToggleFavorite, handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification, handleSaveAdvertisement, handleDeleteAdvertisement,
        handleSaveProperty, handleDeleteProperty, handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide, handleSaveUser, handleDeleteUser, handleSaveAdmin,
        handleDeleteAdmin, handleSaveDriver, handleDeleteDriver, handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor, handleUpdatePublicPageContent, addPost, editPost, deletePost,
        addComment, deleteComment, toggleLikePost, requestAccountDeletion, togglePinPost, voteOnPoll
    ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};