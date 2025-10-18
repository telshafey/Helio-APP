import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import { useServices } from '../context/ServicesContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { ArrowLeftIcon, UserCircleIcon, PencilIcon, StarIcon, ChatBubbleOvalLeftIcon, HeartIconSolid, TrashIcon, Cog6ToothIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import type { AppUser, Theme } from '../types';
import ServiceCard from '../components/common/ServiceCard';

const EditProfileForm: React.FC<{ user: AppUser; onSave: (data: Omit<AppUser, 'joinDate' | 'status'>) => void; onClose: () => void }> = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState([user.avatar]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: user.id, name, email, avatar: avatar[0] });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="الصورة الرمزية" />
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ التغييرات</button>
            </div>
        </form>
    );
};

const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useUI();
    
    const options: { value: Theme, label: string, icon: React.ReactNode }[] = [
        { value: 'light', label: 'فاتح', icon: <SunIcon className="w-5 h-5"/> },
        { value: 'dark', label: 'داكن', icon: <MoonIcon className="w-5 h-5"/> },
        { value: 'system', label: 'النظام', icon: <ComputerDesktopIcon className="w-5 h-5"/> },
    ];

    return (
        <div className="bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg flex gap-1">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        theme === option.value 
                        ? 'bg-white dark:bg-slate-800 shadow text-cyan-500' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    {option.icon}
                    {option.label}
                </button>
            ))}
        </div>
    );
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { requestAccountDeletion } = useUsers();
    const { services } = useServices();
    const { currentPublicUser, updateProfile, publicLogout } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const userReviews = useMemo(() => {
        if (!currentPublicUser) return [];
        return services.flatMap(service =>
            service.reviews
                .filter(review => review.userId === currentPublicUser.id)
                .map(review => ({ ...review, serviceName: service.name }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [currentPublicUser, services]);

    const favoriteServices = useMemo(() => {
        if (!currentPublicUser) return [];
        return services.filter(service => service.isFavorite);
    }, [currentPublicUser, services]);

    if (!currentPublicUser) {
        return null; // Or a loading/error state
    }
    
    const handleSaveProfile = (data: Omit<AppUser, 'joinDate' | 'status'>) => {
        updateProfile({ ...currentPublicUser, ...data });
    };

    const handleConfirmDeletion = () => {
        if (currentPublicUser) {
            requestAccountDeletion(currentPublicUser.id);
            setIsDeleteModalOpen(false);
            setTimeout(() => {
                publicLogout();
                navigate('/');
            }, 1000);
        }
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                            <img src={currentPublicUser.avatar} alt={currentPublicUser.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-cyan-500/50" />
                            <div className="text-center sm:text-right flex-grow">
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{currentPublicUser.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{currentPublicUser.email}</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">عضو منذ: {new Date(currentPublicUser.joinDate).toLocaleDateString('ar-EG')}</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                <Cog6ToothIcon className="w-7 h-7"/>
                                الإعدادات
                            </h2>
                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <h3 className="font-semibold mb-3">المظهر</h3>
                                    <ThemeSelector />
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <h3 className="font-semibold mb-3">الحساب</h3>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                         <button onClick={() => setIsEditModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                            <PencilIcon className="w-5 h-5"/>
                                            تعديل الملف الشخصي
                                        </button>
                                        <button 
                                            onClick={() => setIsDeleteModalOpen(true)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                            طلب حذف الحساب
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                <HeartIconSolid className="w-7 h-7 text-red-500"/>
                                المفضلة ({favoriteServices.length})
                            </h2>
                             {favoriteServices.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favoriteServices.map(service => (
                                        <ServiceCard key={service.id} service={service} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <p>لم تقم بإضافة أي خدمات إلى المفضلة بعد.</p>
                                    <p className="text-sm mt-1">انقر على أيقونة القلب ❤️ على أي خدمة لإضافتها هنا.</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                <ChatBubbleOvalLeftIcon className="w-7 h-7"/>
                                تقييماتي ({userReviews.length})
                            </h2>
                            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                                {userReviews.length > 0 ? userReviews.map(review => (
                                    <div key={review.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                                تقييم لـ <span className="font-bold text-cyan-600 dark:text-cyan-400">{review.serviceName}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                         <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${ i < review.rating ? 'text-yellow-400' : 'text-gray-300' }`} />)}
                                        </div>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">{review.comment}</p>
                                        {review.adminReply && <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-500 border-r-2 border-cyan-500 pr-2">رد الإدارة: {review.adminReply}</p>}
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">لم تقم بإضافة أي تقييمات بعد.</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل الملف الشخصي">
                <EditProfileForm user={currentPublicUser} onSave={handleSaveProfile} onClose={() => setIsEditModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="تأكيد طلب حذف الحساب">
                <div className="text-right">
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        هل أنت متأكد أنك تريد المتابعة؟ سيتم إرسال طلبك إلى الإدارة، وبعد الموافقة سيتم حذف حسابك وبياناتك بشكل دائم.
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleConfirmDeletion}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                            نعم، أرسل طلب الحذف
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfilePage;