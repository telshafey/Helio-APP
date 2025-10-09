import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ChevronDownIcon, DocumentDuplicateIcon } from '../components/common/Icons';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';

const PublicCityServicesGuidePage: React.FC = () => {
    const { serviceGuides } = useData();
    const [openGuideId, setOpenGuideId] = useState<number | null>(serviceGuides.length > 0 ? serviceGuides[0].id : null);

    const handleToggleGuide = (id: number) => {
        setOpenGuideId(openGuideId === id ? null : id);
    };
    
    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner
                title="خدمات جهاز المدينة"
                subtitle="خطوات واضحة ومستندات مطلوبة لإنجاز معاملاتك بسهولة."
                icon={<DocumentDuplicateIcon className="w-12 h-12 text-sky-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto space-y-4">
                    {serviceGuides.length > 0 ? serviceGuides.map(guide => (
                        <div key={guide.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                            <button onClick={() => handleToggleGuide(guide.id)} className="w-full flex justify-between items-center p-5 text-right">
                                <span className="font-semibold text-lg text-gray-800 dark:text-white">{guide.title}</span>
                                <ChevronDownIcon className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${openGuideId === guide.id ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openGuideId === guide.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <div className="p-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 gap-8">
                                    <div>
                                        <h3 className="text-md font-bold mb-3 text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500/30 pb-2">خطوات التقديم</h3>
                                        <ul className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-300">
                                            {guide.steps.map((step, i) => <li key={i}>{step}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-bold mb-3 text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500/30 pb-2">الأوراق المطلوبة</h3>
                                        <ul className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-300">
                                            {guide.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                         <div className="mt-16">
                            <EmptyState
                              icon={<DocumentDuplicateIcon className="w-16 h-16 text-slate-400" />}
                              title="لا توجد أدلة خدمات متاحة حالياً"
                              message="يعمل فريقنا على إضافة الأدلة الإرشادية قريباً."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicCityServicesGuidePage;