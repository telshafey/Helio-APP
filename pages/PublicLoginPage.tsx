import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// FIX: Replaced deprecated useAppContext with useData from DataContext.
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import type { AdminUser } from '../types';

const PublicLoginPage: React.FC = () => {
    const { publicLogin, login } = useAuth();
    // FIX: Replaced deprecated useAppContext with useData.
    const { admins } = useData();
    const navigate = useNavigate();
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = publicLogin(email, password);
        if (success) {
            navigate('/profile');
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }
    };

    const handleAdminLogin = (user: AdminUser) => {
        login(user);
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-100 dark:bg-slate-900 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                    <Logo className="h-16 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">تسجيل الدخول</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8">أهلاً بعودتك! سجل الدخول للمتابعة.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="test@test.com"
                                className="mt-1 block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">كلمة المرور</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="password"
                                className="mt-1 block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        >
                            دخول
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        ليس لديك حساب؟{' '}
                        <Link to="/register" className="font-medium text-cyan-600 hover:text-cyan-500">
                            أنشئ حساباً جديداً
                        </Link>
                    </p>
                </div>
            </div>

            <div className="w-full max-w-md mt-8">
                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 animate-fade-in-up">
                     <h3 className="text-center text-lg font-medium text-gray-600 dark:text-gray-400 mb-4">دخول سريع للمسؤولين (للتطوير)</h3>
                     <div className="space-y-3">
                        {admins.map(admin => (
                            <button
                                key={admin.id}
                                onClick={() => handleAdminLogin(admin)}
                                className="w-full flex items-center text-left gap-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-800"
                            >
                                <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-sm text-gray-800 dark:text-white">{admin.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{admin.role}</p>
                                </div>
                            </button>
                        ))}
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default PublicLoginPage;