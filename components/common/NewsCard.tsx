import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import type { News } from '../../types';

const NewsCard: React.FC<{ newsItem: News }> = ({ newsItem }) => {
    return (
        <Link to={`/news/${newsItem.id}`} className="block group bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 active:scale-[0.98]">
            <div className="relative">
                <img 
                    src={newsItem.imageUrl} 
                    alt={newsItem.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                    loading="lazy" 
                    decoding="async"
                />
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(newsItem.date).toLocaleDateString('ar-EG-u-nu-latn')} • {newsItem.author}</p>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 h-14 overflow-hidden group-hover:text-cyan-500">{newsItem.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm h-12 overflow-hidden text-ellipsis">{newsItem.content}</p>
            </div>
        </Link>
    );
};

export default memo(NewsCard);