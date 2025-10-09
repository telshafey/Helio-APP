import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, PencilSquareIcon, TrashIcon, PlusIcon, ShieldExclamationIcon } from '../components/common/Icons';
import type { EmergencyContact } from '../types';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';
import { useAuth } from '../context/AuthContext';

const EmergencyCard: React.FC<{ contact: EmergencyContact; onEdit: (contact: EmergencyContact) => void; onDelete: (id: number) => void; }> = ({ contact, onEdit, onDelete }) => {
    const { isAuthenticated, hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول ادارة الخدمات']);

    return (
        <div className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg border border-transparent dark:border-slate-700 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
            {contact.type === 'city' && (
                <span className="absolute top-2 right-2 text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 px-2 py-1 rounded-full font-semibold">خدمة خاصة بالمدينة</span>
            )}
            {isAuthenticated && canManage && (
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(contact)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="تعديل الرقم">
                        <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(contact.id)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="حذف الرقم">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
            
            <div className="mb-2">
                <PhoneIcon className="w-10 h-10 text-cyan-400 mx-auto"/>
            </div>
            <h3 className="text-base font-bold mb-2 h-12 flex items-center justify-center text-gray-800 dark:text-white">{contact.title}</h3>
            <p className="text-2xl font-mono tracking-widest text-gray-700 dark:text-gray-300">{contact.number}</p>
            <a href={`tel:${contact.number}`} className="mt-4 inline-block w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                اتصال مباشر
            </a>
    </div>
    );
};

const EmergencyListItem: React.FC<{ contact: EmergencyContact; onEdit: (contact: EmergencyContact) => void; onDelete: (id: number) => void; }> = ({ contact, onEdit, onDelete }) => {
    const { isAuthenticated, hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول ادارة الخدمات']);

    return (
        <div className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex-1 pr-4">
                <h3 className="font-bold text-gray-800 dark:text-white">{contact.title}</h3>
                <p className="font-mono text-lg text-slate-600 dark:text-slate-300 tracking-wider mt-1">{contact.number}</p>
            </div>
            <div className="flex items-center gap-2">
                {isAuthenticated && canManage && (
                     <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(contact)} className="p-2 text-blue-500 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full" title="تعديل الرقم">
                            <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(contact.id)} className="p-2 text-red-500 bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" title="حذف الرقم">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <a href={`tel:${contact.number}`} className="flex items-center justify-center w-12 h-12 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors shadow-lg">
                    <PhoneIcon className="w-6 h-6" />
                </a>
            </div>
        </div>
    );
};

const EmergencyForm: React.FC<{
    onSave: (contact: Omit<EmergencyContact, 'id'> & { id?: number }) => void;
    onClose: () => void;
    contact: EmergencyContact | null;
    defaultType: 'city' | 'national';
}> = ({ onSave, onClose, contact, defaultType }) => {
    const [title, setTitle] = useState('');
    const [number, setNumber] = useState('');
    const [type, setType] = useState<'city' | 'national'>(defaultType);

    useEffect(() => {
        if (contact) {
            setTitle(contact.title || '');
            setNumber(contact.number || '');
            setType(contact.type || defaultType);
        } else {
            setTitle('');
            setNumber('');
            setType(defaultType);
        }
    }, [contact, defaultType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: contact?.id, title, number, type });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع الرقم</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2"><input type="radio" name="type" value="city" checked={type === 'city'} onChange={() => setType('city')} className="form-radio text-cyan-500" /><span>خاص بالمدينة</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="type" value="national" checked={type === 'national'} onChange={() => setType('national')} className="form-radio text-cyan-500" /><span>قومي</span></label>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم الخدمة</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <div className="mb-6">
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الرقم</label>
                <input type="text" id="number" value={number} onChange={(e) => setNumber(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; count: number; }> = ({ active, onClick, children, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-md transition-colors focus:outline-none text-sm ${
            active
                ? 'bg-cyan-500 text-white shadow'
                : 'bg-slate-200/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {children}
        <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white text-cyan-600' : 'bg-slate-300 dark:bg-slate-600'}`}>{count}</span>
    </button>
);


const EmergencyPage: React.FC = () => {
    const navigate = useNavigate();
    const { emergencyContacts, handleSaveEmergencyContact, handleDeleteEmergencyContact } = useData();
    const { isAuthenticated, hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول ادارة الخدمات']);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
    const [activeTab, setActiveTab] = useState<'city' | 'national'>('city');

    const handleAddClick = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (contact: EmergencyContact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };
    
    const cityContacts = emergencyContacts.filter(c => c.type === 'city');
    const nationalContacts = emergencyContacts.filter(c => c.type === 'national');
    const contactsToShow = activeTab === 'city' ? cityContacts : nationalContacts;

    const pageTitle = isAuthenticated ? "إدارة أرقام الطوارئ" : "أرقام الطوارئ والخدمات الهامة";

    const content = (
        <div className="space-y-8">
            {contactsToShow.length > 0 ? (
                <>
                    {/* Desktop Grid */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {contactsToShow.map((contact) => (
                            <EmergencyCard key={contact.id} contact={contact} onEdit={handleEditClick} onDelete={handleDeleteEmergencyContact} />
                        ))}
                    </div>
                    {/* Mobile List */}
                    <div className="md:hidden space-y-4">
                         {contactsToShow.map((contact) => (
                            <EmergencyListItem key={contact.id} contact={contact} onEdit={handleEditClick} onDelete={handleDeleteEmergencyContact} />
                        ))}
                    </div>
                </>
            ) : (
                <EmptyState
                    icon={<ShieldExclamationIcon className="w-16 h-16 text-slate-400" />}
                    title={`لا توجد أرقام ${activeTab === 'city' ? 'خاصة بالمدينة' : 'قومية'} مضافة`}
                    message="يمكنك إضافة الأرقام من خلال لوحة التحكم."
                />
            )}
        </div>
    );
    
    if(!isAuthenticated) {
        return (
             <div className="min-h-full animate-fade-in" dir="rtl">
                <PageBanner
                    title="أرقام الطوارئ"
                    subtitle="أرقام تهمك للحالات الطارئة داخل وخارج المدينة."
                    icon={<ShieldExclamationIcon className="w-12 h-12 text-red-500" />}
                />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
                     <div className="flex justify-center items-center gap-4 mb-8">
                        <TabButton active={activeTab === 'city'} onClick={() => setActiveTab('city')} count={cityContacts.length}>خاصة بالمدينة</TabButton>
                        <TabButton active={activeTab === 'national'} onClick={() => setActiveTab('national')} count={nationalContacts.length}>أرقام قومية</TabButton>
                    </div>
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full animate-fade-in">
             <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">{pageTitle}</h1>
                    {canManage && (
                        <button onClick={handleAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            <span>إضافة رقم جديد</span>
                        </button>
                    )}
                </div>

                <div className="flex justify-center items-center gap-4 mb-8">
                    <TabButton active={activeTab === 'city'} onClick={() => setActiveTab('city')} count={cityContacts.length}>خاصة بالمدينة</TabButton>
                    <TabButton active={activeTab === 'national'} onClick={() => setActiveTab('national')} count={nationalContacts.length}>أرقام قومية</TabButton>
                </div>

                {content}
            </div>
            
            <Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingContact ? 'تعديل الرقم' : 'إضافة رقم جديد'}
            >
                <EmergencyForm 
                    onSave={handleSaveEmergencyContact}
                    onClose={() => setIsModalOpen(false)}
                    contact={editingContact}
                    defaultType={activeTab}
                />
            </Modal>
        </div>
    );
};

export default EmergencyPage;