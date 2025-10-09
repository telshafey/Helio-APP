import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunity } from '../context/AppContext';
import { useServices } from '../context/ServicesContext';
import { ArrowLeftIcon, TagIcon, CheckCircleIcon, XCircleIcon, ClockIcon, TrashIcon, PlusIcon } from '../components/common/Icons';
import type { ExclusiveOffer, ListingStatus, Service } from '../types';
import RejectReasonModal from '../components/common/RejectReasonModal';
import Modal from '../components/common/Modal';
import { InputField, TextareaField } from '../components/common/FormControls';
import ImageUploader from '../components/common/ImageUploader';

const StatusBadge: React.FC<{ status: ListingStatus }> = ({ status }) => {
    const statusMap = {
        pending: { text: 'قيد المراجعة', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: <ClockIcon className="w-4 h-4"/> },
        approved: { text: 'مقبول', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: <CheckCircleIcon className="w-4 h-4"/> },
        rejected: { text: 'مرفوض', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: <XCircleIcon className="w-4 h-4"/> },
        expired: { text: 'منتهي', classes: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300', icon: <ClockIcon className="w-4 h-4"/> },
    };
    const { text, classes, icon } = statusMap[status];
    return <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{icon}{text}</span>;
};

const AddOfferForm: React.FC<{ onClose: () => void; onSave: (data: any) => void; services: Service[]; offer: ExclusiveOffer | null }> = ({ onClose, onSave, services, offer }) => {
    const [formData, setFormData] = useState({
        title: offer?.title || '',
        description: offer?.description || '',
        serviceId: offer?.serviceId || '',
        promoCode: offer?.promoCode || '',
        startDate: offer?.startDate || new Date().toISOString().split('T')[0],
        endDate: offer?.endDate || new Date().toISOString().split('T')[0],
    });
    const [image, setImage] = useState<string[]>(offer?.imageUrl ? [offer.imageUrl] : []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (image.length === 0) { alert('الرجاء إضافة صورة للعرض.'); return; }
        if (!formData.serviceId) { alert('الرجاء اختيار الخدمة المرتبطة بالعرض.'); return; }
        
        onSave({
            id: offer?.id,
            ...formData,
            serviceId: Number(formData.serviceId),
            imageUrl: image[0],
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader initialImages={image} onImagesChange={setImage} multiple={false} label="صورة العرض" />
            <InputField name="title" label="عنوان العرض" value={formData.title} onChange={handleChange} required />
            <TextareaField name="description" label="وصف العرض" value={formData.description} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium mb-1">الخدمة المرتبطة</label>
                <select name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <option value="">-- اختر خدمة --</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <InputField name="promoCode" label="كود الخصم (اختياري)" value={formData.promoCode} onChange={handleChange} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="startDate" label="تاريخ البدء" type="date" value={formData.startDate} onChange={handleChange} required />
                <InputField name="endDate" label="تاريخ الانتهاء" type="date" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};


const OffersManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const { offers, handleSaveOffer, handleUpdateOfferStatus, handleDeleteOffer } = useCommunity();
    const { services } = useServices();
    const [activeTab, setActiveTab] = useState<ListingStatus>('pending');
    const [rejectingOffer, setRejectingOffer] = useState<ExclusiveOffer | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<ExclusiveOffer | null>(null);

    const filteredOffers = useMemo(() => {
        return offers.filter(offer => offer.status === activeTab);
    }, [offers, activeTab]);

    const tabs: { key: ListingStatus, name: string }[] = [
        { key: 'pending', name: 'قيد المراجعة' },
        { key: 'approved', name: 'المقبولة' },
        { key: 'rejected', name: 'المرفوضة' },
        { key: 'expired', name: 'المنتهية' },
    ];
    
    const handleOpenForm = (offer: ExclusiveOffer | null) => {
        setEditingOffer(offer);
        setIsFormOpen(true);
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-6"><ArrowLeftIcon className="w-5 h-5"/><span>العودة</span></button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold flex items-center gap-3"><TagIcon className="w-8 h-8"/>إدارة العروض الحصرية</h1>
                    <button onClick={() => handleOpenForm(null)} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5"/>إضافة عرض</button>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                    <nav className="-mb-px flex gap-4" aria-label="Tabs">{tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {tab.name} ({offers.filter(i => i.status === tab.key).length})
                        </button>
                    ))}</nav>
                </div>
                
                <div className="space-y-4">{filteredOffers.length > 0 ? filteredOffers.map(offer => (
                    <div key={offer.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex gap-4">
                            <img src={offer.imageUrl} alt={offer.title} className="w-24 h-24 object-cover rounded-md" />
                            <div>
                                <p className="font-bold">{offer.title}</p>
                                <p className="text-sm text-gray-500">للخدمة: {services.find(s=> s.id === offer.serviceId)?.name}</p>
                                <p className="text-xs text-gray-400">تنتهي في: {offer.endDate}</p>
                                {offer.status === 'rejected' && <p className="text-xs text-red-500">السبب: {offer.rejectionReason}</p>}
                            </div>
                        </div>
                        <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2">
                            <StatusBadge status={offer.status} />
                            <div className="flex gap-2">
                                {offer.status === 'pending' && <>
                                    <button onClick={() => handleUpdateOfferStatus(offer.id, 'approved')} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"><CheckCircleIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setRejectingOffer(offer)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><XCircleIcon className="w-5 h-5"/></button>
                                </>}
                                <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center py-8 text-gray-500">لا توجد عروض في هذه الفئة.</p>}</div>
            </div>

            {isFormOpen && <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}>
                <AddOfferForm onClose={() => setIsFormOpen(false)} onSave={handleSaveOffer} services={services} offer={editingOffer} />
            </Modal>}

            {rejectingOffer && <RejectReasonModal onClose={() => setRejectingOffer(null)} onConfirm={(reason) => { handleUpdateOfferStatus(rejectingOffer.id, 'rejected', reason); setRejectingOffer(null);}} itemType="العرض" />}
        </div>
    );
};

export default OffersManagementPage;
