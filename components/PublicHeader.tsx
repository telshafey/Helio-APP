import React from 'react';
import { Link, NavLink } from 'react-router-dom';
// FIX: Corrected icon import path
import { MoonIcon, SunIcon } from './common/Icons';
import ProfileDropDown from './common/ProfileDropDown';
// FIX: Import useUI to get dark mode state, as it's no longer in AppContext.
import { useUI } from '../context/UIContext';
// FIX: Import useAuth to get public user authentication state.
import { useAuth } from '../context/AuthContext';

const PublicHeader: React.FC = () => {
    // FIX: Destructure hooks separately. UI state comes from useUI, auth state from useAuth.
    const { isDarkMode, toggleDarkMode } = useUI();
    const { isPublicAuthenticated, currentPublicUser } = useAuth();

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'text-cyan-500 dark:text-cyan-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`;

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20 shadow-sm" dir="rtl">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider">Helio APP</h1>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-1 lg:space-x-4">
                                <NavLink to="/" className={navLinkClasses}>الرئيسية</NavLink>
                                <NavLink to="/services" className={navLinkClasses}>الخدمات</NavLink>
                                <NavLink to="/properties" className={navLinkClasses}>العقارات</NavLink>
                                <NavLink to="/news" className={navLinkClasses}>الأخبار</NavLink>
                                <NavLink to="/community" className={navLinkClasses}>المجتمع</NavLink>
                                <NavLink to="/transportation" className={navLinkClasses}>المواصلات</NavLink>
                                <NavLink to="/emergency" className={navLinkClasses}>الطوارئ</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-colors">
                            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        
                        {isPublicAuthenticated && currentPublicUser ? (
                            <ProfileDropDown user={currentPublicUser} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login-user" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm">
                                    تسجيل الدخول
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                                    إنشاء حساب
                                </Link>
                            </div>
                        )}
                        
                        <div className="hidden sm:block border-r border-slate-200 dark:border-slate-700 h-8 mx-2"></div>

                        <Link to="/admin-login" className="hidden sm:block px-4 py-2 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm">
                           دخول المسؤولين
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default PublicHeader;