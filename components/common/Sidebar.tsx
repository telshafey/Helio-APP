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
    PhotoIcon
} from './Icons';
import { useData } from '../../context/DataContext';
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
    const { categories } = useData();
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
            { name: "إدارة النقل", icon: <TruckIcon className="w-6 h-6" />, to: "/transportation", roles: ['مدير عام', 'مسؤول الباصات'] },
            { name: "إدارة الطوارئ", icon: <ShieldExclamationIcon className="w-6 h-6" />, to: "/emergency", roles: serviceManagerRoles },
            { name: "أخبار المدينة", icon: <NewspaperIcon className="w-6 h-6" />, to: "/news", roles: newsManagerRoles },
            { name: "إدارة الإعلانات", icon: <PhotoIcon className="w-6 h-6" />, to: "/advertisements", roles: newsManagerRoles },
            { name: "إدارة الإشعارات", icon: <BellAlertIcon className="w-6 h-6" />, to: "/notifications", roles: newsManagerRoles },
            { name: "المستخدمون", icon: <UserGroupIcon className="w-6 h-6" />, to: "/users", roles: ['مدير عام'] },
            { name: "إدارة المحتوى", icon: <PencilSquareIcon className="w-6 h-6" />, to: "/content-management", roles: ['مدير عام'] },
            { name: "إدارة التقييمات", icon: <ChatBubbleOvalLeftIcon className="w-6 h-6" />, to: "/reviews", roles: serviceManagerRoles },
            { name: "إدارة المجتمع", icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />, to: "/community-management", roles: ['مدير عام', 'مسؤول الاخبار والاعلانات والاشعارات'] },
            { name: "التقارير", icon: <DocumentChartBarIcon className="w-6 h-6" />, to: "/reports" },
            { name: "سجل التدقيق", icon: <ClipboardDocumentListIcon className="w-6 h-6" />, to: "/audit-log", roles: ['مدير عام'] }
        );
        return constructedNavItems;
    }, [categories]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) setIsOpen(false);
    }, [location.pathname]);

    const visibleNavItems = useMemo(() => {
        if (!currentUser) return [];

        const filterByRole = (items: NavItemData[]): NavItemData[] => {
            const userRole = currentUser.role;
            if (userRole === 'مدير عام') return items;
            
            return items
                .filter(item => !item.roles || item.roles.includes(userRole))
                .map(item => ({
                    ...item,
                    children: item.children ? filterByRole(item.children) : undefined
                }))
                .filter(item => item.to || (item.children && item.children.length > 0));
        };

        const roleFilteredItems = filterByRole(navItems);
        return filterNavItemsBySearch(roleFilteredItems, searchQuery);

    }, [navItems, currentUser, searchQuery]);


    const handleMenuToggle = (name: string) => {
        if (searchQuery) return;
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const NavItem: React.FC<{ item: NavItemData; level: number }> = ({ item, level }) => {
        const hasChildren = item.children && item.children.length > 0;
        
        const isParentOfActive = useMemo(() => {
            if (!hasChildren) return false;
            const checkChildren = (children: NavItemData[]): boolean => children.some(child => (child.to && location.pathname.startsWith(child.to.split('#')[0])) || (child.children && checkChildren(child.children)));
            return checkChildren(item.children!);
        }, [item, location.pathname]);

        const isActive = item.to ? location.pathname === item.to : isParentOfActive;
        const isOpen = searchQuery ? true : openMenus[item.name];

        const paddingClass = level === 1 ? 'pr-8' : 'pr-12';

        if (hasChildren) {
            return (
                <div>
                    <button
                        onClick={() => handleMenuToggle(item.name)}
                        className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition-colors ${
                            isActive ? 'bg-cyan-500/10 text-cyan-500' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="font-semibold">{item.name}</span>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                        <div className="pt-2 space-y-1">
                            {item.children?.map(child => <NavItem key={child.name} item={child} level={level + 1} />)}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Link
                to={item.to || '#'}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-cyan-500 text-white shadow' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                } ${paddingClass}`}
            >
                {item.icon}
                <span className="text-sm">{item.name}</span>
            </Link>
        );
    };

    return (
        <>
            <button className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-slate-200 dark:bg-slate-800 rounded-md" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
            <aside ref={sidebarRef} className={`fixed lg:relative top-0 right-0 h-full bg-slate-100 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 w-72 lg:w-80 flex flex-col transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <Logo className="h-10" />
                    <span className="px-2 py-1 text-xs font-semibold text-cyan-700 bg-cyan-100 dark:text-cyan-200 dark:bg-cyan-900/50 rounded-full">
                        Admin
                    </span>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="بحث في القائمة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {visibleNavItems.map(item => <NavItem key={item.name} item={item} level={0} />)}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <Link to="/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors mb-2">
                        <Cog6ToothIcon className="w-6 h-6" />
                        <span className="font-semibold">الإعدادات</span>
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                        <span className="font-semibold">تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default memo(Sidebar);