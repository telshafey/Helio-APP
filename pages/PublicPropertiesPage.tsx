import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertiesContext';
import { MagnifyingGlassIcon, HomeModernIcon, AdjustmentsHorizontalIcon } from '../components/common/Icons';
import PropertyCard from '../components/common/PropertyCard';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';
import FilterDrawer from '../components/common/FilterDrawer';
import PropertyFilters from '../components/properties/PropertyFilters';
import { useNews } from '../context/NewsContext';
import AdSlider from '../components/common/AdSlider';

const PublicPropertiesPage: React.FC = () => {
    const navigate = useNavigate();
    const { properties } = useProperties();
    const { advertisements } = useNews();

    // Existing state
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');

    // New state for advanced filters
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [tempPriceRange, setTempPriceRange] = useState({ min: '', max: '' });
    const [tempSelectedAmenities, setTempSelectedAmenities] = useState<string[]>([]);
    
    // Applied filters state
    const [appliedPriceRange, setAppliedPriceRange] = useState({ min: '', max: '' });
    const [appliedAmenities, setAppliedAmenities] = useState<string[]>([]);
    
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (appliedPriceRange.min || appliedPriceRange.max) count++;
        count += appliedAmenities.length;
        return count;
    }, [appliedPriceRange, appliedAmenities]);

    const sliderAds = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return advertisements.filter(ad => {
            const start = new Date(ad.startDate);
            const end = new Date(ad.endDate);
            return today >= start && today <= end;
        });
    }, [advertisements]);

    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prop.location.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || prop.type === typeFilter;
            
            const minPrice = parseFloat(appliedPriceRange.min);
            const maxPrice = parseFloat(appliedPriceRange.max);
            const matchesPrice = 
                (isNaN(minPrice) || prop.price >= minPrice) &&
                (isNaN(maxPrice) || prop.price <= maxPrice);

            const matchesAmenities = appliedAmenities.length === 0 || 
                                     appliedAmenities.every(amenity => prop.amenities.includes(amenity));

            return matchesSearch && matchesType && matchesPrice && matchesAmenities;
        });
    }, [properties, searchTerm, typeFilter, appliedPriceRange, appliedAmenities]);

    const handleApplyFilters = () => {
        setAppliedPriceRange(tempPriceRange);
        setAppliedAmenities(tempSelectedAmenities);
        setIsFilterDrawerOpen(false);
    };
    
    const handleClearFilters = () => {
        setTempPriceRange({ min: '', max: '' });
        setTempSelectedAmenities([]);
        setAppliedPriceRange({ min: '', max: '' });
        setAppliedAmenities([]);
        setIsFilterDrawerOpen(false);
    };

    const handleOpenDrawer = () => {
        // Load temp state with applied state when opening
        setTempPriceRange(appliedPriceRange);
        setTempSelectedAmenities(appliedAmenities);
        setIsFilterDrawerOpen(true);
    };
    
    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner
                title="العقارات المتاحة"
                subtitle="ابحث عن منزلك القادم في هليوبوليس الجديدة."
                icon={<HomeModernIcon className="w-12 h-12 text-amber-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {sliderAds.length > 0 && (
                    <div className="mb-8">
                        <AdSlider ads={sliderAds} />
                    </div>
                )}
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md sticky top-12 z-10">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input
                            type="text" placeholder="بحث بالعنوان أو المنطقة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <select
                        value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="all">الكل (بيع وإيجار)</option>
                        <option value="sale">بيع فقط</option>
                        <option value="rent">إيجار فقط</option>
                    </select>
                    <button onClick={handleOpenDrawer} className="relative w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <AdjustmentsHorizontalIcon className="w-5 h-5" />
                        <span>فلاتر متقدمة</span>
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
                
                {filteredProperties.length > 0 ? (
                    <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory' }}>
                        {filteredProperties.map(prop => (
                            <div key={prop.id} className="flex-shrink-0 w-80" style={{ scrollSnapAlign: 'start' }}>
                                <PropertyCard property={prop} />
                            </div>
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
            
            <FilterDrawer 
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            >
                <PropertyFilters 
                    priceRange={tempPriceRange}
                    setPriceRange={setTempPriceRange}
                    selectedAmenities={tempSelectedAmenities}
                    setSelectedAmenities={setTempSelectedAmenities}
                />
            </FilterDrawer>
        </div>
    );
};

export default PublicPropertiesPage;