import React, { useState, useMemo } from 'react';
import { useCommunity } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageBanner from '../components/common/PageBanner';
import { ArchiveBoxIcon, PlusIcon, MapPinIcon } from '../components/common/Icons';
import type { LostAndFoundItem } from '../types';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import { InputField, TextareaField } from '../components/common/FormControls';

const AddLostAndFoundForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { handleSaveLostAndFoundItem } = useCommunity();
    const [formData, setFormData] = useState({
        type: 'lost' as 'lost' | 'found',
        title: '',
        description: '',
        location: '',
        contactInfo: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [image, setImage] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveLostAndFoundItem({
            ...formData,
            imageUrl: image[0] || undefined,
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">نوع البلاغ</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <option value="lost">مفقود</option>
                    <option value="found">تم العثور عليه</option>
                </select>
            </div>
            <InputField name="title" label="العنوان" value={formData.title} onChange={handleChange} required placeholder={formData.type === 'lost' ? 'مثال: فقدت مفاتيح سيارتي' : 'مثال: وجدت هاتف محمول'} />
            <TextareaField name="description" label="الوصف" value={formData.description} onChange={handleChange} required />
            <ImageUploader initialImages={image} onImagesChange={setImage} multiple={false} label="صورة (اختياري)" />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="location" label="الموقع التقريبي" value={formData.location} onChange={handleChange} required placeholder="مثال: الحديقة المركزية"/>
                <InputField name="date" label="تاريخ الفقد/العثور" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <InputField name="contactInfo" label="معلومات التواصل (هاتف أو بريد إلكتروني)" value={formData.contactInfo} onChange={handleChange} required />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">إرسال للمراجعة</button>
            </div>
        </form>
    );
};

const LostAndFoundCard: React.FC<{ item: LostAndFoundItem }> = ({ item }) => {
    const [showContact, setShowContact] = useState(false);
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                     <img src={item.avatar} alt={item.username} className="w-8 h-8 rounded-full" />
                     <span className="font-semibold text-sm">{item.username}</span>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm my-2">{item.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-3">
                    <p className="flex items-center gap-1"><MapPinIcon className="w-4 h-4"/> <strong>الموقع:</strong> {item.location}</p>
                    <p><strong>التاريخ:</strong> {new Date(item.date).toLocaleDateString('ar-EG-u-nu-latn')}</p>
                </div>
                 <button onClick={() => setShowContact(!showContact)} className="w-full mt-4 bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600">
                    {showContact ? item.contactInfo : 'إظهار معلومات التواصل'}
                </button>
            </div>
        </div>
    );
}

const PublicLostAndFoundPage: React.FC = () => {
    const { lostAndFoundItems } = useCommunity();
    const { isPublicAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');

    const filteredItems = useMemo(() => {
        return lostAndFoundItems
            .filter(item => item.status === 'approved' && item.type === activeTab)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [lostAndFoundItems, activeTab]);
    
    const handleAddItemClick = () => {
        if (!isPublicAuthenticated) {
            navigate('/login-user');
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner title="المفقودات والموجودات" subtitle="مكان لمساعدة الجيران في العثور على ما فقدوه." icon={<ArchiveBoxIcon className="w-12 h-12 text-orange-500" />}/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-lg flex gap-1">
                        <button onClick={() => setActiveTab('lost')} className={`px-6 py-2 font-semibold rounded-md ${activeTab === 'lost' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>مفقودات</button>
                        <button onClick={() => setActiveTab('found')} className={`px-6 py-2 font-semibold rounded-md ${activeTab === 'found' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>تم العثور عليها</button>
                    </div>
                     <button onClick={handleAddItemClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600">
                        <PlusIcon className="w-5 h-5"/>
                        <span>أضف بلاغاً</span>
                    </button>
                </div>

                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => <LostAndFoundCard key={item.id} item={item} />)}
                    </div>
                ) : (
                    <div className="mt-16">
                        <EmptyState icon={<ArchiveBoxIcon className="w-16 h-16 text-slate-400" />} title={`لا توجد ${activeTab === 'lost' ? 'مفقودات' : 'موجودات'} حالياً`} message="كن أول من يضيف بلاغاً لمساعدة جيرانك." />
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة بلاغ جديد">
                <AddLostAndFoundForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default PublicLostAndFoundPage;
