import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ServiceCard from '../components/common/ServiceCard';
import { ArrowLeftIcon } from '../components/common/Icons';
import Spinner from '../components/common/Spinner';

const PublicServiceListPage: React.FC = () => {
    const navigate = useNavigate();
    const { subCategoryId: subCategoryIdStr } = useParams<{ subCategoryId: string }>();
    const subCategoryId = Number(subCategoryIdStr);

    const { services, categories } = useAppContext();

    const { categoryName, subCategoryName, filteredServices } = useMemo(() => {
        let catName = '';
        let subName = '';
        const foundCategory = categories.find(c => c.subCategories.some(sc => sc.id === subCategoryId));
        if(foundCategory) {
            catName = foundCategory.name;
            subName = foundCategory.subCategories.find(sc => sc.id === subCategoryId)?.name || '';
        }
        const filtered = services.filter(s => s.subCategoryId === subCategoryId);
        return { categoryName: catName, subCategoryName: subName, filteredServices: filtered };
    }, [services, categories, subCategoryId]);

    if (!subCategoryName) {
        return <Spinner />;
    }

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>

                <div className="text-center mb-10">
                    <p className="text-lg font-semibold text-cyan-500">{categoryName}</p>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">{subCategoryName}</h1>
                </div>

                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredServices.map(service => (
                            <ServiceCard key={service.id} service={service} />
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
