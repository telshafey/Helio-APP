import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, BellAlertIcon } from '../components/common/Icons';
import type { Notification, Service } from '../types';
import { useData } from '../context/DataContext';
import { useServices } from '../context/ServicesContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';

const NotificationForm: React.FC<{
    onSave: (notification: Omit<Notification, 'id'> & { id?: number }) => void;
    onClose: () => void;
    notification: Omit<Notification, 'id'> & { id?: number } | null;
    services: Service[];
}> = ({ onSave, onClose, notification, services }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [externalUrl, setExternalUrl] = useState('');
    const [serviceId, setServiceId] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (notification) {
            setTitle(notification.title || '');
            setContent(notification.content || '');
            setImages(notification.imageUrl ? [notification.imageUrl] : []);
            setExternalUrl(notification.externalUrl || '');
            setServiceId(notification.serviceId);
            setStartDate(notification.startDate || '');
            setEndDate(notification.endDate || '');
        } else {
            setTitle('');
            setContent('');
            setImages([]);
            setExternalUrl('');
            setServiceId(undefined);
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today);
            setEndDate(today);
        }
    }, [notification]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: notification?.id, 
            title, 
            content, 
            imageUrl: images.length > 0 ? images[0] : undefined, 
            externalUrl, 
            serviceId, 
            startDate, 
            endDate 
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label---