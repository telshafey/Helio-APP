import React, { useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { BellIcon, SunIcon, MoonIcon } from './Icons';
import ProfileDropDown from './ProfileDropDown';
import Logo from './Logo';
import { useNews } from '../../context/NewsContext';
import { prefetchMap } from './AnimatedRoutes';

const PublicHeader: React.FC = () => {
    const { isPublicAuthenticated, currentPublicUser } = useAuth();
    const { notifications } = useNews();
    const { isDarkMode, setTheme, dismissedNotificationIds } = useUI();
    
    const unreadCount = useMemo(() => {
        return notifications.filter(n => !dismissedNotificationIds.has(n.id)).length;
    }, [notifications, dismissedNotificationIds]);

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'text-cyan-500 dark:text-cyan-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`;

    const handleToggle = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    const handlePrefetch = (to: string) => {
        const prefetcher = prefetchMap[to];
        if (prefetcher) {
            prefetcher();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20 border-b border-slate-200 dark:border-slate-700" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                    <Logo className="h-8" />
                     <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1 lg:space-x-4">
                            <NavLink to="/" end className={navLinkClasses} onPointerDown={() => handlePrefetch('/')}>الرئيسية</NavLink>
                            <NavLink to="/services" className={navLinkClasses} onPointerDown={() => handlePrefetch('/services')}>الخدمات</NavLink>
                            <NavLink to="/properties" className={navLinkClasses} onPointerDown={() => handlePrefetch('/properties')}>العقارات</NavLink>
                            <NavLink to="/marketplace" className={navLinkClasses} onPointerDown={() => handlePrefetch('/marketplace')}>البيع والشراء</NavLink>
                            <NavLink to="/jobs" className={navLinkClasses} onPointerDown={() => handlePrefetch('/jobs')}>الوظائف</NavLink>
                            <NavLink to="/offers" className={navLinkClasses} onPointerDown={() => handlePrefetch('/offers')}>العروض</NavLink>
                            <NavLink to="/lost-and-found" className={navLinkClasses} onPointerDown={() => handlePrefetch('/lost-and-found')}>المفقودات</NavLink>
                            <NavLink to="/news" className={navLinkClasses} onPointerDown={() => handlePrefetch('/news')}>الأخبار</NavLink>
                            <NavLink to="/community" className={navLinkClasses} onPointerDown={() => handlePrefetch('/community')}>المجتمع</NavLink>
                            <NavLink to="/transportation" className={navLinkClasses} onPointerDown={() => handlePrefetch('/transportation')}>المواصلات</NavLink>
                            <NavLink to="/emergency" className={navLinkClasses} onPointerDown={() => handlePrefetch('/emergency')}>الطوارئ</NavLink>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                        onClick={handleToggle} 
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-all transform active:scale-95" 
                        title="Toggle dark mode"
                    >
                        {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                    </button>
                    <Link to="/user-notifications" className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all transform active:scale-95">
                        <BellIcon className="w-6 h-6" />
                        {unreadCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadCount}</span>}
                    </Link>
                    {isPublicAuthenticated && currentPublicUser ? (
                        <ProfileDropDown user={currentPublicUser} />
                    ) : (
                        <Link to="/login-user" onPointerDown={() => handlePrefetch('/login-user')} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transform active:scale-95">تسجيل الدخول</Link>
                    )}
                </div>
            </div>
        </header>
    );
};
export default PublicHeader;