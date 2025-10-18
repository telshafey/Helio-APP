import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import ServiceCard from '../components/common/ServiceCard';
import { ArrowLeftIcon } from '../components/common/Icons';
import Spinner from '../components/common/Spinner';
import PageBanner from '../components/common/PageBanner';
import { getIcon } from '../components/common/iconUtils';

const PublicServiceListPage: React.FC = () => {
    const navigate = useNavigate();
    const { subCategoryId: subCategoryIdStr } = useParams<{ subCategoryId: string }>();
    const subCategoryId = Number(subCategoryIdStr);

    const { services, categories } = useServices();

    const { categoryName, subCategoryName, filteredServices, categoryIcon } = useMemo(() => {
        let catName = '';
        let subName = '';
        let catIcon = '';
        const foundCategory = categories.find(c => c.subCategories.some(sc => sc.id === subCategoryId));
        if(foundCategory) {
            catName = foundCategory.name;
            catIcon = foundCategory.icon;
            subName = foundCategory.subCategories.find(sc => sc.id === subCategoryId)?.name || '';
        }
        const filtered = services.filter(s => s.subCategoryId === subCategoryId);
        return { categoryName: catName, subCategoryName: subName, filteredServices: filtered, categoryIcon: catIcon };
    }, [services, categories, subCategoryId]);

    if (!subCategoryName) {
        return <Spinner />;
    }

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner
                title={subCategoryName}
                subtitle={categoryName}
                icon={getIcon(categoryIcon, { className: "w-10 h-10 text-cyan-500"})}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                 <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>

                {filteredServices.length > 0 ? (
                    <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory' }}>
                        {filteredServices.map(service => (
                           <div key={service.id} className="flex-shrink-0 w-72" style={{ scrollSnapAlign: 'start' }}>
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold">لا توجد خدمات متاحة</h3>
                        <p className="mt-2">لا توجد خدمات مضافة في هذه الفئة حالياً. يرجى المحاولة مرة أخرى لاحقاً.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicServiceListPage;