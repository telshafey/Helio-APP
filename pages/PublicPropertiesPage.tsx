import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MagnifyingGlassIcon, HomeModernIcon, ArrowLeftIcon } from '../components/common/Icons';
import PropertyCard from '../components/common/PropertyCard';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';

const PublicPropertiesPage: React.FC = () => {
    const navigate = useNavigate();
    const { properties } = useData();

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');

    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prop.location.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = typeFilter === 'all' || prop.type === typeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [properties, searchTerm, typeFilter]);
    
    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner
                title="العقارات المتاحة"
                subtitle="ابحث عن منزلك القادم في هليوبوليس الجديدة."
                icon={<HomeModernIcon className="w-12 h-12 text-amber-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md sticky top-20 z-10">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input
                            type="text" placeholder="بحث بالعنوان أو المنطقة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <select
                        value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="all">الكل (بيع وإيجار)</option>
                        <option value="sale">بيع فقط</option>
                        <option value="rent">إيجار فقط</option>
                    </select>
                </div>
                
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProperties.map(prop => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))}
                    </div>
                ) : (
                     <div className="mt-16">
                        <EmptyState
                            icon={<HomeModernIcon className="w-16 h-16 text-slate-400" />}
                            title="لا توجد عقارات تطابق بحثك"
                            message="حاول تغيير الفلاتر أو توسيع نطاق البحث للعثور على ما تبحث عنه."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicPropertiesPage;