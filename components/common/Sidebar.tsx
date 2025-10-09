import React, { useState, memo, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, UserGroupIcon, Cog6ToothIcon, MagnifyingGlassIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, 
    WrenchScrewdriverIcon, TruckIcon, ShieldExclamationIcon, NewspaperIcon, ChevronDownIcon, 
    HomeModernIcon, BuildingLibraryIcon, 
    BellAlertIcon, DocumentChartBarIcon, DocumentDuplicateIcon, RectangleGroupIcon,
    BuildingOffice2Icon,
    ChatBubbleOvalLeftIcon,
    ClipboardDocumentListIcon,
    PencilSquareIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    PhotoIcon,
    ShoppingBagIcon,
    BriefcaseIcon,
    TagIcon,
    ArchiveBoxIcon
} from './Icons';
import { useServices } from '../../context/ServicesContext';
import { useAuth } from '../../context/AuthContext';
import type { AdminUser } from '../../types';
import Logo from './Logo';
import { getIcon } from './iconUtils';


interface NavItemData {
    name: string;
    icon: React.ReactNode;
    to?: string;
    children?: NavItemData[];
    roles?: (AdminUser['role'])[];
}

const filterNavItemsBySearch = (items: NavItemData[], query: string): NavItemData[] => {
    if (!query.trim()) return items;
    const lowerCaseQuery = query.toLowerCase();

    return items.reduce((acc: NavItemData[], item) => {
        if (item.name.toLowerCase().includes(lowerCaseQuery)) {
            acc.push(item);
            return acc;
        }
        if (item.children) {
            const filteredChildren = filterNavItemsBySearch(item.children, query);
            if (filteredChildren.length > 0) acc.push({ ...item, children: filteredChildren });
        }
        return acc;
    }, []);
};

const Sidebar: React.FC = () => {
    const { categories } = useServices();
    const { logout, currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ 'الخدمات الرئيسية': true });
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const navItems = useMemo(() => {
        const serviceCategories = categories.filter(c => c.name !== "المدينة والجهاز");

        const serviceNavItems: NavItemData[] = serviceCategories.map(category => ({
            name: category.name,
            icon: getIcon(category.icon, { className: "w-5 h-5" }),
            children: category.subCategories.map(sub => ({
                name: sub.name,
                icon: <div className="w-5 h-5" />,
                to: `/services/subcategory/${sub.id}`,
            }))
        }));
        
        const serviceManagerRoles: AdminUser['role'][] = ['مدير عام', 'مسؤول ادارة الخدمات'];
        const newsManagerRoles: AdminUser['role'][] = ['مدير عام', 'مسؤول الاخبار والاعلانات والاشعارات'];

        const constructedNavItems: NavItemData[] = [
            { name: "نظرة عامة", icon: <HomeIcon className="w-6 h-6" />, to: "/" },
            { name: "هيكل الخدمات", icon: <RectangleGroupIcon className="w-6 h-6" />, to: "/services-overview", roles: serviceManagerRoles },
            { name: "خدمات جهاز المدينة", icon: <DocumentDuplicateIcon className="w-6 h-6 text-sky-400" />, to: "/city-services-guide", roles: serviceManagerRoles },
            { name: "عن المدينة والشركة", icon: <BuildingLibraryIcon className="w-6 h-6 text-green-400" />, to: "/about-city", roles: ['مدير عام'] },
        ];
        
        if (serviceNavItems.length > 0) {
            constructedNavItems.push({
                name: "الخدمات الرئيسية",
                icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
                children: serviceNavItems,
                roles: serviceManagerRoles
            });
        }

        constructedNavItems.push(
            { name: "إدارة العقارات", icon: <HomeModernIcon className="w-6 h-6" />, to: "/properties", roles: ['مدير عام', 'مسؤول العقارات'] },
            { name: "إدارة البيع والشراء", icon: <ShoppingBagIcon className="w-6 h-6" />, to: "/marketplace-management", roles: serviceManagerRoles },
            { name: "إدارة الوظائف", icon: <BriefcaseIcon className="w-6 h-6" />, to: "/jobs-management", roles: newsManagerRoles },
            { name: "إدارة العروض", icon: <TagIcon className="w-6 h-6" />, to: "/offers-management", roles: newsManagerRoles },
            { name: "إدارة المفقودات", icon: <ArchiveBoxIcon className="w-6 h-6" />, to: "/lost-and-found-management", roles: ['مدير عام'] },
            { name: "إدارة النقل", icon: <TruckIcon className="w-6 h-6" />, to: "/transportation", roles: ['مدير عام', 'مسؤول الباصات'] },
            { name: "إدارة الطوارئ", icon: <ShieldExclamationIcon className="w-6 h-6" />, to: "/emergency", roles: serviceManagerRoles },
            { name: "الأخبار", icon: <NewspaperIcon className="w-6 h-6" />, to: "/news", roles: newsManagerRoles },
            { name: "الإعلانات", icon: <PhotoIcon className="w-6 h-6" />, to: "/advertisements", roles: newsManagerRoles },
            { name: "الإشعارات", icon: <BellAlertIcon className="w-6 h-6" />, to: "/notifications", roles: newsManagerRoles },
            { name: "إدارة المجتمع", icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />, to: "/community-management", roles: ['مدير عام'] },
            { name: "إدارة المستخدمين", icon: <UserGroupIcon className="w-6 h-6" />, to: "/users", roles: ['مدير عام'] },
            { name: "إدارة المحتوى العام", icon: <PencilSquareIcon className="w-6 h-6" />, to: "/content-management", roles: ['مدير عام'] },
            { name: "سجل التدقيق", icon: <ClipboardDocumentListIcon className="w-6 h-6" />, to: "/audit-log", roles: ['مدير عام'] },
            { name: "التقارير", icon: <DocumentChartBarIcon className="w-6 h-6" />, to: "/reports", roles: ['مدير عام'] },
            { name: "الإعدادات", icon: <Cog6ToothIcon className="w-6 h-6" />, to: "/settings", roles: ['مدير عام'] }
        );
        
        if (!currentUser) return [];

        return constructedNavItems.filter(item => {
            if (!item.roles) return true;
            return item.roles.includes(currentUser.role);
        });
    }, [categories, currentUser]);


    const filteredNavItems = useMemo(() => filterNavItemsBySearch(navItems, searchQuery), [navItems, searchQuery]);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const isLinkActive = (to: string) => {
        if (to === '/') return location.pathname === '/';
        return location.pathname.startsWith(to);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const NavItem: React.FC<{ item: NavItemData; level: number }> = ({ item, level }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenus[item.name] || false;
        
        const paddingLeftClass = `pl-${level * 4}`;

        if (hasChildren) {
            return (
                <div>
                    <button onClick={() => toggleMenu(item.name)} className={`w-full flex items-center justify-between text-right text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 p-3 rounded-lg ${paddingLeftClass}`}>
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="font-semibold">{item.name}</span>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                        <div className="mt-1 space-y-1 pr-4">
                            {item.children?.map((child) => <NavItem key={child.name} item={child} level={level + 1} />)}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link 
                to={item.to!} 
                className={`w-full flex items-center gap-3 text-right p-3 rounded-lg transition-colors ${paddingLeftClass} ${isLinkActive(item.to!) ? 'bg-cyan-500/10 text-cyan-500 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                {item.icon}
                <span>{item.name}</span>
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 right-4 z-30 p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full">
                {isOpen ? <XMarkIcon className="w-6 h-6"/> : <Bars3Icon className="w-6 h-6"/>}
            </button>
            
            {/* Sidebar */}
            <div ref={sidebarRef} className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-slate-100 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col z-20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:flex`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <Logo className="h-10" />
                </div>
                
                <div className="p-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="بحث في القائمة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredNavItems.map(item => <NavItem key={item.name} item={item} level={0} />)}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                        <img src={currentUser?.avatar} alt={currentUser?.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="mr-3 flex-1">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{currentUser?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.role}</p>
                        </div>
                        <button onClick={logout} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors" title="تسجيل الخروج">
                            <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(Sidebar);