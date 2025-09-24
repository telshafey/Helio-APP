import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
    Squares2X2Icon,
    ChevronDownIcon,
    HeartIcon, ShoppingBagIcon, 
    AcademicCapIcon, DevicePhoneMobileIcon, BoltIcon, SparklesIcon, CarIcon, 
    PaintBrushIcon, 
    CakeIcon,
    WrenchScrewdriverIcon,
    GiftIcon
} from '../components/common/Icons';

const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    HeartIcon, ShoppingBagIcon, 
    AcademicCapIcon, DevicePhoneMobileIcon, BoltIcon, SparklesIcon, CarIcon, 
    PaintBrushIcon, 
    CakeIcon,
    WrenchScrewdriverIcon,
    Squares2X2Icon,
    GiftIcon
};

const getIcon = (name: string, props: React.SVGProps<SVGSVGElement>) => {
    const IconComponent = iconComponents[name];
    return IconComponent ? <IconComponent {...props} /> : <Squares2X2Icon {...props} />;
};


const PublicServicesPage: React.FC = () => {
    const { categories } = useAppContext();
    const serviceCategories = categories.filter(c => c.name !== "المدينة والجهاز");
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(serviceCategories.length > 0 ? serviceCategories[0].id : null);


    const handleToggleCategory = (id: number) => {
        setOpenCategoryId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10 pt-16">
                    <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mb-4">
                        <Squares2X2Icon className="w-12 h-12 text-cyan-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">تصفح الخدمات</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">اكتشف كل ما تقدمه مدينة هليوبوليس الجديدة.</p>
                </div>
                
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
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {category.subCategories.map(sub => (
                                            <Link 
                                                key={sub.id} 
                                                to={`/services/subcategory/${sub.id}`} 
                                                className="block p-4 text-center rounded-lg bg-slate-100 dark:bg-slate-700/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 hover:text-cyan-600 transition-colors"
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
