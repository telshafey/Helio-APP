import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';

const ContactPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner
                title="تواصل معنا"
                subtitle="نسعد بسماع آرائكم ومقترحاتكم. فريقنا جاهز للرد على استفساراتكم."
                icon={<EnvelopeIcon className="w-12 h-12 text-cyan-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-8">
                        <ArrowLeftIcon className="w-5 h-5"/>
                        <span>العودة</span>
                    </button>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">معلومات الاتصال</h3>
                                <p className="text-gray-600 dark:text-gray-300">يمكنكم التواصل معنا مباشرة عبر القنوات التالية:</p>
                            </div>
                            <a href="mailto:support@tech-bokra.com" className="flex items-center gap-4 group">
                                <div className="p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full group-hover:bg-cyan-200 transition-colors">
                                    <EnvelopeIcon className="w-7 h-7 text-cyan-600 dark:text-cyan-400"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">البريد الإلكتروني للدعم</h4>
                                    <p className="text-cyan-500 group-hover:underline">support@tech-bokra.com</p>
                                </div>
                            </a>
                            <a href="tel:+201040303547" className="flex items-center gap-4 group">
                                <div className="p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full group-hover:bg-cyan-200 transition-colors">
                                    <PhoneIcon className="w-7 h-7 text-cyan-600 dark:text-cyan-400"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">الهاتف</h4>
                                    <p className="text-cyan-500 group-hover:underline" dir="ltr">+20 104 030 3547</p>
                                </div>
                            </a>
                        </div>
                        <div>
                             <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg h-full flex flex-col justify-center text-center">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">ساعات العمل</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    الدعم الفني متاح من الأحد إلى الخميس،
                                    <br/>
                                    من الساعة 9 صباحاً حتى 5 مساءً بتوقيت القاهرة.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;