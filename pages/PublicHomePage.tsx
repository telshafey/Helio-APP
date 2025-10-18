import React from 'react';
import { 
    MagnifyingGlassIcon,
} from '../components/common/Icons';
import { useData } from '../context/DataContext';
import { useServices } from '../context/ServicesContext';
import { useProperties } from '../context/PropertiesContext';
import { useNews } from '../context/NewsContext';
import AdSlider from '../components/common/AdSlider';
import ServicesCarousel from '../components/common/ServicesCarousel';
import CategoryCarousel from '../components/common/CategoryCarousel';
import PropertyCarousel from '../components/common/PropertyCarousel';
import NewsCarousel from '../components/common/NewsCarousel';

const PublicHomePage: React.FC = () => {
    const { publicPagesContent } = useData();
    const { services, categories } = useServices();
    const { properties } = useProperties();
    const { advertisements, news } = useNews();
    const content = publicPagesContent.home;

    const sliderAds = React.useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return advertisements.filter(ad => {
            const start = new Date(ad.startDate);
            const end = new Date(ad.endDate);
            return today >= start && today <= end;
        });
    }, [advertisements]);

    const recentServices = [...services].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).slice(0, 10);
    const recentNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
    const recentProperties = [...properties].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).slice(0, 8);

    // Filter service categories for the carousel
    const serviceCategories = categories.filter(c => c.name !== "المدينة والجهاز");

    return (
        <div className="animate-fade-in" dir="rtl">
            {/* Hero Section */}
            <section className="relative bg-slate-100 dark:bg-slate-900 pt-6 pb-10 md:pt-10 md:pb-16 text-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-5" style={{backgroundImage: `url('https://picsum.photos/1600/900?grayscale')`}}></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-3 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                            {content.heroTitleLine1}
                        </span>
                    </h1>
                    <p className="max-w-xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
                        {content.heroSubtitle}
                    </p>
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                           <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-4 -translate-y-1/2" />
                           <input type="search" placeholder="ابحث عن مطعم، صيدلية، أو أي خدمة..." className="w-full pl-4 pr-12 py-3 text-base rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {sliderAds.length > 0 && <AdSlider ads={sliderAds} />}
            </div>

            <CategoryCarousel title="تصفح حسب الفئة" categories={serviceCategories} />
            <ServicesCarousel title="أحدث الخدمات" services={recentServices} />
            <PropertyCarousel title="أحدث العقارات" properties={recentProperties} />
            <NewsCarousel title="آخر الأخبار" news={recentNews} />
            
        </div>
    );
};

export default PublicHomePage;