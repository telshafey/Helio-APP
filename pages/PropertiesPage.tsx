import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, 
    MagnifyingGlassIcon, HomeModernIcon, MapPinIcon, PhoneIcon
} from '../components/common/Icons';
import type { Property } from '../types';
import { useProperties } from '../context/PropertiesContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import { InputField, TextareaField } from '../components/common/FormControls';

const PropertyForm: React.FC<{
    onSave: (property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => void;
    onClose: () => void;
    property: Omit<Property, 'id'> & { id?: number } | null;
}> = ({ onSave, onClose, property }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        type: 'sale' as 'sale' | 'rent',
        price: 0,
        contactName: '',
        contactPhone: '',
        amenities: '',
    });
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        if (property) {
            setFormData({
                title: property.title || '',
                description: property.description || '',
                address: property.location?.address || '',
                type: property.type || 'sale',
                price: property.price || 0,
                contactName: property.contact?.name || '',
                contactPhone: property.contact?.phone || '',
                amenities: property.amenities?.join(', ') || '',
            });
            setImages(property.images || []);
        } else {
            setFormData({
                title: '', description: '', address: '', type: 'sale', price: 0,
                contactName: '', contactPhone: '', amenities: ''
            });
            setImages([]);
        }
    }, [property]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const propertyData = {
            id: property?.id,
            title: formData.title,
            description: formData.description,
            images: images,
            location: { address: formData.address },
            type: formData.type,
            price: Number(formData.price),
            contact: { name: formData.contactName, phone: formData.contactPhone },
            amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
        };
        onSave(propertyData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="title" label="عنوان الإعلان" value={formData.title} onChange={handleChange} required />
            <TextareaField name="description" label="الوصف" value={formData.description} onChange={handleChange} required />
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple maxFiles={10} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="price" label="السعر (بالجنيه المصري)" type="number" value={formData.price} onChange={handleChange} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع العرض</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                        <option value="sale">بيع</option>
                        <option value="rent">إيجار</option>
                    </select>
                </div>
            </div>
            <InputField name="address" label="العنوان / المنطقة" value={formData.address} onChange={handleChange} required />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="contactName" label="اسم جهة الاتصال" value={formData.contactName} onChange={handleChange} required />
                <InputField name="contactPhone" label="رقم هاتف التواصل" value={formData.contactPhone} onChange={handleChange} required />
            </div>
            <TextareaField name="amenities" label="وسائل الراحة (مفصولة بفاصلة)" value={formData.amenities} onChange={handleChange} />

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ العقار</button>
            </div>
        </form>
    );
};

const PropertyCard: React.FC<{ property: Property; onEdit: () => void; onDelete: () => void; }> = ({ property, onEdit, onDelete }) => {
    const { hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول العقارات']);
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
            <div className="relative">
                <img src={property.images[0] || 'https://picsum.photos/600/400?random=30'} alt={property.title} className="w-full h-48 object-cover" loading="lazy" />
                <div className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold text-white rounded-full ${property.type === 'sale' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                    {property.type === 'sale' ? 'للبيع' : 'للإيجار'}
                </div>
                 {canManage && (
                    <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={onEdit} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="تعديل العقار"><PencilSquareIcon className="w-5 h-5" /></button>
                        <button onClick={onDelete} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="حذف العقار"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                 )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">{property.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {property.location.address}</p>
                <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">{property.price.toLocaleString('ar-EG')} جنيه</p>
                <div className="flex justify-between items-center text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <PhoneIcon className="w-4 h-4"/>
                        <span>{property.contact.name}</span>
                    </div>
                    <a href={`tel:${property.contact.phone}`} className="font-bold text-green-600 hover:underline">{property.contact.phone}</a>
                </div>
            </div>
        </div>
    );
};


const PropertiesPage: React.FC = () => {
    const navigate = useNavigate();
    const { properties, handleSaveProperty, handleDeleteProperty } = useProperties();
    const { hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول العقارات']);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');

    const handleAddClick = () => {
        setEditingProperty(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (property: Property) => {
        setEditingProperty(property);
        setIsModalOpen(true);
    };

    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prop.location.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = typeFilter === 'all' || prop.type === typeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [properties, searchTerm, typeFilter]);
    
    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
             <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><HomeModernIcon className="w-8 h-8"/>إدارة العقارات</h1>
                    {canManage && (
                        <button onClick={handleAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            <span>إضافة عقار جديد</span>
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input
                            type="text" placeholder="بحث بالعنوان أو المنطقة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <select
                        value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="all">الكل (بيع وإيجار)</option>
                        <option value="sale">بيع فقط</option>
                        <option value="rent">إيجار فقط</option>
                    </select>
                </div>
                
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProperties.map(prop => (
                            <PropertyCard key={prop.id} property={prop} onEdit={() => handleEditClick(prop)} onDelete={() => handleDeleteProperty(prop.id)} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                      icon={<HomeModernIcon className="w-16 h-16 text-slate-400" />}
                      title={properties.length === 0 ? "لا توجد عقارات مضافة بعد" : "لا توجد عقارات تطابق بحثك"}
                      message={properties.length === 0 ? "ابدأ بإضافة أول عقار لعرضه للمستخدمين في المدينة." : "حاول تغيير الفلاتر أو توسيع نطاق البحث."}
                    >
                      {canManage && properties.length === 0 && (
                        <button onClick={handleAddClick} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            <span>إضافة عقار جديد</span>
                        </button>
                      )}
                    </EmptyState>
                )}
            </div>
            
            <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              title={editingProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
            >
                <PropertyForm 
                  onSave={handleSaveProperty}
                  onClose={() => setIsModalOpen(false)}
                  property={editingProperty}
                />
            </Modal>
        </div>
    );
};

export default PropertiesPage;
