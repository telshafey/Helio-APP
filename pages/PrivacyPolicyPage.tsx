import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeftIcon, BookOpenIcon, ShieldCheckIcon, UserGroupIcon, LinkIcon, KeyIcon, PhoneIcon } from '../components/common/Icons';

const PrivacyPolicyPage: React.FC = () => {
    const navigate = useNavigate();
    const { publicPagesContent } = useData();
    const content = publicPagesContent.privacy;

    const getSectionIcon = (title: string): React.ReactNode => {
        const lowerCaseTitle = title.toLowerCase();
        if (lowerCaseTitle.includes('أمن') || lowerCaseTitle.includes('security')) {
            return <ShieldCheckIcon className="w-6 h-6 text-cyan-500" />;
        }
        if (lowerCaseTitle.includes('حقوقك') || lowerCaseTitle.includes('rights')) {
            return <KeyIcon className="w-6 h-6 text-cyan-500" />;
        }
        if (lowerCaseTitle.includes('أطفال') || lowerCaseTitle.includes('children')) {
            return <UserGroupIcon className="w-6 h-6 text-cyan-500" />;
        }
         if (lowerCaseTitle.includes('روابط') || lowerCaseTitle.includes('links')) {
            return <LinkIcon className="w-6 h-6 text-cyan-500" />;
        }
        if (lowerCaseTitle.includes('اتصل') || lowerCaseTitle.includes('contact')) {
            return <PhoneIcon className="w-6 h-6 text-cyan-500" />;
        }
        return <BookOpenIcon className="w-6 h-6 text-cyan-500" />;
    }

    return (
        <div className="animate-fade-in py-10 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
                            <ShieldCheckIcon className="w-12 h-12 text-cyan-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">{content.title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">آخر تحديث: {content.lastUpdated}</p>
                    </div>

                    <div className="space-y-6">
                        {content.sections.map((section, index) => (
                            <div key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 pb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                                    {getSectionIcon(section.title)}
                                    <span>{section.title}</span>
                                </h2>
                                <div className="prose dark:prose-invert max-w-none text-right leading-relaxed text-gray-600 dark:text-gray-300">
                                    {section.content.map((item, itemIndex) => {
                                        if (typeof item === 'string') {
                                            return <p key={itemIndex} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                                        } else if (item.list) {
                                            return (
                                                <ul key={itemIndex} className="space-y-1">
                                                    {item.list.map((li, liIndex) => <li key={liIndex}>{li}</li>)}
                                                </ul>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;