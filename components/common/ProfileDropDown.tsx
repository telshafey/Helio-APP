import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { AppUser } from '../../types';
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from './Icons';

interface ProfileDropDownProps {
    user: AppUser;
}

const ProfileDropDown: React.FC<ProfileDropDownProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { publicLogout } = useAppContext();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        publicLogout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-800"
            >
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full object-cover" src={user.avatar} alt={user.name} />
            </button>

            {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">أهلاً، {user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        <UserCircleIcon className="w-5 h-5"/>
                        ملفي الشخصي
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                        تسجيل الخروج
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropDown;