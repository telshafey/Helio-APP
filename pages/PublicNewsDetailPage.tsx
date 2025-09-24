import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Spinner from '../components/common/Spinner';
import { ArrowLeftIcon, CalendarDaysIcon, UserCircleIcon } from '../components/common/Icons';

const PublicNewsDetailPage: React.FC = () => {
    const { newsId } = useParams<{ newsId: string }>();
    const navigate = useNavigate();
    const { news } = useAppContext();
    const newsItem = news.find(n => n.id === Number(newsId));

    if (!newsItem) {
        return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة إلى الأخبار</span>
                </button>
                
                <article className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white leading-tight">{newsItem.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mt-4">
                            <div className="flex items-center gap-2"><CalendarDaysIcon className="w-5 h-5"/><span>{new Date(newsItem.date).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                            <div className="flex items-center gap-2"><UserCircleIcon className="w-5 h-5"/><span>بواسطة: {newsItem.author}</span></div>
                        </div>
                    </header>
                    <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-md mb-8" />
                    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                       <p>{newsItem.content}</p>
                    </div>
                     {newsItem.externalUrl && (
                         <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <a href={newsItem.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors">
                                قراءة المزيد من المصدر
                            </a>
                         </div>
                     )}
                </article>
            </div>
        </div>
    );
};

export default PublicNewsDetailPage;