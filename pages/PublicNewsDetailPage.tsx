import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import Spinner from '../components/common/Spinner';
import { ArrowLeftIcon, CalendarDaysIcon, UserCircleIcon, NewspaperIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';
import ShareButton from '../components/common/ShareButton';

const PublicNewsDetailPage: React.FC = () => {
    const { newsId } = useParams<{ newsId: string }>();
    const navigate = useNavigate();
    const { news } = useNews();
    const newsItem = news.find(n => n.id === Number(newsId));

    if (!newsItem) {
        return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }
    
    const formattedDate = new Date(newsItem.date).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner 
                title={newsItem.title}
                subtitle={`نشر في ${formattedDate} بواسطة ${newsItem.author}`}
                icon={<NewspaperIcon className="w-10 h-10 text-purple-500" />}
            />
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة إلى الأخبار</span>
                </button>
                
                <article className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-md mb-8" loading="lazy" decoding="async" />
                    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                       <p>{newsItem.content}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
                        <ShareButton
                            title={newsItem.title}
                            text={newsItem.content.substring(0, 100) + '...'}
                        />
                        {newsItem.externalUrl && (
                             <a href={newsItem.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors w-full sm:w-auto text-center">
                                قراءة المزيد من المصدر
                            </a>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PublicNewsDetailPage;