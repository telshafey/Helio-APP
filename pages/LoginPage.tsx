import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const AdminLoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-100 dark:bg-slate-900 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                    <Logo className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-2">لوحة تحكم المدير</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                        يرجى تسجيل الدخول للمتابعة.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@helio.com"
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
                                placeholder="••••••••"
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
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;