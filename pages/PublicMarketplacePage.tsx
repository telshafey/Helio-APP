import React, { useState, useMemo, useEffect } from 'react';
import { useCommunity } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageBanner from '../components/common/PageBanner';
import { ShoppingBagIcon, PlusIcon, MagnifyingGlassIcon, PhoneIcon } from '../components/common/Icons';
import type { MarketplaceItem } from '../types';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import { InputField, TextareaField } from '../components/common/FormControls';

const AddItemForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { handleSaveMarketplaceItem } = useCommunity();
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', category: '', contactPhone: '', duration: 30,
    });
    const [images, setImages] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0) {
            alert('يرجى إضافة صورة واحدة على الأقل.');
            return;
        }
        handleSaveMarketplaceItem({
            ...formData,
            price: parseFloat(formData.price) || 0,
            images,
            duration: Number(formData.duration),
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple maxFiles={5} label="صور المنتج" />
            <InputField name="title" label="عنوان الإعلان" value={formData.title} onChange={handleChange} required />
            <TextareaField name="description" label="الوصف" value={formData.description} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="price" label="السعر (بالجنيه)" type="number" value={formData.price} onChange={handleChange} required />
                <InputField name="category" label="الفئة" value={formData.category} onChange={handleChange} required placeholder="مثال: أثاث, إلكترونيات..."/>
            </div>
            <InputField name="contactPhone" label="رقم هاتف للتواصل" value={formData.contactPhone} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium mb-1">مدة عرض الإعلان</label>
                <select name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <option value={30}>30 يوم</option>
                    <option value={60}>60 يوم</option>
                    <option value={90}>90 يوم</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">إرسال للمراجعة</button>
            </div>
        </form>
    );
};

const MarketplaceItemCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
        <div className="relative">
            <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{item.category}</div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg truncate">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm h-10 overflow-hidden">{item.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-extrabold text-cyan-500">{item.price.toLocaleString('ar-EG')} جنيه</p>
                <a href={`tel:${item.contactPhone}`} className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>تواصل</span>
                </a>
            </div>
        </div>
    </div>
);


const PublicMarketplacePage: React.FC = () => {
    const { marketplaceItems } = useCommunity();
    const { isPublicAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const approvedItems = useMemo(() => {
        return marketplaceItems
            .filter(item => item.status === 'approved')
            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [marketplaceItems, searchTerm]);
    
    const handleAddItemClick = () => {
        if (!isPublicAuthenticated) {
            navigate('/login-user');
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner title="البيع والشراء" subtitle="تصفح إعلانات البيع من جيرانك في المدينة." icon={<ShoppingBagIcon className="w-12 h-12 text-amber-500" />}/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md sticky top-20 z-10">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input type="text" placeholder="ابحث عن منتج أو فئة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none"/>
                    </div>
                    <button onClick={handleAddItemClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600">
                        <PlusIcon className="w-5 h-5"/>
                        <span>أضف إعلانك</span>
                    </button>
                </div>

                {approvedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {approvedItems.map(item => <MarketplaceItemCard key={item.id} item={item} />)}
                    </div>
                ) : (
                    <div className="mt-16">
                        <EmptyState icon={<ShoppingBagIcon className="w-16 h-16 text-slate-400" />} title="لا توجد إعلانات متاحة" message="كن أول من يضيف إعلان بيع في المدينة!" />
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة إعلان جديد">
                <AddItemForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default PublicMarketplacePage;