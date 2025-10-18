import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import { 
    Squares2X2Icon,
    ChevronDownIcon,
} from '../components/common/Icons';
import { getIcon } from '../components/common/iconUtils';
import PageBanner from '../components/common/PageBanner';
import { useNews } from '../context/NewsContext';
import AdSlider from '../components/common/AdSlider';

const PublicServicesPage: React.FC = () => {
    const { categories } = useServices();
    const { advertisements } = useNews();
    const serviceCategories = categories.filter(c => c.name !== "المدينة والجهاز");
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(serviceCategories.length > 0 ? serviceCategories[0].id : null);

    const sliderAds = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return advertisements.filter(ad => {
            const start = new Date(ad.startDate);
            const end = new Date(ad.endDate);
            return today >= start && today <= end;
        });
    }, [advertisements]);

    const handleToggleCategory = (id: number) => {
        setOpenCategoryId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="animate-fade-in" dir="rtl">
             <PageBanner
                title="تصفح الخدمات"
                subtitle="اكتشف كل ما تقدمه مدينة هليوبوليس الجديدة."
                icon={<Squares2X2Icon className="w-12 h-12 text-cyan-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {sliderAds.length > 0 && (
                    <div className="mb-8">
                        <AdSlider ads={sliderAds} />
                    </div>
                )}
                <div className="max-w-4xl mx-auto space-y-4">
                    {serviceCategories.map(category => (
                        <div key={category.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                            <button onClick={() => handleToggleCategory(category.id)} className="w-full flex justify-between items-center p-5 text-right hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    {getIcon(category.icon, { className: "w-8 h-8 text-cyan-500" })}
                                    <span className="font-semibold text-xl text-gray-800 dark:text-white">{category.name}</span>
                                </div>
                                <ChevronDownIcon className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${openCategoryId === category.id ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openCategoryId === category.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
                                        {category.subCategories.map(sub => (
                                            <Link 
                                                key={sub.id} 
                                                to={`/services/subcategory/${sub.id}`} 
                                                className="flex-shrink-0 block px-4 py-3 text-center rounded-lg bg-slate-100 dark:bg-slate-700/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 hover:text-cyan-600 transition-colors whitespace-nowrap"
                                            >
                                                <span className="font-medium">{sub.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default PublicServicesPage;