import React from 'react';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/common/NewsCard';
import { NewspaperIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';

const PublicNewsPage: React.FC = () => {
    const { news } = useNews();
    const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner
                title="أخبار المدينة"
                subtitle="كن على اطلاع بآخر المستجدات والأحداث في هليوبوليس الجديدة."
                icon={<NewspaperIcon className="w-12 h-12 text-purple-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {sortedNews.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedNews.map(newsItem => (
                            <NewsCard key={newsItem.id} newsItem={newsItem} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold">لا توجد أخبار حالياً</h3>
                        <p className="mt-2">يرجى التحقق مرة أخرى قريباً.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicNewsPage;
