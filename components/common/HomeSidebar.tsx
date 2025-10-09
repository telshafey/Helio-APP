import React from 'react';
import { Link } from 'react-router-dom';
import type { Category, News, Property } from '../../types';
import { getIcon } from './iconUtils';
import { NewspaperIcon, HomeModernIcon } from './Icons';
import { prefetchMap } from './AnimatedRoutes';

const HomeSidebar: React.FC<{ categories: Category[], news: News[], properties: Property[] }> = ({ categories, news, properties }) => {
    
    const handlePrefetch = (to: string) => {
        const prefetcher = prefetchMap[to];
        if (prefetcher) {
            prefetcher();
        }
    };

    return (
        <div className="sticky top-20 space-y-8">
            {/* Categories Grid */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <h3 className="font-bold mb-4 text-gray-800 dark:text-white">الفئات الرئيسية</h3>
                <div className="grid grid-cols-3 gap-3">
                    {categories.slice(0, 9).map(category => {
                        const linkTo = category.subCategories.length > 0 ? `/services/subcategory/${category.subCategories[0].id}` : '/services';
                        return (
                            <Link 
                                to={linkTo} 
                                key={category.id} 
                                className="flex flex-col items-center p-2 text-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                onPointerDown={() => handlePrefetch(linkTo)}
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mb-2">
                                    {getIcon(category.icon, { className: "w-6 h-6 text-cyan-600 dark:text-cyan-400" })}
                                </div>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{category.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Recent News */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white"><NewspaperIcon className="w-5 h-5"/>آخر الأخبار</h3>
                <ul className="space-y-3">
                    {news.map(item => (
                        <li key={item.id}>
                            <Link 
                                to={`/news/${item.id}`} 
                                className="block hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-md transition-colors"
                                onPointerDown={() => handlePrefetch(`/news/${item.id}`)}
                            >
                                <p className="font-semibold text-sm line-clamp-2 text-gray-800 dark:text-gray-200">{item.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString('ar-EG-u-nu-latn')}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Properties */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white"><HomeModernIcon className="w-5 h-5"/>أحدث العقارات</h3>
                <ul className="space-y-3">
                    {properties.map(item => (
                         <li key={item.id}>
                            <Link 
                                to={`/property/${item.id}`} 
                                className="block hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-md transition-colors"
                                onPointerDown={() => handlePrefetch(`/property/${item.id}`)}
                            >
                                <p className="font-semibold text-sm line-clamp-2 text-gray-800 dark:text-gray-200">{item.title}</p>
                                <p className="text-xs text-cyan-500 font-bold">{item.price.toLocaleString('ar-EG')} جنيه</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HomeSidebar;