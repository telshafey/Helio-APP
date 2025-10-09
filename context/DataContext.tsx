import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { 
    mockEmergencyContacts, mockServiceGuides,
    mockPublicPagesContent,
} from '../data/mock-data';
import type { 
    EmergencyContact, ServiceGuide,
    PublicPagesContent,
    DataContextType
} from '../types';
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
    const { showToast, showConfirmation } = useUI();

    // State
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(mockPublicPagesContent);

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
        itemType: string
    ) => {
        showConfirmation(
            `تأكيد حذف ${itemType}`,
            `هل أنت متأكد أنك تريد حذف هذا الـ ${itemType}؟ لا يمكن التراجع عن هذا الإجراء.`,
            () => {
                setItems(prev => prev.filter(item => item.id !== itemId));
                showToast(`تم حذف ${itemType}.`);
            }
        );
    };
        
    // --- OTHER DATA HANDLERS ---
    const handleSaveEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'> & { id?: number }) => genericSave<EmergencyContact>(emergencyContacts, setEmergencyContacts, contact, {}, 'رقم الطوارئ'), [emergencyContacts, showToast]);
    
    const handleDeleteEmergencyContact = useCallback((contactId: number) => genericDelete(setEmergencyContacts, contactId, 'رقم الطوارئ'), [showConfirmation, showToast]);

    const handleSaveServiceGuide = useCallback((guide: Omit<ServiceGuide, 'id'> & { id?: number }) => genericSave<ServiceGuide>(serviceGuides, setServiceGuides, guide, {}, 'دليل الخدمة'), [serviceGuides, showToast]);
    
    const handleDeleteServiceGuide = useCallback((guideId: number) => genericDelete(setServiceGuides, guideId, 'دليل الخدمة'), [showConfirmation, showToast]);

    const handleUpdatePublicPageContent = useCallback(<K extends keyof PublicPagesContent>(page: K, content: PublicPagesContent[K]) => {
        setPublicPagesContent(prev => ({...prev, [page]: content}));
        showToast('تم تحديث محتوى الصفحة بنجاح.');
    }, [showToast]);

    const value: DataContextType = {
        emergencyContacts, serviceGuides,
        publicPagesContent,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        handleUpdatePublicPageContent,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};