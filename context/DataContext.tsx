import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { 
    mockNews, mockNotifications, 
    mockProperties, mockEmergencyContacts, mockServiceGuides,
    mockUsers,
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes,
    mockPublicPagesContent,
    mockAdvertisements,
    // FIX: Added mockAdmins and mockAuditLogs to imports.
    mockAdmins,
    mockAuditLogs
} from '../data/mock-data';
import type { 
    News, Notification, Property, 
    EmergencyContact, ServiceGuide, AppUser, AdminUser,
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute,
    PublicPagesContent,
    Advertisement, DataContextType, AuditLog
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

    const [news, setNews] = useState<News[]>(mockNews);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>(mockAdvertisements);
    const [properties, setProperties] = useState<Property[]>(mockProperties);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [users, setUsers] = useState<AppUser[]>(mockUsers);
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(mockPublicPagesContent);
    // FIX: Added missing state for admins and audit logs.
    const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
    
    // Transportation State
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);

    // FIX: Implemented all missing handlers to match DataContextType.
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
    
    // FIX: Updated the genericSave function signature to be more flexible and type-safe.
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

    // FIX: Added explicit generic types to all calls of genericSave to resolve type inference issues.
    const handleSaveNews = useCallback((newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => {
        genericSave<News>(news, setNews, newsItem, {author: 'Admin', date: new Date().toISOString().split('T')[0], views: 0 }, 'الخبر');
    }, [news, showToast]);

    const handleDeleteNews = useCallback((newsId: number) => genericDelete(setNews, newsId, 'الخبر'), [showToast]);

    const handleSaveNotification = useCallback((notification: Omit<Notification, 'id'> & { id?: number }) => genericSave<Notification>(notifications, setNotifications, notification, {}, 'الإشعار'), [notifications, showToast]);

    const handleDeleteNotification = useCallback((notificationId: number) => genericDelete(setNotifications, notificationId, 'الإشعار'), [showToast]);
    
    const handleSaveAdvertisement = useCallback((ad: Omit<Advertisement, 'id'> & { id?: number }) => genericSave<Advertisement>(advertisements, setAdvertisements, ad, {}, 'الإعلان'), [advertisements, showToast]);
    
    const handleDeleteAdvertisement = useCallback((adId: number) => genericDelete(setAdvertisements, adId, 'الإعلان'), [showToast]);
    
    const handleSaveProperty = useCallback((property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => {
        genericSave<Property>(properties, setProperties, property, {views: 0, creationDate: new Date().toISOString().split('T')[0]}, 'العقار');
    }, [properties, showToast]);
    
    const handleDeleteProperty = useCallback((propertyId: number) => genericDelete(setProperties, propertyId, 'العقار'), [showToast]);

    const handleSaveEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'> & { id?: number }) => genericSave<EmergencyContact>(emergencyContacts, setEmergencyContacts, contact, {}, 'رقم الطوارئ'), [emergencyContacts, showToast]);
    
    const handleDeleteEmergencyContact = useCallback((contactId: number) => genericDelete(setEmergencyContacts, contactId, 'رقم الطوارئ'), [showToast]);

    const handleSaveServiceGuide = useCallback((guide: Omit<ServiceGuide, 'id'> & { id?: number }) => genericSave<ServiceGuide>(serviceGuides, setServiceGuides, guide, {}, 'دليل الخدمة'), [serviceGuides, showToast]);
    
    const handleDeleteServiceGuide = useCallback((guideId: number) => genericDelete(setServiceGuides, guideId, 'دليل الخدمة'), [showToast]);

    const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') setInternalSupervisor(supervisor);
        else setExternalSupervisor(supervisor);
        showToast('تم حفظ بيانات المشرف.');
    }, [showToast]);

    const handleSaveDriver = useCallback((driver: Omit<Driver, 'id'> & { id?: number }) => genericSave<Driver>(internalDrivers, setInternalDrivers, driver, {}, 'السائق'), [internalDrivers, showToast]);
    
    const handleDeleteDriver = useCallback((driverId: number) => genericDelete(setInternalDrivers, driverId, 'السائق'), [showToast]);

    const handleSaveRoute = useCallback((route: Omit<ExternalRoute, 'id'> & { id?: number }) => genericSave<ExternalRoute>(externalRoutes, setExternalRoutes, route, {}, 'المسار'), [externalRoutes, showToast]);

    const handleDeleteRoute = useCallback((routeId: number) => genericDelete(setExternalRoutes, routeId, 'المسار'), [showToast]);
    
    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
        showToast('تم حفظ الجدول الأسبوعي.');
    }, [showToast]);

    const handleUpdatePublicPageContent = useCallback(<K extends keyof PublicPagesContent>(page: K, content: PublicPagesContent[K]) => {
        setPublicPagesContent(prev => ({...prev, [page]: content}));
        showToast('تم تحديث محتوى الصفحة بنجاح.');
    }, [showToast]);


    const value: DataContextType = useMemo(() => ({
        news, notifications, advertisements, properties,
        emergencyContacts, serviceGuides, users, admins, auditLogs,
        transportation: {
            internalSupervisor, externalSupervisor, internalDrivers,
            weeklySchedule, externalRoutes,
        },
        publicPagesContent,
        requestAccountDeletion, handleSaveUser, handleDeleteUser,
        handleSaveAdmin, handleDeleteAdmin, handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification, handleSaveAdvertisement, handleDeleteAdvertisement,
        handleSaveProperty, handleDeleteProperty, handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide, handleSaveSupervisor,
        handleSaveDriver, handleDeleteDriver, handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleUpdatePublicPageContent,
    }), [
        news, notifications, advertisements, properties, emergencyContacts,
        serviceGuides, users, admins, auditLogs, internalSupervisor, externalSupervisor,
        internalDrivers, weeklySchedule, externalRoutes, publicPagesContent,
        requestAccountDeletion,
        handleSaveUser, handleDeleteUser, handleSaveAdmin, handleDeleteAdmin, handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification, handleSaveAdvertisement, handleDeleteAdvertisement,
        handleSaveProperty, handleDeleteProperty, handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide, handleSaveSupervisor, handleSaveDriver,
        handleDeleteDriver, handleSaveRoute, handleDeleteRoute, handleSaveSchedule, handleUpdatePublicPageContent
    ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};