import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Import useAuth to get public user session data and logout function.
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import { 
    XMarkIcon, TruckIcon, ShieldExclamationIcon, BuildingLibraryIcon,
    DocumentDuplicateIcon, QuestionMarkCircleIcon, BookOpenIcon, ArrowLeftOnRectangleIcon, KeyIcon, InformationCircleIcon,
    HeartIcon, ChatBubbleOvalLeftEllipsisIcon, Squares2X2Icon, HomeModernIcon, NewspaperIcon
} from './Icons';

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
    // FIX: Destructure authentication properties from useAuth context.
    const { isPublicAuthenticated, currentPublicUser, publicLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        publicLogout();
        onClose();
        navigate('/');
    };
    
    const handleLinkClick = (path: string) => {
        navigate(path);
        onClose();
    }
    
    const navLinkClasses = "flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors";

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <aside 
                className={`fixed top-0 right-0 h-full bg-slate-100 dark:bg-slate-800 w-72 sm:w-80 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                dir="rtl"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <Logo className="h-9" />
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><XMarkIcon className="w-6 h-6"/></button>
                </div>

                <div className="p-4">
                    {isPublicAuthenticated && currentPublicUser ? (
                         <div className="flex items-center gap-4 p-2">
                             <img src={currentPublicUser.avatar} alt={currentPublicUser.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-500" />
                             <div>
                                <p className="font-bold text-gray-800 dark:text-white">{currentPublicUser.name}</p>
                                <Link to="/profile" onClick={() => onClose()} className="text-sm text-cyan-500 hover:underline">عرض الملف الشخصي</Link>
                             </div>
                         </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/login-user" onClick={() => onClose()} className="text-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">تسجيل الدخول</Link>
                            <Link to="/register" onClick={() => onClose()} className="text-center px-4 py-2 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">إنشاء حساب</Link>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isPublicAuthenticated && (
                         <button onClick={() => handleLinkClick('/favorites')} className={`${navLinkClasses} w-full`}>
                            <HeartIcon className="w-6 h-6 text-red-500"/>
                            <span>المفضلة</span>
                        </button>
                    )}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700"></div>
                     <button onClick={() => handleLinkClick('/services')} className={`${navLinkClasses} w-full`}><Squares2X2Icon className="w-6 h-6 text-blue-500"/><span>الخدمات</span></button>
                     <button onClick={() => handleLinkClick('/properties')} className={`${navLinkClasses} w-full`}><HomeModernIcon className="w-6 h-6 text-amber-500"/><span>العقارات</span></button>
                     <button onClick={() => handleLinkClick('/news')} className={`${navLinkClasses} w-full`}><NewspaperIcon className="w-6 h-6 text-indigo-500"/><span>الأخبار</span></button>
                     <button onClick={() => handleLinkClick('/community')} className={`${navLinkClasses} w-full`}><ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-teal-500"/><span>المجتمع</span></button>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700"></div>
                    <button onClick={() => handleLinkClick('/transportation')} className={`${navLinkClasses} w-full`}><TruckIcon className="w-6 h-6 text-purple-500"/><span>المواصلات</span></button>
                    <button onClick={() => handleLinkClick('/emergency')} className={`${navLinkClasses} w-full`}><ShieldExclamationIcon className="w-6 h-6 text-rose-500"/><span>الطوارئ</span></button>
                    <button onClick={() => handleLinkClick('/city-services-guide')} className={`${navLinkClasses} w-full`}><DocumentDuplicateIcon className="w-6 h-6 text-sky-500"/><span>خدمات جهاز المدينة</span></button>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700"></div>
                    <button onClick={() => handleLinkClick('/about-city')} className={`${navLinkClasses} w-full`}><BuildingLibraryIcon className="w-6 h-6 text-green-500"/><span>عن المدينة والشركة</span></button>
                    <button onClick={() => handleLinkClick('/about')} className={`${navLinkClasses} w-full`}><InformationCircleIcon className="w-6 h-6"/><span>حول التطبيق</span></button>
                    <button onClick={() => handleLinkClick('/faq')} className={`${navLinkClasses} w-full`}><QuestionMarkCircleIcon className="w-6 h-6"/><span>الأسئلة الشائعة</span></button>
                     <div className="pt-2 border-t border-slate-200 dark:border-slate-700"></div>
                     <button onClick={() => handleLinkClick('/privacy-policy')} className={`${navLinkClasses} w-full`}><BookOpenIcon className="w-6 h-6"/><span>سياسة الخصوصية</span></button>
                     <button onClick={() => handleLinkClick('/terms-of-use')} className={`${navLinkClasses} w-full`}><BookOpenIcon className="w-6 h-6"/><span>شروط الاستخدام</span></button>
                     <button onClick={() => handleLinkClick('/admin-login')} className={`${navLinkClasses} w-full`}><KeyIcon className="w-6 h-6 text-amber-500"/><span>دخول المسؤولين</span></button>
                </nav>

                 <div className="p-4 border-t border-slate-200 dark:border-slate-700">
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