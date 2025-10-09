import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import { 
    XMarkIcon, TruckIcon, ShieldExclamationIcon, BuildingLibraryIcon,
    DocumentDuplicateIcon, QuestionMarkCircleIcon, BookOpenIcon, ArrowLeftOnRectangleIcon, InformationCircleIcon,
    HeartIcon, ChatBubbleOvalLeftEllipsisIcon, NewspaperIcon, PhoneIcon,
    ShoppingBagIcon, BriefcaseIcon, TagIcon, ArchiveBoxIcon
} from './Icons';
import { prefetchMap } from './AnimatedRoutes';

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
    const { isPublicAuthenticated, currentPublicUser, publicLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        publicLogout();
        onClose();
        navigate('/');
    };
    
    const handlePrefetch = (to: string) => {
        const prefetcher = prefetchMap[to];
        if (prefetcher) {
            prefetcher();
        }
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-4 px-4 py-3 rounded-lg text-lg transition-colors ${
            isActive 
                ? 'bg-cyan-500/10 text-cyan-500 font-semibold' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600'
        }`;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <aside 
                className={`fixed top-0 right-0 h-full bg-slate-100 dark:bg-slate-800 w-72 sm:w-80 shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                dir="rtl"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <Logo className="h-9" />
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><XMarkIcon className="w-6 h-6"/></button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {isPublicAuthenticated && currentPublicUser ? (
                             <div className="flex items-center gap-4 p-2">
                                 <img src={currentPublicUser.avatar} alt={currentPublicUser.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-500" />
                                 <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{currentPublicUser.name}</p>
                                    <NavLink to="/profile" onClick={onClose} className="text-sm text-cyan-500 hover:underline">عرض الملف الشخصي</NavLink>
                                 </div>
                             </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <NavLink to="/login-user" onClick={onClose} onPointerDown={() => handlePrefetch('/login-user')} className="text-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">تسجيل الدخول</NavLink>
                                <NavLink to="/register" onClick={onClose} onPointerDown={() => handlePrefetch('/register')} className="text-center px-4 py-2 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">إنشاء حساب</NavLink>
                            </div>
                        )}
                    </div>

                    <nav className="p-4 space-y-2">
                         {isPublicAuthenticated && (
                             <NavLink to="/favorites" onClick={onClose} onPointerDown={() => handlePrefetch('/favorites')} className={navLinkClasses}>
                                <HeartIcon className="w-6 h-6 text-red-500"/>
                                <span>المفضلة</span>
                            </NavLink>
                        )}

                        <hr className="border-slate-200 dark:border-slate-700 my-3" />
                        
                        <NavLink to="/news" onClick={onClose} onPointerDown={() => handlePrefetch('/news')} className={navLinkClasses}><NewspaperIcon className="w-6 h-6 text-indigo-500"/><span>الأخبار</span></NavLink>
                        <NavLink to="/community" onClick={onClose} onPointerDown={() => handlePrefetch('/community')} className={navLinkClasses}><ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-teal-500"/><span>المجتمع</span></NavLink>
                        <NavLink to="/marketplace" onClick={onClose} onPointerDown={() => handlePrefetch('/marketplace')} className={navLinkClasses}><ShoppingBagIcon className="w-6 h-6 text-amber-500"/><span>البيع والشراء</span></NavLink>
                        <NavLink to="/jobs" onClick={onClose} onPointerDown={() => handlePrefetch('/jobs')} className={navLinkClasses}><BriefcaseIcon className="w-6 h-6 text-lime-500"/><span>الوظائف</span></NavLink>
                        <NavLink to="/offers" onClick={onClose} onPointerDown={() => handlePrefetch('/offers')} className={navLinkClasses}><TagIcon className="w-6 h-6 text-pink-500"/><span>العروض الحصرية</span></NavLink>
                        <NavLink to="/lost-and-found" onClick={onClose} onPointerDown={() => handlePrefetch('/lost-and-found')} className={navLinkClasses}><ArchiveBoxIcon className="w-6 h-6 text-orange-500"/><span>المفقودات</span></NavLink>
                        
                        <hr className="border-slate-200 dark:border-slate-700 my-3" />
                        
                        <h3 className="px-4 text-sm font-semibold text-gray-400">المدينة</h3>
                        <NavLink to="/transportation" onClick={onClose} onPointerDown={() => handlePrefetch('/transportation')} className={navLinkClasses}><TruckIcon className="w-6 h-6 text-purple-500"/><span>المواصلات</span></NavLink>
                        <NavLink to="/city-services-guide" onClick={onClose} onPointerDown={() => handlePrefetch('/city-services-guide')} className={navLinkClasses}><DocumentDuplicateIcon className="w-6 h-6 text-sky-500"/><span>خدمات جهاز المدينة</span></NavLink>
                         <NavLink to="/about-city" onClick={onClose} onPointerDown={() => handlePrefetch('/about-city')} className={navLinkClasses}><BuildingLibraryIcon className="w-6 h-6 text-green-500"/><span>عن المدينة والشركة</span></NavLink>
                        
                        <hr className="border-slate-200 dark:border-slate-700 my-3" />
                        
                        <h3 className="px-4 text-sm font-semibold text-gray-400">حول التطبيق</h3>
                        <NavLink to="/about" onClick={onClose} onPointerDown={() => handlePrefetch('/about')} className={navLinkClasses}><InformationCircleIcon className="w-6 h-6"/><span>حول التطبيق</span></NavLink>
                        <NavLink to="/contact" onClick={onClose} onPointerDown={() => handlePrefetch('/contact')} className={navLinkClasses}><PhoneIcon className="w-6 h-6"/><span>تواصل معنا</span></NavLink>
                        <NavLink to="/faq" onClick={onClose} onPointerDown={() => handlePrefetch('/faq')} className={navLinkClasses}><QuestionMarkCircleIcon className="w-6 h-6"/><span>الأسئلة الشائعة</span></NavLink>
                    </nav>
                </div>

                 <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                     <NavLink to="/privacy-policy" onClick={onClose} onPointerDown={() => handlePrefetch('/privacy-policy')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-500">
                        <BookOpenIcon className="w-5 h-5"/>
                        <span>سياسة الخصوصية</span>
                    </NavLink>
                     <NavLink to="/terms-of-use" onClick={onClose} onPointerDown={() => handlePrefetch('/terms-of-use')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-500">
                        <BookOpenIcon className="w-5 h-5"/>
                        <span>شروط الاستخدام</span>
                    </NavLink>
                    {isPublicAuthenticated && (
                         <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                            <span className="font-semibold">تسجيل الخروج</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default SideDrawer;