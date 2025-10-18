import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { GooglePlayIcon, AppleIcon } from './Icons';
import { prefetchMap } from './AnimatedRoutes';

const PublicFooter: React.FC = () => {

    const handlePrefetch = (to: string) => {
        const prefetcher = prefetchMap[to];
        if (prefetcher) {
            prefetcher();
        }
    };

    return (
        <footer className="bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo & About */}
                    <div className="md:col-span-1 space-y-4">
                        <Logo className="h-10" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            بوابتك الرقمية لاستكشاف الخدمات، متابعة الأخبار، والتواصل مع مجتمع هليوبوليس الجديدة.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white">روابط سريعة</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><Link to="/about" onPointerDown={() => handlePrefetch('/about')} className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">حول التطبيق</Link></li>
                            <li><Link to="/faq" onPointerDown={() => handlePrefetch('/faq')} className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">الأسئلة الشائعة</Link></li>
                            <li><Link to="/city-services-guide" onPointerDown={() => handlePrefetch('/city-services-guide')} className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">دليل خدمات المدينة</Link></li>
                            <li><Link to="/admin-login" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">دخول المسؤولين</Link></li>
                        </ul>
                    </div>
                    
                    {/* Column 3: Legal & Contact */}
                     <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white">روابط هامة</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><Link to="/privacy-policy" onPointerDown={() => handlePrefetch('/privacy-policy')} className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">سياسة الخصوصية</Link></li>
                            <li><Link to="/terms-of-use" onPointerDown={() => handlePrefetch('/terms-of-use')} className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">شروط الاستخدام</Link></li>
                            <li><Link to="/contact" onPointerDown={() => handlePrefetch('/contact')} className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">تواصل معنا</Link></li>
                        </ul>
                    </div>
                    
                    {/* Column 4: Download App */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white">حمل التطبيق</h3>
                         <div className="mt-4 space-y-3">
                           <a href="#" className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                             <GooglePlayIcon className="w-6 h-6"/>
                             <div className="text-right">
                               <p className="text-xs">GET IT ON</p>
                               <p className="text-sm font-semibold">Google Play</p>
                             </div>
                           </a>
                           <a href="#" className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                             <AppleIcon className="w-6 h-6"/>
                             <div className="text-right">
                               <p className="text-xs">Download on the</p>
                               <p className="text-sm font-semibold">App Store</p>
                             </div>
                           </a>
                        </div>
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