import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { AdminUser } from '../types';
import Logo from '../components/common/Logo';

const AdminLoginPage: React.FC = () => {
    const { login, admins } = useAppContext();
    const navigate = useNavigate();

    const handleQuickLogin = (user: AdminUser) => {
        login(user);
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-100 dark:bg-slate-900 px-4 py-8">
            <div className="w-full max-w-md text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                    <Logo className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">لوحة تحكم المدير</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        اختر حسابًا لتسجيل الدخول.
                    </p>

                    <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">تسجيل دخول سريع (للتطوير)</h3>
                        {admins.map(admin => (
                            <button
                                key={admin.id}
                                onClick={() => handleQuickLogin(admin)}
                                className="w-full flex items-center text-left gap-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-800"
                            >
                                <img src={admin.avatar} alt={admin.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{admin.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{admin.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;