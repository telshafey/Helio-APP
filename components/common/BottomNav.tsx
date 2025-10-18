import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, Squares2X2Icon, HomeModernIcon, ShieldExclamationIcon, Bars3Icon } from './Icons';
import { prefetchMap } from './AnimatedRoutes';

interface BottomNavProps {
    onMenuClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onMenuClick }) => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-all duration-200 transform active:scale-95 ${
            isActive ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400 hover:text-cyan-500'
        }`;

    const handlePrefetch = (to: string) => {
        const prefetcher = prefetchMap[to];
        if (prefetcher) {
            prefetcher();
        }
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 z-30" dir="rtl">
            <div className="flex justify-around h-full">
                <NavLink to="/" end className={navLinkClasses} onPointerDown={() => handlePrefetch('/')}>
                    <HomeIcon className="w-6 h-6" />
                    <span className="text-xs">الرئيسية</span>
                </NavLink>
                <NavLink to="/services" className={navLinkClasses} onPointerDown={() => handlePrefetch('/services')}>
                    <Squares2X2Icon className="w-6 h-6" />
                    <span className="text-xs">الخدمات</span>
                </NavLink>
                <NavLink to="/properties" className={navLinkClasses} onPointerDown={() => handlePrefetch('/properties')}>
                    <HomeModernIcon className="w-6 h-6" />
                    <span className="text-xs">العقارات</span>
                </NavLink>
                 <NavLink to="/emergency" className={navLinkClasses} onPointerDown={() => handlePrefetch('/emergency')}>
                    <ShieldExclamationIcon className="w-6 h-6" />
                    <span className="text-xs">الطوارئ</span>
                </NavLink>
                <button onClick={onMenuClick} className="flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 text-gray-500 dark:text-gray-400 hover:text-cyan-500 transform active:scale-95 transition-transform">
                    <Bars3Icon className="w-6 h-6" />
                    <span className="text-xs">القائمة</span>
                </button>
            </div>
        </footer>
    );
};

export default BottomNav;