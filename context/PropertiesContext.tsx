import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockProperties } from '../data/mock-data';
import type { Property, PropertiesContextType } from '../types';
import { useUI } from './UIContext';

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export const useProperties = (): PropertiesContextType => {
    const context = useContext(PropertiesContext);
    if (context === undefined) {
        throw new Error('useProperties must be used within a PropertiesProvider');
    }
    return context;
};

export const PropertiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useUI();
    const [properties, setProperties] = useState<Property[]>(mockProperties);

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

    const value: PropertiesContextType = {
        properties,
        handleSaveProperty,
        handleDeleteProperty,
    };

    return (
        <PropertiesContext.Provider value={value}>
            {children}
        </PropertiesContext.Provider>
    );
};
