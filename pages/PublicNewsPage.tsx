import React from 'react';
import { useAppContext } from '../context/AppContext';
import NewsCard from '../components/common/NewsCard';
import { NewspaperIcon } from '../components/common/Icons';

const PublicNewsPage: React.FC = () => {
    const { news } = useAppContext();
    const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-4">
                        <NewspaperIcon className="w-12 h-12 text-purple-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">أخبار المدينة</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">كن على اطلاع بآخر المستجدات والأحداث في هليوبوليس الجديدة.</p>
                </div>
                
                {sortedNews.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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