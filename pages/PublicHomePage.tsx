import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MagnifyingGlassIcon,
    CakeIcon,
    HeartIcon,
    ShoppingBagIcon,
    WrenchScrewdriverIcon
} from '../components/common/Icons';
import { useData } from '../context/DataContext';
import { useServices } from '../context/ServicesContext';
import ServiceCard from '../components/common/ServiceCard';
import AdSlider from '../components/common/AdSlider';
import NewsCard from '../components/common/NewsCard';
import PropertyCard from '../components/common/PropertyCard';

const QuickAccessCard: React.FC<{ icon: React.ReactNode; title: string; to: string; }> = ({ icon, title, to }) => (
    <Link to={to} className="group flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-center transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-center w-14 h-14 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-200">
            {icon}
        </div>
        <h3 className="text-base font-bold text-gray-800 dark:text-white">{title}</h3>
    </Link>
);

const PublicHomePage: React.FC = () => {
    const { publicPagesContent, advertisements, news, properties } = useData();
    const { services, categories } = useServices();
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

    const recentServices = [...services].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).slice(0, 3);
    const recentNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
    const recentProperties = [...properties].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).slice(0, 3);

    const quickAccessItems = [
        { title: "الطعام والشراب", icon: <CakeIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />, categoryName: "الطعام والشراب" },
        { title: "الصحة", icon: <HeartIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />, categoryName: "الصحة" },
        { title: "التسوق", icon: <ShoppingBagIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />, categoryName: "التسوق" },
        { title: "الصيانة", icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />, categoryName: "الصيانه والخدمات المنزلية" }
    ].map(item => {
        const category = categories.find(c => c.name === item.categoryName);
        const firstSubCategoryId = category?.subCategories[0]?.id;
        return {
            ...item,
            to: firstSubCategoryId ? `/services/subcategory/${firstSubCategoryId}` : '/services-overview'
        };
    });

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
            
            {/* Ad Slider Section */}
            {sliderAds.length > 0 && (
                <section className="py-10 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <AdSlider ads={sliderAds} />
                    </div>
                </section>
            )}

            {/* Quick Access Section */}
            <section className="py-12">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">{content.featuresSectionTitle}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                       {quickAccessItems.map(item => <QuickAccessCard key={item.title} {...item} />)}
                    </div>
                </div>
            </section>

            {/* Recent Services Section */}
            <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">أحدث الخدمات المضافة</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentServices.map(service => <ServiceCard key={service.id} service={service} />)}
                    </div>
                 </div>
            </section>
            
            {/* Recent Properties Section */}
            {recentProperties.length > 0 && (
                <section className="py-12 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">أحدث العقارات</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentProperties.map(prop => <PropertyCard key={prop.id} property={prop} />)}
                        </div>
                        <div className="text-center mt-10">
                            <Link to="/properties" className="px-8 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-transform hover:scale-105">
                                تصفح كل العقارات
                            </Link>
                        </div>
                    </div>
                </section>
            )}
            
            {/* Recent News Section */}
             {recentNews.length > 0 && (
                <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">آخر الأخبار</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentNews.map(newsItem => <NewsCard key={newsItem.id} newsItem={newsItem} />)}
                        </div>
                        <div className="text-center mt-10">
                            <Link to="/news" className="px-8 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-transform hover:scale-105">
                                قراءة كل الأخبار
                            </Link>
                        </div>
                    </div>
                </section>
             )}
        </div>
    );
};

export default PublicHomePage;