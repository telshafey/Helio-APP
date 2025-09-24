import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './common/Logo';

const PublicFooter: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-4 gap-8 text-right">
                    <div className="md:col-span-1">
                        <Logo className="h-8" />
                        <p className="text-gray-500 dark:text-gray-400 mt-2">بوابتك الرقمية لمدينة هليوبوليس الجديدة.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">روابط سريعة</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">حول التطبيق</Link></li>
                            <li><Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">الأسئلة الشائعة</Link></li>
                            <li><Link to="/city-services-guide" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">دليل خدمات المدينة</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">قانوني</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">سياسة الخصوصية</Link></li>
                            <li><Link to="/terms-of-use" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">شروط الاستخدام</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">تواصل معنا</h3>
                        <ul className="mt-4 space-y-2 text-gray-500 dark:text-gray-400">
                            <li><a href="mailto:support@tech-bokra.com" className="hover:text-cyan-500">support@tech-bokra.com</a></li>
                            <li><a href="tel:+201040303547" className="hover:text-cyan-500" dir="ltr">+20 104 030 3547</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Helio APP. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;